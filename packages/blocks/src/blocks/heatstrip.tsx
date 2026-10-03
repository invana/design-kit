import * as React from "react"
import { HeatStrip, type HeatStripRow, type HeatState } from "@invana/charts"

import type { BlockProps, HeatStripRowOptions, Tone } from "../types"

/** The grammar's tones, as the status colours a square is drawn in. */
const COLOR: Record<Tone, string> = {
  good: "var(--color-success)",
  bad: "var(--color-destructive)",
  warn: "var(--color-warning)",
  neutral: "var(--color-muted-foreground)",
}

const toRow = ({ id, label, cells, children }: HeatStripRowOptions): HeatStripRow => ({
  key: id,
  label,
  cells,
  children: children?.map(toRow),
})

const openKeys = (rows: HeatStripRowOptions[]): Record<string, boolean> =>
  Object.fromEntries(
    rows.flatMap((r) => [...(r.open ? [[r.id, true] as const] : []), ...Object.entries(openKeys(r.children ?? []))]),
  )

/**
 * A run of firings, one square each, in time order — a schedule's day, most
 * green and the one that is not. With `rows`, several strips over one axis, and
 * a row opens into its children, so the red square can be followed down to the
 * job that went red. The legend is always drawn: a square has no label of its own.
 */
export function HeatStripBlock({ spec }: BlockProps<"heatstrip">) {
  const states = React.useMemo<HeatState[]>(
    () => spec.states.map((s) => ({ key: s.key, label: s.label, hollow: s.hollow, color: COLOR[s.tone ?? "neutral"] })),
    [spec.states],
  )
  const rows = React.useMemo(() => spec.rows?.map(toRow), [spec.rows])
  const defaultExpanded = React.useMemo(() => openKeys(spec.rows ?? []), [spec.rows])

  return (
    <HeatStrip
      cells={spec.cells}
      rows={rows}
      states={states}
      ticks={spec.ticks}
      defaultExpanded={defaultExpanded}
    />
  )
}
