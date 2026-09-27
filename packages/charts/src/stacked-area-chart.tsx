/**
 * Totals over time, split into the parts that make them up — records over time
 * by model, or by node type inside one model.
 *
 * The paths are stepped: a record count only moves where a write happened, so
 * the edge stays flat between writes and rises in one step at the write rather
 * than sloping across days that changed nothing. Each write is marked — a
 * dashed rule with its label at the top, `import` or `stitch commit` — because
 * the step is the event and the mark says which one.
 *
 * The parts stack bottom-up in `series` order, which is fixed: a model keeps its
 * band and its colour whatever its size, so a filter or a re-sort never
 * repaints the survivors. Bands are separated by a 2px surface line rather than
 * outlined. Up to four series are also named at the right edge, beside their
 * band; a name that would collide with its neighbour is left to the legend,
 * which is always there for two or more series. A series with nothing in it has
 * no band and no direct label, but keeps its legend entry.
 */
import * as React from "react"
import uPlot from "uplot"

import { ChartFrame, type ChartMark, type LegendEntry } from "./base/chart-frame"
import { fixedSplits, formatCount, niceScale } from "./base/floors"
import { resolveColor, withAlpha, type ChartTheme } from "./base/theme"
import { useLatest } from "./base/use-latest"

export interface AreaSeries {
  key: string
  label: string
  /** A token — `var(--color-data-1)`. */
  color: string
}

export interface StackedAreaDatum {
  /** The period, as the tooltip and a tick name it — `17 Sep`. */
  label: string
  /** The total per series `key` at the end of the period. A missing key is 0. */
  values: Record<string, number>
}

export interface StackedAreaChartProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  data: StackedAreaDatum[]
  series: AreaSeries[]
  /** The writes that moved the totals — each import, each stitch commit. */
  marks?: ChartMark[]
  /** Names the marks in the legend — `a write — an import or a stitch commit`. */
  markLegend?: string
  /** How a value is written on the axis and in the hover. Default: `1,284` / `12.9K`. */
  format?: (value: number) => string
  /** Fixes the scale. Defaults to a clean step above the tallest stack. */
  max?: number
  /** Values to draw a hairline at. Default: 0 and every clean step to the top. */
  gridlines?: number[]
  /** Which periods name themselves under the axis. Default: the first and the last. */
  ticks?: number[]
  /** The plot's height in px. */
  height?: number
  /** Name each band at the right edge. Default: on for four series or fewer. */
  directLabels?: boolean
  /** Shown in place of the plot when every period is zero. */
  empty?: React.ReactNode
}

const NONE: never[] = []
const FILL_ALPHA = 0.78

export const StackedAreaChart = React.forwardRef<HTMLDivElement, StackedAreaChartProps>(
  (
    {
      data,
      series,
      marks = NONE,
      markLegend,
      format = formatCount,
      max,
      gridlines = NONE,
      ticks,
      height = 200,
      directLabels,
      empty,
      ...props
    },
    ref,
  ) => {
    const fmt = useLatest(format)
    const labelled = directLabels ?? series.length <= 4

    // Running sums bottom-up: stack[k][i] is the top edge of band k on day i.
    const stack = React.useMemo(() => {
      const sums = data.map(() => 0)
      return series.map((s) =>
        data.map((d, i) => {
          sums[i] += d.values[s.key] ?? 0
          return sums[i]
        }),
      )
    }, [data, series])
    const totals = stack.length ? stack[stack.length - 1] : data.map(() => 0)
    const blank = totals.every((t) => t === 0)

    const build = React.useCallback(
      (theme: ChartTheme, host: HTMLElement) => {
        const colors = series.map((s) => resolveColor(host, s.color))
        const scale = niceScale(Math.max(0, ...totals))
        const ceiling = max ?? Math.max(scale.ceiling, ...gridlines)
        const stepped = uPlot.paths.stepped!({ align: 1 })
        const last = data.length - 1

        const uSeries: uPlot.Series[] = series.map((s, k) => ({
          stroke: theme.card,
          width: 2,
          paths: stepped,
          points: { show: false },
          // The bottom band fills to the baseline; every other band is a
          // `bands` entry filling down to the band beneath it.
          fill: k === 0 ? withAlpha(colors[0], FILL_ALPHA) : undefined,
        }))
        const bands: uPlot.Band[] = series.slice(1).map((_, j) => ({
          series: [j + 2, j + 1],
          fill: withAlpha(colors[j + 1], FILL_ALPHA),
        }))

        const measure = document.createElement("canvas").getContext("2d")
        let padRight = 4
        if (labelled && measure) {
          measure.font = `600 ${theme.font.xs}`
          padRight = Math.ceil(Math.max(0, ...series.map((s) => measure.measureText(s.label).width))) + 20
        }

        const draw = (u: uPlot) => {
          if (!labelled || last < 0) return
          const ctx = u.ctx
          const pr = uPlot.pxRatio
          const x = u.bbox.left + u.bbox.width + 6 * pr
          const line = theme.size.xs * pr + 2 * pr
          const placed = series
            .map((s, k) => {
              const top = stack[k][last]
              const bottom = k ? stack[k - 1][last] : 0
              return { s, k, empty: top === bottom, y: u.valToPos((top + bottom) / 2, "y", true) }
            })
            .filter((p) => !p.empty)
            .sort((a, b) => b.y - a.y)
          ctx.save()
          ctx.font = `600 ${theme.size.xs * pr}px ${theme.family}`
          ctx.textBaseline = "middle"
          ctx.textAlign = "left"
          let prev = Infinity
          for (const p of placed) {
            if (prev - p.y < line) continue
            ctx.fillStyle = colors[p.k]
            ctx.fillRect(x, Math.round(p.y - pr), 6 * pr, 2 * pr)
            ctx.fillStyle = theme.foreground
            ctx.fillText(p.s.label, x + 10 * pr, p.y)
            prev = p.y
          }
          ctx.restore()
        }

        return {
          series: uSeries,
          data: stack,
          bands,
          ceiling,
          splits: gridlines.length ? gridlines : max != null ? fixedSplits(max) : scale.splits,
          format: (v: number) => fmt.current(v),
          crosshair: true,
          cursorPoints: false,
          draw,
          padRight,
        }
      },
      [data, series, stack, totals, max, gridlines, labelled, fmt],
    )

    const legend: LegendEntry[] = [
      ...series,
      ...(marks.length && markLegend
        ? [{ key: "__mark", label: markLegend, color: "var(--color-muted-foreground)", kind: "dashed" as const }]
        : []),
    ]

    const summary = React.useMemo(() => {
      if (blank) return "Stacked area chart with nothing recorded in this period."
      const last = data.length - 1
      return [
        `Stacked area chart over ${data.length} periods, ${data[0].label} to ${data[last].label}.`,
        `${format(totals[0])} at the start, ${format(totals[last])} at the end.`,
        `At the end: ${series.map((s) => `${s.label} ${format(data[last].values[s.key] ?? 0)}`).join(", ")}.`,
        marks.length ? `Writes marked: ${marks.map((m) => `${m.label} (${data[m.index]?.label})`).join(", ")}.` : "",
      ]
        .filter(Boolean)
        .join(" ")
    }, [blank, data, series, totals, marks, format])

    return (
      <ChartFrame
        ref={ref}
        summary={summary}
        labels={data.map((d) => d.label)}
        height={height}
        ticks={ticks}
        marks={marks}
        legend={legend}
        empty={blank ? (empty ?? "Nothing recorded in this period") : undefined}
        build={build}
        tooltip={(i) => ({
          title: data[i].label,
          // Top-down, the order the bands are read in.
          rows: [...series].reverse().map((s) => ({
            key: s.key,
            label: s.label,
            color: s.color,
            value: format(data[i].values[s.key] ?? 0),
          })),
          note: `${format(totals[i])} in all`,
        })}
        table={{
          columns: [
            { accessorKey: "period", header: "Period" },
            ...series.map((s) => ({ accessorKey: s.key, header: s.label })),
            { accessorKey: "__total", header: "Total" },
          ],
          rows: data.map((d, i) => ({
            period: d.label,
            ...Object.fromEntries(series.map((s) => [s.key, format(d.values[s.key] ?? 0)])),
            __total: format(totals[i]),
          })),
        }}
        {...props}
      />
    )
  },
)
StackedAreaChart.displayName = "StackedAreaChart"
