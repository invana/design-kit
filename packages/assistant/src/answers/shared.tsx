import type * as React from "react"
import {
  ANSWER_KINDS,
  ASK_KINDS,
  BLOCK_RENDERERS,
  CitationsBlock,
  NarrativeBlock,
  ScopeBlock,
  type AnswerKind,
  type AskKind,
  type BlockProps,
} from "@invana/blocks"

import { EmissionBody, EmissionCard } from "."
import type {
  AskRenderer,
  AskRendererProps,
  AskRegistry,
  BlockRegistry,
  BlockRenderer,
  BlockRendererProps,
} from "../conversations/registry"
import { ChatSessionCaret } from "../conversations/thread"
import type { ConversationEvent } from "../protocol/events"
import { useCiteFocus } from "./blocks/cite-focus"

/**
 * A block's action, as the conversation event it means on this turn. A block
 * names what the reader did; only the conversation knows the turn it was on.
 */
function toEvent(turn: string, action: string, value: unknown, block: number): ConversationEvent | undefined {
  switch (action) {
    case "reply":
      return { type: "reply", turn, value }
    case "change":
      return { type: "change", turn, value }
    case "skip":
      return { type: "skip", turn }
    case "prompt":
      return { type: "prompt", text: String(value) }
    case "scope": {
      const { part, value: v } = value as { part: number; value: unknown }
      return { type: "scope", turn, part, value: v }
    }
    case "open":
      // Only a block in the answer's own list can be opened; an envelope's has no index.
      return block >= 0 ? { type: "open", turn, block } : undefined
    default:
      return { type: "action", turn, action }
  }
}

/** A block in an answer, drawn from `@invana/blocks`. */
function answerBlock<K extends AnswerKind>(kind: K): BlockRenderer<K> {
  const Renderer = BLOCK_RENDERERS[kind] as React.ComponentType<BlockProps<K>>
  function AnswerBlock({ turn, block, onEvent }: BlockRendererProps<K>) {
    const index = (turn.blocks as unknown[]).indexOf(block)
    return (
      <Renderer
        // The same map, indexed generically: TypeScript cannot see AnswerOptionsByKind[K] is BlockOptionsByKind[K].
        spec={block as unknown as BlockProps<K>["spec"]}
        onAction={(action, value) => {
          const event = toEvent(turn.id, action, value, index)
          if (event) onEvent(event)
        }}
      />
    )
  }
  AnswerBlock.displayName = `Answer(${kind})`
  return AnswerBlock
}

/** A block in an ask, drawn from `@invana/blocks`: the turn's state and value, and its replies. */
function askBlock<K extends AskKind>(kind: K): AskRenderer<K> {
  const Renderer = BLOCK_RENDERERS[kind] as React.ComponentType<BlockProps<K>>
  function AskBlock({ turn, options, onEvent }: AskRendererProps<K>) {
    return (
      <Renderer
        spec={options as unknown as BlockProps<K>["spec"]}
        state={turn.state}
        value={turn.value}
        id={turn.id}
        onAction={(action, value) => {
          const event = toEvent(turn.id, action, value, -1)
          if (event) onEvent(event)
        }}
      />
    )
  }
  AskBlock.displayName = `Ask(${kind})`
  return AskBlock
}

/**
 * The narrative, with what only a conversation has: the source lit across the
 * answer's blocks, and the caret while the answer is still being written.
 */
function NarrativeAnswer({ block, turn }: BlockRendererProps<"narrative">) {
  const [active, setActive] = useCiteFocus(turn.id, block.active)
  const writing = turn.state === "running" && turn.blocks[turn.blocks.length - 1] === block
  return (
    <NarrativeBlock
      spec={block}
      active={active}
      onActiveChange={setActive}
      trailing={writing ? <ChatSessionCaret /> : null}
    />
  )
}

/** The citations, with the row the prose's marker points at lit. */
function CitationsAnswer({ block, turn }: BlockRendererProps<"citations">) {
  const [active] = useCiteFocus(turn.id, block.active)
  return <CitationsBlock spec={block} active={active} />
}

/** The scope, with the envelope's freshness fixed: a fact about the data, not a choice. */
function ScopeAnswer({ block, turn, onEvent }: BlockRendererProps<"scope">) {
  const fromEnvelope = !(turn.blocks as unknown[]).includes(block)
  const fixed = fromEnvelope && turn.envelope?.freshness ? [block.parts.length - 1] : undefined
  return (
    <ScopeBlock
      spec={block}
      fixed={fixed}
      onAction={(action, value) => {
        const event = toEvent(turn.id, action, value, -1)
        if (event) onEvent(event)
      }}
    />
  )
}

/** A proposal, in a card of its own under the answer: something to approve, not evidence. */
const ProposalBody = answerBlock("proposal")
function ProposalAnswer(props: BlockRendererProps<"proposal">) {
  return (
    <EmissionCard kind="proposal" title={props.block.title} citation={props.block.done?.at}>
      <EmissionBody>
        <ProposalBody {...props} />
      </EmissionBody>
    </EmissionCard>
  )
}

const ANSWER_WRAPPERS: Partial<{ [K in AnswerKind]: BlockRenderer<K> }> = {
  narrative: NarrativeAnswer,
  citations: CitationsAnswer,
  scope: ScopeAnswer,
  proposal: ProposalAnswer,
}

/** Every kind an answer can hold: its block from `@invana/blocks`, or `null` when none is built yet. */
export const ANSWER_RENDERERS = Object.fromEntries(
  ANSWER_KINDS.map((kind) => [kind, BLOCK_RENDERERS[kind] ? (ANSWER_WRAPPERS[kind] ?? answerBlock(kind)) : null]),
) as BlockRegistry

/** Every kind an ask can hold, the same way. */
export const ASK_RENDERERS = Object.fromEntries(
  ASK_KINDS.map((kind) => [kind, BLOCK_RENDERERS[kind] ? askBlock(kind) : null]),
) as AskRegistry
