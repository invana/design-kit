import * as React from "react"

import type { ConversationEvent } from "../protocol/events"
import type { ConversationSpec, Turn } from "../protocol/types"
import { ConversationTurn } from "./conversation-turn"
import { type PresetRegistry, resolveRegistry } from "./registry"
import { ChatSession, ChatSessionComposer } from "./thread"
import { TurnLabel } from "./turn-label"

export interface ConversationProps {
  /** The whole conversation, as data. Controlled: patch it with `applyPatch`. */
  spec: ConversationSpec
  /**
   * Everything the analyst does — a prompt, a reply, an approval — as a
   * {@link ConversationEvent}. The component changes nothing itself.
   */
  onEvent?: (event: ConversationEvent) => void
  /** Renderers to add or replace, merged over the built-ins. */
  registry?: PresetRegistry
  /** The composer's placeholder. */
  placeholder?: string
  /** Icon-agnostic: pass your own send and stop glyphs. */
  sendIcon?: React.ReactNode
  stopIcon?: React.ReactNode
  /** Shown when the spec has no turns yet. */
  emptyState?: React.ReactNode
  /** The clock answered asks' times are read against, in ms. Defaults to the time of render. */
  now?: number
  className?: string
}

/**
 * Consecutive asks sit side by side, two at most — the grammar's limit before
 * the assistant must show something. Everything else is one turn per row.
 */
const isAsk = (turn: Turn) => turn.role === "assistant" && turn.kind === "ask"

function rows(turns: Turn[]): Turn[][] {
  const out: Turn[][] = []
  for (const turn of turns) {
    const last = out[out.length - 1]
    if (isAsk(turn) && last?.every(isAsk) && last.length < 2) last.push(turn)
    else out.push([turn])
  }
  return out
}

/**
 * A conversation with the assistant, rendered from JSON alone.
 *
 * The API sends a {@link ConversationSpec}, then patches; every turn renders
 * from the preset registry, and every action goes back through `onEvent`.
 * Nobody assembles a thread by hand — the parts stay exported for stories and
 * the odd special case, but this is how a product builds a conversation.
 */
export function Conversation({
  spec,
  onEvent,
  registry,
  placeholder,
  sendIcon,
  stopIcon,
  emptyState,
  now,
  className,
}: ConversationProps) {
  const resolved = React.useMemo(() => resolveRegistry(registry), [registry])
  const emit = React.useCallback((event: ConversationEvent) => onEvent?.(event), [onEvent])
  const [draft, setDraft] = React.useState("")

  const last = spec.turns[spec.turns.length - 1]
  const running =
    last?.role === "assistant" && last.kind === "answer" && (last.state === "running" || last.state === "partial")

  const send = () => {
    const text = draft.trim()
    if (!text) return
    emit({ type: "prompt", text })
    setDraft("")
  }

  return (
    <ChatSession
      className={className}
      autoScrollKey={spec.turns.length}
      emptyState={emptyState}
      bodyClassName="mx-auto w-full max-w-[52rem]"
      footer={
        <div className="mx-auto w-full max-w-[52rem] px-3 pb-3">
          <ChatSessionComposer
            value={draft}
            onChange={setDraft}
            onSend={send}
            onStop={() => emit({ type: "stop" })}
            isRunning={running}
            placeholder={placeholder}
            sendIcon={sendIcon}
            stopIcon={stopIcon}
          />
        </div>
      }
    >
      {rows(spec.turns).map((row) => {
        const key = row.map((t) => t.id).join("+")
        const first = row[0]!
        const turns =
          row.length === 1 ? (
            <ConversationTurn turn={first} registry={resolved} onEvent={emit} now={now} />
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {row.map((t) => (
                <ConversationTurn key={t.id} turn={t} registry={resolved} onEvent={emit} now={now} />
              ))}
            </div>
          )
        // Only when the spec names the analyst: a label on one side alone
        // would say one speaker is someone and the other is not.
        const label = !spec.analyst
          ? null
          : first.role === "analyst"
            ? <TurnLabel align="end">{spec.analyst}</TurnLabel>
            : isAsk(first)
              ? <TurnLabel>Assistant</TurnLabel>
              : null
        return label ? (
          <div key={key} className="flex flex-col gap-1">
            {label}
            {turns}
          </div>
        ) : (
          <React.Fragment key={key}>{turns}</React.Fragment>
        )
      })}
    </ChatSession>
  )
}
