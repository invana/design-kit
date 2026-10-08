import * as React from 'react';
import { TableBlock, figureText, type BlockOptionsByKind, type Cell } from '@invana/blocks';
import type { PanelRendererProps } from '@invana/boards';
import { DataTable, type ColumnDef } from '@invana/tables';
import { Button, Popover, PopoverContent, PopoverTrigger, Stack, StatusDot, type MarkTone } from '@invana/ui';

import { usePlayable, useReduced, type Call } from './playbook';
import { keyText, tableOps, type TableMark, type TableState } from './table-ops';

/**
 * The `table` panel kind, made playable — a story-only prototype of what the RFC builds into
 * `DataTable` itself. With a `rowKey` it answers to its panel id: it folds the calls it receives
 * over its rows and draws the marks; without one it is the plain `table` block.
 */

type Options = BlockOptionsByKind['table'];
/** A row as the calls leave it — its cells are the block's `Cell`s, read as such when drawn. */
type Row = Record<string, unknown>;

/** A mark's tone as the dot that carries it. */
const DOT: Record<MarkTone, React.ComponentProps<typeof StatusDot>['tone']> = {
  muted: 'muted',
  info: 'info',
  success: 'success',
  warning: 'warning',
  destructive: 'error',
};

/** A cell's figure; a good or bad change carries its dot. */
function CellView({ cell }: { cell: Cell }) {
  if (cell == null) return <>—</>;
  if (typeof cell !== 'object' || !('value' in cell) || 'type' in cell) return <>{figureText(cell)}</>;
  if (!cell.tone) return <>{figureText(cell.value)}</>;
  return (
    <Stack direction="row" gap="xs">
      {figureText(cell.value)}
      <StatusDot tone={cell.tone === 'good' ? 'success' : 'error'} label={cell.tone} />
    </Stack>
  );
}

/**
 * A mark's note: a dot that opens it. It opens when the step that set it is played and the
 * reader can close it; playing that step again opens it again.
 */
function MarkNote({ mark, opens, children }: { mark: TableMark; opens: boolean; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(opens);
  // A new mark, or the step that opens it played again, sets it afresh; the reader's choice holds between.
  const [seen, setSeen] = React.useState({ opens, mark });
  if (seen.opens !== opens || seen.mark !== mark) {
    setSeen({ opens, mark });
    setOpen(opens);
  }
  return (
    <Stack direction="row" gap="xs">
      {children}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon-xs" aria-label={`Note: ${mark.note}`}>
            <StatusDot tone={DOT[mark.tone ?? 'info']} size="md" />
          </Button>
        </PopoverTrigger>
        {/* Never takes the focus from the conversation, and hides with its page. */}
        <PopoverContent side="top" hideWhenDetached onOpenAutoFocus={(e) => e.preventDefault()}>
          {mark.note}
        </PopoverContent>
      </Popover>
    </Stack>
  );
}

export function PlayableTablePanel({ panel, options, onAction }: PanelRendererProps<Options>) {
  const { rowKey } = options;
  const { received, current } = usePlayable(rowKey ? panel.id : undefined);
  const base = React.useMemo<TableState>(() => ({ rowKey: rowKey ?? '', rows: options.rows, marks: [] }), [rowKey, options.rows]);
  const report = React.useCallback(
    (call: Call, error: unknown) => onAction('playback-error', { panelId: panel.id, value: { call, error: String(error) } }),
    [onAction, panel.id],
  );
  const state = useReduced(base, received, tableOps.apply!, report);

  if (!rowKey) return <TableBlock spec={options} onAction={(action, value) => onAction(action, { panelId: panel.id, value })} />;

  const keyOf = (row: Row) => keyText(row[rowKey]);
  const markOf = (row: Row, column?: string) =>
    state.marks.find((m) => m.row === keyOf(row) && (m.column ?? null) === (column ?? null));

  // The note that opens: the last one the current step set on this table, if it set any.
  const last = received.at(-1);
  const fresh = last && last.step === current ? last.calls.filter((c) => c.op === 'mark').flatMap((c) => c.args?.marks as TableMark[]) : [];
  const opening = [...fresh].reverse().find((m) => m.note && m.open);

  const first = options.columns[0]?.key;
  const columns: ColumnDef<Row>[] = options.columns.map((c) => ({
    id: c.key,
    header: c.label,
    accessorFn: (row) => row[c.key],
    cell: (ctx) => {
      // A row's note sits on its first cell; a cell's on the cell.
      const mark = markOf(ctx.row.original, c.key) ?? (c.key === first ? markOf(ctx.row.original) : undefined);
      const view = <CellView cell={ctx.getValue() as Cell} />;
      if (!mark?.note) return view;
      const opens = opening != null && opening.row === mark.row && (opening.column ?? null) === (mark.column ?? null);
      return (
        <MarkNote mark={mark} opens={opens}>
          {view}
        </MarkNote>
      );
    },
    meta: { align: c.align, mono: c.mono },
  }));

  return (
    <DataTable
      columns={columns}
      data={state.rows}
      density="compact"
      seamless
      enableSorting={false}
      enableColumnVisibility={false}
      getRowId={(row) => keyOf(row)}
      isRowHighlighted={(row) => markOf(row) != null}
      isCellHighlighted={(row, column) => markOf(row, column) != null}
    />
  );
}
