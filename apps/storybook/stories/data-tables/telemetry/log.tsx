import * as React from "react";
import type { ColumnDef } from "@invana/tables";
import {
  AgentChip,
  Badge,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  FilterBar,
  FilterChip,
  SearchInput,
} from "@invana/ui";
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
 * its filter row, shared so every story reads the same log the same way. Not a
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

export interface LogFilter {
  query: string;
  kinds: string[];
  agents: string[];
  levels: string[];
}

export const EMPTY_FILTER: LogFilter = {
  query: "",
  kinds: [],
  agents: [],
  levels: [],
};

export function applyLogFilter(events: TelemetryEvent[], f: LogFilter) {
  const q = f.query.trim().toLowerCase();
  return events.filter(
    (e) =>
      (!f.kinds.length || f.kinds.includes(e.kind)) &&
      (!f.agents.length || f.agents.includes(e.agent)) &&
      (!f.levels.length || f.levels.includes(e.level)) &&
      (!q || `${e.taskKey ?? ""} ${e.detail}`.toLowerCase().includes(q)),
  );
}

function MultiChip({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <FilterChip
          label={label}
          value={
            value.length
              ? value.length === 1
                ? value[0]
                : `${value.length} selected`
              : undefined
          }
          active={value.length > 0}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {options.map((o) => (
          <DropdownMenuCheckboxItem
            key={o}
            checked={value.includes(o)}
            onSelect={(e) => e.preventDefault()}
            onCheckedChange={(on) =>
              onChange(on ? [...value, o] : value.filter((v) => v !== o))
            }
          >
            {o}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Search, then a chip per dimension; the count of what is left sits hard right. */
export function LogFilterBar({
  filter,
  onChange,
  shown,
  total,
  children,
}: {
  filter: LogFilter;
  onChange: (next: LogFilter) => void;
  shown: number;
  total: number;
  /** Extra chips, after the standard three — a task the timeline picked. */
  children?: React.ReactNode;
}) {
  return (
    <FilterBar summary={`${shown} of ${total} events`}>
      <SearchInput
        inputSize="sm"
        // Gap: `SearchInput` is `w-full`, so in a `FilterBar` it takes the row
        // and squeezes the chips. The bar should size its search; until then, this.
        className="w-56"
        value={filter.query}
        onChange={(query) => onChange({ ...filter, query })}
        placeholder="Search task or detail…"
      />
      <MultiChip
        label="kind"
        options={KINDS}
        value={filter.kinds}
        onChange={(kinds) => onChange({ ...filter, kinds })}
      />
      <MultiChip
        label="agent"
        options={AGENTS}
        value={filter.agents}
        onChange={(agents) => onChange({ ...filter, agents })}
      />
      <MultiChip
        label="level"
        options={LEVELS}
        value={filter.levels}
        onChange={(levels) => onChange({ ...filter, levels })}
      />
      {children}
    </FilterBar>
  );
}
