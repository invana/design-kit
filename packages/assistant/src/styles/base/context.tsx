import * as React from "react"

import type { ResolvedRegistry } from "../../conversations/registry"
import type { ConversationEvent } from "../../protocol/events"
import type { ConversationSpec } from "../../protocol/types"
import type { ChatSessionIcons, ChatSessionView } from "../types"

/**
 * Everything a variant's parts read, so no part takes more than its turn as a
 * prop. The spec is data; the rest is how the session is being looked at —
 * which steps are open, which view — and never goes back to the API.
 */
export interface ChatSessionContextValue {
  spec: ConversationSpec
  registry: ResolvedRegistry
  emit: (event: ConversationEvent) => void
  icons: ChatSessionIcons
  now: number
  /** Whether the host opens runs itself (`onOpenRun`); if not, the time opens the steps in place. */
  opensRuns: boolean
  /** An answer's steps shown, or folded to one line. Unset follows the run: open while it runs. */
  stepsOpen: (turnId: string, live: boolean) => boolean
  toggleSteps: (turnId: string, open?: boolean) => void
  /** One step's record open. */
  recordOpen: (turnId: string, stepId: string) => boolean
  toggleRecord: (turnId: string, stepId: string, open?: boolean) => void
  /** A rating given here, before the spec comes back with it. */
  rating: (turnId: string) => number | undefined
  rate: (turnId: string, value: number) => void
  view: ChatSessionView
  setView: (view: ChatSessionView) => void
  scrollToTurn: (turnId: string) => void
  focusComposer: () => void
  /** The composer registers its element, so `focusComposer` can reach it. */
  setComposer: (element: HTMLDivElement | null) => void
}

export const ChatSessionContext = React.createContext<ChatSessionContextValue | null>(null)

export function useChatSessionContext(): ChatSessionContextValue {
  const value = React.useContext(ChatSessionContext)
  if (!value) throw new Error("A ChatSession part was rendered outside <ChatSession>.")
  return value
}

export const DEFAULT_ICONS: ChatSessionIcons = {
  send: "↑",
  stop: "■",
  attach: "+",
  close: "×",
  retry: "↻",
  copy: "⧉",
  steps: "≡",
  rateUp: "+1",
  rateDown: "−1",
}

/**
 * The session's own view state: open steps, open records, ratings given, the
 * view. Keyed by turn and step id, so it survives every patch.
 */
export function useViewState() {
  const [steps, setSteps] = React.useState<Record<string, boolean>>({})
  const [records, setRecords] = React.useState<Record<string, boolean>>({})
  const [ratings, setRatings] = React.useState<Record<string, number>>({})

  const stepsOpen = React.useCallback((turnId: string, live: boolean) => steps[turnId] ?? live, [steps])
  const toggleSteps = React.useCallback(
    (turnId: string, open?: boolean) =>
      setSteps((prev) => ({ ...prev, [turnId]: open ?? !(prev[turnId] ?? false) })),
    [],
  )
  const recordOpen = React.useCallback(
    (turnId: string, stepId: string) => !!records[`${turnId}/${stepId}`],
    [records],
  )
  const toggleRecord = React.useCallback((turnId: string, stepId: string, open?: boolean) => {
    const key = `${turnId}/${stepId}`
    setRecords((prev) => ({ ...prev, [key]: open ?? !prev[key] }))
  }, [])
  const rating = React.useCallback((turnId: string) => ratings[turnId], [ratings])
  const setRating = React.useCallback(
    (turnId: string, value: number) => setRatings((prev) => ({ ...prev, [turnId]: value })),
    [],
  )
  return { stepsOpen, toggleSteps, recordOpen, toggleRecord, rating, setRating }
}

/** The clock: the given one, or one that ticks while `live`. */
export function useClock(fixed: number | undefined, live: boolean, every = 250): number {
  const [now, setNow] = React.useState(() => fixed ?? Date.now())
  React.useEffect(() => {
    if (fixed !== undefined || !live) return
    const timer = setInterval(() => setNow(Date.now()), every)
    return () => clearInterval(timer)
  }, [fixed, live, every])
  return fixed ?? now
}
