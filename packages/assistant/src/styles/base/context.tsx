import * as React from "react"

import type { ResolvedRegistry } from "../../conversations/registry"
import type { ConversationEvent } from "../../protocol/events"
import type { ConversationSpec } from "../../protocol/types"
import type { ChatSessionAnswerAction, ChatSessionIcons } from "../types"

/**
 * Everything the session's parts read, so no part takes more than its turn as a
 * prop. The spec is data; the rest is how the session is being looked at —
 * which steps are open — and never goes back to the API.
 */
export interface ChatSessionContextValue {
  spec: ConversationSpec
  registry: ResolvedRegistry
  emit: (event: ConversationEvent) => void
  icons: ChatSessionIcons
  now: number
  /** Whether the host opens runs itself (`onOpenRun`); if not, the time opens the steps in place. */
  opensRuns: boolean
  /** The host shows a list of conversations (`onHistory`): the header draws History. */
  canHistory: boolean
  /** The host starts conversations (`onNewConversation`): the header draws New. */
  canNew: boolean
  /** Every step of an answer opened to its record. */
  stepsOpen: (turnId: string, live: boolean) => boolean
  toggleSteps: (turnId: string, open?: boolean) => void
  /** The analyst opened or folded an answer's steps: toggles them, and sends `toggle-steps`. */
  setSteps: (turnId: string, open: boolean) => void
  /** An answer's run report shown under it. */
  reportOpen: (turnId: string) => boolean
  toggleReport: (turnId: string, open?: boolean) => void
  /** The actions beside a settled answer's time. */
  actions: ChatSessionAnswerAction[]
  /** One step's record opened or folded on its own; unset follows the answer's steps. */
  recordOpen: (turnId: string, stepId: string) => boolean | undefined
  toggleRecord: (turnId: string, stepId: string, open?: boolean) => void
  /** A rating given here, before the spec comes back with it. */
  rating: (turnId: string) => number | undefined
  rate: (turnId: string, value: number) => void
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
  session: "◇",
  send: "↑",
  stop: "■",
  attach: "+",
  close: "×",
  retry: "↻",
  copy: "⧉",
  steps: "≡",
  history: "⟲",
  newChat: "+",
  report: "▤",
  rateUp: "+1",
  rateDown: "−1",
}

/**
 * The session's own view state: open steps, open records, ratings given.
 * Keyed by turn and step id, so it survives every patch.
 */
export function useViewState() {
  const [steps, setSteps] = React.useState<Record<string, boolean>>({})
  const [records, setRecords] = React.useState<Record<string, boolean>>({})
  const [ratings, setRatings] = React.useState<Record<string, number>>({})
  const [reports, setReports] = React.useState<Record<string, boolean>>({})

  const stepsOpen = React.useCallback((turnId: string, live: boolean) => steps[turnId] ?? live, [steps])
  // Opening or folding every step clears the rows opened one by one, so all of them follow.
  const toggleSteps = React.useCallback((turnId: string, open?: boolean) => {
    setSteps((prev) => ({ ...prev, [turnId]: open ?? !(prev[turnId] ?? false) }))
    setRecords((prev) => Object.fromEntries(Object.entries(prev).filter(([key]) => !key.startsWith(`${turnId}/`))))
  }, [])
  const recordOpen = React.useCallback(
    (turnId: string, stepId: string): boolean | undefined => records[`${turnId}/${stepId}`],
    [records],
  )
  const toggleRecord = React.useCallback((turnId: string, stepId: string, open?: boolean) => {
    const key = `${turnId}/${stepId}`
    setRecords((prev) => ({ ...prev, [key]: open ?? !prev[key] }))
  }, [])
  const reportOpen = React.useCallback((turnId: string) => !!reports[turnId], [reports])
  const toggleReport = React.useCallback(
    (turnId: string, open?: boolean) => setReports((prev) => ({ ...prev, [turnId]: open ?? !prev[turnId] })),
    [],
  )
  const rating = React.useCallback((turnId: string) => ratings[turnId], [ratings])
  const setRating = React.useCallback(
    (turnId: string, value: number) => setRatings((prev) => ({ ...prev, [turnId]: value })),
    [],
  )
  return { stepsOpen, toggleSteps, recordOpen, toggleRecord, reportOpen, toggleReport, rating, setRating }
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
