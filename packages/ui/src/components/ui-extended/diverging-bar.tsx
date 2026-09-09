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

export interface DivergingDatum {
  label: React.ReactNode
  /** Signed. The sign is the whole point of this chart. */
  value: number
  display?: React.ReactNode
}

export interface DivergingBarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  data: DivergingDatum[]
  /** Fixes the scale on both sides. Defaults to the largest magnitude present. */
  max?: number
  labelWidth?: number
  /** Above the midpoint. Defaults to `--color-success`. */
  positiveColor?: string
  /** Below it. Defaults to `--color-destructive`. */
  negativeColor?: string
  caption?: React.ReactNode
}

/**
 * Polarity — how far either side of zero.
 *
 * A net learning weight, a delta against a baseline, a sentiment score. The
 * midpoint is a real zero line, drawn in the neutral border colour, and both
 * sides share one scale so a `−9` is visibly longer than a `+6`.
 *
 * The poles use the **status** colours rather than data-palette hues, because
 * this chart's two directions are good and bad, not two categories. That is the
 * one place status colour belongs on a chart — it is encoding valence, not
 * identity, so it is never "series 1 and series 2". Every bar is directly
 * labelled, so the sign is readable without seeing colour at all.
 */
export const DivergingBar = React.forwardRef<
  HTMLDivElement,
  DivergingBarProps
>(
  (
    {
      data,
      max,
      labelWidth = 104,
      positiveColor = "var(--color-success)",
      negativeColor = "var(--color-destructive)",
      caption,
      className,
      ...props
    },
    ref,
  ) => {
    const ceiling =
      max ?? (Math.max(...data.map((d) => Math.abs(d.value)), 0) || 1)

    return (
      <div ref={ref} className={cn("flex flex-col gap-1", className)} {...props}>
        {caption != null ? (
          <span className="text-meta text-muted-foreground">{caption}</span>
        ) : null}
        {data.map((d, i) => {
          const positive = d.value >= 0
          const width = `${(Math.abs(d.value) / ceiling) * 50}%`
          return (
            <div key={i} className="flex h-4 items-center gap-2">
              <span
                className="shrink-0 truncate text-meta text-muted-foreground"
                style={{ width: labelWidth }}
              >
                {d.label}
              </span>
              <span className="relative flex min-w-0 flex-1 items-center">
                {/* The zero line — neutral, never one of the poles. */}
                <span
                  aria-hidden
                  className="absolute left-1/2 h-4 w-px -translate-x-1/2 bg-border"
                />
                <span className="flex w-1/2 justify-end">
                  {!positive ? (
                    <span
                      title={`${d.label}: ${d.display ?? d.value}`}
                      className="h-2.5 rounded-s-[4px]"
                      style={{ width, background: negativeColor }}
                    />
                  ) : null}
                </span>
                <span className="flex w-1/2 justify-start">
                  {positive ? (
                    <span
                      title={`${d.label}: ${d.display ?? d.value}`}
                      className="h-2.5 rounded-e-[4px]"
                      style={{ width, background: positiveColor }}
                    />
                  ) : null}
                </span>
              </span>
              {/* One gutter for every value, not one per side. Flipping the
                  column with the sign puts a negative number immediately after
                  the row's name, where it reads as part of the label. */}
              <span className="w-8 shrink-0 text-right text-meta tabular-nums">
                {d.display ?? (d.value > 0 ? `+${d.value}` : d.value)}
              </span>
            </div>
          )
        })}
      </div>
    )
  },
)
DivergingBar.displayName = "DivergingBar"
