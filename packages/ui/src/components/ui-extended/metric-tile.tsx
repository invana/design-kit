import * as React from "react"

import { cn } from "../../lib/utils"

/**
 * The ink on the value, for a number whose *state* is the thing being read —
 * `running` while in flight, `ok` when it finished, `failed` when it did not.
 *
 * Omit it for an ordinary measurement. A grid where every tile is coloured
 * carries no signal, and a number that is merely large is not a warning.
 */
export type KnownMetricTone =
  | "running" | "success" | "warning" | "error" | "info" | "muted"

/**
 * The values the kit draws specially — **suggestions, not a limit.** Anything
 * else renders with the neutral token and its own name.
 */
export type MetricTone = KnownMetricTone | (string & {})

const TONE: Partial<Record<MetricTone, string>> = {
  running: "text-info",
  success: "text-success",
  warning: "text-warning",
  error: "text-destructive",
  info: "text-info",
  muted: "text-muted-foreground",
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
   * Tints the caption instead — for a caption that is a change, `▲ 8 d vs
   * normal`, where the direction is the signal and the value is a plain figure.
   */
  captionTone?: MetricTone
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
  /**
   * The figure against a target, as a bar under it: `fill` is how far the
   * figure has come and `mark` where the target sits, both `0`–`1` of the
   * scale. `labels` writes the scale's start, the target and its end under it.
   *
   * Unlike `meter`, the target is a line the figure is read against, not a
   * ceiling it spends — the fill may pass it.
   */
  gauge?: { fill: number; mark: number; labels?: [React.ReactNode, React.ReactNode, React.ReactNode] }
  /**
   * Set on the warning ground: the one tile in a band that needs a second look
   * — a figure resting on too few records. Say why in a line under the band.
   */
  flagged?: boolean
  /** Beside the figure, at the right, bottom-aligned — a sparkline of its recent run. */
  aside?: React.ReactNode
  /**
   * `tile` is one of several, boxed, in a strip. `hero` is the one figure an
   * answer turns on — the adjusted odds ratio, net revenue retention — set
   * large on the surface it sits in: no box, the label in sentence case over
   * it, the caption in mono under it, so it reads as a result, not a gauge.
   * `figure` is one of a band of figures inside an answer — boxed like a tile
   * but set like a small hero: the label in sentence case, the value in a
   * larger sans, the caption in mono.
   */
  variant?: "tile" | "hero" | "figure"
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
   * as two grids. A board passes its own gap; a standalone strip keeps the
   * default.
   */
  gap?: number
  /**
   * One strip, the tiles divided by rules instead of spaced apart — for a
   * band of figures that belong to one answer and read left to right. `gap`
   * is ignored.
   */
  joined?: boolean
  /**
   * With `joined`: no box around the strip, and nothing wasted on its outside
   * — only the rules between tiles are drawn, and the outer tiles sit flush
   * with the text around the grid, as a seamless table's outer columns do.
   * For a strip inside a card or an answer, whose edge already frames it.
   */
  seamless?: boolean
  /**
   * A fixed number of columns instead of fitting to the width — for a band
   * whose shape is part of what it says: three across, two by two.
   */
  columns?: number
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
  ({ label, value, caption, tone, captionTone, meter, gauge, flagged, aside, variant = "tile", className, children, ...props }, ref) => {
    const hero = variant === "hero"
    const figure = variant === "figure"
    const clamp = (n: number) => Math.min(Math.max(n, 0), 1) * 100
    const tile = (
    <div
      ref={aside == null ? ref : undefined}
      data-variant={aside == null ? variant : undefined}
      className={cn(
        "flex min-w-0 flex-col gap-px",
        !hero && "border border-border bg-card",
        // Mixed onto the card rather than translucent, so the tile reads the
        // same on whatever ground the grid sits on.
        flagged && "bg-[color-mix(in_srgb,var(--color-warning)_15%,var(--color-card))]",
        variant === "tile" && "px-3 py-2.5",
        figure && "px-2 py-1.5",
        aside == null && className,
      )}
      {...(aside == null ? props : {})}
    >
      {/* Caps, like every other label that titles a thing in this system — see
          `Eyebrow`. A tile's label is a heading over a number, and left in
          sentence case it reads as the first line of a sentence the number then
          interrupts. */}
      <span
        className={cn(
          "truncate text-muted-foreground",
          figure || hero ? "text-xs" : "text-sm",
          variant === "tile" && "font-semibold uppercase tracking-wide",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          // Mono, because a metric is a figure: proportional digits make
          // `1,880` and `2 / 5` in adjacent tiles sit at different widths, and
          // a strip of six stops reading as one row of numbers. A hero stands
          // alone, so it is set in the text face at display size, with
          // tabular digits.
          hero
            ? "text-3xl font-semibold leading-tight tracking-tight tabular-nums"
            : figure
              ? "text-xl font-semibold leading-tight tracking-tight tabular-nums"
              : "font-mono text-lg font-semibold leading-tight",
          tone ? (TONE[tone] ?? "text-foreground") : undefined,
        )}
      >
        {value}
      </span>
      {caption != null ? (
        <span
          className={cn(
            figure || hero ? "text-xs" : "text-sm",
            (hero || figure) && "font-mono",
            captionTone ? (TONE[captionTone] ?? "text-muted-foreground") : "text-muted-foreground",
          )}
        >
          {caption}
        </span>
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
            className={cn("h-full", tone ? (TONE[tone] ?? "text-foreground") : "text-primary", "bg-current")}
            style={{ width: `${Math.min(Math.max(meter, 0), 1) * 100}%` }}
          />
        </div>
      ) : null}
      {children}
    </div>
    )
    const withGauge =
      gauge == null ? (
        tile
      ) : (
        <div className="flex flex-col gap-1">
          {tile}
          <div
            className="relative mt-1.5 h-1.5 rounded-[1px] bg-muted"
            role="img"
            aria-label={`${Math.round(clamp(gauge.fill))}% of the scale, target at ${Math.round(clamp(gauge.mark))}%`}
          >
            <div className="h-full rounded-[1px] bg-primary" style={{ width: `${clamp(gauge.fill)}%` }} />
            <span
              aria-hidden
              className="absolute -top-[3px] h-3 w-0.5 -translate-x-1/2 bg-foreground"
              style={{ left: `${clamp(gauge.mark)}%` }}
            />
          </div>
          {gauge.labels ? (
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              {gauge.labels.map((l, i) => (
                <span key={i}>{l}</span>
              ))}
            </div>
          ) : null}
        </div>
      )
    if (aside == null) return withGauge
    return (
      <div ref={ref} data-variant={variant} className={cn("flex items-end gap-2.5", className)} {...props}>
        {withGauge}
        <div className="ms-auto shrink-0">{aside}</div>
      </div>
    )
  },
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
  ({ minTileWidth = 120, gap = 6, joined, seamless, columns, className, style, children, ...props }, ref) => {
    const gridStyle: React.CSSProperties = {
      gap: joined ? undefined : gap,
      gridTemplateColumns: columns
        ? `repeat(${columns}, minmax(0, 1fr))`
        : `repeat(auto-fit, minmax(${minTileWidth}px, 1fr))`,
      ...style,
    }
    // The rules are each tile's 1px ring filling the 1px gap, so they follow
    // the tiles when the grid wraps — and a short last row leaves its empty
    // slots in the card's colour, where a border-coloured grid background
    // would show through as a grey block.
    const rules = "gap-px [&>*]:border-0 [&>*]:shadow-[0_0_0_1px_var(--color-border)]"
    if (!(joined && seamless)) {
      return (
        <div
          ref={ref}
          className={cn("grid", joined && cn(rules, "border border-border"), className)}
          style={gridStyle}
          {...props}
        >
          {children}
        </div>
      )
    }
    // Flush outer tiles without knowing which tiles are outer — the grid is
    // auto-fit and wraps with its width. The grid reaches out by a tile's
    // padding on every side and the wrapper clips that band off, so only the
    // padding between tiles is left. `overflow` rather than `clip-path`: its
    // edge snaps to the pixel, where a clip-path's anti-aliased edge lets the
    // rule colour show through as a hairline.
    return (
      <div ref={ref} data-seamless className={cn("overflow-hidden", className)} {...props}>
        <div
          className={cn(
            "grid",
            rules,
            "[--edge-x:0.75rem] [--edge-y:0.625rem] has-[>[data-variant=figure]]:[--edge-x:0.5rem] has-[>[data-variant=figure]]:[--edge-y:0.375rem] -mx-(--edge-x) -my-(--edge-y)",
          )}
          style={gridStyle}
        >
          {children}
        </div>
      </div>
    )
  },
)
MetricGrid.displayName = "MetricGrid"
