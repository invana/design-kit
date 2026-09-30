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

import { cn, Legend, LegendItem } from "@invana/ui"

interface ColumnBase {
  /** The period or group — `wk 36`, `F`, `paid`. */
  label: React.ReactNode
  /** A second line under the label — `1–5 Sep`. */
  sublabel?: React.ReactNode
}

/** One column: one measure in one period. */
export interface SingleColumnDatum extends ColumnBase {
  value: number
  display?: React.ReactNode
  /**
   * What the column was meant to reach — drawn as a dashed column the value
   * stands inside, so falling short reads as the gap between them.
   */
  plan?: number
}

/** A group of columns side by side, one per {@link BarSeries}, in the same order. */
export interface GroupedColumnDatum extends ColumnBase {
  values: number[]
  /** Written values, index for index with `values`. */
  display?: React.ReactNode[]
}

export type ColumnDatum = SingleColumnDatum | GroupedColumnDatum

export interface BarSeries {
  /** What the series is — `before 2 Jun`. Named in the legend. */
  name: React.ReactNode
  /** Defaults to the data palette in order: `--color-data-1`, `-2`, … */
  color?: string
}

export interface BarTarget {
  value: number
  /** Written at the right-hand end of the rule — `avg`, `target`. */
  label?: React.ReactNode
  /** Defaults to the muted text colour. */
  color?: string
}

export interface BarChartVProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  data: ColumnDatum[]
  /**
   * Names the series when `data` is grouped. Two or more draw a legend; the
   * columns in a group follow this order.
   */
  series?: BarSeries[]
  /** Fixes the scale. Defaults to the largest value present, or the target. */
  max?: number
  /** Values to draw a hairline at — `[50, 75, 100]`. */
  gridlines?: number[]
  /** A dashed rule across the plot — a target, a baseline, an average. */
  target?: BarTarget
  height?: number
  color?: string
  /** Colour for the column the story is about. Defaults to `color`. Single series only. */
  highlightColor?: string
  /**
   * Which column (or group) carries the emphasis. The rest are drawn lighter.
   *
   * A single series defaults to the most recent. A grouped chart defaults to
   * none, because there the comparison is inside each group, not between them.
   * `null` says none outright.
   */
  highlightIndex?: number | null
  /**
   * Which columns get a value on the cap.
   *
   * `last` by default — the emphasised column or group. A number on every
   * column stops being a label and becomes texture; the gridlines carry the rest.
   */
  labelMode?: "last" | "all" | "none"
  caption?: React.ReactNode
  /**
   * `default` caps columns at 24px so the band's leftover is air. `comparison`
   * is the answer-card form: columns take two thirds of their band, so they
   * grow with the card from 280px to 720px, stand on a baseline with square
   * caps, and carry their values in the muted text colour.
   */
  variant?: "default" | "comparison"
  /** Names the dashed plan columns in the legend — `plan`. */
  planLabel?: React.ReactNode
}

interface Mark {
  plan?: number
  value: number
  display: React.ReactNode
  color: string
}

const isGrouped = (d: ColumnDatum): d is GroupedColumnDatum =>
  "values" in d && Array.isArray(d.values)

/**
 * One measure over a few periods, or a few series side by side per group.
 *
 * Vertical because the x-axis is time and time reads left to right. Columns are
 * capped at 24px and separated by real gaps, so the band's leftover is air
 * rather than a fatter bar; columns in a group touch but for a 2px gap.
 *
 * Rule labels — gridlines and the target — sit in a gutter at the right that is
 * as wide as the longest of them, so a label never sits on a column however
 * narrow the chart. One series needs no legend (`caption` says what is
 * plotted); two or more get one, with the target in it.
 */
export const BarChartV = React.forwardRef<HTMLDivElement, BarChartVProps>(
  (
    {
      data,
      series,
      max,
      gridlines = [],
      target,
      height = 160,
      color = "var(--color-data-1)",
      highlightColor,
      highlightIndex,
      labelMode = "last",
      caption,
      variant = "default",
      planLabel,
      className,
      ...props
    },
    ref,
  ) => {
    const grouped = data.some(isGrouped)
    const seriesColor = (k: number) =>
      series?.[k]?.color ?? (k === 0 ? color : `var(--color-data-${k + 1})`)

    const emphasis =
      highlightIndex === undefined
        ? grouped
          ? undefined
          : data.length - 1
        : (highlightIndex ?? undefined)
    const marks: Mark[][] = data.map((d, i) =>
      isGrouped(d)
        ? d.values.map((value, k) => ({
            value,
            display: d.display?.[k] ?? value,
            color: seriesColor(k),
          }))
        : [
            {
              plan: d.plan,
              value: d.value,
              display: d.display ?? d.value,
              color: i === emphasis ? (highlightColor ?? color) : color,
            },
          ],
    )

    const largest = Math.max(
      0,
      ...marks.flat().map((m) => Math.max(m.value, m.plan ?? 0)),
      target?.value ?? 0,
    )
    const planned = marks.some((g) => g.some((m) => m.plan != null))
    const ceiling = max ?? (largest || 1)
    const labelled = (i: number) =>
      labelMode === "all" || (labelMode === "last" && i === emphasis)
    const at = (v: number) => `${(v / ceiling) * 100}%`
    const comparison = variant === "comparison"

    const legend = (series != null && series.length > 1) || (planned && planLabel != null)
    const rules = [
      ...gridlines.map((g) => ({ key: `g${g}`, value: g, label: g as React.ReactNode })),
      // With a legend the target is named there, and a gutter label would only
      // take width from the plot.
      ...(target?.label != null && !legend
        ? [{ key: "target", value: target.value, label: target.label }]
        : []),
    ]

    return (
      <div ref={ref} className={cn("flex flex-col gap-1", className)} {...props}>
        {caption != null ? (
          <span className="text-sm text-muted-foreground">{caption}</span>
        ) : null}

        {/* `mt-2` is headroom: a rule's label is centred on its line, so half
            of the topmost one sits above the plot box and would otherwise
            collide with the caption. */}
        <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] gap-y-1">
          <div className="relative" style={{ height }}>
            {gridlines.map((g) => (
              <span
                key={g}
                aria-hidden
                className="absolute inset-x-0 h-px bg-border"
                style={{ bottom: at(g) }}
              />
            ))}

            {comparison ? (
              <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-border" />
            ) : null}

            <div className="absolute inset-0 flex items-end justify-between gap-2">
              {marks.map((group, i) => (
                <div key={i} className="flex h-full min-w-0 flex-1 justify-center">
                  <div
                    className={cn(
                      "flex h-full min-w-0 items-end justify-center gap-0.5",
                      comparison ? "w-2/3" : "w-full",
                    )}
                  >
                    {group.map((m, k) => (
                      <div
                        key={k}
                        className={cn(
                          "relative flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1",
                          !comparison && "max-w-6",
                        )}
                      >
                        {m.plan != null ? (
                          <span
                            aria-hidden
                            className="absolute inset-x-0 bottom-0 border border-dashed border-muted-foreground"
                            style={{ height: `${Math.max(0, (m.plan / ceiling) * 100)}%` }}
                          />
                        ) : null}
                        {labelled(i) ? (
                          <span
                            className={cn(
                              "text-sm whitespace-nowrap tabular-nums",
                              comparison && "text-muted-foreground",
                            )}
                          >
                            {m.display}
                          </span>
                        ) : null}
                        <span
                          title={`${textOf(data[i]!.label)}: ${textOf(m.display)}`}
                          className={cn(
                            m.plan != null ? "relative w-2/3" : "w-full",
                            !comparison && "rounded-t-[4px]",
                          )}
                          style={{
                            height: `${Math.max(0, (m.value / ceiling) * 100)}%`,
                            background: m.color,
                            opacity: emphasis == null || i === emphasis ? 1 : 0.55,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Drawn over the columns: a target is read against them, so it
                must not disappear behind the one that clears it. */}
            {target ? (
              <span
                aria-hidden
                className="absolute inset-x-0 border-t border-dashed"
                style={{
                  bottom: at(target.value),
                  borderColor: target.color ?? "var(--color-muted-foreground)",
                }}
              />
            ) : null}
          </div>

          <div className="relative">
            {/* Invisible copies size the gutter to its longest label. */}
            {rules.map((r) => (
              <span
                key={r.key}
                aria-hidden
                className="invisible block h-0 pl-1 text-sm whitespace-nowrap"
              >
                {r.label}
              </span>
            ))}
            {rules.map((r) => (
              <span
                key={r.key}
                className="absolute left-0 translate-y-1/2 pl-1 text-sm whitespace-nowrap tabular-nums text-muted-foreground"
                style={{ bottom: at(r.value) }}
              >
                {r.label}
              </span>
            ))}
          </div>

          <div className="flex justify-between gap-2">
            {data.map((d, i) => (
              <div key={i} className="flex min-w-0 flex-1 flex-col items-center">
                <span className="truncate text-sm text-muted-foreground">
                  {d.label}
                </span>
                {d.sublabel != null ? (
                  <span className="truncate text-sm text-muted-foreground/70">
                    {d.sublabel}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {legend ? (
          <Legend>
            {(series ?? []).map((s, k) => (
              <LegendItem key={k} kind="box" color={seriesColor(k)} label={s.name} />
            ))}
            {planned && planLabel != null ? (
              <LegendItem kind="outline" color="var(--color-muted-foreground)" label={planLabel} />
            ) : null}
            {target?.label != null ? (
              <LegendItem
                kind="dashed"
                color={target.color ?? "var(--color-muted-foreground)"}
                label={target.label}
              />
            ) : null}
          </Legend>
        ) : null}
      </div>
    )
  },
)
BarChartV.displayName = "BarChartV"

function textOf(node: React.ReactNode): string {
  return typeof node === "string" || typeof node === "number" ? String(node) : ""
}
