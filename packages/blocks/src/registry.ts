import type * as React from "react"

import { ActivityBlock } from "./blocks/activity"
import { BarsBlock } from "./blocks/bars"
import { CannotBlock } from "./blocks/cannot"
import { CaveatBlock } from "./blocks/caveat"
import { CitationsBlock } from "./blocks/citations"
import { ConfirmAsk } from "./blocks/confirm"
import { FilesBlock } from "./blocks/files"
import { FormAsk } from "./blocks/form"
import { GridBlock } from "./blocks/grid"
import { MethodBlock } from "./blocks/method"
import { MetricBlock } from "./blocks/metric"
import { MultiAsk } from "./blocks/multi"
import { MultistepAsk } from "./blocks/multistep"
import { NarrativeBlock } from "./blocks/narrative"
import { ProposalBlock } from "./blocks/proposal"
import { QuickAsk } from "./blocks/quick"
import { RankedBlock } from "./blocks/ranked"
import { RecordBlock } from "./blocks/record"
import { ScopeBlock } from "./blocks/scope"
import { SingleAsk } from "./blocks/single"
import { SuggestionsAsk } from "./blocks/suggestions"
import { TableBlock } from "./blocks/table"
import { TimelineBlock } from "./blocks/timeline"
import { TimeseriesBlock } from "./blocks/timeseries"
import { TraceBlock } from "./blocks/trace"
import type { BlockKind, BlockProps } from "./types"

/** What draws each kind; `null` is a kind with no renderer yet, drawn as a labelled placeholder. */
export type BlockRenderers = { [K in BlockKind]: React.ComponentType<BlockProps<K>> | null }

/** Keyed by every kind, so a kind added to the list and not here does not compile. */
export const BLOCK_RENDERERS: BlockRenderers = {
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
  suggestions: SuggestionsAsk,
  narrative: NarrativeBlock,
  metric: MetricBlock,
  grid: GridBlock,
  table: TableBlock,
  attr: null,
  record: RecordBlock,
  ranked: RankedBlock,
  timeseries: TimeseriesBlock,
  bars: BarsBlock,
  waterfall: null,
  matrix: null,
  funnel: null,
  histogram: null,
  timeline: TimelineBlock,
  subgraph: null,
  method: MethodBlock,
  citations: CitationsBlock,
  files: FilesBlock,
  proposal: ProposalBlock,
  cannot: CannotBlock,
  caveat: CaveatBlock,
  scope: ScopeBlock,
  checks: null,
  trace: TraceBlock,
  activity: ActivityBlock,
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
