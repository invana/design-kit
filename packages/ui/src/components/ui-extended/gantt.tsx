import * as React from "react"

import { type ExpandedKeys, useExpandedKeys } from "../../hooks/use-expanded-keys"
import { cn } from "../../lib/utils"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"
import { StatusDot } from "../ui/status-dot"
import { ExpandToggle } from "./expand-toggle"
import { PropertyList, PropertyRow } from "./property-list"

/**
 * What a bar did with its slice of the clock.
 *
 * These are the engine's own step statuses (`StepStatus`, plus `skipped` for a
 * branch that never ran), not a second vocabulary: a Gantt row and a log line
 * are the same work seen twice, so they say the same word for the same state.
 * `refused` is what a rule stopped — reached for and not allowed — which is a
 * different fact from `skipped`, and both are drawn.
 */
export type GanttStatus =
  | "succeeded"
  | "running"
  | "failed"
  | "needs_input"
  | "stopped"
  | "skipped"
  | "queued"
  | "refused"

/** A `Date`, an ISO string, or epoch milliseconds — whatever the JSON carried. */
export type GanttInstant = string | number | Date

/**
 * One bar on the clock. A row's own bar is one of these, so is each earlier
 * attempt — the failed one sitting to the left of the one that stuck — and so
 * is each of the row's `bars`.
 */
export interface GanttBar {
  /** Offset from the run's zero. Use this, or `startedAt` with `origin`. */
  startMs?: number
  durationMs?: number
  startedAt?: GanttInstant
  finishedAt?: GanttInstant
  status?: GanttStatus
  /** Overrides the hover text, which otherwise reads `key · status · duration`. */
  title?: string
  /**
   * Names the bar, so it can be picked on its own — `fetch_source#1`. Only a
   * bar in a row's `bars` has one; the row's own bar is picked with the row.
   */
  key?: string
  /**
   * Written in the bar — the task a slot held, the participant a layer reached.
   * A row with a labelled bar grows to the `xs` control height to carry it, and
   * the bar draws as a card with its fill as a rail, so the text stays legible
   * on any status or palette colour.
   */
  label?: React.ReactNode
  /**
   * Which entry of `palette` paints it, in place of its status fill — a layer,
   * a lane, an agent. A group the palette does not name keeps the status fill,
   * and a `failed` or `refused` bar is always drawn as one.
   */
  group?: string
  /**
   * `solid` (the default) is spent time. `outline` is time held but not spent
   * — queued, waiting on a gate; `dashed` is time that may be spent — declared,
   * not yet dispatched.
   */
  variant?: "solid" | "outline" | "dashed"
  /**
   * A second line under the label — `1,204 of 1,251`, `503`. A row with one
   * grows to the `md` control height to carry both lines.
   */
  note?: React.ReactNode
  /** A small mark at the bar's end — a `Badge`, an icon, a count. Drawn with a label. */
  chip?: React.ReactNode
  /**
   * What this bar did, for its own hover card — the same fields a row's card
   * reads. A row with a bar that has one opens no card of its own: its bars
   * do, so the reader gets the bar under the cursor rather than the row.
   */
  summary?: React.ReactNode
  result?: React.ReactNode | Record<string, unknown>
  error?: { code?: React.ReactNode; message?: React.ReactNode; detail?: React.ReactNode }
  log?: React.ReactNode
}

/**
 * One row: a task on a run's clock, a worker slot, a layer, a participant —
 * whatever the surface groups time by. It carries its own bar, earlier
 * attempts, many `bars` of its own, and the `rows` it opens into.
 */
export interface GanttRow extends GanttBar {
  /** What the log lines call it — `task_key`, `slot-1`, `ingest`. Also the row's label. */
  key: string
  /** Shown instead of `key`, when the row wants a human name. */
  label?: React.ReactNode
  /** Earlier attempts, oldest first. A failed one draws in `destructive`. */
  attempts?: GanttBar[]
  /**
   * Many bars on one row, each a thing of its own rather than a retry — what a
   * worker slot held in order, what a layer was reached for. Drawn with the
   * row's own bar, if it has one; give each a `label` to say what it was.
   */
  bars?: GanttBar[]
  /** Overrides the right-hand duration cell. `—` when the row never ran. */
  duration?: React.ReactNode
  /** One line — what it said. The card's last line. */
  log?: React.ReactNode
  /** A sentence under the card's header, when the row wants one. */
  summary?: React.ReactNode
  /**
   * What it produced — its `result.json`, or any part of it.
   *
   * An object renders as label/value pairs, with nested values as JSON; a node
   * renders as given, which is the hook for a kind-specific card (a table
   * preview, a subgraph thumb) without replacing the whole body.
   */
  result?: React.ReactNode | Record<string, unknown>
  /** Why it failed. Drawn in `destructive`, above the result. */
  error?: { code?: React.ReactNode; message?: React.ReactNode; detail?: React.ReactNode }
  /** Replaces this row's card body entirely. */
  detail?: React.ReactNode
  /**
   * The rows this one opens into — the tasks it split into, the participants
   * of a layer — drawn under it, indented, when it is open. A row with no
   * timing of its own draws the stretch its rows cover.
   */
  rows?: GanttRow[]
}

/**
 * A bounded repetition — a loop's rounds — drawn as a bracket over the rows
 * it holds, with its label on a line of its own above them.
 */
export interface GanttBracket {
  /** The first row it holds, by `key`. */
  from: string
  /** The last row it holds, by `key`. Rows are matched in order, first hit. */
  to: string
  /** `↻ 2 of 3 rounds — understood on round 2`. */
  label: React.ReactNode
}

/**
 * A gate — a moment the run held and spent nothing — drawn as a rule across
 * the stretch of the clock it held, between the rows it lies between.
 */
export interface GanttSeam
  extends Pick<GanttBar, "startMs" | "durationMs" | "startedAt" | "finishedAt"> {
  /** The row it follows, by `key`. */
  after: string
  /** The label column's word — `approval`. */
  label: React.ReactNode
  /** What it was and how it resolved, written on the rule — `approved by ravi`. */
  note?: React.ReactNode
  /** Overrides the right-hand cell, which otherwise reads the time it held. */
  duration?: React.ReactNode
}

export interface GanttProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** One entry per row, in order — a run's tasks, its slots, its layers. */
  rows: GanttRow[]
  /** The clock's zero, when bars carry timestamps. Defaults to the earliest one. */
  origin?: GanttInstant
  /** The clock's ceiling. Defaults to the last end, or `nowMs` if that is later. */
  spanMs?: number
  /** Draws the *now* line. Set it while the run is in flight; omit it after. */
  nowMs?: number
  /** Marks the last axis label `8s+` — the run has not decided its own length yet. */
  openEnded?: boolean
  /** Intervals on the axis. Five labels by default. */
  ticks?: number
  formatTick?: (ms: number) => string
  formatDuration?: (ms: number) => string
  /**
   * The key column, in px. Omit it and the column takes its longest label,
   * up to 40% of the width — the surface decides the width, never the chart.
   */
  labelWidth?: number
  /**
   * The right-hand duration column, in px. Omit it and it takes its widest
   * cell; set it on charts stacked over one clock so their tracks end together.
   */
  durationWidth?: number
  /** Loops, bracketed over their rounds. */
  brackets?: GanttBracket[]
  /** Gates, ruled across the time they held. */
  seams?: GanttSeam[]
  /**
   * What each bar `group` is painted with — `{ ingest: "bg-data-1" }`. The
   * kit ships no hues: a group nobody painted keeps its status fill.
   */
  palette?: Record<string, string>
  /**
   * The inside of a bar, for every bar in `bars` — a chip, an icon, a count. Return
   * `null` for a bar that should stay a plain fill. Wins over `label`.
   */
  renderBar?: (bar: GanttBar, row: GanttRow) => React.ReactNode
  /**
   * `compact` in a drawer, `comfortable` on a board. It moves the bar's
   * height, not the type scale — one component, three surfaces (SR14).
   */
  density?: "compact" | "comfortable"
  /**
   * The card on hover. On by default; a row with nothing to say shows none.
   *
   * Supplementary by design — the same facts are in the log band and in
   * `result.json`, because a hover card is not reachable by touch.
   */
  showDetail?: boolean
  /**
   * Replaces the default card body, for every row. Return `null` for a row that
   * should not open one.
   */
  renderDetail?: (row: GanttRow) => React.ReactNode
  /** Where the card sits, how fast it opens, and how wide it is. */
  detailProps?: GanttDetailProps
  /** The row or bar picked — what the log is currently filtered to (SR15). */
  selectedKey?: string | null
  /** Makes the rows pickable. Picking one is what filters the log. */
  onSelectRow?: (key: string) => void
  /**
   * Makes each keyed bar pickable on its own — the task a layer was reached
   * for, rather than the layer. A row whose bars are keyed is then
   * picked by its bars, not as a whole, so a bar is never a button inside a
   * button. `selectedKey` lights a bar with that key as it lights a row.
   */
  onSelectBar?: (barKey: string, rowKey: string) => void
  /** Which rows with `rows` are open, by key — `true` for all. Controlled. */
  expanded?: ExpandedKeys
  /** Which are open at first, uncontrolled. Closed by default. */
  defaultExpanded?: ExpandedKeys
  /** A row opened or closed: every open key, as a `DataTable`'s `expanded` reads. */
  onExpandedChange?: (expanded: ExpandedKeys) => void
}

/** The bar's fill. `skipped` and `queued` have none — they draw as an outline. */
const BAR: Record<GanttStatus, string> = {
  succeeded: "bg-success",
  running: "bg-info",
  failed: "bg-destructive",
  needs_input: "bg-warning",
  stopped: "bg-muted-foreground",
  skipped: "bg-transparent",
  queued: "bg-transparent",
  refused: "bg-destructive/35",
}

/** The dot's tone, so a card and a row say one state in one colour. */
const DOT: Record<GanttStatus, React.ComponentProps<typeof StatusDot>["tone"]> = {
  succeeded: "success",
  running: "running",
  failed: "error",
  needs_input: "warning",
  stopped: "muted",
  skipped: "muted",
  queued: "queued",
  refused: "error",
}

/** What the card calls each state. `skipped` and `queued` say what happened, not the enum. */
const STATUS_LABEL: Record<GanttStatus, string> = {
  succeeded: "succeeded",
  running: "running",
  failed: "failed",
  needs_input: "needs input",
  stopped: "stopped",
  skipped: "never ran",
  queued: "not started",
  refused: "refused",
}

/**
 * Where the card opens. With neither `side` nor `align` it opens beside the
 * cursor, under the row; set either and it is placed against the row instead.
 */
export interface GanttDetailProps {
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  sideOffset?: number
  /** @default 200 */
  openDelay?: number
  /** @default 80 */
  closeDelay?: number
  /** The card's width. A `result.json` wants more than the 256px default. */
  width?: number | string
  className?: string
}

export interface GanttDetailCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  row: GanttRow
  /** Elapsed so far, for a row still running — it has no `durationMs` yet. */
  elapsedMs?: number
  formatDuration?: (ms: number) => string
}

/** A scalar renders as a value; anything else is JSON, so nothing is silently dropped. */
function renderResult(
  result: React.ReactNode | Record<string, unknown>,
): React.ReactNode {
  if (result == null) return null
  if (React.isValidElement(result)) return result
  if (typeof result !== "object") {
    return <span className="font-mono text-sm">{String(result)}</span>
  }

  const entries = Object.entries(result as Record<string, unknown>)
  const scalars = entries.filter(([, v]) => v == null || typeof v !== "object")
  const nested = entries.filter(([, v]) => v != null && typeof v === "object")
  return (
    <>
      {scalars.length ? (
        <PropertyList labelWidth={96}>
          {scalars.map(([k, v]) => (
            <PropertyRow key={k} label={k} mono className="py-0.5">
              {v == null ? "—" : String(v)}
            </PropertyRow>
          ))}
        </PropertyList>
      ) : null}
      {nested.map(([k, v]) => (
        <div key={k} className="flex flex-col gap-0.5">
          <span className="text-sm text-muted-foreground">{k}</span>
          <pre className="max-h-40 overflow-auto border border-border bg-muted/40 p-1.5 font-mono text-sm">
            {JSON.stringify(v, null, 2)}
          </pre>
        </div>
      ))}
    </>
  )
}

/**
 * What one row — or one bar — did, as a card.
 *
 * The body of the hover card, and exported so a surface can compose its own
 * around the same header — `renderDetail` returning this with a kind-specific
 * block under it is the intended way to specialise, rather than redrawing the
 * header and drifting the status vocabulary.
 *
 * Order is fixed and is the order a reader asks in: what state, how long, what
 * went wrong, what came out, what it said last.
 */
export const GanttDetailCard = React.forwardRef<
  HTMLDivElement,
  GanttDetailCardProps
>(({ row, elapsedMs, formatDuration = defaultFormatDuration, className, ...props }, ref) => {
  const status = row.status ?? "succeeded"
  const ms = row.durationMs ?? elapsedMs
  const duration = row.duration ?? (ms != null ? formatDuration(ms) : "—")
  const attempts = row.attempts ?? []

  return (
    <div ref={ref} className={cn("flex flex-col gap-2", className)} {...props}>
      <div className="flex items-baseline gap-2">
        <StatusDot tone={DOT[status]} size="md" className="translate-y-px" />
        <span className="min-w-0 flex-1 truncate font-mono text-sm font-medium">
          {row.key}
        </span>
        <span className="shrink-0 font-mono text-sm text-muted-foreground tabular-nums">
          {duration}
        </span>
      </div>

      <div className="text-sm text-muted-foreground">
        {STATUS_LABEL[status]}
        {row.summary != null ? <> · {row.summary}</> : null}
      </div>

      {attempts.length ? (
        <div className="flex flex-col gap-0.5">
          {attempts.map((a, i) => (
            <span key={i} className="text-sm text-muted-foreground">
              <span className="font-medium text-warning">attempt {i + 1}</span>{" "}
              {a.title ??
                `${a.status ?? "failed"}${
                  a.durationMs != null ? ` · ${formatDuration(a.durationMs)}` : ""
                }`}
            </span>
          ))}
        </div>
      ) : null}

      {row.bars?.length ? (
        <div className="flex flex-col gap-0.5">
          {row.bars.map((s, i) => (
            <span key={i} className="flex items-baseline gap-2 text-sm text-muted-foreground">
              <span className="min-w-0 flex-1 truncate font-mono text-foreground">
                {s.label ?? s.title ?? s.status ?? "—"}
              </span>
              {s.durationMs != null ? (
                <span className="shrink-0 font-mono tabular-nums">{formatDuration(s.durationMs)}</span>
              ) : null}
            </span>
          ))}
        </div>
      ) : null}

      {row.error != null ? (
        <div
          // The colour is a token, set inline because the kit's build emits no
          // `border-<colour>` utility today — `border-destructive` renders grey.
          style={{ borderColor: "var(--color-destructive)" }}
          className="border-l-2 bg-destructive/10 px-2 py-1.5"
        >
          {row.error.code != null ? (
            <div className="font-mono text-sm font-medium text-destructive">
              {row.error.code}
            </div>
          ) : null}
          {row.error.message != null ? (
            <div className="text-sm">{row.error.message}</div>
          ) : null}
          {row.error.detail != null ? (
            <pre className="mt-1 max-h-32 overflow-auto whitespace-pre-wrap font-mono text-sm text-muted-foreground">
              {row.error.detail}
            </pre>
          ) : null}
        </div>
      ) : null}

      {row.result != null ? renderResult(row.result) : null}

      {row.log != null ? (
        <div className="border-t border-border pt-1.5 font-mono text-sm text-muted-foreground">
          {row.log}
        </div>
      ) : null}
    </div>
  )
})
GanttDetailCard.displayName = "GanttDetailCard"

const toMs = (t: GanttInstant): number =>
  t instanceof Date ? t.getTime() : typeof t === "number" ? t : Date.parse(t)

const defaultFormatDuration = (ms: number): string => {
  // Under 100ms a run reads in milliseconds — `4ms`, `40ms`. Above it, seconds,
  // because `700ms` and `1.2s` in the same column cannot be compared at a glance.
  if (ms < 100) return `${Math.round(ms)}ms`
  const s = ms / 1000
  return s < 10 ? `${(Math.round(s * 10) / 10).toFixed(1)}s` : `${Math.round(s)}s`
}

const defaultFormatTick = (ms: number): string => {
  if (ms === 0) return "0s"
  const s = ms / 1000
  return Number.isInteger(s) ? `${s}s` : `${(Math.round(s * 10) / 10).toFixed(1)}s`
}

/** Resolves a bar to the clock, in ms from zero. */
function place(
  bar: GanttBar,
  origin: number | undefined,
): { start: number; duration: number } | null {
  let start = bar.startMs
  if (start == null && bar.startedAt != null && origin != null) {
    start = toMs(bar.startedAt) - origin
  }
  if (start == null || Number.isNaN(start)) return null

  let duration = bar.durationMs
  if (duration == null && bar.startedAt != null && bar.finishedAt != null) {
    duration = toMs(bar.finishedAt) - toMs(bar.startedAt)
  }
  return { start, duration: duration != null && duration > 0 ? duration : 0 }
}

/** Every row in the tree, parents before the rows they open into. */
const everyRow = (rows: GanttRow[]): GanttRow[] =>
  rows.flatMap((t) => [t, ...everyRow(t.rows ?? [])])

type Placed = {
  start: number
  duration: number
  status: GanttStatus
  title: string | undefined
  /** The bar as given, for `renderBar`, `label`, `group` and `variant`. */
  bar: GanttBar
}

/**
 * A row's bars: its earlier attempts, the `bars` it holds, then its own — the
 * attempt that stuck. The row's `label` and card fields describe the row, not
 * its own bar, so that bar is drawn without them.
 */
const barsOf = (row: GanttRow, zero: number | undefined): Placed[] =>
  [
    ...(row.attempts ?? []),
    ...(row.bars ?? []),
    { ...row, label: undefined, summary: undefined, result: undefined, error: undefined, log: undefined },
  ]
    .map((bar) => {
      const at = place(bar, zero)
      return at
        ? { ...at, status: bar.status ?? row.status ?? "succeeded", title: bar.title, bar }
        : null
    })
    .filter((s): s is Placed => s !== null)

/** `outline` and `dashed` are drawn as an edge; the fill is kept for spent time. */
const VARIANT = {
  solid: "",
  outline: "border border-foreground/40 bg-transparent",
  dashed: "border border-dashed border-foreground/40 bg-transparent",
} as const

/** A bar with something to say beyond its tooltip. */
const hasCard = (bar: GanttBar) =>
  bar.summary != null || bar.result != null || bar.error != null || bar.log != null

/** Indent per level of `rows`, and the room the open/close control takes. */
const INDENT = 12
const TOGGLE = 16

/**
 * A row's hover card. With no placement asked for it opens beside the cursor —
 * where the reader is looking — and a little to its right, so moving straight
 * down to the next row never lands on the card.
 */
function RowCard({
  trigger,
  detail,
  detailProps,
}: {
  trigger: React.ReactElement
  detail: React.ReactNode
  detailProps?: GanttDetailProps
}) {
  const x = React.useRef(0)
  const [offset, setOffset] = React.useState(0)
  const atCursor = detailProps?.side == null && detailProps?.align == null
  return (
    <HoverCard
      openDelay={detailProps?.openDelay ?? 200}
      closeDelay={detailProps?.closeDelay ?? 80}
      onOpenChange={(open) => {
        if (open) setOffset(x.current)
      }}
    >
      <HoverCardTrigger
        asChild
        onPointerMove={(e) => {
          x.current = e.clientX - e.currentTarget.getBoundingClientRect().left
        }}
      >
        {trigger}
      </HoverCardTrigger>
      <HoverCardContent
        side={detailProps?.side ?? "bottom"}
        align={detailProps?.align ?? "start"}
        alignOffset={atCursor ? offset + 16 : undefined}
        sideOffset={detailProps?.sideOffset ?? (atCursor ? 4 : 8)}
        style={detailProps?.width != null ? { width: detailProps.width } : undefined}
        className={cn("w-72 p-3", detailProps?.className)}
      >
        {detail}
      </HoverCardContent>
    </HoverCard>
  )
}

/**
 * Where the time went — rows of bars on one clock.
 *
 * A row is whatever a surface groups time by. Read by **task**, it answers the
 * question a run detail is opened with: a bar placed by start and sized by
 * duration puts the slow task, the retry and the branch that never ran in one
 * glance (SR14). Read by **layer**, the same drawing answers what the run
 * reached and what it was stopped from reaching: a row per layer opens into its
 * participants, and each holds the `bars` of the tasks that reached it, painted
 * by `palette` — `refused` where a rule said no, `dashed` where it was declared
 * and never dispatched. Read by **slot**, each row is a worker and its bars are
 * what it ran, in order.
 *
 * A row opens into its `rows`, indented under it, and a parent with no timing
 * of its own draws the stretch they cover as a thin rule — so a closed plan
 * still says how long it took. The clock is milliseconds by default; a plan
 * read in order passes step numbers and a `formatTick` that names them.
 *
 * Colour never carries state alone: every row names its duration, a bar titles
 * itself with its status, a row that never ran is an *outline* rather than a
 * paler fill, and a refused bar's name is struck through.
 */
export const Gantt = React.forwardRef<HTMLDivElement, GanttProps>(
  (
    {
      rows,
      origin,
      spanMs,
      nowMs,
      openEnded,
      ticks = 4,
      formatTick = defaultFormatTick,
      formatDuration = defaultFormatDuration,
      labelWidth,
      durationWidth,
      brackets = [],
      seams = [],
      palette,
      renderBar,
      density = "comfortable",
      showDetail = true,
      renderDetail,
      detailProps,
      selectedKey,
      onSelectRow,
      onSelectBar,
      expanded,
      defaultExpanded,
      onExpandedChange,
      className,
      ...props
    },
    ref,
  ) => {
    const barHeight = density === "compact" ? 11 : 13

    const all = React.useMemo(() => everyRow(rows), [rows])
    const parents = all.filter((t) => t.rows?.length).map((t) => t.key)
    const nested = parents.length > 0
    const { isOpen, toggle } = useExpandedKeys({
      expanded,
      defaultExpanded,
      onExpandedChange,
      keys: parents,
    })

    const zero = React.useMemo(() => {
      const stamps: number[] = []
      for (const t of [...all, ...all.flatMap((t) => t.attempts ?? [])]) {
        if (t.startedAt != null) stamps.push(toMs(t.startedAt))
      }
      return origin != null ? toMs(origin) : stamps.length ? Math.min(...stamps) : undefined
    }, [all, origin])

    /** Each row's bars, and for a parent the stretch everything under it covers. */
    const placed = React.useMemo(() => {
      const own = new Map(all.map((t) => [t.key, barsOf(t, zero)]))
      const reach = (t: GanttRow): { start: number; end: number } | null => {
        const segs = everyRow([t]).flatMap((d) => own.get(d.key) ?? [])
        if (!segs.length) return null
        return {
          start: Math.min(...segs.map((s) => s.start)),
          end: Math.max(...segs.map((s) => s.start + s.duration)),
        }
      }
      return new Map(
        all.map((t) => [t.key, { bars: own.get(t.key) ?? [], reach: t.rows?.length ? reach(t) : null }]),
      )
    }, [all, zero])

    /** The rows on screen: every row whose parents are all open, with its depth. */
    const visible: { row: GanttRow; depth: number }[] = []
    const walk = (list: GanttRow[], depth: number) => {
      for (const row of list) {
        visible.push({ row, depth })
        if (row.rows?.length && isOpen(row.key)) walk(row.rows, depth + 1)
      }
    }
    walk(rows, 0)

    const placedSeams = seams
      .map((seam) => ({ seam, at: place(seam, zero) }))
      .filter((s) => s.at !== null) as { seam: GanttSeam; at: { start: number; duration: number } }[]

    const ends = [...placed.values()].flatMap((p) => p.bars.map((s) => s.start + s.duration))
    const span = Math.max(
      spanMs ??
        Math.max(
          nowMs ?? 0,
          ...ends,
          ...placedSeams.map((s) => s.at.start + s.at.duration),
        ),
      1,
    )

    // Which rows a bracket holds, and which bracket opens on which row — of the rows on screen.
    const inBracket = new Set<number>()
    const opens = new Map<string, GanttBracket>()
    for (const b of brackets) {
      const from = visible.findIndex((r) => r.row.key === b.from)
      const to = visible.findIndex((r, i) => i >= from && r.row.key === b.to)
      if (from < 0 || to < 0) continue
      opens.set(visible[from].row.key, b)
      for (let i = from; i <= to; i++) inBracket.add(i)
    }
    const seamsAfter = (key: string) => placedSeams.filter((s) => s.seam.after === key)
    const pct = (ms: number) => `${Math.max(0, Math.min(100, (ms / span) * 100))}%`

    const axis = Array.from({ length: ticks + 1 }, (_, i) =>
      formatTick((span / ticks) * i),
    )
    const lastLabel = openEnded ? `${axis[axis.length - 1]}+` : axis[axis.length - 1]

    /**
     * The card for one row, or `null` for a row with nothing to say — an empty
     * card that follows the cursor is worse than no card.
     */
    const detailFor = (row: GanttRow, elapsedMs?: number): React.ReactNode => {
      if (!showDetail) return null
      if (renderDetail) return renderDetail(row)
      if (row.detail != null) return row.detail
      const hasBody =
        row.result != null ||
        row.error != null ||
        row.log != null ||
        row.summary != null ||
        (row.attempts?.length ?? 0) > 0 ||
        (row.bars?.length ?? 0) > 0
      if (!hasBody) return null
      return (
        <GanttDetailCard
          row={row}
          elapsedMs={elapsedMs}
          formatDuration={formatDuration}
        />
      )
    }

    return (
      <div
        ref={ref}
        className={cn("grid gap-x-2", className)}
        style={{
          gridTemplateColumns: `${
            labelWidth != null ? `${labelWidth}px` : "fit-content(40%)"
          } minmax(0, 1fr) ${durationWidth != null ? `${durationWidth}px` : "max-content"}`,
        }}
        {...props}
      >
        {/* The axis — the run's clock, read once at the top. */}
        <div className="col-span-full grid grid-cols-subgrid items-center pt-0.5 pb-1" aria-hidden>
          <span />
          <span className="flex">
            {axis.slice(0, -1).map((label, i) => (
              <span
                key={i}
                className="flex-1 border-l border-border pl-1 text-sm text-muted-foreground tabular-nums"
              >
                {label}
              </span>
            ))}
          </span>
          <span className="text-right text-sm text-muted-foreground tabular-nums">
            {lastLabel}
          </span>
        </div>

        {visible.map(({ row, depth }, index) => {
          const { bars, reach } = placed.get(row.key)!
          const kids = (row.rows?.length ?? 0) > 0
          const open = kids && isOpen(row.key)
          const neverRan = bars.length === 0 && reach == null
          const selected = selectedKey != null && selectedKey === row.key
          const bracketed = inBracket.has(index)
          const barPicks = onSelectBar != null && (row.bars ?? []).some((s) => s.key != null)
          const pickable = onSelectRow != null && !barPicks
          // A running row has no `durationMs` of its own yet: what it has spent so
          // far is the bar drawn up to the *now* line. A parent with no bar of its
          // own has spent what its rows cover; a row of many bars, what they add up to.
          const ownBar = place(row, zero) != null
          const elapsed =
            row.durationMs ??
            (row.bars?.length && !ownBar
              ? bars.reduce((n, s) => n + s.duration, 0)
              : bars[bars.length - 1]?.duration) ??
            (reach ? reach.end - reach.start : undefined)
          const duration =
            row.duration ?? (neverRan || elapsed == null ? "—" : formatDuration(elapsed))

          // A bar that has its own card: the bars own the hover, not the row.
          const barCards = bars.map((s) =>
            showDetail && hasCard(s.bar) ? (
              <GanttDetailCard
                row={{
                  key: s.bar.key ?? row.key,
                  label: s.bar.label,
                  status: s.status,
                  durationMs: s.duration,
                  summary: s.bar.summary,
                  result: s.bar.result,
                  error: s.bar.error,
                  log: s.bar.log,
                }}
                formatDuration={formatDuration}
              />
            ) : null,
          )
          const detail = barCards.some((c) => c != null) ? null : detailFor(row, elapsed)

          // What each bar carries inside it. A row with any of it grows to hold a
          // line of text — two, with a note; the rest keep the thin bar, so a
          // chart of plain bars does not change height because the API added a field.
          const contents = bars.map((s) =>
            renderBar ? renderBar(s.bar, row) : s.bar.label ?? null,
          )
          const tall = contents.some((c) => c != null)
          const twoLines = tall && bars.some((s) => s.bar.note != null)

          const cells = (
            <div className="col-span-full grid grid-cols-subgrid items-center py-[3px]">
              <span
                className={cn(
                  "min-w-0 truncate font-mono text-sm",
                  neverRan && "text-muted-foreground",
                )}
                style={nested ? { paddingLeft: depth * INDENT + TOGGLE } : undefined}
                title={row.key}
              >
                {row.label ?? row.key}
              </span>

              {/* The track — the whole clock, so an empty stretch reads as waiting. */}
              <span
                className={cn(
                  "relative min-w-0 bg-muted/55",
                  twoLines ? "h-control-md" : tall && "h-control-xs",
                )}
                style={tall ? undefined : { height: barHeight }}
              >
                {neverRan ? (
                  <span className="absolute inset-0 border border-dashed border-border" />
                ) : bars.length ? (
                  bars.map((b, i) => {
                    // Chosen, not merged: a palette entry is a consumer's class,
                    // which `cn` cannot see a conflict with. A failure and a
                    // refusal keep their own colour over any group's — they are
                    // the bars a reader must not mistake for work done.
                    const fill =
                      (b.status !== "failed" && b.status !== "refused" && b.bar.group != null && palette?.[b.bar.group]) ||
                      BAR[b.status]
                    const variant = VARIANT[b.bar.variant ?? "solid"]
                    const inside = contents[i]
                    const title =
                      b.title ?? `${row.key} · ${b.status} · ${formatDuration(b.duration)}`
                    const at = { left: pct(b.start), width: pct(b.duration), minWidth: 2 }
                    const key = b.bar.key
                    const Bar = barPicks && key != null ? "button" : "span"
                    const pick =
                      Bar === "button"
                        ? {
                            type: "button" as const,
                            "aria-label": title,
                            "aria-pressed": selectedKey === key,
                            onClick: () => onSelectBar!(key!, row.key),
                          }
                        : {}
                    const lit = key != null && selectedKey === key && "ring-1 ring-ring"
                    const picking =
                      Bar === "button" &&
                      "cursor-pointer focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    const card = barCards[i]
                    // The native tooltip is the fallback, not a second copy of the card.
                    const tip = card == null ? title : undefined
                    const drawn = inside == null ? (
                      <Bar
                        key={i}
                        title={tip}
                        className={cn("absolute inset-y-0 rounded-[1px]", variant || fill, picking, lit)}
                        style={at}
                        {...pick}
                      />
                    ) : (
                      // A card with the fill as its rail: text on a status colour
                      // is unreadable in half the themes.
                      <Bar
                        key={i}
                        title={tip}
                        className={cn(
                          "absolute inset-y-px flex min-w-0 items-stretch overflow-hidden rounded-xs border border-border bg-card text-left",
                          b.bar.variant === "dashed" && "border-dashed",
                          // Muted, not accent: in some themes accent is a strong hue
                          // and the bar's text would sit on it.
                          picking && [picking, "hover:bg-muted"],
                          lit,
                        )}
                        style={at}
                        {...pick}
                      >
                        <span
                          aria-hidden
                          className={cn("w-1 shrink-0", b.bar.variant && b.bar.variant !== "solid" ? "bg-border" : fill)}
                        />
                        <span className="flex min-w-0 flex-auto flex-col justify-center px-1">
                          <span
                            className={cn(
                              "truncate font-mono text-sm",
                              b.status === "refused" && "text-destructive line-through",
                            )}
                          >
                            {inside}
                          </span>
                          {b.bar.note != null ? (
                            <span className="truncate text-sm text-muted-foreground">{b.bar.note}</span>
                          ) : null}
                        </span>
                        {b.bar.chip != null ? (
                          // The chip gives way first: a narrow bar keeps its name.
                          <span className="flex min-w-0 shrink-[100] items-center overflow-hidden pr-1">
                            {b.bar.chip}
                          </span>
                        ) : null}
                      </Bar>
                    )
                    return card == null ? (
                      drawn
                    ) : (
                      <RowCard key={i} trigger={drawn} detail={card} detailProps={detailProps} />
                    )
                  })
                ) : reach ? (
                  <span
                    title={`${row.key} · ${row.rows!.length} rows · ${formatDuration(reach.end - reach.start)}`}
                    className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-foreground/45"
                    style={{
                      left: pct(reach.start),
                      width: pct(reach.end - reach.start),
                      minWidth: 2,
                    }}
                  />
                ) : null}
                {nowMs != null ? (
                  <span
                    className="absolute -top-0.5 -bottom-0.5 w-px bg-info/70"
                    style={{ left: pct(nowMs) }}
                    aria-hidden
                  />
                ) : null}
              </span>

              <span className="text-right font-mono text-sm text-muted-foreground tabular-nums">
                {duration}
              </span>
            </div>
          )

          const trigger = pickable ? (
            <button
              type="button"
              aria-pressed={selected}
              onClick={() => onSelectRow(row.key)}
              className={cn(
                "col-span-full row-start-1 grid cursor-pointer grid-cols-subgrid text-left focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                "hover:bg-accent/60",
                bracketed && !selected && "bg-warning/5",
                selected && "bg-accent",
              )}
            >
              {cells}
            </button>
          ) : (
            <div
              className={cn(
                "col-span-full row-start-1 grid grid-cols-subgrid",
                bracketed && "bg-warning/5",
                detail != null && "hover:bg-accent/60",
              )}
            >
              {cells}
            </div>
          )

          // The open/close control sits over the label cell, beside the row
          // rather than in it, so it is never a button inside the pick button.
          const line = (
            <div className="col-span-full grid grid-cols-subgrid">
              {detail == null ? (
                trigger
              ) : (
                <RowCard trigger={trigger} detail={detail} detailProps={detailProps} />
              )}
              {kids ? (
                <ExpandToggle
                  open={open}
                  label={row.key}
                  onClick={() => toggle(row.key)}
                  className="z-10 col-start-1 row-start-1 self-center justify-self-start"
                  style={{ marginLeft: depth * INDENT }}
                />
              ) : null}
            </div>
          )

          const bracket = opens.get(row.key)
          return (
            <React.Fragment key={row.key}>
              {bracket ? (
                <div
                  className="col-span-full truncate border-l-2 bg-warning/10 px-2 py-0.5 font-mono text-sm font-medium text-warning"
                  // The kit's build emits no `border-<colour>` utility (see the card).
                  style={{ borderColor: "var(--color-warning)" }}
                >
                  {bracket.label}
                </div>
              ) : null}
              {line}
              {seamsAfter(row.key).map(({ seam, at }, i) => (
                <div
                  key={`seam-${i}`}
                  className="col-span-full grid grid-cols-subgrid items-center py-[3px]"
                >
                  <span className="min-w-0 truncate font-mono text-sm font-medium text-destructive">
                    {seam.label}
                  </span>
                  <span className="relative min-w-0" style={{ height: barHeight }}>
                    <span
                      className="absolute top-1/2 border-t-2 border-dashed"
                      style={{
                        left: pct(at.start),
                        width: pct(at.duration),
                        borderColor: "var(--color-destructive)",
                      }}
                    />
                    {seam.note != null ? (
                      <span
                        className="absolute top-1/2 max-w-full -translate-x-1/2 -translate-y-1/2 truncate bg-card px-1.5 text-sm text-destructive"
                        style={{ left: pct(at.start + at.duration / 2) }}
                      >
                        {seam.note}
                      </span>
                    ) : null}
                  </span>
                  <span className="text-right font-mono text-sm text-destructive tabular-nums">
                    {seam.duration ?? formatDuration(at.duration)}
                  </span>
                </div>
              ))}
            </React.Fragment>
          )
        })}
      </div>
    )
  },
)
Gantt.displayName = "Gantt"
