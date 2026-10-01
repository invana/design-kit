import * as React from "react"

/*
 * Which source the reader is on, per answer. A marker in the prose and a row in
 * the citations are separate blocks, so they meet here, keyed by the turn: point
 * at marker 2 and row 2 lights with it.
 */
const focus = new Map<string, number | undefined>()
const listeners = new Set<() => void>()

function set(turn: string, n: number | undefined) {
  if (focus.get(turn) === n) return
  focus.set(turn, n)
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** The source lit in this answer: the one pointed at, else the one the spec names. */
export function useCiteFocus(turn: string, initial?: number): [number | undefined, (n: number | undefined) => void] {
  const pointed = React.useSyncExternalStore(
    subscribe,
    () => focus.get(turn),
    () => undefined,
  )
  return [pointed ?? initial, (n) => set(turn, n)]
}
