/**
 * TODO — provisional. Built ahead of its design review.
 *
 * The chart set was deliberately deferred while the rest of the kit was built,
 * because charts are the one group with a real design question in them rather
 * than a markup question: which forms this product actually needs, at what
 * sizes, and how much a 330px drawer can carry. This component satisfies the
 * dataviz rules and the validated palette, but the *form inventory* has not been
 * agreed — treat the API as unsettled until a board screen uses it in anger.
 */
import * as React from "react"

import { cn } from "../../lib/utils"

export interface SparklineProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, "children" | "values"> {
  values: number[]
  width?: number
  height?: number
  color?: string
  /** Washes the area under the line at 10%. Off by default at this size. */
  area?: boolean
  /** A filled dot on the last point, ringed in the surface colour. */
  endMarker?: boolean
  /** What the line is, for assistive tech. The surface around it usually says. */
  label?: string
}

/**
 * The shape of a series, small enough to sit inside a row.
 *
 * No axis, no gridlines, no labels — a sparkline answers "which way, and how
 * steadily", and the number it accompanies answers "how much". If a reader
 * needs to read a value off it, it wanted to be a chart.
 *
 * The end marker carries a 2px ring in the surface colour so it stays legible
 * where the line runs under it.
 */
export const Sparkline = React.forwardRef<SVGSVGElement, SparklineProps>(
  (
    {
      values,
      width = 72,
      height = 20,
      color = "var(--color-data-1)",
      area,
      endMarker = true,
      label,
      className,
      ...props
    },
    ref,
  ) => {
    const pad = 3
    const min = Math.min(...values)
    const max = Math.max(...values)
    const span = max - min || 1
    const stepX = values.length > 1 ? (width - pad * 2) / (values.length - 1) : 0
    const points = values.map((v, i) => [
      pad + i * stepX,
      height - pad - ((v - min) / span) * (height - pad * 2),
    ])
    const d = points.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ")
    const last = points[points.length - 1]

    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className={cn("shrink-0 overflow-visible", className)}
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        {...props}
      >
        {area ? (
          <path
            d={`${d} L${last[0]} ${height} L${points[0][0]} ${height} Z`}
            fill={color}
            opacity={0.1}
          />
        ) : null}
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {endMarker ? (
          <circle
            cx={last[0]}
            cy={last[1]}
            r={4}
            fill={color}
            stroke="var(--color-card)"
            strokeWidth={2}
          />
        ) : null}
      </svg>
    )
  },
)
Sparkline.displayName = "Sparkline"
