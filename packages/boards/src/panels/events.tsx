import * as React from "react"
import { Badge, Button, ButtonGroup, PropertyList, PropertyRow } from "@invana/ui"
import {
  DataTable,
  PaginatedTable,
  type ColumnDef,
  type ExpandedState,
  type TableFilter,
} from "@invana/tables"

import type { EventSpec, EventsOptions, PanelRendererProps } from "../types"

const LEVELS: EventSpec["level"][] = ["error", "warn", "info", "debug"]
const offset = (ms: number) => `${(ms / 1000).toFixed(3)}s`
const took = (ms?: number) => (ms == null ? "—" : ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`)

/** A kind reads in its level's colour: grey for info and debug, amber for warn, red for error. */
function KindBadge({ kind, level }: Pick<EventSpec, "kind" | "level">) {
  if (level === "error")
    return (
      <Badge variant="destructive" size="xs">
        {kind}
      </Badge>
    )
  if (level === "warn")
    return (
      <Badge variant="soft" tone="warning" size="xs">
        {kind}
      </Badge>
    )
  return (
    <Badge variant="outline" tone="muted" size="xs">
      {kind}
    </Badge>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === "succeeded")
    return (
      <Badge variant="soft" tone="success" size="xs">
        {status}
      </Badge>
    )
  if (status === "failed")
    return (
      <Badge variant="destructive" size="xs">
        {status}
      </Badge>
    )
  return (
    <Badge variant="outline" tone="muted" size="xs">
      {status.replace("_", " ")}
    </Badge>
  )
}

/**
 * The run's event stream — see {@link EventsOptions}. Both layouts read the
 * same events, so a log and a tree of one run never disagree.
 */
export function EventsPanel(props: PanelRendererProps<EventsOptions>) {
  return props.options.layout === "tree" ? <EventTree {...props} /> : <EventLog {...props} />
}

// ── log ─────────────────────────────────────────────────────────────────────

function EventLog({ panel, options, onAction }: PanelRendererProps<EventsOptions>) {
  const { selectAction, hideTask } = options
  const columns = React.useMemo<ColumnDef<EventSpec, unknown>[]>(
    () => [
      {
        id: "at",
        accessorKey: "atMs",
        header: "t",
        size: 84,
        meta: { mono: true, align: "right" },
        cell: ({ getValue }) => offset(getValue() as number),
      },
      {
        id: "kind",
        accessorKey: "kind",
        header: "Kind",
        size: 132,
        cell: ({ row }) => <KindBadge kind={row.original.kind} level={row.original.level} />,
      },
      ...(hideTask
        ? []
        : [
            {
              id: "task",
              accessorKey: "task",
              header: "Task",
              size: 150,
              meta: { mono: true },
              cell: ({ getValue }) => (getValue() as string | undefined) ?? "—",
            } satisfies ColumnDef<EventSpec, unknown>,
          ]),
      {
        id: "took",
        accessorKey: "tookMs",
        header: "Took",
        size: 72,
        meta: { mono: true, align: "right" },
        cell: ({ getValue }) => took(getValue() as number | undefined),
      },
      { id: "message", accessorKey: "message", header: "Detail", size: 360, enableSorting: false },
    ],
    [hideTask],
  )
  // The level has no column of its own — the kind's badge already reads in its colour — so its
  // chip matches the event and names the levels the stream holds.
  const levels = React.useMemo(() => LEVELS.filter((l) => options.events.some((e) => e.level === l)), [options.events])
  const filters = React.useMemo<TableFilter<EventSpec>[]>(
    () => [
      { id: "kind", label: "kind" },
      ...(hideTask ? [] : [{ id: "task", label: "task" }]),
      { id: "level", label: "level", options: levels, match: (e, picked) => picked.includes(e.level) },
    ],
    [hideTask, levels],
  )
  return (
    <PaginatedTable<EventSpec>
      columns={columns}
      data={options.events}
      density="compact"
      seamless
      filters={filters}
      searchColumns={hideTask ? ["message"] : ["task", "message"]}
      searchPlaceholder={hideTask ? "Search detail…" : "Search task or detail…"}
      noun="events"
      pageSize={options.pageSize ?? 25}
      pageSizeOptions={[25, 50, 100]}
      onRowClick={
        selectAction
          ? (e) => e.task && onAction(selectAction, { panelId: panel.id, value: e.task })
          : undefined
      }
    />
  )
}

// ── tree ────────────────────────────────────────────────────────────────────

type TreeRow = {
  id: string
  name: string
  atMs?: number
  tookMs?: number
  summary: string
  status?: string
  event?: EventSpec
  /** The task a row picks — itself, or the task an event belongs to. */
  task?: string
  children?: TreeRow[]
}

/** A task's own events first, in time order, then the tasks it split into. */
function treeOf(options: EventsOptions): TreeRow[] {
  const tasks = options.tasks ?? []
  const row = (t: (typeof tasks)[number]): TreeRow => ({
    id: t.key,
    name: t.key,
    atMs: t.startMs,
    tookMs: t.durationMs,
    summary: t.summary ?? "",
    status: t.status,
    task: t.key,
    children: [
      ...options.events
        .filter((e) => e.task === t.key)
        .sort((a, b) => a.atMs - b.atMs)
        .map((e) => ({
          id: e.id,
          name: e.kind,
          atMs: e.atMs,
          tookMs: e.tookMs,
          summary: e.message,
          event: e,
          task: t.key,
        })),
      ...tasks.filter((c) => c.parent === t.key).map(row),
    ],
  })
  return tasks.filter((t) => !t.parent).map(row)
}

/** Every task on the way to an event at warn or error, and the event itself. */
function troublePaths(options: EventsOptions): Record<string, boolean> {
  const parent = new Map((options.tasks ?? []).map((t) => [t.key, t.parent]))
  const open: Record<string, boolean> = {}
  for (const e of options.events.filter((ev) => ev.level === "error" || ev.level === "warn")) {
    open[e.id] = true
    for (let k: string | undefined = e.task; k; k = parent.get(k)) open[k] = true
  }
  return open
}

const resolve = <T,>(next: T | ((old: T) => T), old: T) =>
  typeof next === "function" ? (next as (old: T) => T)(old) : next

const TREE_COLUMNS: ColumnDef<TreeRow, unknown>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Task / event",
    size: 260,
    cell: ({ row }) =>
      row.original.event ? (
        <KindBadge kind={row.original.event.kind} level={row.original.event.level} />
      ) : (
        <span className="font-mono">{row.original.name}</span>
      ),
  },
  {
    id: "status",
    header: "Status",
    size: 100,
    cell: ({ row }) => (row.original.status ? <StatusBadge status={row.original.status} /> : "—"),
  },
  {
    id: "at",
    accessorKey: "atMs",
    header: "t",
    size: 84,
    meta: { mono: true, align: "right" },
    cell: ({ getValue }) => {
      const v = getValue() as number | undefined
      return v == null ? "—" : offset(v)
    },
  },
  {
    id: "took",
    accessorKey: "tookMs",
    header: "Took",
    size: 72,
    meta: { mono: true, align: "right" },
    cell: ({ getValue }) => took(getValue() as number | undefined),
  },
  { id: "summary", accessorKey: "summary", header: "Detail", size: 360, enableSorting: false },
]

function EventTree({ panel, options, onAction }: PanelRendererProps<EventsOptions>) {
  const tree = React.useMemo(() => treeOf(options), [options])
  const roots = React.useMemo(() => Object.fromEntries(tree.map((r) => [r.id, true])), [tree])
  const [expanded, setExpanded] = React.useState<ExpandedState>(roots)
  const { selectAction } = options
  return (
    <DataTable<TreeRow>
      columns={TREE_COLUMNS}
      data={tree}
      density="compact"
      seamless
      getSubRows={(r) => r.children}
      getRowId={(r) => r.id}
      expanded={expanded}
      onExpandedChange={(next) => setExpanded(resolve(next, expanded))}
      canExpand={(r) => r.event?.fields != null}
      enableSorting={false}
      enableColumnVisibility={false}
      onRowClick={
        selectAction
          ? (r) => r.task && onAction(selectAction, { panelId: panel.id, value: r.task })
          : undefined
      }
      toolbar={
        <ButtonGroup>
          <Button size="xs" variant="outline" onClick={() => setExpanded(troublePaths(options))}>
            Open failures
          </Button>
          <Button size="xs" variant="outline" onClick={() => setExpanded(true)}>
            Expand all
          </Button>
          <Button size="xs" variant="outline" onClick={() => setExpanded({})}>
            Collapse all
          </Button>
        </ButtonGroup>
      }
      renderExpanded={(r) =>
        r.event?.fields ? (
          <PropertyList labelWidth={80}>
            {Object.entries(r.event.fields).map(([label, value]) => (
              <PropertyRow key={label} label={label} mono>
                {value}
              </PropertyRow>
            ))}
          </PropertyList>
        ) : null
      }
    />
  )
}
