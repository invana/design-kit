/**
 * The frame every uPlot chart sits in. Internal — the package exports charts,
 * not this.
 *
 * uPlot owns the scales, the canvas, the y axis and the cursor. Everything a
 * reader reads as text — the period ticks, the tooltip, the legend, the table
 * view — is DOM composed from `@invana/ui`, so it sets in the same type as the
 * panel around it and never scales with a canvas.
 *
 * The x axis runs from -½ to n-½: every period owns one equal slot with its
 * point or column in the middle, so a line and a column chart of the same days
 * line up when they sit side by side, and a single period sits centred rather
 * than on an edge.
 */
import * as React from "react"
import uPlot from "uplot"
import {
  Button,
  Card,
  Eyebrow,
  Legend,
  LegendItem,
  cn,
  type LegendSwatchKind,
} from "@invana/ui"
import { DataTable, type DataTableProps } from "@invana/tables"

import { useChartTheme, useWidth } from "./hooks"
import type { ChartTheme } from "./theme"
import { installUPlotStyles } from "./uplot-styles"

export interface ChartMark {
  /** The period the mark sits on. */
  index: number
  label: string
}

export interface ChartReference {
  /** Where the rule sits, on the chart's own axis. */
  value: number
  label: string
}

export interface LegendEntry {
  key: string
  label: string
  /** The series colour, as CSS — `var(--color-data-3)`. */
  color: string
  kind?: LegendSwatchKind
}

export interface TooltipRow {
  key: string
  label: string
  /** CSS colour for the row's line key. */
  color: string
  value: string
}

export interface TooltipContent {
  title: string
  rows: TooltipRow[]
  /** A mark on this period, or why it has no value — `nothing ran`. */
  note?: string
}

/** What a chart hands the frame once its tokens have been resolved. */
export interface BuiltChart {
  series: uPlot.Series[]
  data: (number | null)[][]
  bands?: uPlot.Band[]
  /** The top of the y scale. The bottom is always 0. */
  ceiling: number
  /** Where the y hairlines and their labels go. */
  splits: number[]
  format: (value: number) => string
  /** A crosshair for lines and areas; columns get a hover band instead. */
  crosshair: boolean
  /** Dots on each series at the hovered period. Default: with the crosshair. */
  cursorPoints?: boolean
  /** Custom marks drawn after the series and before event marks. */
  draw?: (u: uPlot) => void
  /** CSS px kept free right of the plot, for direct labels. */
  padRight?: number
}

// Row values are whatever the chart puts in its table; DataTable owns rendering.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TableRow = Record<string, any>

export interface ChartFrameProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** What the chart shows, for assistive tech. */
  summary: string
  /** One per period. */
  labels: string[]
  /** The plot's height in CSS px. Ticks, legend and toggle sit below it, inside the chart. */
  height: number
  /** Which periods name themselves under the plot. Default: the first and the last. */
  ticks?: number[]
  marks?: ChartMark[]
  reference?: ChartReference
  /** Drawn for two or more entries; a single series is named by its panel. */
  legend?: LegendEntry[]
  /** Shown in place of the plot when there is nothing to draw. */
  empty?: React.ReactNode
  build: (theme: ChartTheme, host: HTMLElement) => BuiltChart
  tooltip: (index: number) => TooltipContent
  table: { columns: DataTableProps<TableRow>["columns"]; rows: TableRow[] }
}

interface PlotBox {
  left: number
  top: number
  width: number
  height: number
}

const measure = (() => {
  let ctx: CanvasRenderingContext2D | null | undefined
  return (font: string, text: string) => {
    if (ctx === undefined) ctx = document.createElement("canvas").getContext("2d")
    if (!ctx) return text.length * 7
    ctx.font = font
    return ctx.measureText(text).width
  }
})()

export const ChartFrame = React.forwardRef<HTMLDivElement, ChartFrameProps>(
  (
    {
      summary,
      labels,
      height,
      ticks,
      marks = [],
      reference,
      legend = [],
      empty,
      build,
      tooltip,
      table,
      className,
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) => {
    const root = React.useRef<HTMLDivElement>(null)
    React.useImperativeHandle(ref, () => root.current as HTMLDivElement)
    const mount = React.useRef<HTMLDivElement>(null)
    const plot = React.useRef<uPlot | null>(null)

    const theme = useChartTheme(root)
    const width = useWidth(root)
    const widthRef = React.useRef(width)
    React.useLayoutEffect(() => {
      widthRef.current = width
    })

    const [asTable, setAsTable] = React.useState(false)
    const [hover, setHover] = React.useState<number | null>(null)
    const [box, setBox] = React.useState<PlotBox | null>(null)
    const [crosshair, setCrosshair] = React.useState(true)

    const n = labels.length
    const blank = empty != null || n === 0
    // Marks arrive as inline arrays; key them by value so a parent's re-render
    // does not rebuild the canvas.
    const marksKey = JSON.stringify(marks)
    const referenceKey = JSON.stringify(reference ?? null)
    const hasWidth = width > 0

    React.useEffect(() => {
      const el = mount.current
      const host = root.current
      if (!el || !host || !theme || !hasWidth || blank || asTable) return
      installUPlotStyles()
      const built = build(theme, host)
      const marksNow: ChartMark[] = JSON.parse(marksKey)
      const referenceNow: ChartReference | null = JSON.parse(referenceKey)
      setCrosshair(built.crosshair)

      const labelBand = marksNow.length ? Math.ceil(theme.size.xs) + 8 : 0
      const half = Math.ceil(theme.size.xs / 2) + 1
      const axisWidth =
        Math.ceil(Math.max(0, ...built.splits.map((s) => measure(theme.font.xs, built.format(s))))) + 10

      // A reference is named right of the plot, beside its rule, where the
      // series cannot run through the label.
      const referenceBand = referenceNow
        ? Math.ceil(measure(theme.font.xs, referenceNow.label)) + 10
        : 0

      const readBox = (u: uPlot) =>
        setBox({
          left: u.over.offsetLeft,
          top: u.over.offsetTop,
          width: u.over.clientWidth,
          height: u.over.clientHeight,
        })

      const drawMarks = (u: uPlot) => {
        const ctx = u.ctx
        const pr = uPlot.pxRatio
        const { left, top, width: w, height: h } = u.bbox
        ctx.save()
        ctx.font = `${theme.size.xs * pr}px ${theme.family}`
        ctx.lineWidth = pr
        ctx.setLineDash([3 * pr, 3 * pr])
        ctx.strokeStyle = theme.mutedForeground
        ctx.fillStyle = theme.mutedForeground
        ctx.textBaseline = "bottom"

        // An event: a dashed rule through the plot, named above it. Labels that
        // would collide are left to the tooltip rather than stacked.
        let lastRight = -Infinity
        for (const m of marksNow) {
          if (m.index < 0 || m.index >= n) continue
          const x = Math.round(u.valToPos(m.index, "x", true)) + 0.5
          ctx.beginPath()
          ctx.moveTo(x, top - 2 * pr)
          ctx.lineTo(x, top + h)
          ctx.stroke()
          const tw = ctx.measureText(m.label).width
          const flip = x + 4 * pr + tw > left + w
          const start = flip ? x - 4 * pr - tw : x + 4 * pr
          if (start < lastRight + 6 * pr) continue
          ctx.textAlign = "left"
          ctx.fillText(m.label, start, top - 2 * pr)
          lastRight = start + tw
        }

        // A reference: a dashed rule across the plot, named at its right end.
        if (referenceNow) {
          const y = Math.round(u.valToPos(referenceNow.value, "y", true)) + 0.5
          ctx.setLineDash([2 * pr, 4 * pr])
          ctx.beginPath()
          ctx.moveTo(left, y)
          ctx.lineTo(left + w, y)
          ctx.stroke()
          ctx.textAlign = "left"
          ctx.textBaseline = "middle"
          ctx.fillText(referenceNow.label, left + w + 6 * pr, y)
        }
        ctx.restore()
      }

      const color = (u: uPlot, i: number) => {
        const stroke = u.series[i].stroke
        return String(typeof stroke === "function" ? stroke(u, i) : stroke)
      }

      const opts: uPlot.Options = {
        class: "invana-uplot",
        width: widthRef.current,
        height,
        padding: [labelBand || half, Math.max(built.padRight ?? 4, referenceBand), half, 0],
        legend: { show: false },
        scales: {
          x: { time: false, range: [-0.5, n - 0.5] },
          y: { range: [0, built.ceiling] },
        },
        axes: [
          { show: false },
          {
            scale: "y",
            side: 3,
            size: axisWidth,
            gap: 6,
            font: theme.font.xs,
            stroke: theme.mutedForeground,
            ticks: { show: false },
            grid: { stroke: theme.border, width: 1 },
            splits: () => built.splits,
            values: (_u, splits) => splits.map((s) => built.format(s)),
          },
        ],
        series: [{}, ...built.series],
        bands: built.bands,
        cursor: {
          x: built.crosshair,
          y: false,
          drag: { x: false, y: false, setScale: false },
          points: {
            show: built.cursorPoints ?? built.crosshair,
            size: 8,
            width: 2,
            stroke: () => theme.card,
            fill: color,
          },
        },
        hooks: {
          ready: [readBox],
          setSize: [readBox],
          setCursor: [(u) => setHover(u.cursor.idx ?? null)],
          draw: [...(built.draw ? [built.draw] : []), drawMarks],
        },
      }

      const xs = Array.from({ length: n }, (_, i) => i)
      const u = new uPlot(opts, [xs, ...built.data] as uPlot.AlignedData, el)
      plot.current = u
      return () => {
        u.destroy()
        plot.current = null
        setHover(null)
      }
    }, [theme, build, hasWidth, blank, asTable, n, height, marksKey, referenceKey])

    React.useEffect(() => {
      if (hasWidth) plot.current?.setSize({ width, height })
    }, [width, height, hasWidth])

    const slot = box ? box.width / Math.max(n, 1) : 0
    const xAt = (i: number) => (box ? box.left + (i + 0.5) * slot : 0)
    // Where each tick's text runs, given how it is anchored: the first starts at
    // its slot's left edge, the last ends at its slot's right edge, the rest
    // centre. A tick that would overlap one already placed is dropped — the
    // first and the last are placed first, so the window's ends always read.
    const tickStyle = (i: number): React.CSSProperties =>
      n > 1 && i === 0
        ? { left: xAt(i) - slot / 2 }
        : n > 1 && i === n - 1
          ? { right: (width || 0) - (xAt(i) + slot / 2) }
          : { left: xAt(i), transform: "translateX(-50%)" }
    const tickSpan = (i: number): [number, number] => {
      const w = theme ? measure(theme.font.xs, labels[i] ?? "") : 0
      if (n > 1 && i === 0) return [xAt(i) - slot / 2, xAt(i) - slot / 2 + w]
      if (n > 1 && i === n - 1) return [xAt(i) + slot / 2 - w, xAt(i) + slot / 2]
      return [xAt(i) - w / 2, xAt(i) + w / 2]
    }
    const wanted = [...new Set(ticks ?? (n > 1 ? [0, n - 1] : [0]))].filter((i) => i >= 0 && i < n)
    const placed: [number, number][] = []
    const named = [
      ...wanted.filter((i) => i === 0 || i === n - 1),
      ...wanted.filter((i) => i !== 0 && i !== n - 1),
    ].filter((i) => {
      const [a, b] = tickSpan(i)
      if (placed.some(([c, d]) => a < d + 8 && b > c - 8)) return false
      placed.push([a, b])
      return true
    })

    const tip = hover != null && hover < n ? tooltip(hover) : null
    const markHere = hover != null ? marks.filter((m) => m.index === hover).map((m) => m.label) : []
    const tipLeft = hover != null ? xAt(hover) : 0
    const tipFlip = box ? tipLeft > box.left + box.width / 2 : false

    const onKeyDown = (e: React.KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return
      e.preventDefault()
      const step = e.key === "ArrowLeft" ? -1 : 1
      setHover((at) => Math.min(n - 1, Math.max(0, (at ?? (step > 0 ? -1 : n)) + step)))
    }

    return (
      <div ref={root} className={cn("flex min-w-0 flex-col gap-1", className)} {...props}>
        {asTable ? (
          <DataTable
            columns={table.columns}
            data={table.rows}
            enablePagination={false}
            enableSorting={false}
          />
        ) : (
          <>
            <div
              role="img"
              aria-label={ariaLabel ?? summary}
              tabIndex={blank ? undefined : 0}
              onKeyDown={onKeyDown}
              onBlur={() => setHover(null)}
              className="relative w-full rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              style={{ height }}
            >
              {blank ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  {empty ?? "Nothing in this period"}
                </div>
              ) : (
                <>
                  {!crosshair && hover != null && box ? (
                    // The hover band sits behind the transparent canvas, so a
                    // column lifts without its colour being tinted.
                    <div
                      aria-hidden
                      className="absolute rounded-sm bg-muted"
                      style={{ left: xAt(hover) - slot / 2, width: slot, top: box.top, height: box.height }}
                    />
                  ) : null}
                  <div ref={mount} aria-hidden className="relative" />
                  {tip && box ? (
                    <Card
                      aria-hidden
                      className="pointer-events-none absolute z-10 flex min-w-32 max-w-64 flex-col gap-1 px-2 py-1.5 shadow-sm"
                      style={{
                        top: box.top,
                        left: tipFlip ? undefined : tipLeft + 10,
                        right: tipFlip ? (width || 0) - tipLeft + 10 : undefined,
                      }}
                    >
                      <Eyebrow>{tip.title}</Eyebrow>
                      {tip.rows.map((r) => (
                        <div key={r.key} className="flex items-center gap-1.5">
                          <span aria-hidden className="h-0.5 w-3 shrink-0 rounded-full" style={{ background: r.color }} />
                          <span className="font-semibold tabular-nums">{r.value}</span>
                          <span className="min-w-0 truncate text-muted-foreground">{r.label}</span>
                        </div>
                      ))}
                      {[...markHere, ...(tip.note ? [tip.note] : [])].map((note) => (
                        <div key={note} className="text-sm text-muted-foreground">
                          {note}
                        </div>
                      ))}
                    </Card>
                  ) : null}
                </>
              )}
            </div>
            {!blank && box ? (
              <div aria-hidden className="relative h-4 text-xs text-muted-foreground">
                {named.map((i) => (
                  <span
                    key={i}
                    className="absolute top-0 whitespace-nowrap tabular-nums"
                    style={tickStyle(i)}
                  >
                    {labels[i]}
                  </span>
                ))}
              </div>
            ) : null}
          </>
        )}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {legend.length > 1 && !blank ? (
            <Legend>
              {legend.map((s) => (
                <LegendItem key={s.key} color={s.color} label={s.label} kind={s.kind} />
              ))}
            </Legend>
          ) : null}
          {blank ? null : (
            <Button
              variant="link"
              size="xs"
              className="ml-auto px-0 text-muted-foreground"
              aria-pressed={asTable}
              onClick={() => setAsTable((v) => !v)}
            >
              {asTable ? "View as chart" : "View as table"}
            </Button>
          )}
        </div>
      </div>
    )
  },
)
ChartFrame.displayName = "ChartFrame"
