import { ClarifyCard } from "../../asks"
import { Placeholder } from "../../conversations/placeholder"
import type { ResolvedRegistry } from "../../conversations/registry"
import { relativeTime } from "../../conversations/relative-time"
import { STAGES } from "../../grammar"
import type { ConversationEvent } from "../../protocol/events"
import type { AskTurn } from "../../protocol/types"

const STAGE_NAME = new Map<string, string>(STAGES.map((s) => [s.id, s.name]))
const stageName = (stage: string) => (STAGE_NAME.get(stage) ?? stage).toLowerCase()

export interface AskViewProps {
  turn: AskTurn
  registry: ResolvedRegistry
  onEvent: (event: ConversationEvent) => void
  /** The clock an answered ask's time is read against, in ms. */
  now: number
}

/**
 * An ask, drawn by whatever the registry holds for its block. Its traits say
 * how it sits: in the ask card — its state, the stage that asked, when it was
 * answered, the header word the block names — or bare, as its renderer draws
 * it. An ask with no renderer is a labelled placeholder in the card.
 */
export function AskView({ turn, registry, onEvent, now }: AskViewProps) {
  const Renderer = registry.asks[turn.ask.kind]
  const traits = registry.askTraits(turn.ask.kind)
  if (Renderer && traits.frame === "none") {
    return <Renderer turn={turn} options={turn.ask} onEvent={onEvent} />
  }
  const time =
    turn.state === "answered" && turn.answeredAt ? relativeTime(turn.answeredAt, now) : undefined
  return (
    <ClarifyCard
      state={turn.state}
      kind={traits.kind}
      step={stageName(turn.stage)}
      waiting={turn.state === "pending" ? turn.waiting : undefined}
      time={time}
    >
      {Renderer ? (
        <Renderer turn={turn} options={turn.ask} onEvent={onEvent} />
      ) : (
        <Placeholder kind={turn.ask.kind} options={turn.ask} />
      )}
    </ClarifyCard>
  )
}
