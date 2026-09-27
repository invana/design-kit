/**
 * Counts over days, split into the parts that make them up — `served` and
 * `failed` in each day's runs.
 *
 * Vertical because the x-axis is time. The parts stack bottom-up in `series`
 * order with a 2px surface gap between them, and only the top of a column is
 * rounded, so a stack reads as one count cut into pieces rather than as bars
 * balanced on each other. A day with nothing draws nothing: a zero is a gap,
 * not a sliver.
 *
 * Every column answers a hover with its day and each part's count. Two or more
 * series always carry a legend, because identity is never colour alone; the
 * axis labels are sparse (`ticks`), because thirty dates under thirty columns
 * is texture.
 */
import * as React from "react"

import { cn } from "../../lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Legend, LegendItem } from "./legend"

export interface StackSeries {
  key: string
  label: string
  /** A token — `var(--color-success)`. Status tokens only for status series. */
  color: string
}

export interface StackedColumnDatum {
  /** The period, as the tooltip and a tick name it — `17 Sep`. */
  label: string
  /** The count per series `key`. A missing key is 0. */
  values: Record<string, number>
}

export interface StackedBarChartVProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  data: StackedColumnDatum[]
  series: StackSeries[]
  /** Fixes the scale. Defaults to the tallest column. */
  max?: number
  /** Values to draw a hairline at — `[20, 40, 60]`. */
  gridlines?: number[]
  height?: number
  /** Which columns name their period under the axis. Default: the first and the last. */
  ticks?: number[]
}

export const StackedBarChartV = React.forwardRef<HTMLDivElement, StackedBarChartVProps>(
  ({ data, series, max, gridlines = [], height = 132, ticks, className, ...props }, ref) => {
    const total = (d: StackedColumnDatum) =>
      series.reduce((sum, s) => sum + (d.values[s.key] ?? 0), 0)
    const ceiling = max ?? (Math.max(0, ...data.map(total)) || 1)
    const named = new Set(ticks ?? [0, data.length - 1])

    return (
      <TooltipProvider delayDuration={0}>
        <div ref={ref} className={cn("flex flex-col gap-1", className)} {...props}>
          <div className="relative mt-2" style={{ height }}>
            {gridlines.map((g) => (
              <div
                key={g}
                aria-hidden
                className="absolute inset-x-0 flex translate-y-1/2 items-center"
                style={{ bottom: `${(g / ceiling) * 100}%` }}
              >
                <span className="h-px flex-1 bg-border" />
                <span className="pl-1 text-xs tabular-nums text-muted-foreground">{g}</span>
              </div>
            ))}

            <div className="absolute inset-0 flex items-end gap-0.5 pr-6">
              {data.map((d, i) => {
                const parts = series.filter((s) => (d.values[s.key] ?? 0) > 0)
                return (
                  <Tooltip key={i}>
                    <TooltipTrigger asChild>
                      {/* The hit target is the whole day's height, not the bar. */}
                      <div className="flex h-full min-w-0 flex-1 flex-col-reverse items-stretch gap-0.5 hover:bg-muted/50">
                        {parts.map((s, j) => (
                          <span
                            key={s.key}
                            className={cn("w-full", j === parts.length - 1 && "rounded-t-[4px]")}
                            style={{
                              height: `${((d.values[s.key] ?? 0) / ceiling) * 100}%`,
                              background: s.color,
                            }}
                          />
                        ))}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="flex flex-col gap-0.5">
                        <span>{d.label}</span>
                        {series.map((s) => (
                          <span key={s.key} className="tabular-nums">
                            {s.label} · {d.values[s.key] ?? 0}
                          </span>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          </div>

          <div className="flex gap-0.5 pr-6">
            {data.map((d, i) => (
              <span
                key={i}
                className="min-w-0 flex-1 overflow-visible whitespace-nowrap text-xs text-muted-foreground"
              >
                {named.has(i) ? d.label : null}
              </span>
            ))}
          </div>

          {series.length > 1 ? (
            <Legend>
              {series.map((s) => (
                <LegendItem key={s.key} color={s.color} label={s.label} />
              ))}
            </Legend>
          ) : null}
        </div>
      </TooltipProvider>
    )
  },
)
StackedBarChartV.displayName = "StackedBarChartV"
