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

import { cn, ExpandToggle, type ExpandedKeys, useExpandedKeys } from "@invana/ui"

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

/** One labelled strip, and the strips it opens into — a schedule, then each of its jobs. */
export interface HeatStripRow {
  key: string
  label: React.ReactNode
  cells: HeatCell[]
  /** Drawn under it, indented, when it is open. */
  children?: HeatStripRow[]
}

export interface HeatStripProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** One strip. Pass this or `rows`. */
  cells?: HeatCell[]
  /** Labelled strips over one axis, each opening into its `children`. Pass this or `cells`. */
  rows?: HeatStripRow[]
  states: HeatState[]
  /** Axis ticks under the strip — `[{at: 0, label: '09'}, …]`. */
  ticks?: { at: number; label: React.ReactNode }[]
  cellSize?: number
  /** The label column of `rows`, in px. Defaults to its longest label, up to 40%. */
  labelWidth?: number
  /** Which rows with `children` are open, by key — `true` for all. Controlled. */
  expanded?: ExpandedKeys
  /** Which are open at first, uncontrolled. Closed by default. */
  defaultExpanded?: ExpandedKeys
  onExpandedChange?: (expanded: ExpandedKeys) => void
}

const INDENT = 12

const everyRow = (rows: HeatStripRow[]): HeatStripRow[] =>
  rows.flatMap((r) => [r, ...everyRow(r.children ?? [])])

/** One strip of squares — the whole of a plain strip, or one row of `rows`. */
function Cells({
  cells,
  byKey,
  cellSize,
  className,
}: {
  cells: HeatCell[]
  byKey: Map<string, HeatState>
  cellSize: number
  className?: string
}) {
  return (
    <div className={cn("flex gap-1", className)}>
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
  )
}

function Ticks({
  count,
  ticks,
  cellSize,
  className,
}: {
  count: number
  ticks: { at: number; label: React.ReactNode }[]
  cellSize: number
  className?: string
}) {
  return (
    <div className={cn("flex gap-1", className)} aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const tick = ticks.find((t) => t.at === i)
        return (
          <span
            key={i}
            className="shrink-0 text-sm tabular-nums text-muted-foreground"
            style={{ width: cellSize }}
          >
            {tick ? tick.label : ""}
          </span>
        )
      })}
    </div>
  )
}

/**
 * A run of firings, one square each, in time order.
 *
 * A schedule's day: twenty-one firings, most served, one skipped, one that could
 * not answer. The shape of the day is the point — a reader sees the run of green
 * and the one square that is not, without reading any of them.
 *
 * `rows` draws several strips over one axis, each labelled, and a row opens into
 * its `children` — an agent into its tasks, a schedule into its jobs — so the one
 * red square can be followed down to the part that went red.
 *
 * These are **status** colours, so they are reserved and never stand in for
 * categories. The legend is mandatory rather than optional: a square carries no
 * label of its own, so without the legend the strip would be colour-alone. Each
 * cell also names its state in the hover title, which is what a screen reader
 * and a keyboard user get.
 */
export const HeatStrip = React.forwardRef<HTMLDivElement, HeatStripProps>(
  (
    {
      cells,
      rows,
      states,
      ticks,
      cellSize = 14,
      labelWidth,
      expanded,
      defaultExpanded,
      onExpandedChange,
      className,
      ...props
    },
    ref,
  ) => {
    const byKey = React.useMemo(
      () => new Map(states.map((s) => [s.key, s])),
      [states],
    )
    const parents = everyRow(rows ?? [])
      .filter((r) => r.children?.length)
      .map((r) => r.key)
    const nested = parents.length > 0
    const { isOpen, toggle } = useExpandedKeys({
      expanded,
      defaultExpanded,
      onExpandedChange,
      keys: parents,
    })

    const shown: { row: HeatStripRow; depth: number }[] = []
    const walk = (list: HeatStripRow[], depth: number) => {
      for (const row of list) {
        shown.push({ row, depth })
        if (row.children?.length && isOpen(row.key)) walk(row.children, depth + 1)
      }
    }
    walk(rows ?? [], 0)
    const count = Math.max(cells?.length ?? 0, ...shown.map((r) => r.row.cells.length))

    return (
      <div ref={ref} className={cn("flex flex-col gap-1.5", className)} {...props}>
        {rows ? (
          <div
            className="grid items-center gap-x-2 gap-y-1"
            style={{
              gridTemplateColumns: `${labelWidth != null ? `${labelWidth}px` : "fit-content(40%)"} minmax(0, 1fr)`,
            }}
          >
            {shown.map(({ row, depth }) => {
              const kids = (row.children?.length ?? 0) > 0
              const open = kids && isOpen(row.key)
              return (
                <React.Fragment key={row.key}>
                  <span
                    className={cn("flex min-w-0 items-center gap-1 text-sm", depth > 0 && "text-muted-foreground")}
                    style={{ paddingLeft: depth * INDENT }}
                  >
                    {kids ? (
                      <ExpandToggle
                        open={open}
                        label={typeof row.label === "string" ? row.label : row.key}
                        onClick={() => toggle(row.key)}
                      />
                    ) : nested ? (
                      <ExpandToggle.Spacer />
                    ) : null}
                    <span className="min-w-0 truncate">{row.label}</span>
                  </span>
                  <Cells
                    cells={row.cells}
                    byKey={byKey}
                    cellSize={cellSize}
                    className="min-w-0 overflow-hidden"
                  />
                </React.Fragment>
              )
            })}
            {ticks?.length ? (
              <>
                <span />
                <Ticks count={count} ticks={ticks} cellSize={cellSize} className="min-w-0 overflow-hidden" />
              </>
            ) : null}
          </div>
        ) : (
          <>
            <Cells cells={cells ?? []} byKey={byKey} cellSize={cellSize} className="flex-wrap" />
            {ticks?.length ? (
              <Ticks count={count} ticks={ticks} cellSize={cellSize} className="flex-wrap" />
            ) : null}
          </>
        )}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
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
