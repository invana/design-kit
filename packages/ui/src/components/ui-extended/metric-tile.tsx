import * as React from "react"

import { cn } from "../../lib/utils"

/**
 * The ink on the value, for a number whose *state* is the thing being read —
 * `running` while in flight, `ok` when it finished, `failed` when it did not.
 *
 * Omit it for an ordinary measurement. A grid where every tile is coloured
 * carries no signal, and a number that is merely large is not a warning.
 */
export type MetricTone = "running" | "success" | "warning" | "error" | "info"

const TONE: Record<MetricTone, string> = {
  running: "text-info",
  success: "text-success",
  warning: "text-warning",
  error: "text-destructive",
  info: "text-info",
}

export interface MetricTileProps extends React.HTMLAttributes<HTMLDivElement> {
  /** What is being measured — `accepted`, `served (plan.verified)`, `hit rate`. */
  label: React.ReactNode
  /** The number. `31 of 38`, `91%`, `9.6 s`, `$38.20`. */
  value: React.ReactNode
  /** Why the number is what it is — the denominator, the window, the caveat. */
  caption?: React.ReactNode
  /** Tints the value. See {@link MetricTone} — most tiles should not set it. */
  tone?: MetricTone
  /**
   * How much of a known ceiling has been spent, `0`–`1`, as a 4px bar under the
   * caption. Takes `tone`'s colour when one is set.
   *
   * Only for a value with a **real ceiling** — a budget, a token limit, a lane
   * pool, a task count. Never a rate or a duration: a sliver under `$0.04 of
   * $2.00` says the budget is safe, while the same bar under `12s` would invent
   * a deadline that does not exist.
   */
  meter?: number
  /** A sparkline, or anything else that sits under the value. */
  children?: React.ReactNode
}

export interface MetricGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Smallest a tile may get before the grid drops a column. */
  minTileWidth?: number
  /**
   * Gap between tiles, in px.
   *
   * It is a prop because a tile strip is usually one band of something larger,
   * and a grid that keeps its own tighter rhythm makes the whole surface read
   * as two grids. A dashboard passes its own gap; a standalone strip keeps the
   * default.
   */
  gap?: number
  children?: React.ReactNode
}

/**
 * One number, with enough around it to be read correctly.
 *
 * `caption` is not decoration. A tile that says `91%` and nothing else invites
 * the reader to supply their own denominator; `of thinkings` stops that. If
 * there is no honest caption, the number probably needs a different surface.
 */
export const MetricTile = React.forwardRef<HTMLDivElement, MetricTileProps>(
  ({ label, value, caption, tone, meter, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-px border border-border bg-card px-3 py-2.5",
        className,
      )}
      {...props}
    >
      {/* Caps, like every other label that titles a thing in this system — see
          `Eyebrow`. A tile's label is a heading over a number, and left in
          sentence case it reads as the first line of a sentence the number then
          interrupts. */}
      <span className="truncate text-meta font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span
        className={cn(
          // Mono, because a metric is a figure: proportional digits make
          // `1,880` and `2 / 5` in adjacent tiles sit at different widths, and
          // a strip of six stops reading as one row of numbers.
          "font-mono text-lg font-semibold leading-tight",
          tone ? TONE[tone] : undefined,
        )}
      >
        {value}
      </span>
      {caption != null ? (
        <span className="text-meta text-muted-foreground">{caption}</span>
      ) : null}
      {meter != null ? (
        // Not a <Progress>: that is a control-sized, rounded, animated bar for
        // work in flight. This is a 4px rule that says how much of a ceiling is
        // gone, and it must not read as a second value in the tile.
        <div
          className="mt-1 h-1 w-full bg-muted"
          role="img"
          aria-label={`${Math.round(Math.min(Math.max(meter, 0), 1) * 100)}% of the ceiling`}
        >
          <div
            className={cn("h-full", tone ? TONE[tone] : "text-primary", "bg-current")}
            style={{ width: `${Math.min(Math.max(meter, 0), 1) * 100}%` }}
          />
        </div>
      ) : null}
      {children}
    </div>
  ),
)
MetricTile.displayName = "MetricTile"

/**
 * Tiles at whatever width the panel gives them.
 *
 * `auto-fit` rather than a column count, because the same set of tiles appears
 * in a 420px panel and across a full-width board and should not need a
 * different call site for each.
 */
export const MetricGrid = React.forwardRef<HTMLDivElement, MetricGridProps>(
  ({ minTileWidth = 120, gap = 6, className, style, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("grid", className)}
      style={{
        gap,
        gridTemplateColumns: `repeat(auto-fit, minmax(${minTileWidth}px, 1fr))`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  ),
)
MetricGrid.displayName = "MetricGrid"
