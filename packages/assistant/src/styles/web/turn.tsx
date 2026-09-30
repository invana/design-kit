import * as React from "react"

import { type PresetRegistry, resolveRegistry } from "../../conversations/registry"
import { ChatSessionMessage } from "../../conversations/thread"
import type { ConversationEvent } from "../../protocol/events"
import type { Turn } from "../../protocol/types"
import { AskView } from "../base/ask"
import { ChatSessionContext, type ChatSessionContextValue, DEFAULT_ICONS, useViewState } from "../base/context"
import { WebAnswer } from "./web-session"

export interface ChatSessionTurnProps {
  turn: Turn
  onEvent?: (event: ConversationEvent) => void
  registry?: PresetRegistry
  /** The clock an answered ask's time is read against, in ms. Defaults to the time of render. */
  now?: number
}

/**
 * One turn on its own, as the web variant draws it — the analyst's prompt,
 * an ask in its frame, or an answer's cards — without the thread around it.
 * For a preset's board, where each cell is one turn.
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
    stepsOpen: view.stepsOpen,
    toggleSteps: view.toggleSteps,
    recordOpen: view.recordOpen,
    toggleRecord: view.toggleRecord,
    rating: view.rating,
    rate: view.setRating,
    view: "chat",
    setView: () => {},
    scrollToTurn: () => {},
    focusComposer: () => {},
    setComposer: () => {},
  }
  return (
    <ChatSessionContext.Provider value={context}>
      {turn.role === "analyst" ? (
        <ChatSessionMessage role="user">{turn.text}</ChatSessionMessage>
      ) : turn.kind === "ask" ? (
        <AskView turn={turn} registry={resolved} onEvent={emit} now={context.now} />
      ) : (
        <WebAnswer turn={turn} chrome={false} />
      )}
    </ChatSessionContext.Provider>
  )
}
