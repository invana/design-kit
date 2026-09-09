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

export interface ColumnDatum {
  /** The period — `wk 36`. */
  label: React.ReactNode
  /** A second line under the label — `1–5 Sep`. */
  sublabel?: React.ReactNode
  value: number
  display?: React.ReactNode
}

export interface BarChartVProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  data: ColumnDatum[]
  /** Fixes the scale. Defaults to the largest value present. */
  max?: number
  /** Values to draw a hairline at — `[50, 75, 100]`. */
  gridlines?: number[]
  height?: number
  color?: string
  /** Colour for the column the story is about. Defaults to `color`. */
  highlightColor?: string
  /** Which column carries the emphasis — usually the most recent. */
  highlightIndex?: number
  /**
   * Which columns get a value on the cap.
   *
   * `last` by default. A number on every column stops being a label and becomes
   * texture; the gridlines carry the rest.
   */
  labelMode?: "last" | "all" | "none"
  caption?: React.ReactNode
}

/**
 * One measure over a few periods.
 *
 * Vertical because the x-axis is time and time reads left to right. Columns are
 * capped at 24px and separated by real gaps, so the band's leftover is air
 * rather than a fatter bar.
 *
 * `labelMode` defaults to `last`: the current period is the one being asked
 * about, and the gridlines carry the others. One series, so no legend —
 * `caption` says what is plotted.
 */
export const BarChartV = React.forwardRef<HTMLDivElement, BarChartVProps>(
  (
    {
      data,
      max,
      gridlines = [],
      height = 160,
      color = "var(--color-data-1)",
      highlightColor,
      highlightIndex,
      labelMode = "last",
      caption,
      className,
      ...props
    },
    ref,
  ) => {
    const ceiling = max ?? (Math.max(...data.map((d) => d.value), 0) || 1)
    const emphasis = highlightIndex ?? data.length - 1
    const labelled = (i: number) =>
      labelMode === "all" || (labelMode === "last" && i === emphasis)

    return (
      <div ref={ref} className={cn("flex flex-col gap-1", className)} {...props}>
        {caption != null ? (
          <span className="text-meta text-muted-foreground">{caption}</span>
        ) : null}

        {/* `mt-2` is headroom: the topmost gridline's tick is centred on its
            line, so half of it sits above the plot box and would otherwise
            collide with the caption. */}
        <div className="relative mt-2" style={{ height }}>
          {gridlines.map((g) => (
            <div
              key={g}
              aria-hidden
              className="absolute inset-x-0 flex translate-y-1/2 items-center"
              style={{ bottom: `${(g / ceiling) * 100}%` }}
            >
              <span className="h-px flex-1 bg-border" />
              <span className="pl-1 text-meta tabular-nums text-muted-foreground">
                {g}
              </span>
            </div>
          ))}

          <div className="absolute inset-0 flex items-end justify-between gap-2">
            {data.map((d, i) => (
              <div
                key={i}
                className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1"
              >
                {labelled(i) ? (
                  <span className="text-meta tabular-nums">
                    {d.display ?? d.value}
                  </span>
                ) : null}
                <span
                  title={`${d.label}: ${d.display ?? d.value}`}
                  className="w-full max-w-6 rounded-t-[4px]"
                  style={{
                    height: `${Math.max(0, (d.value / ceiling) * 100)}%`,
                    background:
                      i === emphasis ? (highlightColor ?? color) : color,
                    opacity: i === emphasis ? 1 : 0.55,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between gap-2">
          {data.map((d, i) => (
            <div key={i} className="flex min-w-0 flex-1 flex-col items-center">
              <span className="truncate text-meta text-muted-foreground">
                {d.label}
              </span>
              {d.sublabel != null ? (
                <span className="truncate text-meta text-muted-foreground/70">
                  {d.sublabel}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    )
  },
)
BarChartV.displayName = "BarChartV"
