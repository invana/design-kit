import * as React from "react";
import type { RowData } from "@tanstack/react-table";

/** Where streamed rows go. */
export type StreamMode = "prepend" | "append" | "upsert";

/**
 * Subscribes to a source of rows: call `emit` with each batch as it arrives,
 * and return what stops it — closing a socket, clearing a timer.
 */
export type TableStream<TData> = (
  emit: (rows: TData[]) => void,
) => (() => void) | void;

/**
 * Live rows on top of `data` — a log, an evaluation stream, sessions whose
 * numbers move. `data` is where the rows start; what `stream` emits goes on
 * top of it, and a new `data` starts the rows over from it.
 */
export interface TableStreamProps<TData extends RowData> {
  /**
   * Subscribed while true: turning it on calls `stream`, turning it off (or
   * unmounting) calls what `stream` returned.
   */
  streaming?: boolean;
  /**
   * The source. Read when `streaming` turns on, not on every render, so an
   * inline function does not reconnect each time the parent draws; to switch
   * sources, turn `streaming` off and on, or remount the table.
   */
  stream?: TableStream<TData>;
  /**
   * `prepend` puts new rows on top (newest first, the default), `append` at
   * the bottom; `upsert` replaces the row with the same `getRowId` in place
   * and appends the rest — rows whose values move.
   */
  streamMode?: StreamMode;
  /**
   * Keep only this many rows: the oldest go — the bottom ones when
   * prepending, the top ones otherwise.
   */
  maxRows?: number;
}

/** How long a streamed row reads as new. */
const FRESH_MS = 1000;

function merge<TData>(
  rows: TData[],
  incoming: TData[],
  mode: StreamMode,
  maxRows: number | undefined,
  getRowId: ((row: TData, index: number) => string) | undefined,
): TData[] {
  let next: TData[];
  if (mode === "upsert" && getRowId) {
    next = rows.slice();
    const at = new Map(next.map((row, i) => [getRowId(row, i), i]));
    for (const row of incoming) {
      const id = getRowId(row, next.length);
      const i = at.get(id);
      if (i == null) {
        at.set(id, next.length);
        next.push(row);
      } else {
        next[i] = row;
      }
    }
  } else if (mode === "prepend") {
    // A batch arrives oldest first; newest first means the last on top.
    next = incoming.slice().reverse().concat(rows);
  } else {
    next = rows.concat(incoming);
  }
  if (maxRows != null && next.length > maxRows) {
    next = mode === "prepend" ? next.slice(0, maxRows) : next.slice(-maxRows);
  }
  return next;
}

/**
 * The rows a table draws: `data`, plus whatever `stream` has emitted since.
 * Batches that land in the same frame are drawn together, so a burst of
 * events is one render, not one per event. `isRowFresh` says which rows
 * arrived in the last second.
 */
export function useStreamedRows<TData extends RowData>(
  data: TData[],
  {
    streaming = false,
    stream,
    streamMode = "prepend",
    maxRows,
    getRowId,
  }: TableStreamProps<TData> & {
    getRowId?: (row: TData, index: number) => string;
  },
): { rows: TData[]; isRowFresh: (row: TData) => boolean } {
  const [rows, setRows] = React.useState(data);
  const [fresh, setFresh] = React.useState<ReadonlySet<TData>>(() => new Set());

  // A new `data` starts the rows over.
  const [seed, setSeed] = React.useState(data);
  if (seed !== data) {
    setSeed(data);
    setRows(data);
  }

  // Read when streaming turns on, so changing them does not resubscribe.
  // Declared before the subscribing effect, so it runs first in a commit.
  const latest = React.useRef({ stream, streamMode, maxRows, getRowId });
  React.useEffect(() => {
    latest.current = { stream, streamMode, maxRows, getRowId };
  });

  React.useEffect(() => {
    const source = latest.current.stream;
    if (!streaming || !source) return;
    if (latest.current.streamMode === "upsert" && !latest.current.getRowId) {
      console.warn(
        '@invana/tables: streamMode="upsert" needs getRowId to match rows; appending instead.',
      );
    }

    let pending: TData[] = [];
    let frame: number | null = null;
    let closed = false;
    const timers = new Set<ReturnType<typeof setTimeout>>();

    const flush = () => {
      frame = null;
      if (closed || pending.length === 0) return;
      const batch = pending;
      pending = [];
      const { streamMode: mode, maxRows: cap, getRowId: rowId } = latest.current;
      setRows((prev) => merge(prev, batch, mode, cap, rowId));
      setFresh((prev) => new Set([...prev, ...batch]));
      const timer = setTimeout(() => {
        timers.delete(timer);
        setFresh((prev) => {
          const next = new Set(prev);
          for (const row of batch) next.delete(row);
          return next;
        });
      }, FRESH_MS);
      timers.add(timer);
    };

    const stop = source((incoming) => {
      if (closed || incoming.length === 0) return;
      pending.push(...incoming);
      if (frame == null) frame = requestAnimationFrame(flush);
    });

    return () => {
      closed = true;
      if (frame != null) cancelAnimationFrame(frame);
      timers.forEach(clearTimeout);
      setFresh(new Set());
      stop?.();
    };
  }, [streaming]);

  const isRowFresh = React.useCallback((row: TData) => fresh.has(row), [fresh]);
  return { rows, isRowFresh };
}
