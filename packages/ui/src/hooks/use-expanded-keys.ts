import * as React from "react"

/**
 * Which rows of a tree are open, by key — `true` for every one. The same shape
 * as a `DataTable`'s `expanded`, so a page holding both passes one value.
 */
export type ExpandedKeys = true | Record<string, boolean>

export interface UseExpandedKeysOptions {
  /** Controlled. Pair it with `onExpandedChange`. */
  expanded?: ExpandedKeys
  /** Uncontrolled: what is open at first. Closed by default. */
  defaultExpanded?: ExpandedKeys
  onExpandedChange?: (expanded: ExpandedKeys) => void
  /** Every key that can open, so closing one row of `true` keeps the rest open. */
  keys: string[]
}

/**
 * Open and close the rows of a tree, controlled or not. What a chart drawn as
 * rows uses to nest — a Gantt's subtasks, a heat strip's children — so each
 * opens the same way and reports the same value.
 */
export function useExpandedKeys({
  expanded,
  defaultExpanded,
  onExpandedChange,
  keys,
}: UseExpandedKeysOptions) {
  const [own, setOwn] = React.useState<ExpandedKeys>(defaultExpanded ?? {})
  const state = expanded ?? own
  const isOpen = (key: string) => state === true || state[key] === true
  const toggle = (key: string) => {
    const map = state === true ? Object.fromEntries(keys.map((k) => [k, true])) : state
    const next = { ...map, [key]: !isOpen(key) }
    if (expanded === undefined) setOwn(next)
    onExpandedChange?.(next)
  }
  return { isOpen, toggle }
}
