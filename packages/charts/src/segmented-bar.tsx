/**
 * One row's total, split into categories along a single 100% bar — a model's
 * queries by caller: agent, plan, Explorer, API.
 *
 * DOM, not canvas: it repeats down a table, one per row.
 *
 * The categories run left to right in `series` order, and the order is the same
 * in every row, so a caller is always in the same place and the same colour
 * down the column. Segments are separated by a 2px gap in the surface colour,
 * never outlined. A category with nothing in it takes no space. A row with
 * nothing at all draws an empty track rather than a bar of one category.
 *
 * The legend is not per row. Pass the same `series` to one
 * {@link SegmentedBarLegend} in the table's header, so the colours are named
 * once for the whole column. Each segment names itself on hover, so identity
 * is never colour alone.
 */
import * as React from "react"
import {
  Legend,
  LegendItem,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  cn,
  type LegendProps,
} from "@invana/ui"

export interface SegmentSeries {
  key: string
  label: string
  /** A token — `var(--color-data-7)`. */
  color: string
}

export interface SegmentedBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** The count per series `key`. A missing key is 0. */
  values: Record<string, number>
  /** The categories, in the fixed order every row shares. */
  series: SegmentSeries[]
  /** How a count is written in the hover. Default: `1,284`. */
  format?: (value: number) => string
}

const whole = new Intl.NumberFormat()

export const SegmentedBar = React.forwardRef<HTMLDivElement, SegmentedBarProps>(
  ({ values, series, format = (v) => whole.format(v), className, ...props }, ref) => {
    const total = series.reduce((sum, s) => sum + Math.max(0, values[s.key] ?? 0), 0)
    const parts = series
      .map((s) => ({ ...s, value: Math.max(0, values[s.key] ?? 0) }))
      .filter((p) => p.value > 0)
    const pct = (v: number) => `${Math.round((v / total) * 100)}%`
    const summary = total
      ? parts.map((p) => `${p.label} ${pct(p.value)}`).join(", ")
      : "nothing counted"

    return (
      <TooltipProvider delayDuration={0}>
        <div
          ref={ref}
          role="img"
          aria-label={summary}
          // The gaps show the surface behind the bar; only an empty row draws a track.
          className={cn(
            "flex h-2 w-full min-w-16 gap-[2px] overflow-hidden rounded-full",
            total === 0 && "bg-muted",
            className,
          )}
          {...props}
        >
          {parts.map((p) => (
            <Tooltip key={p.key}>
              <TooltipTrigger asChild>
                <span
                  className="h-full min-w-[2px]"
                  style={{ flexGrow: p.value, flexBasis: 0, background: p.color }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <span className="tabular-nums">
                  {p.label} · {format(p.value)} · {pct(p.value)}
                </span>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    )
  },
)
SegmentedBar.displayName = "SegmentedBar"

export interface SegmentedBarLegendProps extends Omit<LegendProps, "children"> {
  /** The same `series` every row's {@link SegmentedBar} is given. */
  series: SegmentSeries[]
}

/** The one legend for a column of {@link SegmentedBar}s. */
export const SegmentedBarLegend = React.forwardRef<HTMLDivElement, SegmentedBarLegendProps>(
  ({ series, ...props }, ref) => (
    <Legend ref={ref} {...props}>
      {series.map((s) => (
        <LegendItem key={s.key} color={s.color} label={s.label} />
      ))}
    </Legend>
  ),
)
SegmentedBarLegend.displayName = "SegmentedBarLegend"
