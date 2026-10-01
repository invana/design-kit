/**
 * Counts over days, split into the parts that make them up — `served` and
 * `failed` in each day's runs, or a model's queries by caller.
 *
 * Vertical because the x-axis is time. The parts stack bottom-up in `series`
 * order with a 2px surface gap between them, and only the top of a column is
 * rounded, so a stack reads as one count cut into pieces rather than as bars
 * balanced on each other. A day with nothing draws nothing: a zero is a gap,
 * not a sliver.
 *
 * The floors: the count axis never tops out below five, so one run on a quiet
 * day is a short column, not a full-height one; a column is never wider than
 * 24px, however few days there are; and a window where every day is zero shows
 * that it is empty rather than an axis of zeros.
 *
 * Every column answers a hover with its day and each part's count; the hover
 * target is the day's whole slot, not the painted bar. Two or more series
 * always carry a legend, inside the chart, because identity is never colour
 * alone; the axis labels are sparse (`ticks`), because thirty dates under
 * thirty columns is texture.
 */
import * as React from "react"
import uPlot from "uplot"

import { ChartFrame } from "./base/chart-frame"
import { topRoundedRect } from "./base/draw"
import {
  BAR_RADIUS,
  MAX_BAR_WIDTH,
  SEGMENT_GAP,
  countScale,
  fixedSplits,
  formatCount,
} from "./base/floors"
import { resolveColor, type ChartTheme } from "./base/theme"

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
  /** Fixes the scale. Defaults to a clean step above the tallest column, and never below 5. */
  max?: number
  /** Values to draw a hairline at — `[20, 40, 60]`. */
  gridlines?: number[]
  /** The plot's height in px. */
  height?: number
  /** Which columns name their period under the axis. Default: the first and the last. */
  ticks?: number[]
  /** Shown in place of the plot when every column is zero. */
  empty?: React.ReactNode
}

const NONE: never[] = []

export const StackedBarChartV = React.forwardRef<HTMLDivElement, StackedBarChartVProps>(
  ({ data, series, max, gridlines = NONE, height = 132, ticks, empty, ...props }, ref) => {
    const totals = React.useMemo(
      () => data.map((d) => series.reduce((sum, s) => sum + (d.values[s.key] ?? 0), 0)),
      [data, series],
    )
    const blank = totals.every((t) => t === 0)

    const build = React.useCallback(
      (_theme: ChartTheme, host: HTMLElement) => {
        const colors = series.map((s) => resolveColor(host, s.color))
        const scale = countScale(Math.max(0, ...totals))
        const ceiling = max ?? Math.max(scale.ceiling, ...gridlines)
        const draw = (u: uPlot) => {
          const ctx = u.ctx
          const pr = uPlot.pxRatio
          const slot = u.bbox.width / Math.max(data.length, 1)
          const width = Math.max(pr, Math.min(MAX_BAR_WIDTH * pr, slot * 0.72))
          const gap = SEGMENT_GAP * pr
          const baseline = u.valToPos(0, "y", true)
          ctx.save()
          data.forEach((d, i) => {
            const x = Math.round(u.valToPos(i, "x", true) - width / 2)
            const parts = series
              .map((s, k) => ({ value: d.values[s.key] ?? 0, color: colors[k] }))
              .filter((p) => p.value > 0)
            let sum = 0
            let bottom = baseline
            parts.forEach((p, j) => {
              sum += p.value
              const top = u.valToPos(Math.min(sum, ceiling), "y", true)
              const last = j === parts.length - 1
              // The gap sits on top of every segment but the last; a segment
              // too small to survive it keeps one device pixel.
              const y = last ? top : Math.min(top + gap, bottom - pr)
              const h = Math.max(pr, bottom - y)
              ctx.fillStyle = p.color
              if (last) topRoundedRect(ctx, x, y, width, h, BAR_RADIUS * pr)
              else ctx.fillRect(x, y, width, h)
              bottom = top
            })
          })
          ctx.restore()
        }
        return {
          // One invisible series carries the totals, so the cursor has a value
          // to snap to on every day; the columns themselves are drawn above.
          series: [{ stroke: "transparent", paths: () => null, points: { show: false } }],
          data: [totals],
          ceiling,
          splits: gridlines.length ? gridlines : max != null ? fixedSplits(max) : scale.splits,
          format: formatCount,
          crosshair: false,
          draw,
        }
      },
      [data, series, totals, max, gridlines],
    )

    const summary = React.useMemo(() => {
      if (blank) return "Stacked column chart with nothing counted in this period."
      const sums = series.map((s) => data.reduce((sum, d) => sum + (d.values[s.key] ?? 0), 0))
      const busiest = totals.indexOf(Math.max(...totals))
      return [
        `Stacked column chart over ${data.length} periods, ${data[0].label} to ${data[data.length - 1].label}.`,
        `Totals: ${series.map((s, k) => `${s.label} ${formatCount(sums[k])}`).join(", ")}.`,
        `Busiest: ${data[busiest].label} with ${formatCount(totals[busiest])}.`,
      ].join(" ")
    }, [blank, data, series, totals])

    return (
      <ChartFrame
        ref={ref}
        summary={summary}
        labels={data.map((d) => d.label)}
        height={height}
        ticks={ticks}
        legend={series}
        empty={blank ? (empty ?? "Nothing counted in this period") : undefined}
        build={build}
        tooltip={(i) => ({
          title: data[i].label,
          rows: series.map((s) => ({
            key: s.key,
            label: s.label,
            color: s.color,
            value: formatCount(data[i].values[s.key] ?? 0),
          })),
        })}
        table={{
          columns: [
            { accessorKey: "period", header: "Period" },
            ...series.map((s) => ({ accessorKey: s.key, header: s.label })),
            { accessorKey: "__total", header: "Total" },
          ],
          rows: data.map((d, i) => ({
            period: d.label,
            ...Object.fromEntries(series.map((s) => [s.key, formatCount(d.values[s.key] ?? 0)])),
            __total: formatCount(totals[i]),
          })),
        }}
        {...props}
      />
    )
  },
)
StackedBarChartV.displayName = "StackedBarChartV"
