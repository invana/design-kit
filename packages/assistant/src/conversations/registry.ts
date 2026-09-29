import type * as React from "react"

import { FormAsk } from "../asks/presets/form"
import { MultistepAsk } from "../asks/presets/multistep"
import { SingleAsk } from "../asks/presets/single"
import type { AskPresetId, BlockPresetId } from "../grammar"
import type { ConversationEvent } from "../protocol/events"
import type {
  AnswerTurn,
  AskOptionsByPreset,
  AskTurn,
  BlockBase,
  BlockOptionsByPreset,
} from "../protocol/types"

export interface AskRendererProps<P extends AskPresetId = AskPresetId> {
  turn: AskTurn
  /** The ask's options, already narrowed to its preset. */
  options: AskOptionsByPreset[P]
  onEvent: (event: ConversationEvent) => void
}

export interface BlockRendererProps<P extends BlockPresetId = BlockPresetId> {
  turn: AnswerTurn
  /** The block's options, already narrowed to its preset. */
  block: BlockBase & BlockOptionsByPreset[P]
  onEvent: (event: ConversationEvent) => void
}

// `any`, as in the dashboard's registry: a registry holds renderers for many
// option shapes, and one typed on its own options is not assignable to `unknown`.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AskRenderer<P extends AskPresetId = any> = React.ComponentType<AskRendererProps<P>>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BlockRenderer<P extends BlockPresetId = any> = React.ComponentType<BlockRendererProps<P>>

/**
 * Every ask preset the grammar names, and what renders it. `null` is a preset
 * not built yet: it renders as a labelled placeholder, so the number of `null`s
 * is the work left and a session story shows exactly where.
 *
 * Keyed by the grammar's ids, so a preset added to the grammar and not here is
 * a compile error, and `grammar.test.ts` checks the same at runtime.
 */
export type AskRegistry = { [P in AskPresetId]: AskRenderer<P> | null }
export type BlockRegistry = { [P in BlockPresetId]: BlockRenderer<P> | null }

export const BUILT_IN_ASKS: AskRegistry = {
  confirm: null,
  single: SingleAsk,
  multi: null,
  quick: null,
  period: null,
  number: null,
  short: null,
  long: null,
  entity: null,
  scale: null,
  multistep: MultistepAsk,
  form: FormAsk,
  weights: null,
  approval: null,
  interpretation: null,
  fork: null,
  plan: null,
  modelspec: null,
  hypothesis: null,
  range: null,
}

export const BUILT_IN_BLOCKS: BlockRegistry = {
  narrative: null,
  metric: null,
  grid: null,
  table: null,
  attr: null,
  record: null,
  ranked: null,
  timeseries: null,
  bars: null,
  waterfall: null,
  matrix: null,
  funnel: null,
  histogram: null,
  timeline: null,
  subgraph: null,
  method: null,
  citations: null,
  files: null,
  proposal: null,
  cannot: null,
  caveat: null,
  scope: null,
  checks: null,
  suggestions: null,
  trace: null,
  test: null,
  coef: null,
  forest: null,
  scatter: null,
  box: null,
  correlation: null,
  control: null,
  pareto: null,
  survival: null,
  tornado: null,
  decomposition: null,
  modeleval: null,
  pivot: null,
  profile: null,
  evidence: null,
  dumbbell: null,
  quantiles: null,
}

/**
 * Renderers a consumer adds or replaces — `{ blocks: { subgraph: CanvasBlock } }`.
 * Consumer entries win over the built-ins, as in the dashboard.
 */
export interface PresetRegistry {
  asks?: Partial<Record<string, AskRenderer>>
  blocks?: Partial<Record<string, BlockRenderer>>
}

export interface ResolvedRegistry {
  asks: Record<string, AskRenderer | null | undefined>
  blocks: Record<string, BlockRenderer | null | undefined>
}

export function resolveRegistry(extra?: PresetRegistry): ResolvedRegistry {
  return {
    asks: { ...BUILT_IN_ASKS, ...extra?.asks },
    blocks: { ...BUILT_IN_BLOCKS, ...extra?.blocks },
  }
}

// ── the options maps must name exactly the grammar's presets ────────────────

type Same<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false
const askOptionsMatchGrammar: Same<keyof AskOptionsByPreset, AskPresetId> = true
const blockOptionsMatchGrammar: Same<keyof BlockOptionsByPreset, BlockPresetId> = true
void askOptionsMatchGrammar
void blockOptionsMatchGrammar
