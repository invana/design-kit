import * as React from "react"
import { Badge, Gantt, type ExpandedKeys, type GanttRow } from "@invana/ui"

import { BADGE_TONE } from "../format"
import type { BlockProps, GanttSpecBar, GanttSpecRow } from "../types"

/** The tasks drawn open at first, by key — every task the spec marks `open`. */
const openKeys = (tasks: GanttSpecRow[]): Record<string, boolean> =>
  Object.fromEntries(
    tasks.flatMap((t) => [...(t.open ? [[t.key, true] as const] : []), ...Object.entries(openKeys(t.subtasks ?? []))]),
  )

/** A bar's chip, as the badge the JSON names. */
const toBar = ({ chip, ...bar }: GanttSpecBar) => ({
  ...bar,
  chip: chip ? (
    <Badge variant="soft" tone={BADGE_TONE[chip.tone ?? "neutral"]}>
      {chip.label}
    </Badge>
  ) : undefined,
})

/** A plan read in order counts steps, not milliseconds. */
const STEP_TICK = (n: number) => `step ${Math.round(n)}`
const STEPS = (n: number) => (Math.round(n) === 1 ? "1 step" : `${Math.round(n)} steps`)

/**
 * The spec's words as the Gantt's: a task is a row, its `subtasks` the rows it
 * opens into, its `segments` the bars it holds — the open flag left behind.
 */
const toRow = ({ open: _open, subtasks, segments, ...task }: GanttSpecRow): GanttRow => ({
  ...task,
  bars: segments?.map(toBar),
  rows: subtasks?.map(toRow),
})

/**
 * Where a run's time went: one row per task on the run's own clock, a retry's
 * failed attempt to the left of the one that stuck, a task that never ran as an
 * outline. A task that split into others opens into them; one with no timing of
 * its own draws the stretch they cover. Hover a row for what it produced; pick
 * one and it is sent as `select` with the task's key.
 *
 * A row's `segments` are many bars on one row — what a worker slot held, what a
 * layer was reached for — painted by `palette`. A keyed bar is picked on its
 * own and sent as `select` with its key. With `scale: "seq"` the clock counts a
 * plan's steps, so the same drawing reads a plan before it runs.
 */
export function GanttBlock({ spec, onAction }: BlockProps<"gantt">) {
  const [selected, setSelected] = React.useState<string | null>(spec.selected ?? null)
  const [expanded, setExpanded] = React.useState<ExpandedKeys>(() => openKeys(spec.tasks))
  const rows = React.useMemo(() => spec.tasks.map(toRow), [spec.tasks])
  const pick = (key: string) => {
    setSelected(key)
    onAction?.("select", key)
  }

  return (
    <Gantt
      rows={rows}
      spanMs={spec.spanMs}
      nowMs={spec.nowMs}
      openEnded={spec.openEnded}
      ticks={spec.ticks}
      formatTick={spec.scale === "seq" ? STEP_TICK : undefined}
      formatDuration={spec.scale === "seq" ? STEPS : undefined}
      labelWidth={spec.labelWidth}
      durationWidth={spec.durationWidth}
      palette={spec.palette}
      seams={spec.seams}
      density={spec.density}
      expanded={expanded}
      onExpandedChange={setExpanded}
      selectedKey={selected}
      onSelectRow={onAction ? pick : undefined}
      onSelectBar={onAction ? pick : undefined}
    />
  )
}
