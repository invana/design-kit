import * as React from "react"

import { cn } from "../../lib/utils"

export interface MetricTileProps extends React.HTMLAttributes<HTMLDivElement> {
  /** What is being measured — `accepted`, `served (plan.verified)`, `hit rate`. */
  label: React.ReactNode
  /** The number. `31 of 38`, `91%`, `9.6 s`, `$38.20`. */
  value: React.ReactNode
  /** Why the number is what it is — the denominator, the window, the caveat. */
  caption?: React.ReactNode
  /** A bar, a sparkline, anything that sits under the value. */
  children?: React.ReactNode
}

export interface MetricGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Smallest a tile may get before the grid drops a column. */
  minTileWidth?: number
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
  ({ label, value, caption, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-0.5 border border-border bg-card p-2", className)}
      {...props}
    >
      <span className="truncate text-meta text-muted-foreground">{label}</span>
      <span className="text-base font-medium leading-tight">{value}</span>
      {caption != null ? (
        <span className="text-meta text-muted-foreground">{caption}</span>
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
  ({ minTileWidth = 120, className, style, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("grid gap-1.5", className)}
      style={{
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
