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
 *
 * A band shades the range the line is judged against — a normal range, or a
 * forecast's interval — under the line. A highlight rings a period that stands
 * out, in its own colour, without a label: whatever sits beside the chart says
 * why. After `forecastFrom` the line is dashed, with an unlabelled rule at the
 * boundary unless `forecastLabel` names it. A measure that never nears zero can
 * drop the zero baseline (`zero={false}`), so its movement is not flattened.
 */
import * as React from "react"
import uPlot from "uplot"

import { ChartFrame, type ChartMark, type ChartReference } from "./base/chart-frame"
import { fixedSplits, niceRange, niceScale } from "./base/floors"
import { resolveColor, withAlpha, type ChartTheme } from "./base/theme"
import { useLatest } from "./base/use-latest"

export type LineChartMark = ChartMark
export type LineChartReference = ChartReference

export interface LineChartBand {
  /** The bottom edge: one value across the plot, or one per period (`null` leaves a gap). */
  lower: number | (number | null)[]
  upper: number | (number | null)[]
  /** Named below the band's right end — `normal range`. */
  label?: string
  /** A CSS colour or token. Default: the line's. */
  color?: string
}

export interface LineChartHighlight {
  /** The period ringed. */
  index: number
  /** A CSS colour or token — `var(--color-warning)`. Default: the line's. */
  color?: string
}

/** A line read against the main one — last year beside this — drawn behind it. */
export interface LineChartSeries {
  /** Named at the line's right end, in the hover and in the table. */
  name: string
  /** One per period, as `values`; `null` where nothing was measured. */
  values: (number | null)[]
  /** A CSS colour or token. Default: the muted foreground. */
  color?: string
}

export interface LineChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** One per period; `null` where nothing was measured. */
  values: (number | null)[]
  /**
   * The main line's name. Needed once there is a `compare`: every line is then
   * named at its right end, where it finishes, instead of in a legend.
   */
  name?: string
  /** Lines to read the main one against, drawn behind it without its marks or forecast. */
  compare?: LineChartSeries[]
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
  /** A range shaded under the line. */
  band?: LineChartBand
  /** Periods ringed because they stand out. */
  highlights?: LineChartHighlight[]
  /** The last actual period — the one the forecast runs from. The line is dashed after it. */
  forecastFrom?: number
  /** Names the rule at `forecastFrom` — `today`. */
  forecastLabel?: string
  /** Start the axis at 0. Default: true. */
  zero?: boolean
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
      name,
      compare = NONE,
      labels,
      format = String,
      max,
      gridlines = NONE,
      marks = NONE,
      reference,
      band,
      highlights = NONE,
      forecastFrom,
      forecastLabel,
      zero = true,
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
    const n = values.length
    // The band as one value per period, whichever form it arrived in.
    const [lower, upper] = React.useMemo(() => {
      const spread = (edge: number | (number | null)[] | undefined) =>
        edge == null ? null : Array.from({ length: n }, (_, i) => (typeof edge === "number" ? edge : (edge[i] ?? null)))
      return [spread(band?.lower), spread(band?.upper)]
    }, [band?.lower, band?.upper, n])
    const forecast = forecastFrom != null && forecastFrom >= 0 && forecastFrom < n ? forecastFrom : null
    // Inline arrays; keyed by value so a parent's re-render keeps the canvas.
    const highlightsKey = JSON.stringify(highlights)
    const compareKey = JSON.stringify(compare)
    const named = compare.length > 0

    const build = React.useCallback(
      (theme: ChartTheme, host: HTMLElement) => {
        const stroke = resolveColor(host, color)
        const rings: { index: number; color: string }[] = (JSON.parse(highlightsKey) as LineChartHighlight[])
          .filter((h) => h.index >= 0 && h.index < n)
          .map((h) => ({ index: h.index, color: h.color ? resolveColor(host, h.color) : stroke }))
        const ringed = new Set(rings.map((r) => r.index))
        const others = (JSON.parse(compareKey) as LineChartSeries[]).map((c) => ({
          ...c,
          stroke: resolveColor(host, c.color ?? "var(--color-muted-foreground)"),
        }))
        const measured = [...values, ...others.flatMap((c) => c.values)].filter((v): v is number => v != null)
        const edges = [...(lower ?? []), ...(upper ?? [])].filter((v): v is number => v != null)
        const top = Math.max(...measured, ...edges, referenceValue ?? -Infinity)
        const bottom = Math.min(...measured, ...edges, referenceValue ?? Infinity)
        // Headroom above the highest value, so a single point or a flat line
        // is not pinned to the top of the plot.
        const scale = zero
          ? { floor: 0, ...niceScale(Math.max(0, top) * 1.05) }
          : niceRange(bottom, top + (top - bottom) * 0.05)
        const ceiling = max ?? Math.max(scale.ceiling, ...gridlines)
        const last = forecast ?? values.reduce<number>((at, v, i) => (v != null ? i : at), -1)
        // Points: the latest actual value, and any value with no neighbour to
        // join — unless a ring already marks the period.
        const points = values
          .map((v, i) => (v != null && (i === last || (values[i - 1] == null && values[i + 1] == null)) ? i : -1))
          .filter((i) => i >= 0 && !ringed.has(i))
        const line = (dash?: number[]): uPlot.Series => ({
          stroke,
          width: 2,
          dash,
          spanGaps: false,
          points: {
            show: !dash,
            size: 10,
            width: 2,
            stroke: theme.card,
            fill: stroke,
            filter: () => points,
          },
        })
        // A forecast is a second, dashed series that shares the boundary
        // period, so the two lines join.
        const actual = forecast == null ? values : values.map((v, i) => (i <= forecast ? v : null))
        const ahead = forecast == null ? null : values.map((v, i) => (i >= forecast ? v : null))
        const bandFill = withAlpha(band?.color ? resolveColor(host, band.color) : stroke, 0.1)
        const bandLabel = band?.label

        const drawUnder = (u: uPlot) => {
          if (!lower || !upper) return
          const ctx = u.ctx
          const pr = uPlot.pxRatio
          const { left, width: w, top: t, height: h } = u.bbox
          ctx.save()
          ctx.beginPath()
          ctx.rect(left, t, w, h)
          ctx.clip()
          ctx.fillStyle = bandFill
          const y = (v: number) => u.valToPos(v, "y", true)
          if (typeof band?.lower === "number" && typeof band?.upper === "number") {
            // A constant range runs the width of the plot.
            ctx.fillRect(left, y(band.upper), w, y(band.lower) - y(band.upper))
          } else {
            // One polygon per run of periods with both edges.
            let run: number[] = []
            const flush = () => {
              if (run.length) {
                const x = (i: number) => u.valToPos(i, "x", true)
                ctx.beginPath()
                run.forEach((i, k) => (k ? ctx.lineTo(x(i), y(upper[i] as number)) : ctx.moveTo(x(i), y(upper[i] as number))))
                for (const i of [...run].reverse()) ctx.lineTo(x(i), y(lower[i] as number))
                ctx.closePath()
                ctx.fill()
              }
              run = []
            }
            for (let i = 0; i < n; i++) {
              if (lower[i] != null && upper[i] != null) run.push(i)
              else flush()
            }
            flush()
          }
          ctx.restore()
          if (bandLabel) {
            // Named under the band's right end, or over it when the band sits
            // on the floor of the plot.
            const at = n - 1 - [...lower].reverse().findIndex((v, k) => v != null && upper[n - 1 - k] != null)
            if (at < n) {
              ctx.save()
              ctx.font = `${theme.size.xs * pr}px ${theme.family}`
              ctx.fillStyle = theme.mutedForeground
              ctx.textAlign = "right"
              const below = y(lower[at] as number) + 3 * pr
              const room = below + theme.size.xs * pr <= t + h
              ctx.textBaseline = room ? "top" : "bottom"
              ctx.fillText(bandLabel, left + w - 4 * pr, room ? below : y(upper[at] as number) - 3 * pr)
              ctx.restore()
            }
          }
        }

        // Every line named at its right end, where it finishes; labels that
        // would collide are nudged apart, the main line's first.
        const lastOf = (vs: (number | null)[]) => vs.reduce<number>((at, v, i) => (v != null ? i : at), -1)
        const endLabels = named
          ? [{ name: name ?? "", values, stroke, main: true }, ...others.map((c) => ({ ...c, main: false }))]
          : []
        const font = `600 ${theme.size.xs}px ${theme.family}`
        const padRight = named
          ? Math.ceil(
              Math.max(
                0,
                ...endLabels.map((l) => {
                  const m = document.createElement("canvas").getContext("2d")
                  if (!m) return l.name.length * 7
                  m.font = font
                  return m.measureText(l.name).width
                }),
              ),
            ) + 12
          : undefined
        const drawLabels = (u: uPlot) => {
          if (!named) return
          const ctx = u.ctx
          const pr = uPlot.pxRatio
          const x = u.bbox.left + u.bbox.width + 6 * pr
          const step = theme.size.xs * pr + 2 * pr
          const placed = endLabels
            .map((l) => {
              const at = lastOf(l.values)
              return at < 0 ? null : { ...l, y: u.valToPos(l.values[at] as number, "y", true) }
            })
            .filter((l): l is NonNullable<typeof l> => l != null)
            .sort((a, b) => a.y - b.y)
          for (let i = 1; i < placed.length; i++) placed[i].y = Math.max(placed[i].y, placed[i - 1].y + step)
          ctx.save()
          ctx.font = `600 ${theme.size.xs * pr}px ${theme.family}`
          ctx.textBaseline = "middle"
          ctx.textAlign = "left"
          for (const l of placed) {
            ctx.fillStyle = l.main ? theme.foreground : l.stroke
            ctx.fillText(l.name, x, l.y)
          }
          ctx.restore()
        }

        const draw = (u: uPlot) => {
          drawLabels(u)
          if (!rings.length) return
          const ctx = u.ctx
          const pr = uPlot.pxRatio
          ctx.save()
          ctx.lineWidth = 1.5 * pr
          for (const r of rings) {
            const v = values[r.index]
            if (v == null) continue
            ctx.strokeStyle = r.color
            ctx.beginPath()
            ctx.arc(u.valToPos(r.index, "x", true), u.valToPos(v, "y", true), 4.5 * pr, 0, Math.PI * 2)
            ctx.stroke()
          }
          ctx.restore()
        }

        // The lines it is read against go behind the main one, plain.
        const behind = others.map(
          (c): uPlot.Series => ({ stroke: c.stroke, width: 2, spanGaps: false, points: { show: false } }),
        )
        return {
          series: [...behind, ...(ahead ? [line(), line([6, 4])] : [line()])],
          data: [...others.map((c) => c.values), ...(ahead ? [actual, ahead] : [actual])],
          padRight,
          floor: scale.floor,
          ceiling,
          splits: gridlines.length ? gridlines : max != null ? fixedSplits(max) : scale.splits,
          format: (v: number) => fmt.current(v),
          crosshair: true,
          cursorPoints: true,
          drawUnder,
          draw,
        }
      },
      [values, name, compareKey, named, color, max, gridlines, referenceValue, fmt, zero, lower, upper, band?.lower, band?.upper, band?.color, band?.label, forecast, highlightsKey, n],
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
      const lastIdx = forecast ?? values.reduce<number>((at, v, i) => (v != null ? i : at), -1)
      const parts = [
        `Line chart over ${values.length} periods, ${labels[0]} to ${labels[labels.length - 1]}.`,
        `Latest ${f(values[lastIdx] as number)} on ${labels[lastIdx]}; highest ${f(values[top] as number)} on ${labels[top]}.`,
      ]
      const gaps = values.length - measured.length
      if (gaps) parts.push(`${gaps} periods with nothing measured.`)
      if (forecast != null) parts.push(`Forecast from ${labels[forecast]}.`)
      if (band && typeof band.lower === "number" && typeof band.upper === "number")
        parts.push(`${band.label ?? "Band"} ${f(band.lower)} to ${f(band.upper)}.`)
      else if (band) parts.push(`${band.label ?? "A band"} shaded.`)
      if (highlights.length) parts.push(`Highlighted: ${highlights.map((h) => labels[h.index]).join(", ")}.`)
      const named = marks.filter((m) => m.label)
      if (named.length) parts.push(`Marked: ${named.map((m) => `${m.label} (${labels[m.index]})`).join(", ")}.`)
      if (reference) parts.push(`Reference ${reference.label} at ${f(reference.value)}.`)
      for (const c of compare) {
        const at = c.values.reduce<number>((last, v, i) => (v != null ? i : last), -1)
        if (at >= 0) parts.push(`Against ${c.name}: ${f(c.values[at] as number)} on ${labels[at]}.`)
      }
      return parts.join(" ")
    }, [blank, values, labels, marks, reference, measured.length, format, forecast, band, highlights, compare])

    // The forecast boundary is a mark: a dashed rule, named only if asked.
    const allMarks = React.useMemo(
      () => (forecast == null ? marks : [...marks, { index: forecast, label: forecastLabel }]),
      [marks, forecast, forecastLabel],
    )
    const bandText = (i: number) =>
      lower?.[i] != null && upper?.[i] != null ? `${format(lower[i] as number)} – ${format(upper[i] as number)}` : ""

    return (
      <ChartFrame
        ref={ref}
        summary={summary}
        labels={labels}
        height={height}
        ticks={ticks}
        marks={allMarks}
        reference={reference}
        empty={blank ? (empty ?? "Nothing measured in this period") : undefined}
        build={build}
        tooltip={(i) => ({
          title: labels[i],
          rows: [
            ...(values[i] != null ? [{ key: "value", label: named ? (name ?? "") : "", color, value: format(values[i] as number) }] : []),
            ...compare.flatMap((c, k) =>
              c.values[i] != null
                ? [{ key: `compare-${k}`, label: c.name, color: c.color ?? "var(--color-muted-foreground)", value: format(c.values[i] as number) }]
                : [],
            ),
          ],
          note:
            values[i] == null
              ? "nothing ran"
              : [
                  forecast != null && i > forecast ? "forecast" : "",
                  bandText(i) ? `${band?.label ?? "band"} ${bandText(i)}` : "",
                ]
                  .filter(Boolean)
                  .join(" · ") || undefined,
        })}
        table={{
          columns: [
            { accessorKey: "period", header: "Period" },
            { accessorKey: "value", header: name ?? "Value" },
            ...compare.map((c, k) => ({ accessorKey: `compare${k}`, header: c.name })),
            ...(band ? [{ accessorKey: "band", header: band.label ?? "Band" }] : []),
          ],
          rows: values.map((v, i) => ({
            period: labels[i],
            value: v != null ? `${format(v)}${forecast != null && i > forecast ? " (forecast)" : ""}` : "—",
            ...Object.fromEntries(compare.map((c, k) => [`compare${k}`, c.values[i] != null ? format(c.values[i] as number) : "—"])),
            band: bandText(i) || "—",
          })),
        }}
        {...props}
      />
    )
  },
)
LineChart.displayName = "LineChart"
