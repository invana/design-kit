import * as React from "react"
import { TaskGantt, type ExpandedKeys, type TaskGanttTask } from "@invana/ui"

import type { BlockProps, GanttTask } from "../types"

/** The tasks drawn open at first, by key — every task the spec marks `open`. */
const openKeys = (tasks: GanttTask[]): Record<string, boolean> =>
  Object.fromEntries(
    tasks.flatMap((t) => [...(t.open ? [[t.key, true] as const] : []), ...Object.entries(openKeys(t.subtasks ?? []))]),
  )

/** The JSON's words as the Gantt's task — the same fields, with the open flag left behind. */
const toTask = ({ open: _open, subtasks, ...task }: GanttTask): TaskGanttTask => ({
  ...task,
  subtasks: subtasks?.map(toTask),
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
 * own and sent as `select` with its key.
 */
export function GanttBlock({ spec, onAction }: BlockProps<"gantt">) {
  const [selected, setSelected] = React.useState<string | null>(spec.selected ?? null)
  const [expanded, setExpanded] = React.useState<ExpandedKeys>(() => openKeys(spec.tasks))
  const tasks = React.useMemo(() => spec.tasks.map(toTask), [spec.tasks])
  const pick = (key: string) => {
    setSelected(key)
    onAction?.("select", key)
  }

  return (
    <TaskGantt
      tasks={tasks}
      spanMs={spec.spanMs}
      nowMs={spec.nowMs}
      openEnded={spec.openEnded}
      ticks={spec.ticks}
      labelWidth={spec.labelWidth}
      durationWidth={spec.durationWidth}
      palette={spec.palette}
      seams={spec.seams}
      density={spec.density}
      expanded={expanded}
      onExpandedChange={setExpanded}
      selectedKey={selected}
      onSelectTask={onAction ? pick : undefined}
      onSelectSegment={onAction ? pick : undefined}
    />
  )
}
