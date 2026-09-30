import { EmissionBody, EmissionCard } from "../answers"
import { ClarifyCard } from "../asks"
import { STAGES } from "../grammar"
import type { ConversationEvent } from "../protocol/events"
import type { AnswerTurn, AskTurn, BlockSpec, Turn } from "../protocol/types"
import { BlockCaption, BlockEmpty, BlockSkeleton } from "./block-status"
import { Placeholder } from "./placeholder"
import { relativeTime } from "./relative-time"
import type { ResolvedRegistry } from "./registry"
import { ChatSessionMessage } from "./thread"

export interface ConversationTurnProps {
  turn: Turn
  registry: ResolvedRegistry
  onEvent: (event: ConversationEvent) => void
  /**
   * The clock an answered ask's time is read against, in ms. Defaults to the
   * time of render; a story passes a fixed one so it reads the same every run.
   */
  now?: number
}

/**
 * Blocks that are cards of their own and sit under the answer card rather than
 * inside it: a proposal is something to approve, not part of the evidence.
 */
const OWN_CARD = new Set<string>(["proposal"])

function Block({
  block,
  turn,
  registry,
  onEvent,
}: {
  block: BlockSpec
  turn: AnswerTurn
  registry: ResolvedRegistry
  onEvent: (event: ConversationEvent) => void
}) {
  const Renderer = registry.blocks[block.preset]
  const body =
    block.status === "loading" ? (
      <BlockSkeleton preset={block.preset} />
    ) : block.status === "empty" ? (
      <BlockEmpty
        text={block.emptyText ?? "Nothing to show."}
        suggestions={block.emptySuggestions}
        onSuggest={(text) => onEvent({ type: "suggestion", turn: turn.id, text })}
      />
    ) : !Renderer ? (
      <Placeholder kind="block" preset={block.preset} options={block} />
    ) : (
      <Renderer block={block} turn={turn} onEvent={onEvent} />
    )
  // A skeleton or an empty block says it all; the line under the block is about its data.
  if (!block.caption || block.status) return body
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      {body}
      <BlockCaption text={block.caption} tone={block.captionTone} />
    </div>
  )
}

/** The envelope is drawn by the same presets a block would use, so it looks the same everywhere. */
function envelopeBlocks(turn: AnswerTurn): { top: BlockSpec[]; bottom: BlockSpec[] } {
  const env = turn.envelope
  if (!env) return { top: [], bottom: [] }
  const parts = [...(env.scope ?? []), ...(env.freshness ? [`as of ${env.freshness}`] : [])]
  const top: BlockSpec[] = parts.length ? [{ preset: "scope", parts }] : []
  const bottom: BlockSpec[] = [
    ...(env.method ? [{ preset: "method" as const, label: "method", code: env.method }] : []),
    ...(env.caveats ?? []).map((c) => ({ preset: "caveat" as const, label: c.label, text: c.text })),
  ]
  return { top, bottom }
}

function citation(turn: AnswerTurn) {
  const g = turn.envelope?.grounding
  return g ? `cite · ${g.records.toLocaleString("en-GB")}${g.noun ? ` ${g.noun}` : ""}` : undefined
}

function AnswerTurnView({
  turn,
  registry,
  onEvent,
}: {
  turn: AnswerTurn
  registry: ResolvedRegistry
  onEvent: (event: ConversationEvent) => void
}) {
  if (turn.state === "error" || turn.state === "stopped") {
    return (
      <ChatSessionMessage role="assistant" status={turn.state}>
        {turn.state === "error" ? "The answer failed." : "Stopped."}
      </ChatSessionMessage>
    )
  }

  const { top, bottom } = envelopeBlocks(turn)
  const inCard = [...top, ...turn.blocks.filter((b) => !OWN_CARD.has(b.preset)), ...bottom]
  const ownCards = turn.blocks.filter((b) => OWN_CARD.has(b.preset))
  const block = (b: BlockSpec, i: number) => (
    <Block key={`${b.preset}-${i}`} block={b} turn={turn} registry={registry} onEvent={onEvent} />
  )

  if (turn.state === "running" && !inCard.length && !turn.trace?.length) {
    return (
      <ChatSessionMessage role="assistant" status="running">
        Working
      </ChatSessionMessage>
    )
  }

  return (
    <div className="flex min-w-0 flex-col gap-2">
      {turn.trace?.length ? (
        // Live while the answer runs; once it is done, the same steps fold to one line.
        <EmissionCard kind={turn.state === "running" ? "running" : "done"}>
          <EmissionBody>
            {block({ preset: "trace", steps: turn.trace, folded: turn.state !== "running" }, 0)}
          </EmissionBody>
        </EmissionCard>
      ) : null}
      {inCard.length ? (
        <EmissionCard
          kind={turn.label ?? turn.pattern ?? "answer"}
          title={turn.title}
          citation={
            citation(turn) ??
            turn.aside ??
            // Blocks already drawn while the answer runs are still being written.
            (turn.state === "running" && !inCard.some((b) => b.status === "loading")
              ? "writing…"
              : undefined)
          }
          note={turn.state === "partial" ? turn.state : undefined}
        >
          <EmissionBody>{inCard.map(block)}</EmissionBody>
        </EmissionCard>
      ) : null}
      {ownCards.map(block)}
      {turn.suggestions?.length
        ? block({ preset: "suggestions", items: turn.suggestions }, 0)
        : null}
    </div>
  )
}

/** The header word of an ask that is not a plain question; the rest say `question`. */
const HEADER_WORD: Partial<Record<string, string>> = { confirm: "confirm", approval: "proposal" }

const STAGE_NAME = new Map<string, string>(STAGES.map((s) => [s.id, s.name]))
const stageName = (stage: string) => (STAGE_NAME.get(stage) ?? stage).toLowerCase()

/**
 * An ask renders in ClarifyCard, which draws its state and the stage that
 * asked; the preset's renderer fills the body.
 */
function AskTurnView({
  turn,
  registry,
  onEvent,
  now,
}: {
  turn: AskTurn
  registry: ResolvedRegistry
  onEvent: (event: ConversationEvent) => void
  now?: number
}) {
  const Renderer = registry.asks[turn.ask.preset]
  const time =
    turn.state === "answered" && turn.answeredAt
      ? relativeTime(turn.answeredAt, now ?? Date.now())
      : undefined
  return (
    <ClarifyCard
      state={turn.state}
      kind={HEADER_WORD[turn.ask.preset]}
      step={stageName(turn.stage)}
      waiting={turn.state === "pending" ? turn.waiting : undefined}
      time={time}
    >
      {Renderer ? (
        <Renderer turn={turn} options={turn.ask} onEvent={onEvent} />
      ) : (
        <Placeholder kind="ask" preset={turn.ask.preset} options={turn.ask} />
      )}
    </ClarifyCard>
  )
}

/**
 * One turn, rendered by role and kind: the analyst's prompt, an ask in its
 * frame, or an answer card with its envelope, followed by any proposal and the
 * suggested follow-ups.
 */
export function ConversationTurn({ turn, registry, onEvent, now }: ConversationTurnProps) {
  if (turn.role === "analyst") {
    return <ChatSessionMessage role="user">{turn.text}</ChatSessionMessage>
  }
  if (turn.kind === "ask") {
    return <AskTurnView turn={turn} registry={registry} onEvent={onEvent} now={now} />
  }
  return <AnswerTurnView turn={turn} registry={registry} onEvent={onEvent} />
}
