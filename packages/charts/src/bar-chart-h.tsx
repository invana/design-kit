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

import { cn } from "@invana/ui"

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
  /** Width of the label column, so bars start on the same x. Default: 78, or 96 in `ranked`. */
  labelWidth?: number
  /** Series colour when a datum does not override it. */
  color?: string
  /** Names what is plotted. A single series needs no legend when this is set. */
  caption?: React.ReactNode
  /**
   * `tips` labels each bar at its end. `ranked` is a list read top to bottom —
   * drivers, top-N, likely causes: the labels are the reading in the text
   * colour and may wrap, the bars take the width between, and the values line
   * up in a column at the right. A negative value draws in `negativeColor`,
   * its length its size.
   */
  variant?: "tips" | "ranked"
  /** The colour of a bar below zero, in `ranked`. */
  negativeColor?: string
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
      labelWidth,
      color = "var(--color-data-1)",
      caption,
      variant = "tips",
      negativeColor = "var(--color-destructive)",
      className,
      ...props
    },
    ref,
  ) => {
    if (variant === "ranked") {
      const ceiling = max ?? (Math.max(...data.map((d) => Math.abs(d.value)), 0) || 1)
      return (
        <div ref={ref} className={cn("flex flex-col gap-1.5", className)} {...props}>
          {caption != null ? (
            <span className="text-sm text-muted-foreground">{caption}</span>
          ) : null}
          {data.map((d, i) => (
            <div
              key={i}
              className="grid items-center gap-2"
              style={{ gridTemplateColumns: `${labelWidth ?? 96}px minmax(0, 1fr) auto` }}
            >
              <span className="min-w-0 text-pretty">{d.label}</span>
              <span
                title={`${d.label}: ${d.display ?? d.value}`}
                className="h-2"
                style={{
                  width: `${Math.min(100, (Math.abs(d.value) / ceiling) * 100)}%`,
                  background: d.color ?? (d.value < 0 ? negativeColor : color),
                }}
              />
              <span className="min-w-[3ch] text-end tabular-nums">{d.display ?? d.value}</span>
            </div>
          ))}
        </div>
      )
    }
    const ceiling = max ?? (Math.max(...data.map((d) => d.value), 0) || 1)
    return (
      <div ref={ref} className={cn("flex flex-col gap-1", className)} {...props}>
        {caption != null ? (
          <span className="text-sm text-muted-foreground">{caption}</span>
        ) : null}
        {data.map((d, i) => (
          <div key={i} className="flex h-4 items-center gap-2">
            <span
              className="shrink-0 truncate text-sm text-muted-foreground"
              style={{ width: labelWidth ?? 78 }}
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
              <span className="shrink-0 text-sm tabular-nums">
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
