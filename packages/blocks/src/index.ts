// What a block is: its kinds, the options each reads, and the props every block takes.
export * from "./kinds"
export * from "./types"
export * from "./values"

// Drawing them: one block, or a page of them.
export { BLOCK_RENDERERS, type BlockRenderers } from "./registry"
export { Block, type BlockComponentProps } from "./block"
export { Page, type PageProps, type PageSection, type PageSpec } from "./page"
export { Placeholder, type PlaceholderProps } from "./placeholder"

// Writing figures and prose the way every block does.
export { figureText, metricValue, CAPTION_TONE, BADGE_TONE } from "./format"
export { prose, strong } from "./prose"

// Parts more than one block draws with.
export { ActionRow } from "./parts/actions"
export * from "./parts/confirm-card"
export * from "./parts/suggestion-chips"

// Each block, for a shell that wraps one.
export { ActivityBlock } from "./blocks/activity"
export { BarsBlock } from "./blocks/bars"
export { CannotBlock } from "./blocks/cannot"
export { CaveatBlock } from "./blocks/caveat"
export { CitationsBlock, type CitationsBlockProps } from "./blocks/citations"
export { ConfirmAsk } from "./blocks/confirm"
export { FilesBlock } from "./blocks/files"
export { FormAsk } from "./blocks/form"
export { GanttBlock } from "./blocks/gantt"
export { GridBlock } from "./blocks/grid"
export { HeatStripBlock } from "./blocks/heatstrip"
export { MethodBlock } from "./blocks/method"
export { MetricBlock } from "./blocks/metric"
export { MultiAsk } from "./blocks/multi"
export { MultistepAsk } from "./blocks/multistep"
export { NarrativeBlock, type NarrativeBlockProps } from "./blocks/narrative"
export { ProposalBlock } from "./blocks/proposal"
export { QuickAsk } from "./blocks/quick"
export { RankedBlock } from "./blocks/ranked"
export { RecordBlock } from "./blocks/record"
export { ScopeBlock, type ScopeBlockProps } from "./blocks/scope"
export { SingleAsk } from "./blocks/single"
export { SuggestionsAsk } from "./blocks/suggestions"
export { TableBlock } from "./blocks/table"
export { TimelineBlock } from "./blocks/timeline"
export { TimeseriesBlock } from "./blocks/timeseries"
export { TraceBlock } from "./blocks/trace"
