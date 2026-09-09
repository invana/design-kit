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

export interface BarDatum {
  label: React.ReactNode
  value: number
  /**
   * Overrides the series colour for this bar. Use a data-palette token
   * (`var(--color-data-3)`) when the bar's identity is an entity — a node type,
   * a theme — so it matches that entity everywhere else it appears.
   */
  color?: string
  /** What the tip should read, if not the raw value. */
  display?: React.ReactNode
}

export interface BarChartHProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  data: BarDatum[]
  /** Fixes the scale. Defaults to the largest value present. */
  max?: number
  /** Width of the label column, so bars start on the same x. */
  labelWidth?: number
  /** Series colour when a datum does not override it. */
  color?: string
  /** Names what is plotted. A single series needs no legend when this is set. */
  caption?: React.ReactNode
}

/**
 * Magnitude across a handful of named things.
 *
 * Horizontal because the labels are words — a stock, a pattern, a theme — and
 * words read badly rotated under a column. Bars grow from a single baseline on
 * the left, so length is the only thing carrying the value.
 *
 * One series, so there is no legend: `caption` names what is plotted. Every bar
 * is directly labelled at its tip, which is also what discharges the light-mode
 * contrast obligation on the data palette — identity and value are never
 * carried by hue alone.
 */
export const BarChartH = React.forwardRef<HTMLDivElement, BarChartHProps>(
  (
    {
      data,
      max,
      labelWidth = 78,
      color = "var(--color-data-1)",
      caption,
      className,
      ...props
    },
    ref,
  ) => {
    const ceiling = max ?? (Math.max(...data.map((d) => d.value), 0) || 1)
    return (
      <div ref={ref} className={cn("flex flex-col gap-1", className)} {...props}>
        {caption != null ? (
          <span className="text-meta text-muted-foreground">{caption}</span>
        ) : null}
        {data.map((d, i) => (
          <div key={i} className="flex h-4 items-center gap-2">
            <span
              className="shrink-0 truncate text-meta text-muted-foreground"
              style={{ width: labelWidth }}
            >
              {d.label}
            </span>
            <span className="flex min-w-0 flex-1 items-center gap-1.5">
              <span
                title={`${d.label}: ${d.display ?? d.value}`}
                className="h-2.5 shrink-0 rounded-e-[4px]"
                style={{
                  width: `${Math.max(0, (d.value / ceiling) * 100)}%`,
                  background: d.color ?? color,
                }}
              />
              <span className="shrink-0 text-meta tabular-nums">
                {d.display ?? d.value}
              </span>
            </span>
          </div>
        ))}
      </div>
    )
  },
)
BarChartH.displayName = "BarChartH"
