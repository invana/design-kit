import type * as React from "react"

import { CaveatBlock } from "../answers/blocks/caveat"
import { FilesBlock } from "../answers/blocks/files"
import { GridBlock } from "../answers/blocks/grid"
import { MetricBlock } from "../answers/blocks/metric"
import { NarrativeBlock } from "../answers/blocks/narrative"
import { ProposalBlock } from "../answers/blocks/proposal"
import { RankedBlock } from "../answers/blocks/ranked"
import { RecordBlock } from "../answers/blocks/record"
import { ScopeBlock } from "../answers/blocks/scope"
import { SuggestionsBlock } from "../answers/blocks/suggestions"
import { TableBlock } from "../answers/blocks/table"
import { TimelineBlock } from "../answers/blocks/timeline"
import { TimeseriesBlock } from "../answers/blocks/timeseries"
import { ConfirmAsk } from "../asks/presets/confirm"
import { FormAsk } from "../asks/presets/form"
import { MultiAsk } from "../asks/presets/multi"
import { MultistepAsk } from "../asks/presets/multistep"
import { QuickAsk } from "../asks/presets/quick"
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
  confirm: ConfirmAsk,
  single: SingleAsk,
  multi: MultiAsk,
  quick: QuickAsk,
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
  narrative: NarrativeBlock,
  metric: MetricBlock,
  grid: GridBlock,
  table: TableBlock,
  attr: null,
  record: RecordBlock,
  ranked: RankedBlock,
  timeseries: TimeseriesBlock,
  bars: null,
  waterfall: null,
  matrix: null,
  funnel: null,
  histogram: null,
  timeline: TimelineBlock,
  subgraph: null,
  method: null,
  citations: null,
  files: FilesBlock,
  proposal: ProposalBlock,
  cannot: null,
  caveat: CaveatBlock,
  scope: ScopeBlock,
  checks: null,
  suggestions: SuggestionsBlock,
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
