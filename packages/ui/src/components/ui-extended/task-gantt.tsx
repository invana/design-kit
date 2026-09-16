import * as React from "react"

import { cn } from "../../lib/utils"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"
import { StatusDot } from "../ui/status-dot"
import { PropertyList, PropertyRow } from "./property-list"

/**
 * What a task did with its slice of the run's clock.
 *
 * These are the engine's own step statuses (`StepStatus`, plus `skipped` for a
 * branch that never ran), not a second vocabulary: a Gantt row and a log line
 * are the same task seen twice, so they say the same word for the same state.
 */
export type TaskGanttStatus =
  | "succeeded"
  | "running"
  | "failed"
  | "needs_input"
  | "stopped"
  | "skipped"
  | "queued"

/** A `Date`, an ISO string, or epoch milliseconds — whatever the JSON carried. */
export type TaskGanttInstant = string | number | Date

/**
 * One bar. A task is usually one of these; a retried task is two or more, the
 * failed attempt sitting to the left of the one that stuck.
 */
export interface TaskGanttSegment {
  /** Offset from the run's zero. Use this, or `startedAt` with `origin`. */
  startMs?: number
  durationMs?: number
  startedAt?: TaskGanttInstant
  finishedAt?: TaskGanttInstant
  status?: TaskGanttStatus
  /** Overrides the hover text, which otherwise reads `key · status · duration`. */
  title?: string
}

export interface TaskGanttTask extends TaskGanttSegment {
  /** `task_key` — what the log lines call this task. Also the row's label. */
  key: string
  /** Shown instead of `key`, when the row wants a human name. */
  label?: React.ReactNode
  /** Earlier attempts, oldest first. A failed one draws in `destructive`. */
  attempts?: TaskGanttSegment[]
  /** Overrides the right-hand duration cell. `—` when the task never ran. */
  duration?: React.ReactNode
  /** One line — what the task said. The card's last line. */
  log?: React.ReactNode
  /** A sentence under the card's header, when the row wants one. */
  summary?: React.ReactNode
  /**
   * What the task produced — its `result.json`, or any part of it.
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
}

export interface TaskGanttProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** One entry per task, in plan order — the run's `steps`, grouped by task. */
  tasks: TaskGanttTask[]
  /** The run's zero, when tasks carry timestamps. Defaults to the earliest one. */
  origin?: TaskGanttInstant
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
  /** The key column, in px. 112 in the drawer, wider on a dashboard. */
  labelWidth?: number
  /**
   * `compact` in a drawer, `comfortable` on a dashboard. It moves the bar's
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
  renderDetail?: (task: TaskGanttTask) => React.ReactNode
  /** Where the card sits, how fast it opens, and how wide it is. */
  detailProps?: TaskGanttDetailProps
  /** The task the log is currently filtered to (SR15). */
  selectedKey?: string | null
  /** Makes the rows pickable. Picking one is what filters the log. */
  onSelectTask?: (key: string) => void
}

/** The bar's fill. `skipped` and `queued` have none — they draw as an outline. */
const BAR: Record<TaskGanttStatus, string> = {
  succeeded: "bg-success",
  running: "bg-info",
  failed: "bg-destructive",
  needs_input: "bg-warning",
  stopped: "bg-muted-foreground",
  skipped: "bg-transparent",
  queued: "bg-transparent",
}

/** The dot's tone, so a card and a task row say one state in one colour. */
const DOT: Record<TaskGanttStatus, React.ComponentProps<typeof StatusDot>["tone"]> = {
  succeeded: "success",
  running: "running",
  failed: "error",
  needs_input: "warning",
  stopped: "muted",
  skipped: "muted",
  queued: "queued",
}

/** What the card calls each state. `skipped` and `queued` say what happened, not the enum. */
const STATUS_LABEL: Record<TaskGanttStatus, string> = {
  succeeded: "succeeded",
  running: "running",
  failed: "failed",
  needs_input: "needs input",
  stopped: "stopped",
  skipped: "never ran",
  queued: "not started",
}

export interface TaskGanttDetailProps {
  /** @default "right" */
  side?: "top" | "right" | "bottom" | "left"
  /** @default "start" */
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

export interface TaskGanttDetailCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  task: TaskGanttTask
  /** Elapsed so far, for a task still running — it has no `durationMs` yet. */
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
    return <span className="font-mono text-meta">{String(result)}</span>
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
          <span className="text-meta text-muted-foreground">{k}</span>
          <pre className="max-h-40 overflow-auto border border-border bg-muted/40 p-1.5 font-mono text-meta">
            {JSON.stringify(v, null, 2)}
          </pre>
        </div>
      ))}
    </>
  )
}

/**
 * What one task did, as a card.
 *
 * The body of the hover card, and exported so a surface can compose its own
 * around the same header — `renderDetail` returning this with a kind-specific
 * block under it is the intended way to specialise, rather than redrawing the
 * header and drifting the status vocabulary.
 *
 * Order is fixed and is the order a reader asks in: what state, how long, what
 * went wrong, what came out, what it said last.
 */
export const TaskGanttDetailCard = React.forwardRef<
  HTMLDivElement,
  TaskGanttDetailCardProps
>(({ task, elapsedMs, formatDuration = defaultFormatDuration, className, ...props }, ref) => {
  const status = task.status ?? "succeeded"
  const ms = task.durationMs ?? elapsedMs
  const duration = task.duration ?? (ms != null ? formatDuration(ms) : "—")
  const attempts = task.attempts ?? []

  return (
    <div ref={ref} className={cn("flex flex-col gap-2", className)} {...props}>
      <div className="flex items-baseline gap-2">
        <StatusDot tone={DOT[status]} size="md" className="translate-y-px" />
        <span className="min-w-0 flex-1 truncate font-mono text-meta font-medium">
          {task.key}
        </span>
        <span className="shrink-0 font-mono text-meta text-muted-foreground tabular-nums">
          {duration}
        </span>
      </div>

      <div className="text-meta text-muted-foreground">
        {STATUS_LABEL[status]}
        {task.summary != null ? <> · {task.summary}</> : null}
      </div>

      {attempts.length ? (
        <div className="flex flex-col gap-0.5">
          {attempts.map((a, i) => (
            <span key={i} className="text-meta text-muted-foreground">
              <span className="font-medium text-warning">attempt {i + 1}</span>{" "}
              {a.title ??
                `${a.status ?? "failed"}${
                  a.durationMs != null ? ` · ${formatDuration(a.durationMs)}` : ""
                }`}
            </span>
          ))}
        </div>
      ) : null}

      {task.error != null ? (
        <div
          // The colour is a token, set inline because the kit's build emits no
          // `border-<colour>` utility today — `border-destructive` renders grey.
          style={{ borderColor: "var(--color-destructive)" }}
          className="border-l-2 bg-destructive/10 px-2 py-1.5"
        >
          {task.error.code != null ? (
            <div className="font-mono text-meta font-medium text-destructive">
              {task.error.code}
            </div>
          ) : null}
          {task.error.message != null ? (
            <div className="text-meta">{task.error.message}</div>
          ) : null}
          {task.error.detail != null ? (
            <pre className="mt-1 max-h-32 overflow-auto whitespace-pre-wrap font-mono text-meta text-muted-foreground">
              {task.error.detail}
            </pre>
          ) : null}
        </div>
      ) : null}

      {task.result != null ? renderResult(task.result) : null}

      {task.log != null ? (
        <div className="border-t border-border pt-1.5 font-mono text-meta text-muted-foreground">
          {task.log}
        </div>
      ) : null}
    </div>
  )
})
TaskGanttDetailCard.displayName = "TaskGanttDetailCard"

const toMs = (t: TaskGanttInstant): number =>
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

/** Resolves a segment to the run's clock, in ms from zero. */
function place(
  seg: TaskGanttSegment,
  origin: number | undefined,
): { start: number; duration: number } | null {
  let start = seg.startMs
  if (start == null && seg.startedAt != null && origin != null) {
    start = toMs(seg.startedAt) - origin
  }
  if (start == null || Number.isNaN(start)) return null

  let duration = seg.durationMs
  if (duration == null && seg.startedAt != null && seg.finishedAt != null) {
    duration = toMs(seg.finishedAt) - toMs(seg.startedAt)
  }
  return { start, duration: duration != null && duration > 0 ? duration : 0 }
}

/**
 * Where the time went — one row per task, on the run's own clock.
 *
 * Duration is the question a run detail is opened with, and a step list with a
 * duration column answers it one row at a time. A bar placed by start and sized
 * by duration puts the slow task, the retry and the branch that never ran in one
 * glance (SR14).
 *
 * It is one component across three surfaces — the Runs drawer (compact, with a
 * line of log per row), the run dashboard (full width, logs off) and the
 * document rendering — so `density` and `showLogs` are props, not three
 * drawings.
 *
 * Colour never carries state alone: every row names its duration, the bar
 * titles itself with its status, and a task that never ran is an *outline*
 * rather than a paler fill.
 */
export const TaskGantt = React.forwardRef<HTMLDivElement, TaskGanttProps>(
  (
    {
      tasks,
      origin,
      spanMs,
      nowMs,
      openEnded,
      ticks = 4,
      formatTick = defaultFormatTick,
      formatDuration = defaultFormatDuration,
      labelWidth = 112,
      density = "comfortable",
      showDetail = true,
      renderDetail,
      detailProps,
      selectedKey,
      onSelectTask,
      className,
      ...props
    },
    ref,
  ) => {
    const barHeight = density === "compact" ? 11 : 13
    const durationWidth = 40

    const rows = React.useMemo(() => {
      const stamps: number[] = []
      for (const t of [...tasks, ...tasks.flatMap((t) => t.attempts ?? [])]) {
        if (t.startedAt != null) stamps.push(toMs(t.startedAt))
      }
      const zero =
        origin != null ? toMs(origin) : stamps.length ? Math.min(...stamps) : undefined

      return tasks.map((task) => {
        const segments = [...(task.attempts ?? []), task]
          .map((seg) => {
            const at = place(seg, zero)
            return at
              ? { ...at, status: seg.status ?? task.status ?? "succeeded", title: seg.title }
              : null
          })
          .filter((s): s is NonNullable<typeof s> => s !== null)
        const last = segments[segments.length - 1]
        return { task, segments, end: last ? last.start + last.duration : 0 }
      })
    }, [tasks, origin])

    const span = Math.max(
      spanMs ?? Math.max(nowMs ?? 0, ...rows.map((r) => r.end)),
      1,
    )
    const pct = (ms: number) => `${Math.max(0, Math.min(100, (ms / span) * 100))}%`

    const axis = Array.from({ length: ticks + 1 }, (_, i) =>
      formatTick((span / ticks) * i),
    )
    const lastLabel = openEnded ? `${axis[axis.length - 1]}+` : axis[axis.length - 1]

    /**
     * The card for one row, or `null` for a row with nothing to say — an empty
     * card that follows the cursor is worse than no card.
     */
    const detailFor = (task: TaskGanttTask, elapsedMs?: number): React.ReactNode => {
      if (!showDetail) return null
      if (renderDetail) return renderDetail(task)
      if (task.detail != null) return task.detail
      const hasBody =
        task.result != null ||
        task.error != null ||
        task.log != null ||
        task.summary != null ||
        (task.attempts?.length ?? 0) > 0
      if (!hasBody) return null
      return (
        <TaskGanttDetailCard
          task={task}
          elapsedMs={elapsedMs}
          formatDuration={formatDuration}
        />
      )
    }

    return (
      <div ref={ref} className={cn("flex flex-col", className)} {...props}>
        {/* The axis — the run's clock, read once at the top. */}
        <div className="flex items-center gap-2 pt-0.5 pb-1" aria-hidden>
          <span className="shrink-0" style={{ width: labelWidth }} />
          <span className="flex flex-1">
            {axis.slice(0, -1).map((label, i) => (
              <span
                key={i}
                className="flex-1 border-l border-border pl-1 text-meta text-muted-foreground tabular-nums"
              >
                {label}
              </span>
            ))}
          </span>
          <span
            className="shrink-0 text-right text-meta text-muted-foreground tabular-nums"
            style={{ width: durationWidth }}
          >
            {lastLabel}
          </span>
        </div>

        {rows.map(({ task, segments }) => {
          const neverRan = segments.length === 0
          const selected = selectedKey != null && selectedKey === task.key
          const pickable = onSelectTask != null
          // A running task has no `durationMs` of its own yet: what it has spent so
          // far is the segment drawn up to the *now* line.
          const elapsed = task.durationMs ?? segments[segments.length - 1]?.duration
          const duration =
            task.duration ?? (neverRan || elapsed == null ? "—" : formatDuration(elapsed))

          const detail = detailFor(task, elapsed)

          const row = (
            <>
              <div className="flex items-center gap-2 py-[3px]">
                <span
                  className={cn(
                    "shrink-0 truncate font-mono text-meta",
                    neverRan && "text-muted-foreground",
                  )}
                  style={{ width: labelWidth }}
                  title={task.key}
                >
                  {task.label ?? task.key}
                </span>

                {/* The track — the whole clock, so an empty stretch reads as waiting. */}
                <span
                  className="relative min-w-0 flex-1 bg-muted/55"
                  style={{ height: barHeight }}
                >
                  {neverRan ? (
                    <span className="absolute inset-0 border border-dashed border-border" />
                  ) : (
                    segments.map((seg, i) => (
                      <span
                        key={i}
                        title={
                          seg.title ??
                          `${task.key} · ${seg.status} · ${formatDuration(seg.duration)}`
                        }
                        className={cn("absolute inset-y-0 rounded-[1px]", BAR[seg.status])}
                        style={{
                          left: pct(seg.start),
                          width: pct(seg.duration),
                          minWidth: 2,
                        }}
                      />
                    ))
                  )}
                  {nowMs != null ? (
                    <span
                      className="absolute -top-0.5 -bottom-0.5 w-px bg-info/70"
                      style={{ left: pct(nowMs) }}
                      aria-hidden
                    />
                  ) : null}
                </span>

                <span
                  className="shrink-0 text-right font-mono text-meta text-muted-foreground tabular-nums"
                  style={{ width: durationWidth }}
                >
                  {duration}
                </span>
              </div>
            </>
          )

          const trigger = pickable ? (
            <button
              type="button"
              aria-pressed={selected}
              onClick={() => onSelectTask(task.key)}
              className={cn(
                "w-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                "hover:bg-accent/60",
                selected && "bg-accent",
              )}
            >
              {row}
            </button>
          ) : (
            <div className={cn(detail != null && "hover:bg-accent/60")}>{row}</div>
          )

          if (detail == null) return <div key={task.key}>{trigger}</div>

          return (
            <HoverCard
              key={task.key}
              openDelay={detailProps?.openDelay ?? 200}
              closeDelay={detailProps?.closeDelay ?? 80}
            >
              <HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
              <HoverCardContent
                side={detailProps?.side ?? "right"}
                align={detailProps?.align ?? "start"}
                sideOffset={detailProps?.sideOffset ?? 8}
                style={detailProps?.width != null ? { width: detailProps.width } : undefined}
                className={cn("w-72 p-3", detailProps?.className)}
              >
                {detail}
              </HoverCardContent>
            </HoverCard>
          )
        })}
      </div>
    )
  },
)
TaskGantt.displayName = "TaskGantt"
