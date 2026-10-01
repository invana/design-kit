import type * as React from "react"

import { ANSWER_RENDERERS, ASK_RENDERERS } from "../answers/shared"
import type { AnswerKind, AskKind } from "@invana/blocks"
import type { ConversationEvent } from "../protocol/events"
import type {
  AnswerTurn,
  AskOptionsByKind,
  AskTurn,
  BlockBase,
  AnswerOptionsByKind,
} from "../protocol/types"

export interface AskRendererProps<P extends AskKind = AskKind> {
  turn: AskTurn
  /** The ask's options, already narrowed to its block. */
  options: AskOptionsByKind[P]
  onEvent: (event: ConversationEvent) => void
}

export interface BlockRendererProps<P extends AnswerKind = AnswerKind> {
  turn: AnswerTurn
  /** The block's options, already narrowed to its block. */
  block: BlockBase & AnswerOptionsByKind[P]
  onEvent: (event: ConversationEvent) => void
}

// `any`, as in the dashboard's registry: a registry holds renderers for many
// option shapes, and one typed on its own options is not assignable to `unknown`.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AskRenderer<P extends AskKind = any> = React.ComponentType<AskRendererProps<P>>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BlockRenderer<P extends AnswerKind = any> = React.ComponentType<BlockRendererProps<P>>

/**
 * Every block the grammar names, and what renders it. `null` is a block
 * not built yet: it renders as a labelled placeholder, so the number of `null`s
 * is the work left and a session story shows exactly where.
 *
 * Keyed by the grammar's ids, so a block added to the grammar and not here is
 * a compile error, and `grammar.test.ts` checks the same at runtime.
 */
export type AskRegistry = { [P in AskKind]: AskRenderer<P> | null }
export type BlockRegistry = { [P in AnswerKind]: BlockRenderer<P> | null }

export const BUILT_IN_ASKS: AskRegistry = ASK_RENDERERS

export const BUILT_IN_BLOCKS: BlockRegistry = ANSWER_RENDERERS

/**
 * How an ask sits in the thread, apart from what its renderer draws.
 *
 * `frame: "card"` draws it in the ask card, with its state, the stage that
 * asked and when it was answered; `"none"` draws the renderer alone — chips
 * that show their own pick. `kind` is the card's header word while it waits.
 */
export interface AskTraits {
  frame?: "card" | "none"
  kind?: string
}

/**
 * How a block sits in an answer. `"card"` is inside the answer card with the
 * rest of the evidence; `"own"` is a card of its own under it — a proposal is
 * something to approve, not part of the evidence.
 */
export interface BlockTraits {
  placement?: "card" | "own"
}

/** Traits of the built-in blocks; every block not named takes the defaults. */
export const BUILT_IN_ASK_TRAITS: Partial<Record<string, AskTraits>> = {
  suggestions: { frame: "none" },
  confirm: { kind: "confirm" },
  approval: { kind: "proposal" },
}
export const BUILT_IN_BLOCK_TRAITS: Partial<Record<string, BlockTraits>> = {
  proposal: { placement: "own" },
}

/**
 * Renderers a consumer adds or replaces — `{ blocks: { subgraph: CanvasBlock } }`
 * — with their traits. Consumer entries win over the built-ins, as in the
 * dashboard, so a template of your own sits in the thread exactly as you say.
 */
export interface RegistryOverrides {
  asks?: Partial<Record<string, AskRenderer>>
  blocks?: Partial<Record<string, BlockRenderer>>
  askTraits?: Partial<Record<string, AskTraits>>
  blockTraits?: Partial<Record<string, BlockTraits>>
}

export interface ResolvedRegistry {
  asks: Record<string, AskRenderer | null | undefined>
  blocks: Record<string, BlockRenderer | null | undefined>
  askTraits: (kind: string) => Required<Pick<AskTraits, "frame">> & AskTraits
  blockTraits: (kind: string) => Required<BlockTraits>
}

export function resolveRegistry(extra?: RegistryOverrides): ResolvedRegistry {
  const askTraits = { ...BUILT_IN_ASK_TRAITS, ...extra?.askTraits }
  const blockTraits = { ...BUILT_IN_BLOCK_TRAITS, ...extra?.blockTraits }
  return {
    asks: { ...BUILT_IN_ASKS, ...extra?.asks },
    blocks: { ...BUILT_IN_BLOCKS, ...extra?.blocks },
    askTraits: (kind) => ({ frame: "card", ...askTraits[kind] }),
    blockTraits: (kind) => ({ placement: "card", ...blockTraits[kind] }),
  }
}

// ── the options maps must name exactly the grammar's blocks ────────────────

type Same<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false
const askOptionsMatchGrammar: Same<keyof AskOptionsByKind, AskKind> = true
const blockOptionsMatchGrammar: Same<keyof AnswerOptionsByKind, AnswerKind> = true
void askOptionsMatchGrammar
void blockOptionsMatchGrammar
