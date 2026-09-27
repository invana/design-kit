/**
 * One measure over time, with the moments that might explain it marked on the
 * axis — a plan's work p50 a day, with each version's publish.
 *
 * One series and one axis, so no legend: the panel's title names what is
 * plotted. A day with no value breaks the line rather than drawing it to zero,
 * because *nothing ran* is not *it took no time*. A mark is a dashed rule with
 * its label at the top — an event, not a value. Hover reads the nearest day.
 */
import * as React from "react"

import { cn } from "../../lib/utils"

export interface LineChartMark {
  /** The point the mark sits on. */
  index: number
  label: string
}

export interface LineChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** One per period; `null` where nothing was measured. */
  values: (number | null)[]
  /** One per period — what the hover and a tick name it. */
  labels: string[]
  /** How a value is written on the axis and in the hover — `6.0s`. */
  format?: (value: number) => string
  /** Fixes the scale. Defaults to the largest value. */
  max?: number
  /** Values to draw a hairline at. */
  gridlines?: number[]
  marks?: LineChartMark[]
  /** Which periods name themselves under the axis. Default: the first and the last. */
  ticks?: number[]
  height?: number
  color?: string
}

const PAD_L = 36

export const LineChart = React.forwardRef<HTMLDivElement, LineChartProps>(
  (
    {
      values,
      labels,
      format = String,
      max,
      gridlines = [],
      marks = [],
      ticks,
      height = 132,
      color = "var(--color-primary)",
      className,
      ...props
    },
    ref,
  ) => {
    const [hover, setHover] = React.useState<number | null>(null)
    // Drawn at its real width, so the axis text is never stretched.
    const box = React.useRef<HTMLDivElement>(null)
    const [W, setW] = React.useState(400)
    React.useLayoutEffect(() => {
      const el = box.current
      if (!el) return
      const observer = new ResizeObserver(([entry]) => setW(Math.max(120, entry.contentRect.width)))
      observer.observe(el)
      return () => observer.disconnect()
    }, [])
    const measured = values.filter((v): v is number => v != null)
    const ceiling = max ?? (Math.max(0, ...measured) || 1)
    const H = height
    const plotH = H - 8
    const step = values.length > 1 ? (W - PAD_L - 6) / (values.length - 1) : 0
    const x = (i: number) => PAD_L + i * step
    const y = (v: number) => H - (v / ceiling) * plotH

    // Break the line at every gap: one path segment per run of measured days.
    const path = values
      .map((v, i) =>
        v == null ? "" : `${i === 0 || values[i - 1] == null ? "M" : "L"}${x(i)} ${y(v)}`,
      )
      .join(" ")
    const last = values.reduce<number | null>((at, v, i) => (v != null ? i : at), null)
    const named = new Set(ticks ?? [0, values.length - 1])

    const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
      const box = e.currentTarget.getBoundingClientRect()
      const at = ((e.clientX - box.left) / box.width) * W
      const i = Math.round((at - PAD_L) / (step || 1))
      setHover(i >= 0 && i < values.length ? i : null)
    }

    return (
      <div ref={ref} className={cn("relative flex flex-col gap-1", className)} {...props}>
        <div ref={box} className="w-full">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width={W}
          height={H}
          className="block overflow-visible"
          role="img"
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
        >
          {gridlines.map((g) => (
            <g key={g}>
              <line
                x1={PAD_L}
                x2={W}
                y1={y(g)}
                y2={y(g)}
                stroke="var(--color-border)"
              />
              <text
                x={PAD_L - 5}
                y={y(g) + 3}
                textAnchor="end"
                className="fill-muted-foreground text-xs"
              >
                {format(g)}
              </text>
            </g>
          ))}
          {marks.map((m) => (
            <g key={m.index}>
              <line
                x1={x(m.index)}
                x2={x(m.index)}
                y1={8}
                y2={H}
                stroke="var(--color-muted-foreground)"
                strokeDasharray="3 3"
              />
              <text x={x(m.index) + 4} y={10} className="fill-muted-foreground text-xs">
                {m.label}
              </text>
            </g>
          ))}
          <path
            d={path}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {hover != null ? (
            <line
              x1={x(hover)}
              x2={x(hover)}
              y1={0}
              y2={H}
              stroke="var(--color-border)"
            />
          ) : null}
          {last != null && values[last] != null ? (
            <circle
              cx={x(last)}
              cy={y(values[last] as number)}
              r={4}
              fill={color}
              stroke="var(--color-card)"
              strokeWidth={2}
            />
          ) : null}
        </svg>
        </div>

        {hover != null ? (
          <div
            className="pointer-events-none absolute top-0 rounded-sm border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-sm"
            style={{ left: `${(x(hover) / W) * 100}%`, transform: "translateX(-50%)" }}
          >
            {labels[hover]} ·{" "}
            <span className="tabular-nums">
              {values[hover] != null ? format(values[hover] as number) : "nothing ran"}
            </span>
          </div>
        ) : null}

        <div className="relative h-4">
          {[...named].map((i) =>
            labels[i] != null ? (
              <span
                key={i}
                className={cn(
                  "absolute whitespace-nowrap text-xs text-muted-foreground",
                  i === values.length - 1 ? "-translate-x-full" : i > 0 && "-translate-x-1/2",
                )}
                style={{ left: `${(x(i) / W) * 100}%` }}
              >
                {labels[i]}
              </span>
            ) : null,
          )}
        </div>
      </div>
    )
  },
)
LineChart.displayName = "LineChart"
