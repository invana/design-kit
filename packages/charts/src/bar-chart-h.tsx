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
  /**
   * Drawn as the remainder rather than an item — `3 others`, the rest folded
   * into one line: its label and bar in the muted colour. `ranked` only.
   */
  muted?: boolean
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
  /**
   * `ranked` only: bars grow both ways from a zero rule in the middle, and the
   * line under them says what each side means — `− pulls margin down`,
   * `lifts it +`.
   */
  diverging?: { below?: React.ReactNode; above?: React.ReactNode }
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
      diverging,
      className,
      ...props
    },
    ref,
  ) => {
    if (variant === "ranked") {
      const ceiling = max ?? (Math.max(...data.map((d) => Math.abs(d.value)), 0) || 1)
      const share = (d: BarDatum) => Math.min(100, (Math.abs(d.value) / ceiling) * 100)
      const fill = (d: BarDatum) =>
        d.color ??
        (d.muted
          ? "color-mix(in srgb, var(--color-muted-foreground) 40%, transparent)"
          : d.value < 0
            ? negativeColor
            : color)
      // Below ~290px the label and value columns narrow, so the bars keep their length.
      const columns =
        labelWidth != null
          ? { gridTemplateColumns: `${labelWidth}px minmax(0, 1fr) 40px` }
          : undefined
      return (
        <div ref={ref} className={cn("@container flex flex-col gap-1.5", className)} {...props}>
          {caption != null ? (
            <span className="text-sm text-muted-foreground">{caption}</span>
          ) : null}
          {data.map((d, i) => (
            <div
              key={i}
              className={cn(
                "grid items-center gap-[7px] text-sm",
                labelWidth == null &&
                  "grid-cols-[96px_minmax(0,1fr)_40px] @max-[290px]:grid-cols-[74px_minmax(0,1fr)_36px]",
              )}
              style={columns}
            >
              <span className={cn("min-w-0 truncate", d.muted && "text-muted-foreground")}>{d.label}</span>
              {diverging ? (
                <span className="relative block h-2 before:absolute before:-inset-y-[3px] before:left-1/2 before:border-l before:border-border">
                  <span
                    title={`${d.label}: ${d.display ?? d.value}`}
                    className="absolute top-0 h-2 rounded-[1px] opacity-85"
                    style={{
                      left: d.value < 0 ? `${50 - share(d) / 2}%` : "50%",
                      width: `${share(d) / 2}%`,
                      background: fill(d),
                    }}
                  />
                </span>
              ) : (
                <span
                  title={`${d.label}: ${d.display ?? d.value}`}
                  className="h-2 rounded-[1px] opacity-85"
                  style={{ width: `${share(d)}%`, background: fill(d) }}
                />
              )}
              <span className="text-end font-mono text-xs tabular-nums">{d.display ?? d.value}</span>
            </div>
          ))}
          {diverging ? (
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{diverging.below}</span>
              <span>0</span>
              <span>{diverging.above}</span>
            </div>
          ) : null}
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
