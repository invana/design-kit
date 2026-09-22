import * as React from "react"

import { cn } from "../../lib/utils"
import {
  layerLabel,
  layerPaint,
  type Layer,
  type LayerPalette,
} from "./layer-chip"

export interface TraceListProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

/**
 * A run, in the order it happened.
 *
 * The default reading of a trace, because *what happened, and then what* is the
 * cheapest honest answer to a reader opening a run. Its rows are
 * {@link TraceStep}s; a bounded repetition **contains** its rounds
 * ({@link TraceLoop}) and a gate lies **between** rows ({@link TraceGate}).
 *
 * Nothing here is an axis. The layer a step spent is a column on its row, so a
 * list nests for free and a second round is simply another row inside the box
 * that holds it. The clock reading of the same trace is `LayerStrip`.
 */
export const TraceList = React.forwardRef<HTMLDivElement, TraceListProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      role="list"
      className={cn("flex flex-col [&>*:first-child]:border-t-0", className)}
      {...props}
    >
      {children}
    </div>
  ),
)
TraceList.displayName = "TraceList"

export interface TraceStepProps
  // `role` is the **step's** role, not an ARIA one: a row is a list item by
  // construction, so the DOM attribute is the component's to set and the word
  // is free to mean what the record means by it.
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect" | "role"> {
  /** Where it sits in the run — the sequence number. */
  seq?: React.ReactNode
  /** The step's key — `execute_query`. Mono, because it is the plan's own word. */
  name: React.ReactNode
  /** One line: what it did, in the graph's terms. */
  description?: React.ReactNode
  /** The participant class it spent. A step spends exactly one. */
  layer?: Layer
  /** What it spent it on — `extract`, `decide`, `read_only`, `schema`. */
  role?: React.ReactNode
  /** How long it took, or `—` when it never ran. */
  duration?: React.ReactNode
  /** Under the duration — `ok`, `round 2`, `1,284 rows`, `skipped`. */
  note?: React.ReactNode
  /** The exception this row carries — a `MarkChip`. */
  mark?: React.ReactNode
  palette?: LayerPalette
  /** A delegated run's steps sit under the step that spawned them. */
  depth?: number
  /** Dispatched to nobody: queued, held, or never reached. Present, not in play. */
  dim?: boolean
  /** It ran and it failed, or it was refused. The name is struck, in the destructive tone. */
  struck?: boolean
  selected?: boolean
  onSelect?: () => void
}

/**
 * One event of a run: a step, and everything that is true of it.
 *
 * **The stripe is the layer.** A step touches exactly one participant class, so
 * the layer is a 3px rail down the row rather than a column of its own — which
 * leaves the row's width for the two things a reader is actually scanning, the
 * step's key and what it did.
 *
 * A row keeps its place in every state. A step that is painting right now, one
 * that was skipped because the step above it failed, one that was refused: all
 * three stay where they sit in the order, dimmed or struck. A list that dropped
 * them would be a list that cannot say *nothing below the failure was
 * dispatched*.
 */
export const TraceStep = React.forwardRef<HTMLDivElement, TraceStepProps>(
  (
    {
      seq,
      name,
      description,
      layer,
      role,
      duration,
      note,
      mark,
      palette,
      depth = 0,
      dim,
      struck,
      selected,
      onSelect,
      className,
      ...props
    },
    ref,
  ) => {
    const paint = layer ? layerPaint(palette, layer) : undefined
    const Row = onSelect ? "button" : "div"
    return (
      <div
        ref={ref}
        role="listitem"
        className={cn(
          "flex min-h-[46px] items-stretch border-t border-border/55",
          selected && "bg-accent shadow-[inset_2px_0_0_var(--color-primary)]",
          dim && "opacity-50",
          className,
        )}
        {...props}
      >
        <span
          aria-hidden
          className={cn(
            "w-[3px] shrink-0",
            struck ? "bg-destructive" : (paint?.swatch ?? "bg-muted-foreground"),
          )}
        />
        <Row
          type={onSelect ? "button" : undefined}
          onClick={onSelect}
          className={cn(
            "flex min-w-0 flex-1 items-center gap-2 pr-3 text-left",
            onSelect &&
              "cursor-pointer hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring",
          )}
        >
          <span
            style={{ width: 26 + depth * 18 }}
            className="shrink-0 text-right font-mono text-xs text-muted-foreground"
          >
            {seq}
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-px py-1.5 pl-2">
            <span className="flex min-w-0 items-center gap-1.5">
              <span
                className={cn(
                  "min-w-0 truncate font-mono font-semibold",
                  struck && "text-destructive line-through",
                )}
              >
                {name}
              </span>
              {mark}
            </span>
            {description != null ? (
              <span className="truncate text-sm text-muted-foreground">
                {description}
              </span>
            ) : null}
          </span>
          {layer != null ? (
            // The layer is never the part that gives way: it is one of six short
            // words and it is what the row is *about*. The role is the longer,
            // subordinate string, so it truncates first.
            <span className="flex w-[10.5rem] shrink-0 items-center justify-end gap-1.5">
              <span
                aria-hidden
                className={cn(
                  "size-1.5 shrink-0 rounded-full",
                  dim ? "bg-muted-foreground" : paint?.swatch,
                )}
              />
              <span
                className={cn(
                  "shrink-0 text-sm whitespace-nowrap",
                  dim && "text-muted-foreground",
                )}
              >
                {layerLabel(layer)}
              </span>
              {role != null ? (
                <span className="min-w-0 truncate font-mono text-xs text-muted-foreground">
                  {role}
                </span>
              ) : null}
            </span>
          ) : null}
          <span className="flex w-[6rem] shrink-0 flex-col items-end">
            <span className="font-mono text-sm">{duration}</span>
            {note != null ? (
              <span className="text-xs text-muted-foreground">{note}</span>
            ) : null}
          </span>
        </Row>
      </div>
    )
  },
)
TraceStep.displayName = "TraceStep"

export interface TraceLoopProps extends React.HTMLAttributes<HTMLDivElement> {
  /** What bounded it — `↻ 2 of 3 rounds — understood on round 2`. */
  label: React.ReactNode
  /** Hard right — `3 events · 42.8s`. */
  summary?: React.ReactNode
  /** The rail and wash it is drawn in. Defaults to the warning token. */
  tone?: "warning" | "info" | "muted"
  children?: React.ReactNode
}

// The rail and the wash belong to the box; the hue as **type** belongs to the
// label alone. Toning the container would paint every step name inside the loop
// in the bound's colour — which would say the rounds failed, when what is being
// marked is that they repeated.
const LOOP_TONE = {
  warning: { box: "border-l-warning bg-warning/5", label: "text-warning" },
  info: { box: "border-l-info bg-info/5", label: "text-info" },
  muted: { box: "border-l-muted-foreground bg-muted/40", label: "text-muted-foreground" },
}

/**
 * A bounded repetition, drawn by containment.
 *
 * The rounds are **inside** it, so a second round is one more row in the box
 * and a list nests for free. Drawing a loop as a marker beside its rows would
 * make a reader reconstruct which rows it held; drawing it as a bracket down the
 * side is the clock reading's job, where the axis is time and rows are bands.
 */
export const TraceLoop = React.forwardRef<HTMLDivElement, TraceLoopProps>(
  ({ label, summary, tone = "warning", className, children, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      aria-label={typeof label === "string" ? label : undefined}
      className={cn("border-l-2", LOOP_TONE[tone].box, className)}
      {...props}
    >
      <div className="flex h-[25px] items-center gap-2 border-t border-border/55 px-3">
        <span
          className={cn(
            "truncate font-mono text-xs font-semibold",
            LOOP_TONE[tone].label,
          )}
        >
          {label}
        </span>
        <span className="flex-1" />
        {summary != null ? (
          <span className="shrink-0 text-xs text-muted-foreground">{summary}</span>
        ) : null}
      </div>
      <div className="[&>*:first-child]:border-t-0">{children}</div>
    </div>
  ),
)
TraceLoop.displayName = "TraceLoop"

export interface TraceGateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** What it is — `approval — approved by ravi`. */
  label: React.ReactNode
  /** What it cost — `waited 2m 04s · nothing was spent while it waited`. */
  note?: React.ReactNode
  /** Defaults to the destructive token, which is what a stop is drawn in. */
  tone?: "destructive" | "warning" | "muted"
  /**
   * Which side of the line the cost falls on. `before` — nothing has been spent
   * yet; `after` — the work up to here is already paid for.
   */
  edge?: "before" | "after"
}

const GATE_TONE = {
  destructive: "border-destructive text-destructive",
  warning: "border-warning text-warning",
  muted: "border-muted-foreground text-muted-foreground",
}

/**
 * A gate — a rule across the list, never a row in it.
 *
 * It is dispatched by nobody, holds no slot and spends no participant, so it is
 * not a step: it is a **condition on the way into one**. Drawn as a full-width
 * rule with its chip hung off the side the cost falls on, *above this, nothing
 * has been spent* becomes something the drawing says rather than something a
 * legend has to claim.
 */
export const TraceGate = React.forwardRef<HTMLDivElement, TraceGateProps>(
  ({ label, note, tone = "destructive", edge = "before", className, ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      aria-label={typeof label === "string" ? label : undefined}
      className={cn("relative flex h-[38px] items-center", className)}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 border-t-2",
          GATE_TONE[tone],
          edge === "before" ? "top-[18px]" : "bottom-[18px]",
        )}
      />
      <span
        className={cn(
          "relative ml-8 flex items-center gap-2 rounded-control border bg-card px-2 py-0.5",
          GATE_TONE[tone],
        )}
      >
        <span className="font-mono text-xs font-semibold whitespace-nowrap">
          ◈ {label}
        </span>
        {note != null ? (
          <span className="min-w-0 truncate text-xs text-muted-foreground">
            {note}
          </span>
        ) : null}
      </span>
    </div>
  ),
)
TraceGate.displayName = "TraceGate"
