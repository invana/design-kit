import * as React from "react"

import { type RegistryOverrides, resolveRegistry } from "../../conversations/registry"
import type { ConversationEvent } from "../../protocol/events"
import type { Turn } from "../../protocol/types"
import { AskView } from "../base/ask"
import { ChatSessionContext, type ChatSessionContextValue, DEFAULT_ICONS, useViewState } from "../base/context"
import { WebAnswer } from "./web-session"

export interface ChatSessionTurnProps {
  turn: Turn
  onEvent?: (event: ConversationEvent) => void
  registry?: RegistryOverrides
  /** The clock an answered ask's time is read against, in ms. Defaults to the time of render. */
  now?: number
}

/**
 * One turn on its own, as the session draws it — the analyst's prompt,
 * an ask in its frame, or an answer's steps and blocks — without the thread around it.
 * For a block's board, where each cell is one turn.
 */
export function ChatSessionTurn({ turn, onEvent, registry, now }: ChatSessionTurnProps) {
  const resolved = React.useMemo(() => resolveRegistry(registry), [registry])
  const view = useViewState()
  const [clock] = React.useState(() => now ?? Date.now())
  const emit = React.useCallback((event: ConversationEvent) => onEvent?.(event), [onEvent])
  const context: ChatSessionContextValue = {
    spec: { id: `turn-${turn.id}`, turns: [turn] },
    registry: resolved,
    emit,
    icons: DEFAULT_ICONS,
    now: now ?? clock,
    opensRuns: false,
    canHistory: false,
    canNew: false,
    stepsOpen: view.stepsOpen,
    toggleSteps: view.toggleSteps,
    setSteps: (turnId, open) => {
      view.toggleSteps(turnId, open)
      emit({ type: "toggle-steps", turn: turnId, open })
    },
    actions: [],
    reportOpen: view.reportOpen,
    toggleReport: view.toggleReport,
    recordOpen: view.recordOpen,
    toggleRecord: view.toggleRecord,
    rating: view.rating,
    rate: view.setRating,
    scrollToTurn: () => {},
    focusComposer: () => {},
    setComposer: () => {},
  }
  return (
    <ChatSessionContext.Provider value={context}>
      {turn.role === "analyst" ? (
        <div className="w-fit max-w-full rounded-control border border-border bg-card px-3.5 py-2.5 whitespace-pre-wrap">{turn.text}</div>
      ) : turn.kind === "ask" ? (
        <AskView turn={turn} registry={resolved} onEvent={emit} now={context.now} />
      ) : (
        <WebAnswer turn={turn} chrome={false} />
      )}
    </ChatSessionContext.Provider>
  )
}
