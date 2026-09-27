/**
 * One measure over time, with the moments that might explain it marked on the
 * axis — a plan's work p50 a day, with each version's publish.
 *
 * One series and one axis, so no legend: the panel's title names what is
 * plotted. A day with no value breaks the line rather than drawing it to zero,
 * because *nothing ran* is not *it took no time*; a measured day between two
 * gaps draws as a point, so it is not lost. A mark is a dashed rule with its
 * label at the top — an event, not a value. A reference is a dashed rule with
 * its label at the right — a line to compare against, such as the Graph's p95.
 * Hover (or the arrow keys) reads the nearest day.
 */
import * as React from "react"
import type uPlot from "uplot"

import { ChartFrame, type ChartMark, type ChartReference } from "./base/chart-frame"
import { fixedSplits, niceScale } from "./base/floors"
import { resolveColor, type ChartTheme } from "./base/theme"
import { useLatest } from "./base/use-latest"

export type LineChartMark = ChartMark
export type LineChartReference = ChartReference

export interface LineChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** One per period; `null` where nothing was measured. */
  values: (number | null)[]
  /** One per period — what the hover and a tick name it. */
  labels: string[]
  /** How a value is written on the axis and in the hover — `6.0s`. */
  format?: (value: number) => string
  /** Fixes the scale. Defaults to a clean step above the largest value. */
  max?: number
  /** Values to draw a hairline at. Default: 0 and every clean step to the top. */
  gridlines?: number[]
  marks?: LineChartMark[]
  /** A value to compare against, drawn as a dashed rule labelled at the right. */
  reference?: LineChartReference
  /** Which periods name themselves under the axis. Default: the first and the last. */
  ticks?: number[]
  /** The plot's height in px. */
  height?: number
  /** A CSS colour or token — `var(--color-primary)`. */
  color?: string
  /** Shown in place of the plot when no period has a value. */
  empty?: React.ReactNode
}

const NONE: never[] = []

export const LineChart = React.forwardRef<HTMLDivElement, LineChartProps>(
  (
    {
      values,
      labels,
      format = String,
      max,
      gridlines = NONE,
      marks = NONE,
      reference,
      ticks,
      height = 132,
      color = "var(--color-primary)",
      empty,
      ...props
    },
    ref,
  ) => {
    const fmt = useLatest(format)
    const referenceValue = reference?.value

    const build = React.useCallback(
      (theme: ChartTheme, host: HTMLElement) => {
        const stroke = resolveColor(host, color)
        const measured = values.filter((v): v is number => v != null)
        // Headroom above the highest value, so a single point or a flat line
        // is not pinned to the top of the plot.
        const scale = niceScale(Math.max(0, ...measured, referenceValue ?? 0) * 1.05)
        const ceiling = max ?? Math.max(scale.ceiling, ...gridlines)
        const last = values.reduce<number>((at, v, i) => (v != null ? i : at), -1)
        // Points: the latest value, and any value with no neighbour to join.
        const points = values
          .map((v, i) => (v != null && (i === last || (values[i - 1] == null && values[i + 1] == null)) ? i : -1))
          .filter((i) => i >= 0)
        const series: uPlot.Series = {
          stroke,
          width: 2,
          spanGaps: false,
          points: {
            show: true,
            size: 10,
            width: 2,
            stroke: theme.card,
            fill: stroke,
            filter: () => points,
          },
        }
        return {
          series: [series],
          data: [values],
          ceiling,
          splits: gridlines.length ? gridlines : max != null ? fixedSplits(max) : scale.splits,
          format: (v: number) => fmt.current(v),
          crosshair: true,
        }
      },
      [values, color, max, gridlines, referenceValue, fmt],
    )

    const measured = values.filter((v): v is number => v != null)
    const blank = measured.length === 0
    const summary = React.useMemo(() => {
      if (blank) return "Line chart with no measured periods."
      const f = format
      let top = 0
      values.forEach((v, i) => {
        if (v != null && v > (values[top] ?? -Infinity)) top = i
      })
      const lastIdx = values.reduce<number>((at, v, i) => (v != null ? i : at), -1)
      const parts = [
        `Line chart over ${values.length} periods, ${labels[0]} to ${labels[labels.length - 1]}.`,
        `Latest ${f(values[lastIdx] as number)} on ${labels[lastIdx]}; highest ${f(values[top] as number)} on ${labels[top]}.`,
      ]
      const gaps = values.length - measured.length
      if (gaps) parts.push(`${gaps} periods with nothing measured.`)
      if (marks.length) parts.push(`Marked: ${marks.map((m) => `${m.label} (${labels[m.index]})`).join(", ")}.`)
      if (reference) parts.push(`Reference ${reference.label} at ${f(reference.value)}.`)
      return parts.join(" ")
    }, [blank, values, labels, marks, reference, measured.length, format])

    return (
      <ChartFrame
        ref={ref}
        summary={summary}
        labels={labels}
        height={height}
        ticks={ticks}
        marks={marks}
        reference={reference}
        empty={blank ? (empty ?? "Nothing measured in this period") : undefined}
        build={build}
        tooltip={(i) => ({
          title: labels[i],
          rows:
            values[i] != null
              ? [{ key: "value", label: "", color, value: format(values[i] as number) }]
              : [],
          note: values[i] == null ? "nothing ran" : undefined,
        })}
        table={{
          columns: [
            { accessorKey: "period", header: "Period" },
            { accessorKey: "value", header: "Value" },
          ],
          rows: values.map((v, i) => ({
            period: labels[i],
            value: v != null ? format(v) : "—",
          })),
        }}
        {...props}
      />
    )
  },
)
LineChart.displayName = "LineChart"
