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

export interface HeatCell {
  /** When this cell is — `09:45`. Used in the hover title. */
  at: React.ReactNode
  /** Which state key this cell is in. Must exist in `states`. */
  state: string
  /** Extra detail for the hover title — `2 names: BPCL, HINDPETRO`. */
  detail?: React.ReactNode
}

export interface HeatState {
  key: string
  /** What the state is called. Shown in the legend and the hover title. */
  label: React.ReactNode
  color?: string
  /** Renders as a ring rather than a fill — for "nothing happened here". */
  hollow?: boolean
}

export interface HeatStripProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  cells: HeatCell[]
  states: HeatState[]
  /** Axis ticks under the strip — `[{at: 0, label: '09'}, …]`. */
  ticks?: { at: number; label: React.ReactNode }[]
  cellSize?: number
}

/**
 * A run of firings, one square each, in time order.
 *
 * A schedule's day: twenty-one firings, most served, one skipped, one that could
 * not answer. The shape of the day is the point — a reader sees the run of green
 * and the one square that is not, without reading any of them.
 *
 * These are **status** colours, so they are reserved and never stand in for
 * categories. The legend is mandatory rather than optional: a square carries no
 * label of its own, so without the legend the strip would be colour-alone. Each
 * cell also names its state in the hover title, which is what a screen reader
 * and a keyboard user get.
 */
export const HeatStrip = React.forwardRef<HTMLDivElement, HeatStripProps>(
  ({ cells, states, ticks, cellSize = 14, className, ...props }, ref) => {
    const byKey = React.useMemo(
      () => new Map(states.map((s) => [s.key, s])),
      [states],
    )
    return (
      <div ref={ref} className={cn("flex flex-col gap-1.5", className)} {...props}>
        <div className="flex flex-wrap gap-1">
          {cells.map((c, i) => {
            const s = byKey.get(c.state)
            return (
              <span
                key={i}
                title={`${c.at} · ${s?.label ?? c.state}${c.detail ? ` · ${c.detail}` : ""}`}
                className={cn("shrink-0 rounded-[2px]", s?.hollow && "border")}
                style={{
                  width: cellSize,
                  height: cellSize,
                  background: s?.hollow ? "transparent" : (s?.color ?? "var(--color-muted)"),
                  borderColor: s?.hollow ? (s.color ?? "var(--color-border)") : undefined,
                }}
              />
            )
          })}
        </div>

        {ticks?.length ? (
          <div className="flex flex-wrap gap-1" aria-hidden>
            {cells.map((_, i) => {
              const tick = ticks.find((t) => t.at === i)
              return (
                <span
                  key={i}
                  className="shrink-0 text-meta tabular-nums text-muted-foreground"
                  style={{ width: cellSize }}
                >
                  {tick ? tick.label : ""}
                </span>
              )
            })}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-meta">
          {states.map((s) => (
            <span key={s.key} className="flex items-center gap-1.5">
              <span
                aria-hidden
                className={cn("size-2.5 shrink-0 rounded-[2px]", s.hollow && "border")}
                style={{
                  background: s.hollow ? "transparent" : (s.color ?? "var(--color-muted)"),
                  borderColor: s.hollow ? (s.color ?? "var(--color-border)") : undefined,
                }}
              />
              <span className="text-muted-foreground">{s.label}</span>
            </span>
          ))}
        </div>
      </div>
    )
  },
)
HeatStrip.displayName = "HeatStrip"
