import type { ColumnDef, TableFilter } from "@invana/tables";
import { AgentChip, Badge } from "@invana/ui";
import {
  AGENTS,
  KINDS,
  LEVELS,
  formatMs,
  formatOffset,
  type TelemetryEvent,
  type TelemetryLevel,
} from "./fixtures";

/**
 * Story-only helpers for `Data Tables/Telemetry` — the event log's columns and
 * its filters, shared so every story reads the same log the same way. Not a
 * story file (no `.stories.`), so Storybook does not index it.
 */

/** A kind reads in its level's colour: grey for info, amber for warn, red for error. */
export function KindBadge({
  kind,
  level,
}: {
  kind: string;
  level: TelemetryLevel;
}) {
  if (level === "error")
    return (
      <Badge variant="destructive" size="xs">
        {kind}
      </Badge>
    );
  if (level === "warn")
    return (
      <Badge variant="soft" tone="warning" size="xs">
        {kind}
      </Badge>
    );
  return (
    <Badge variant="outline" tone="muted" size="xs">
      {kind}
    </Badge>
  );
}

export const LOG_COLUMNS: ColumnDef<TelemetryEvent, unknown>[] = [
  {
    id: "offset",
    accessorKey: "offsetMs",
    header: "t",
    size: 84,
    meta: { mono: true, align: "right" },
    cell: ({ getValue }) => formatOffset(getValue() as number),
  },
  {
    id: "kind",
    accessorKey: "kind",
    header: "Kind",
    size: 128,
    cell: ({ row }) => (
      <KindBadge kind={row.original.kind} level={row.original.level} />
    ),
  },
  {
    id: "agent",
    accessorKey: "agent",
    header: "Agent",
    size: 112,
    cell: ({ getValue }) => <AgentChip name={getValue() as string} />,
  },
  {
    id: "task",
    accessorKey: "taskKey",
    header: "Task",
    size: 136,
    meta: { mono: true },
    cell: ({ getValue }) => (getValue() as string | undefined) ?? "—",
  },
  {
    id: "slot",
    accessorKey: "slot",
    header: "Slot",
    size: 56,
    meta: { mono: true },
    cell: ({ row }) =>
      row.original.slot
        ? `${row.original.slot}${row.original.attempt! > 1 ? ` #${row.original.attempt}` : ""}`
        : "—",
  },
  {
    id: "duration",
    accessorKey: "durationMs",
    header: "Took",
    size: 72,
    meta: { mono: true, align: "right" },
    cell: ({ getValue }) => formatMs(getValue() as number | undefined),
  },
  {
    id: "detail",
    accessorKey: "detail",
    header: "Detail",
    size: 360,
    enableSorting: false,
  },
];

/**
 * The log's filter chips — kind, agent and level, in the engine's own order.
 * The table does the filtering: in memory on a `PaginatedTable`, on the
 * server on a `RemotePaginatedTable`.
 */
export const LOG_FILTERS: TableFilter<TelemetryEvent>[] = [
  { id: "kind", label: "kind", options: KINDS },
  { id: "agent", label: "agent", options: AGENTS },
  { id: "level", label: "level", options: LEVELS },
];

/** The search reads the task and the detail, not the offset or the slot. */
export const LOG_SEARCH_COLUMNS = ["task", "detail"];
