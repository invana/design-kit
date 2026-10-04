import * as React from "react"
import { Badge, Gantt, type ExpandedKeys, type GanttRow } from "@invana/ui"

import { BADGE_TONE } from "../format"
import type { BlockProps, GanttSpecBar, GanttSpecRow } from "../types"

/** The tasks drawn open at first, by key — every task the spec marks `open`. */
const openKeys = (tasks: GanttSpecRow[]): Record<string, boolean> =>
  Object.fromEntries(
    tasks.flatMap((t) => [...(t.open ? [[t.key, true] as const] : []), ...Object.entries(openKeys(t.subtasks ?? []))]),
  )

/** Every task's key, nested ones too. */
const allKeys = (tasks: GanttSpecRow[]): string[] => tasks.flatMap((t) => [t.key, ...allKeys(t.subtasks ?? [])])

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
 * plan's steps, so the same drawing reads a plan before it runs. The reader opens
 * and closes rows; a spec whose `open` flags change opens and closes them again.
 */
export function GanttBlock({ spec, onAction }: BlockProps<"gantt">) {
  const [selected, setSelected] = React.useState<string | null>(spec.selected ?? null)
  const [expanded, setExpanded] = React.useState<ExpandedKeys>(() => openKeys(spec.tasks))
  // Two ways the spec opens rows. A task that streams in marked `open` opens, and the rows the
  // reader opened or closed keep their choice. A patch that changes the `open` flags of tasks
  // already drawn (an `Expand all`) wins again, compared by the keys it opens, so a new spec
  // object with the same flags (a selection moved) leaves the reader's rows alone.
  const keys = allKeys(spec.tasks)
  const flagged = openKeys(spec.tasks)
  const openedAmong = (among: string[]) => among.filter((key) => flagged[key]).sort().join("\n")
  const [seen, setSeen] = React.useState(() => new Set(keys))
  const [lastOpened, setLastOpened] = React.useState(() => openedAmong(keys))
  const fresh = keys.filter((key) => !seen.has(key))
  const reflagged = openedAmong(keys.filter((key) => seen.has(key))) !== lastOpened
  if (fresh.length || reflagged) {
    setSeen(new Set(keys))
    setLastOpened(openedAmong(keys))
    if (reflagged) setExpanded(flagged)
    else {
      const arrived = fresh.filter((key) => flagged[key])
      if (arrived.length)
        setExpanded((e) => (e === true ? e : { ...e, ...Object.fromEntries(arrived.map((k) => [k, true])) }))
    }
  }
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
