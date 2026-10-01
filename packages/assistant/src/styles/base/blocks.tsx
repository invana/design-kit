import * as React from "react"
import { cn } from "@invana/ui"

import { ActionRow } from "@invana/blocks"
import { BlockCaption, BlockEmpty, BlockSkeleton } from "../../conversations/block-status"
import { Placeholder } from "@invana/blocks"
import type { ResolvedRegistry } from "../../conversations/registry"
import type { ConversationEvent } from "../../protocol/events"
import type { AnswerTurn, BlockSpec, Outcome } from "../../protocol/types"

export interface BlockViewProps {
  block: BlockSpec
  turn: AnswerTurn
  registry: ResolvedRegistry
  onEvent: (event: ConversationEvent) => void
}

/**
 * One block, drawn by whatever the registry holds for its block — a built-in,
 * a renderer of your own, or a labelled placeholder when there is none. Its
 * loading and empty states and its caption are the protocol's, so they look
 * the same under every renderer.
 */
export function BlockView({ block, turn, registry, onEvent }: BlockViewProps) {
  const Renderer = registry.blocks[block.kind]
  const body =
    block.status === "loading" ? (
      <BlockSkeleton kind={block.kind} />
    ) : block.status === "empty" ? (
      <BlockEmpty
        text={block.emptyText ?? "Nothing to show."}
        suggestions={block.emptySuggestions}
        onSuggest={(text) => onEvent({ type: "prompt", text })}
      />
    ) : !Renderer ? (
      <Placeholder kind={block.kind} options={block} />
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

/**
 * The envelope, drawn by the blocks a block would use so it looks the same
 * everywhere: scope and freshness over the evidence, method and caveats under.
 * These are the protocol's envelope fields, not answer types.
 */
export function envelopeBlocks(turn: AnswerTurn): { top: BlockSpec[]; bottom: BlockSpec[] } {
  const env = turn.envelope
  if (!env) return { top: [], bottom: [] }
  const parts = [...(env.scope ?? []), ...(env.freshness ? [`as of ${env.freshness}`] : [])]
  const top: BlockSpec[] = parts.length ? [{ kind: "scope", parts }] : []
  const bottom: BlockSpec[] = [
    ...(env.method ? [{ kind: "method" as const, label: "method", code: env.method }] : []),
    ...(env.caveats ?? []).map((c) => ({ kind: "caveat" as const, label: c.label, text: c.text })),
  ]
  return { top, bottom }
}

/**
 * An answer's blocks, split by where the registry says each sits: in the
 * answer's card with its envelope, or in a card of its own under it.
 */
export function splitBlocks(turn: AnswerTurn, registry: ResolvedRegistry) {
  const { top, bottom } = envelopeBlocks(turn)
  const own = turn.blocks.filter((b) => registry.blockTraits(b.kind).placement === "own")
  const inCard = turn.blocks.filter((b) => registry.blockTraits(b.kind).placement !== "own")
  return { inCard: [...top, ...inCard, ...bottom], own, hasEvidence: inCard.length > 0 }
}

/** `cite · 3,406 fills` — what the card's header says it rests on. */
export function citationOf(turn: AnswerTurn): string | undefined {
  const g = turn.envelope?.grounding
  return g ? `cite · ${g.records.toLocaleString("en-GB")}${g.noun ? ` ${g.noun}` : ""}` : undefined
}

/**
 * What the run produced, outside the thread, and what to do with it —
 * `14 nodes · 212 relationships` with `Load to canvas`. Each action is sent as
 * an `action` event on the turn.
 */
export function OutcomeView({
  outcome,
  turn,
  onEvent,
  tone,
  className,
}: {
  outcome: Outcome
  turn: AnswerTurn
  onEvent: (event: ConversationEvent) => void
  /** `bad` rules it in the destructive tone — what to do after a failure. */
  tone?: "bad"
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5 rounded-control border border-border px-2 py-1.5",
        tone === "bad" && "border-destructive/50",
        className,
      )}
    >
      {outcome.text ? <span className="min-w-0 flex-1 text-muted-foreground">{outcome.text}</span> : null}
      {outcome.actions?.length ? (
        <div className={cn("min-w-0", outcome.text ? "shrink-0" : "flex-1")}>
          <ActionRow
            actions={outcome.actions}
            onAction={(action) => onEvent({ type: "action", turn: turn.id, action })}
          />
        </div>
      ) : null}
    </div>
  )
}

/** Blocks in a column, with the gap an answer's body uses. */
export function BlockStack({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex min-w-0 flex-col gap-3", className)}>{children}</div>
}
