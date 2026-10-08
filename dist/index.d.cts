import * as React from 'react';
import { TraceStep, AnswerKind, Tone, AnswerOptionsByKind, ActionOption, AskState, AskSpec, AskKind, AskOptionsByKind, BlockPatch, PatchSource as PatchSource$1, PatchChunk as PatchChunk$1, PatchScript as PatchScript$1, ScriptStep as ScriptStep$1, EventSourceOptions, PlayOptions, PageSpec } from '@invana/blocks';
export { ANSWER_KINDS, ASK_KINDS, ActionOption, AnswerKind, AnswerOptionsByKind, ApprovalOptions, AskKind, AskOptionsByKind, AskSpec, AskState, AskText, AskValueByKind, BLOCKS, BlockKind, BlockOptionsByKind, CannotOptions, CaveatNoteOptions, CaveatOptions, CaveatTone, Cell, ChoiceFigure, ChoiceOption, CitationSource, CitationsOptions, Column, ConfirmCard, ConfirmCardProps, ConfirmCost, ConfirmOptions, CostFigure, EntityOptions, EventSourceOptions, Figure, FileItem, ForkOptions, FormOptions, HypothesisOptions, InterpretationOptions, LongOptions, MethodOptions, MetricOptions, ModelSpecOptions, MultiOptions, MultistepOptions, NarrativeOptions, NumberOptions, PeriodOptions, Placeholder, PlaceholderProps, PlanOptions, PlayOptions, ProposalOptions, QuickOptions, QuickPick, RangeOptions, RecordRow, ScaleOptions, ScopeOptions, ScopePart, ShortOptions, SingleOptions, SuggestionChips, SuggestionChipsProps, SuggestionsOptions, Tone, TraceIoRow, TraceOptions, TraceStep, TypedValue, WeightsOptions, scriptLength } from '@invana/blocks';
import * as _invana_ui from '@invana/ui';
import { ChatSessionActivityRow as ChatSessionActivityRow$1, ChatSessionActivitySubLine as ChatSessionActivitySubLine$1, ChatSessionCaret as ChatSessionCaret$1, ChatSessionComposer as ChatSessionComposer$1, ChatSessionContextChip as ChatSessionContextChip$1, ChatSessionDisclosure as ChatSessionDisclosure$1, ChatSessionDisclosureCode as ChatSessionDisclosureCode$1, ChatSessionDisclosureSteps as ChatSessionDisclosureSteps$1, ChatSession as ChatSession$1, ChatSessionMessage as ChatSessionMessage$1, ChatSessionMessageOptions as ChatSessionMessageOptions$1, ChatSessionProgressLine as ChatSessionProgressLine$1, ChatSessionPromptRow as ChatSessionPromptRow$1, ChatSessionStatusBar as ChatSessionStatusBar$1, ChatSessionTaskGroup as ChatSessionTaskGroup$1, ChatSessionTaskRow as ChatSessionTaskRow$1 } from '@invana/ui';
export { ChatSessionActivityRowProps, ChatSessionActivityStatus, ChatSessionActivitySubLineProps, ChatSessionComposerProps, ChatSessionContextChipProps, ChatSessionDisclosureProps, ChatSessionDisclosureStepsProps, ChatSessionProps as ChatSessionFrameProps, ChatSessionMessageAction, ChatSessionMessageOptionsProps, ChatSessionMessageProps, ChatSessionMessageRole, ChatSessionMessageStatus, ChatSessionProgressLineProps, ChatSessionPromptRowProps, ChatSessionStatusBarProps, ChatSessionTaskGroupProps, ChatSessionTaskRowProps, ChatSessionTaskStatus, ClarifyActionsProps, ClarifyCardProps, ClarifyFootnoteProps, ClarifyOption, ClarifyState, EmissionCardProps, EmissionHeaderProps, EmissionKind, TemplateOption, TemplatePickerProps } from '@invana/ui';

/**
 * Everything the analyst can do, as data. The component never acts on a
 * conversation itself: it reports an event, and the API answers with patches.
 *
 * Every event but `prompt`, `stop` and `setting` names the turn it came from.
 */
type ConversationEvent = 
/**
 * A prompt. `settings` is what the composer's controls held — `{ mode: "nl",
 * model: "qwen" }`; `files` what was attached, as the browser gave them.
 */
{
    type: "prompt";
    text: string;
    context?: string[];
    settings?: Record<string, string>;
    files?: File[];
}
/** An ask was answered. `value` has the type its block fixes. */
 | {
    type: "reply";
    turn: string;
    value: unknown;
}
/** An ask was skipped; its default is used and recorded. */
 | {
    type: "skip";
    turn: string;
}
/** An answered ask was changed. Re-runs from that turn, not from scratch. */
 | {
    type: "change";
    turn: string;
    value: unknown;
}
/**
 * An action the answer's spec declares — `approve`, `create-drafts` — or one a
 * block names with what it carries: `select` with a table row's key,
 * `download` with a file's digest.
 */
 | {
    type: "action";
    turn: string;
    action: string;
    value?: unknown;
}
/** One part of an answer's scope line was edited. */
 | {
    type: "scope";
    turn: string;
    part: number;
    value: unknown;
}
/**
 * Open a block's records in full — the rows a table previews. `block` is its
 * index in the turn's `blocks`.
 */
 | {
    type: "open";
    turn: string;
    block: number;
}
/** Render the same records as another block. */
 | {
    type: "template";
    turn: string;
    kind: string;
}
/** Change the current answer in place — `by-region`. */
 | {
    type: "refine";
    turn: string;
    refine: string;
} | {
    type: "rate";
    turn: string;
    value: number;
} | {
    type: "stop";
} | {
    type: "retry";
    turn: string;
}
/** Open the whole run behind an answer — its elapsed time was clicked. `step` when one step was. */
 | {
    type: "open-run";
    turn: string;
    step?: string;
}
/** A composer control changed — the mode, the model, the timeout. */
 | {
    type: "setting";
    id: string;
    value: string;
}
/** An answer's words were copied, as `text`. */
 | {
    type: "copy";
    turn: string;
    text: string;
}
/** An answer's steps were opened or folded. */
 | {
    type: "toggle-steps";
    turn: string;
    open: boolean;
};
type ConversationEventType = ConversationEvent["type"];
/** The event types, in the grammar's order. `grammar.test.ts` checks the union against it. */
declare const EVENT_TYPES: readonly ["prompt", "reply", "skip", "change", "action", "scope", "open", "template", "refine", "rate", "stop", "retry", "open-run", "setting", "copy", "toggle-steps"];

/** The seven stages every flow walks some of, in order. */
declare const STAGES: readonly [{
    readonly id: "frame";
    readonly name: "Frame";
}, {
    readonly id: "scope";
    readonly name: "Scope";
}, {
    readonly id: "check";
    readonly name: "Check data";
}, {
    readonly id: "analyse";
    readonly name: "Analyse";
}, {
    readonly id: "explain";
    readonly name: "Explain";
}, {
    readonly id: "act";
    readonly name: "Act";
}, {
    readonly id: "monitor";
    readonly name: "Monitor";
}];
type StageId = (typeof STAGES)[number]["id"];

/**
 * Answer patterns: which blocks an answer has, in order. The flow picks the
 * pattern, and `validate()` checks each answer against it.
 */
declare const PATTERNS: readonly [{
    readonly id: "snapshot";
    readonly name: "KPI snapshot";
    readonly blocks: readonly ["grid", "timeseries", "narrative", "scope"];
}, {
    readonly id: "bridge";
    readonly name: "Change explanation";
    readonly blocks: readonly ["narrative", "waterfall", "ranked", "citations"];
}, {
    readonly id: "comparison";
    readonly name: "Comparison";
    readonly blocks: readonly ["bars", "table", "caveat"];
}, {
    readonly id: "ranking";
    readonly name: "Ranked list";
    readonly blocks: readonly ["ranked", "table"];
}, {
    readonly id: "profile";
    readonly name: "Segment profile";
    readonly blocks: readonly ["table", "bars", "narrative"];
}, {
    readonly id: "cohort";
    readonly name: "Cohort matrix";
    readonly blocks: readonly ["matrix", "narrative"];
}, {
    readonly id: "forecast";
    readonly name: "Forecast";
    readonly blocks: readonly ["timeseries", "record", "caveat"];
}, {
    readonly id: "anomaly";
    readonly name: "Anomaly report";
    readonly blocks: readonly ["timeseries", "timeline", "ranked"];
}, {
    readonly id: "drivers";
    readonly name: "Driver ranking";
    readonly blocks: readonly ["ranked", "narrative", "caveat"];
}, {
    readonly id: "readout";
    readonly name: "Experiment readout";
    readonly blocks: readonly ["metric", "record", "caveat", "proposal"];
}, {
    readonly id: "scenariot";
    readonly name: "Scenario table";
    readonly blocks: readonly ["record", "table", "ranked"];
}, {
    readonly id: "funnelv";
    readonly name: "Funnel";
    readonly blocks: readonly ["funnel", "table"];
}, {
    readonly id: "spread";
    readonly name: "Distribution";
    readonly blocks: readonly ["histogram", "table"];
}, {
    readonly id: "quality";
    readonly name: "Quality report";
    readonly blocks: readonly ["checks", "table", "files"];
}, {
    readonly id: "e360";
    readonly name: "Entity 360";
    readonly blocks: readonly ["record", "timeline", "table"];
}, {
    readonly id: "relmap";
    readonly name: "Relationship map";
    readonly blocks: readonly ["subgraph", "ranked"];
}, {
    readonly id: "memo";
    readonly name: "Findings memo";
    readonly blocks: readonly ["narrative", "citations", "caveat"];
}, {
    readonly id: "recommend";
    readonly name: "Recommendation";
    readonly blocks: readonly ["table", "ranked", "proposal"];
}, {
    readonly id: "delivery";
    readonly name: "Scheduled delivery";
    readonly blocks: readonly ["files", "proposal", "record"];
}, {
    readonly id: "shortlist";
    readonly name: "Candidate shortlist";
    readonly blocks: readonly ["attr", "histogram", "caveat", "proposal"];
}, {
    readonly id: "significance";
    readonly name: "Significance test";
    readonly blocks: readonly ["test", "box", "evidence", "caveat"];
}, {
    readonly id: "effects";
    readonly name: "Effect estimates";
    readonly blocks: readonly ["coef", "forest", "method", "caveat"];
}, {
    readonly id: "association";
    readonly name: "Association";
    readonly blocks: readonly ["correlation", "scatter", "caveat"];
}, {
    readonly id: "spc";
    readonly name: "Control report";
    readonly blocks: readonly ["control", "pareto", "decomposition"];
}, {
    readonly id: "timeto";
    readonly name: "Time to event";
    readonly blocks: readonly ["survival", "quantiles", "dumbbell", "caveat"];
}, {
    readonly id: "modelcheck";
    readonly name: "Model check";
    readonly blocks: readonly ["modeleval", "profile", "pivot", "tornado"];
}];
type PatternId = (typeof PATTERNS)[number]["id"];

/** The things the assistant asks back, each on one block. */
declare const ASK_INTENTS: readonly [{
    readonly id: "clarify";
    readonly name: "Clarify what was meant";
    readonly stage: "frame";
    readonly kind: "single";
}, {
    readonly id: "measure";
    readonly name: "Choose the measure";
    readonly stage: "frame";
    readonly kind: "single";
}, {
    readonly id: "definition";
    readonly name: "Confirm a definition";
    readonly stage: "frame";
    readonly kind: "confirm";
}, {
    readonly id: "hunch";
    readonly name: "Share a hunch";
    readonly stage: "frame";
    readonly kind: "long";
}, {
    readonly id: "window";
    readonly name: "Time window";
    readonly stage: "scope";
    readonly kind: "period";
}, {
    readonly id: "baseline";
    readonly name: "Compare against";
    readonly stage: "scope";
    readonly kind: "single";
}, {
    readonly id: "filter";
    readonly name: "Filter and segment";
    readonly stage: "scope";
    readonly kind: "multi";
}, {
    readonly id: "granularity";
    readonly name: "Granularity";
    readonly stage: "scope";
    readonly kind: "quick";
}, {
    readonly id: "entities";
    readonly name: "Pick entities";
    readonly stage: "scope";
    readonly kind: "entity";
}, {
    readonly id: "threshold";
    readonly name: "Set a threshold";
    readonly stage: "scope";
    readonly kind: "number";
}, {
    readonly id: "ambiguity";
    readonly name: "Resolve ambiguity";
    readonly stage: "check";
    readonly kind: "single";
}, {
    readonly id: "dataissue";
    readonly name: "Handle a data issue";
    readonly stage: "check";
    readonly kind: "single";
}, {
    readonly id: "cost";
    readonly name: "Approve an expensive run";
    readonly stage: "check";
    readonly kind: "confirm";
}, {
    readonly id: "method";
    readonly name: "Choose a method";
    readonly stage: "analyse";
    readonly kind: "single";
}, {
    readonly id: "assumptions";
    readonly name: "Confirm assumptions";
    readonly stage: "analyse";
    readonly kind: "multi";
}, {
    readonly id: "confidence";
    readonly name: "Confidence level";
    readonly stage: "analyse";
    readonly kind: "quick";
}, {
    readonly id: "objectives";
    readonly name: "Weigh objectives";
    readonly stage: "analyse";
    readonly kind: "weights";
}, {
    readonly id: "scenario";
    readonly name: "Scenario inputs";
    readonly stage: "analyse";
    readonly kind: "form";
}, {
    readonly id: "format";
    readonly name: "Choose the output";
    readonly stage: "explain";
    readonly kind: "quick";
}, {
    readonly id: "rate";
    readonly name: "Rate the answer";
    readonly stage: "explain";
    readonly kind: "scale";
}, {
    readonly id: "next";
    readonly name: "Suggest what's next";
    readonly stage: "explain";
    readonly kind: "suggestions";
}, {
    readonly id: "approve";
    readonly name: "Approve an action";
    readonly stage: "act";
    readonly kind: "approval";
}, {
    readonly id: "schedule";
    readonly name: "Schedule and share";
    readonly stage: "monitor";
    readonly kind: "multistep";
}, {
    readonly id: "reading";
    readonly name: "Check my reading";
    readonly stage: "frame";
    readonly kind: "interpretation";
}, {
    readonly id: "fork";
    readonly name: "Pick a reading";
    readonly stage: "frame";
    readonly kind: "fork";
}, {
    readonly id: "range";
    readonly name: "Set a range";
    readonly stage: "scope";
    readonly kind: "range";
}, {
    readonly id: "model";
    readonly name: "Specify the model";
    readonly stage: "analyse";
    readonly kind: "modelspec";
}, {
    readonly id: "plan";
    readonly name: "Review the plan";
    readonly stage: "analyse";
    readonly kind: "plan";
}, {
    readonly id: "hypothesis";
    readonly name: "State the hypothesis";
    readonly stage: "analyse";
    readonly kind: "hypothesis";
}];
type AskIntentId = (typeof ASK_INTENTS)[number]["id"];

/**
 * What an answer tells, each drawn by one or more blocks. The answer
 * half of {@link ASK_INTENTS}: an intent is an id and a name, the block is the
 * drawing, and several intents may share one block with different options.
 */
declare const ANSWER_INTENTS: readonly [{
    readonly id: "say";
    readonly name: "Say it in words";
    readonly kinds: readonly ["narrative"];
}, {
    readonly id: "figure";
    readonly name: "One number, or a few";
    readonly kinds: readonly ["metric", "grid"];
}, {
    readonly id: "trend";
    readonly name: "Change over time";
    readonly kinds: readonly ["timeseries", "control"];
}, {
    readonly id: "compare";
    readonly name: "Groups side by side";
    readonly kinds: readonly ["bars", "dumbbell", "matrix", "funnel"];
}, {
    readonly id: "rank";
    readonly name: "Leaders and laggards";
    readonly kinds: readonly ["ranked", "pareto", "tornado"];
}, {
    readonly id: "explain-change";
    readonly name: "What moved the total";
    readonly kinds: readonly ["waterfall", "decomposition"];
}, {
    readonly id: "records";
    readonly name: "Rows, or one entity";
    readonly kinds: readonly ["table", "record", "attr", "pivot", "profile"];
}, {
    readonly id: "sequence";
    readonly name: "What happened when";
    readonly kinds: readonly ["timeline", "heatstrip"];
}, {
    readonly id: "spread";
    readonly name: "The shape of the values";
    readonly kinds: readonly ["histogram", "box", "quantiles", "survival"];
}, {
    readonly id: "relate";
    readonly name: "How things connect";
    readonly kinds: readonly ["scatter", "correlation", "subgraph"];
}, {
    readonly id: "stats";
    readonly name: "Test and model results";
    readonly kinds: readonly ["test", "coef", "forest", "evidence", "modeleval"];
}, {
    readonly id: "trust";
    readonly name: "Method, sources, scope and limits";
    readonly kinds: readonly ["method", "citations", "scope", "caveat", "cannot", "checks"];
}, {
    readonly id: "act";
    readonly name: "A proposed action, or a file";
    readonly kinds: readonly ["proposal", "files"];
}, {
    readonly id: "run.steps";
    readonly name: "What the run did, in order";
    readonly kinds: readonly ["trace", "gantt"];
}, {
    readonly id: "run.activity";
    readonly name: "Which layers were busy";
    readonly kinds: readonly ["activity"];
}];
type AnswerIntentId = (typeof ANSWER_INTENTS)[number]["id"];

/** The research flows: the shapes of question analysts bring. */
declare const FLOWS: readonly [{
    readonly id: "kpi";
    readonly name: "KPI check";
    readonly template: "How is {measure} tracking against {baseline}?";
    readonly stages: readonly ["frame", "scope", "analyse", "explain"];
    readonly asks: readonly ["measure", "window", "baseline"];
    readonly pattern: "snapshot";
}, {
    readonly id: "diagnose";
    readonly name: "Root cause";
    readonly template: "Why did {measure} change in {period}?";
    readonly stages: readonly ["frame", "scope", "check", "analyse", "explain", "act"];
    readonly asks: readonly ["measure", "window", "baseline", "hunch"];
    readonly pattern: "bridge";
}, {
    readonly id: "compare";
    readonly name: "Comparison & benchmark";
    readonly template: "How does {A} compare with {B} on {measures}?";
    readonly stages: readonly ["frame", "scope", "analyse", "explain"];
    readonly asks: readonly ["entities", "measure", "confidence"];
    readonly pattern: "comparison";
}, {
    readonly id: "rank";
    readonly name: "Top-N ranking";
    readonly template: "Which {entities} lead or lag on {measure}?";
    readonly stages: readonly ["frame", "scope", "analyse", "explain", "act"];
    readonly asks: readonly ["measure", "filter", "threshold"];
    readonly pattern: "ranking";
}, {
    readonly id: "segment";
    readonly name: "Segmentation";
    readonly template: "What groups exist within {population}, and how do they differ?";
    readonly stages: readonly ["frame", "scope", "analyse", "explain"];
    readonly asks: readonly ["filter", "method", "assumptions"];
    readonly pattern: "profile";
}, {
    readonly id: "cohort";
    readonly name: "Cohort & retention";
    readonly template: "How do {cohorts} behave over time?";
    readonly stages: readonly ["frame", "scope", "analyse", "explain"];
    readonly asks: readonly ["definition", "window", "granularity"];
    readonly pattern: "cohort";
}, {
    readonly id: "forecast";
    readonly name: "Trend & forecast";
    readonly template: "Where is {measure} heading?";
    readonly stages: readonly ["frame", "scope", "analyse", "explain", "monitor"];
    readonly asks: readonly ["window", "granularity", "method", "assumptions"];
    readonly pattern: "forecast";
}, {
    readonly id: "anomaly";
    readonly name: "Anomaly & monitoring";
    readonly template: "Tell me when {measure} behaves unusually.";
    readonly stages: readonly ["scope", "analyse", "act", "monitor"];
    readonly asks: readonly ["measure", "threshold", "approve", "schedule"];
    readonly pattern: "anomaly";
}, {
    readonly id: "drivers";
    readonly name: "Driver analysis";
    readonly template: "What moves {measure}?";
    readonly stages: readonly ["frame", "analyse", "explain"];
    readonly asks: readonly ["measure", "method", "assumptions"];
    readonly pattern: "drivers";
}, {
    readonly id: "experiment";
    readonly name: "Experiment readout";
    readonly template: "Did {change} work?";
    readonly stages: readonly ["frame", "check", "analyse", "explain", "act"];
    readonly asks: readonly ["entities", "definition", "confidence"];
    readonly pattern: "readout";
}, {
    readonly id: "scenario";
    readonly name: "Scenario & what-if";
    readonly template: "What happens to {outcome} if {input} changes?";
    readonly stages: readonly ["frame", "scope", "analyse", "explain", "act"];
    readonly asks: readonly ["scenario", "assumptions"];
    readonly pattern: "scenariot";
}, {
    readonly id: "funnel";
    readonly name: "Funnel & journey";
    readonly template: "Where do {entities} drop out of {process}?";
    readonly stages: readonly ["frame", "scope", "analyse", "explain"];
    readonly asks: readonly ["definition", "window", "filter"];
    readonly pattern: "funnelv";
}, {
    readonly id: "distribution";
    readonly name: "Distribution & outliers";
    readonly template: "What does the spread of {measure} look like, and what sits outside it?";
    readonly stages: readonly ["scope", "analyse", "explain"];
    readonly asks: readonly ["measure", "filter", "threshold"];
    readonly pattern: "spread";
}, {
    readonly id: "audit";
    readonly name: "Data audit & reconciliation";
    readonly template: "Can I trust {dataset}? Do {A} and {B} agree?";
    readonly stages: readonly ["check", "analyse", "explain", "act"];
    readonly asks: readonly ["definition", "dataissue", "cost"];
    readonly pattern: "quality";
}, {
    readonly id: "entity";
    readonly name: "Entity lookup (360)";
    readonly template: "Tell me everything about {entity}.";
    readonly stages: readonly ["frame", "check", "explain"];
    readonly asks: readonly ["ambiguity", "entities"];
    readonly pattern: "e360";
}, {
    readonly id: "network";
    readonly name: "Relationships & networks";
    readonly template: "How are {entities} connected?";
    readonly stages: readonly ["frame", "scope", "check", "analyse", "explain"];
    readonly asks: readonly ["entities", "threshold", "cost"];
    readonly pattern: "relmap";
}, {
    readonly id: "qual";
    readonly name: "Qualitative synthesis";
    readonly template: "What are people saying about {topic}?";
    readonly stages: readonly ["frame", "scope", "analyse", "explain"];
    readonly asks: readonly ["filter", "window", "hunch"];
    readonly pattern: "memo";
}, {
    readonly id: "recommend";
    readonly name: "Recommendation & priority";
    readonly template: "What should we do about {problem}, and in what order?";
    readonly stages: readonly ["analyse", "explain", "act"];
    readonly asks: readonly ["assumptions", "method", "approve"];
    readonly pattern: "recommend";
}, {
    readonly id: "report";
    readonly name: "Report & schedule";
    readonly template: "Send me {analysis} every {cadence}.";
    readonly stages: readonly ["explain", "act", "monitor"];
    readonly asks: readonly ["format", "schedule", "approve"];
    readonly pattern: "delivery";
}, {
    readonly id: "combine";
    readonly name: "Combination design";
    readonly template: "Which combination of {candidates} best meets {objectives}?";
    readonly stages: readonly ["frame", "scope", "analyse", "explain", "act"];
    readonly asks: readonly ["entities", "objectives", "threshold", "assumptions"];
    readonly pattern: "shortlist";
}, {
    readonly id: "significance";
    readonly name: "Significance test";
    readonly template: "Is the difference in {measure} between {A} and {B} real?";
    readonly stages: readonly ["frame", "scope", "analyse", "explain"];
    readonly asks: readonly ["hypothesis", "confidence", "assumptions"];
    readonly pattern: "significance";
}, {
    readonly id: "effects";
    readonly name: "Effect estimation";
    readonly template: "How much does each {factor} change {outcome}, holding the others fixed?";
    readonly stages: readonly ["frame", "scope", "analyse", "explain"];
    readonly asks: readonly ["model", "plan", "assumptions"];
    readonly pattern: "effects";
}, {
    readonly id: "association";
    readonly name: "Correlation & association";
    readonly template: "Which {measures} move together, and how strongly?";
    readonly stages: readonly ["frame", "scope", "check", "analyse", "explain"];
    readonly asks: readonly ["reading", "filter", "range"];
    readonly pattern: "association";
}, {
    readonly id: "spc";
    readonly name: "Process control";
    readonly template: "Is {process} in control, and what causes most of the defects?";
    readonly stages: readonly ["scope", "analyse", "explain", "monitor"];
    readonly asks: readonly ["window", "granularity", "range"];
    readonly pattern: "spc";
}, {
    readonly id: "timeto";
    readonly name: "Time to event";
    readonly template: "How long until {event}, and does it differ by {group}?";
    readonly stages: readonly ["frame", "scope", "analyse", "explain"];
    readonly asks: readonly ["definition", "fork", "window"];
    readonly pattern: "timeto";
}, {
    readonly id: "modelcheck";
    readonly name: "Model check";
    readonly template: "How well does {model} predict {outcome}, and where does it fail?";
    readonly stages: readonly ["check", "analyse", "explain", "act"];
    readonly asks: readonly ["model", "range", "plan"];
    readonly pattern: "modelcheck";
}];
type FlowId = (typeof FLOWS)[number]["id"];

/**
 * A conversation is **data**, like a board. Everything in this file is
 * JSON-serialisable: the API sends a {@link ConversationSpec}, then patches;
 * the component renders whatever spec it is given and sends events back.
 *
 * The shapes are fixed by the Design Kit Spec. An block fixes the type of
 * the value that comes back; a block fixes the options it reads; a
 * pattern fixes which blocks an answer has. A screen that needs more is a
 * grammar change or a new block, never an extra field here.
 */
/** Everything a block carries apart from its options. */
interface BlockBase {
    /** The line under a block — `kg/ha per step of each trait`. */
    caption?: string;
    /** `warn` when the line is a warning — `North rests on 9 stores · indicative`. */
    captionTone?: Tone;
    /**
     * `loading` draws the block's skeleton while its data is on the way; `empty`
     * says there is nothing to draw, in `emptyText`. The card's header stays in both.
     */
    status?: "loading" | "empty";
    /** What is missing, said out loud — `No renewals fell due in September`. */
    emptyText?: string;
    /** Follow-ups under an empty block that would find something — `Search “Acme”`. */
    emptySuggestions?: string[];
}
type BlockSpec = {
    [P in AnswerKind]: BlockBase & {
        kind: P;
    } & AnswerOptionsByKind[P];
}[AnswerKind];
/**
 * What every analytic answer states, in the same place. These sit on the
 * answer, never as free blocks, so no answer can forget one or move it.
 */
interface Envelope {
    /** Period, filters and population, exactly as applied. */
    scope?: string[];
    /** How many records the answer rests on. Zero is said, never left out. */
    grounding?: {
        records: number;
        noun: string;
    };
    /** When the data was last loaded — `28 Sep 06:00`. Shown as `as of …`. */
    freshness?: string;
    /** The formula, query or model behind the figure. */
    method?: string;
    caveats?: {
        label: string;
        text: string;
    }[];
}
/**
 * `running` is being produced; `partial` is answered in part — settled, the
 * rest in the background or not to be had; `stopped` was interrupted.
 */
type AnswerState = "running" | "partial" | "complete" | "cannot" | "error" | "stopped";
interface AnalystTurn {
    id: string;
    role: "analyst";
    text: string;
    /** What the prompt was about — carried scope, a selection. */
    context?: string[];
    /** When it was sent, as an ISO 8601 time. */
    at?: string;
}
interface AskTurn {
    id: string;
    role: "assistant";
    kind: "ask";
    stage: StageId;
    state: AskState;
    ask: AskSpec;
    /** The analyst's reply, once answered. Its type is fixed by the block. */
    value?: unknown;
    /** When it was answered, as an ISO 8601 time. Shown as `just now`, `2 min ago`. */
    answeredAt?: string;
    /** How long a pending ask has been left, already worded — `parked 1 min`. */
    waiting?: string;
}
interface AnswerTurn {
    id: string;
    role: "assistant";
    kind: "answer";
    state: AnswerState;
    flow?: FlowId;
    pattern?: PatternId;
    /** The word on the card's header strip — `chart`, `ranked`. */
    label?: string;
    /** What the card shows — `P&L attribution, £M`. */
    title?: string;
    /** The right of the header strip when nothing is cited — `3 files · 166 KB`. */
    aside?: string;
    envelope?: Envelope;
    /** Streamed while the answer runs; kept as the record of what was done. */
    trace?: TraceStep[];
    blocks: BlockSpec[];
    /** When the run started, as an ISO 8601 time. A running answer counts up from it. */
    startedAt?: string;
    /** When it settled, as an ISO 8601 time. */
    at?: string;
    /** How long the run took, in ms — `Answered in 1.4 s`. */
    duration?: number;
    /** The run's facts in one line — `local · qwen3-27b · 14 rows · query 1.4 s`. */
    meta?: string;
    /** What the run produced, outside the thread, and what can be done with it. */
    outcome?: Outcome;
    /** How the analyst rated it — `1` good, `-1` not what they wanted. Sent as a `rate` event. */
    rating?: number;
}
/**
 * What a run produced, outside the thread — `14 nodes · 212 relationships`
 * with `Load to canvas`; or, when it failed, what to do next. Each action is
 * sent as an `action` event.
 */
interface Outcome {
    text?: string;
    actions?: ActionOption[];
}
type Turn = AnalystTurn | AskTurn | AnswerTurn;
interface ConversationSpec {
    id: string;
    title?: string;
    /**
     * What the analyst is called in this thread — `Planner`, `Researcher`. When
     * set, their prompts and the assistant's asks are labelled with who is
     * speaking; answers are cards and need no label.
     */
    analyst?: string;
    /** What the assistant is called in this thread — `Analyst`. Labels its turns where speakers are labelled. */
    assistant?: string;
    /** Scope carried by the whole thread, until a turn changes it. */
    scope?: Record<string, string>;
    /**
     * Who is answering, what it can reach, what it may spend and the rules it
     * runs under — sent with the spec for the host's header (`AgentHeader`,
     * passed as `header`). The session itself draws none of them.
     */
    agent?: AgentSpec;
    /** The data this session can reach. Set when the session starts; never changed by a turn. */
    access?: AccessSpec;
    /** Tokens spent in this session, of the budget it was given. Tokens, never money. */
    budget?: {
        used: number;
        limit: number;
    };
    /** The rules the session runs under — read-only here; changed in the host's settings. */
    governance?: GovernanceSpec;
    /** What the composer offers besides the text — mode, model, timeout, files. */
    composer?: ComposerSpec;
    turns: Turn[];
}
interface AgentSpec {
    /** `Analyst`. */
    name: string;
    /** `v2`. */
    version?: string;
    /** `sonnet-5.5`. */
    model?: string;
}
/** One published model, and what this session may do with it. */
interface AccessModel {
    id: string;
    name: string;
    /**
     * Records this session can see, after its slice. Left out while the count is
     * on its way; the API keeps it current with `set-records`.
     */
    records?: number | null;
    /** `["read"]`, `["read", "write"]`, or `"denied"`. */
    access: string[] | "denied";
    /** What the session's view is narrowed to — `time 2019 → now · axis announced_at`. */
    slice?: string;
}
/**
 * The data a session can reach. `world` is the whole graph the session opened
 * on; `group` is an access group's share of it, named in `label`.
 */
interface AccessSpec {
    kind: "world" | "group";
    /** `Accounts graph`, `Finance-EU`. */
    label: string;
    models?: AccessModel[];
}
interface GovernanceSpec {
    /** The strictest rule in force, as the badge says it — `Read-only`, `Governed`. */
    summary: string;
    /** The rules, in order — `Permissions: read-only`, `Retention: 30 days`. */
    rules?: {
        label: string;
        value: string;
    }[];
    /** Where data may leave to, per destination, and what may go. */
    egress?: {
        to: string;
        classes?: string[];
    }[];
}
/** One choice of a composer control. */
interface ComposerOption {
    value: string;
    label: string;
    /** The composer's placeholder while this is picked — `MATCH (n) WHERE … RETURN n`. */
    placeholder?: string;
    /** Set the prompt in mono while this is picked — a query language. */
    mono?: boolean;
}
/**
 * A select in the composer's toolbar — `Natural Language`, `local · qwen3-27b`,
 * `2m`. What is picked is sent with every prompt, under its `id`.
 */
interface ComposerControl {
    id: string;
    /** Its accessible name and tooltip — `Model`, `LLM + query timeout`. */
    label: string;
    options: ComposerOption[];
    /** Picked at first. Defaults to the first option. */
    default?: string;
    /** `start` sits with the text controls; `end` beside send. @default "start" */
    align?: "start" | "end";
    /** An icon before the value: the path data of a 16×16 stroked icon. */
    icon?: string;
    /** Muted: a setting, not the mode. */
    quiet?: boolean;
}
interface ComposerSpec {
    placeholder?: string;
    controls?: ComposerControl[];
    /** Offer attaching files; `accept` is the input's accept list. */
    attach?: boolean | {
        accept?: string;
        multiple?: boolean;
    };
    /** Keyboard hints under the composer — `↵ send`, `esc stop`. @default true */
    hints?: boolean;
}

interface AskRendererProps<P extends AskKind = AskKind> {
    turn: AskTurn;
    /** The ask's options, already narrowed to its block. */
    options: AskOptionsByKind[P];
    onEvent: (event: ConversationEvent) => void;
}
interface BlockRendererProps<P extends AnswerKind = AnswerKind> {
    turn: AnswerTurn;
    /** The block's options, already narrowed to its block. */
    block: BlockBase & AnswerOptionsByKind[P];
    onEvent: (event: ConversationEvent) => void;
}
type AskRenderer<P extends AskKind = any> = React.ComponentType<AskRendererProps<P>>;
type BlockRenderer<P extends AnswerKind = any> = React.ComponentType<BlockRendererProps<P>>;
/**
 * Every block the grammar names, and what renders it. `null` is a block
 * not built yet: it renders as a labelled placeholder, so the number of `null`s
 * is the work left and a session story shows exactly where.
 *
 * Keyed by the grammar's ids, so a block added to the grammar and not here is
 * a compile error, and `grammar.test.ts` checks the same at runtime.
 */
type AskRegistry = {
    [P in AskKind]: AskRenderer<P> | null;
};
type BlockRegistry = {
    [P in AnswerKind]: BlockRenderer<P> | null;
};
declare const BUILT_IN_ASKS: AskRegistry;
declare const BUILT_IN_BLOCKS: BlockRegistry;
/**
 * How an ask sits in the thread, apart from what its renderer draws.
 *
 * `frame: "card"` draws it in the ask card, with its state, the stage that
 * asked and when it was answered; `"none"` draws the renderer alone — chips
 * that show their own pick. `kind` is the card's header word while it waits.
 */
interface AskTraits {
    frame?: "card" | "none";
    kind?: string;
}
/**
 * How a block sits in an answer. `"card"` is inside the answer card with the
 * rest of the evidence; `"own"` is a card of its own under it — a proposal is
 * something to approve, not part of the evidence.
 */
interface BlockTraits {
    placement?: "card" | "own";
}
/** Traits of the built-in blocks; every block not named takes the defaults. */
declare const BUILT_IN_ASK_TRAITS: Partial<Record<string, AskTraits>>;
declare const BUILT_IN_BLOCK_TRAITS: Partial<Record<string, BlockTraits>>;
/**
 * Renderers a consumer adds or replaces — `{ blocks: { subgraph: CanvasBlock } }`
 * — with their traits. Consumer entries win over the built-ins, as in the
 * board, so a template of your own sits in the thread exactly as you say.
 */
interface RegistryOverrides {
    asks?: Partial<Record<string, AskRenderer>>;
    blocks?: Partial<Record<string, BlockRenderer>>;
    askTraits?: Partial<Record<string, AskTraits>>;
    blockTraits?: Partial<Record<string, BlockTraits>>;
}
interface ResolvedRegistry {
    asks: Record<string, AskRenderer | null | undefined>;
    blocks: Record<string, BlockRenderer | null | undefined>;
    askTraits: (kind: string) => Required<Pick<AskTraits, "frame">> & AskTraits;
    blockTraits: (kind: string) => Required<BlockTraits>;
}
declare function resolveRegistry(extra?: RegistryOverrides): ResolvedRegistry;

/**
 * How a spec changes while an answer streams. The API sends one of these at a
 * time; {@link applyPatch} returns a new spec and never mutates the old one, so
 * a controlled `<ChatSession spec>` re-renders exactly what changed.
 */
type ConversationPatch = {
    op: "add-turn";
    turn: Turn;
}
/** Move a turn through its states. An answered ask carries its `value`. */
 | {
    op: "set-state";
    turn: string;
    state: AskState | AnswerState;
    value?: unknown;
} | {
    op: "add-block";
    turn: string;
    block: BlockSpec;
}
/**
 * Stream a block: one {@link BlockPatch} — the same patch a board or a page
 * streams the block by. `block` is its index, the last block when left out.
 */
 | {
    op: "patch-block";
    turn: string;
    block?: number;
    patch: BlockPatch;
}
/** Change a block in place — its rows arriving, a loading block settling. `block` is its index. A `set` block patch. */
 | {
    op: "update-block";
    turn: string;
    block: number;
    fields: Record<string, unknown>;
}
/**
 * Stream words into a block: `text` is appended to its string `field`
 * (default `text`). `block` is its index, the last block when left out — so
 * a stream sends `add-block` with the field empty, then its words. An
 * `append` block patch.
 */
 | {
    op: "append-text";
    turn: string;
    text: string;
    block?: number;
    field?: string;
} | {
    op: "add-trace-step";
    turn: string;
    step: TraceStep;
}
/** Change a step in place, by id — its detail counting up, its state settling. */
 | {
    op: "update-trace-step";
    turn: string;
    step: string;
    fields: Partial<TraceStep>;
}
/** Stream a step's reasoning: `text` is appended to its `thinking`. */
 | {
    op: "append-thinking";
    turn: string;
    step: string;
    text: string;
}
/** Anything else on a turn — its envelope once known, its outcome, its duration. */
 | {
    op: "update-turn";
    turn: string;
    fields: Record<string, unknown>;
}
/** A model's record count, as it changes — the live count behind the header's data reach. */
 | {
    op: "set-records";
    model: string;
    records: number;
}
/** The conversation's own fields — its title, its composer. Never its turns. */
 | {
    op: "update-spec";
    fields: Partial<Omit<ConversationSpec, "id" | "turns">>;
};
type ConversationPatchOp = ConversationPatch["op"];
declare class PatchError extends Error {
}
declare function applyPatch(spec: ConversationSpec, patch: ConversationPatch): ConversationSpec;
/** Apply patches in order — a recorded stream, replayed. */
declare function applyPatches(spec: ConversationSpec, patches: ConversationPatch[]): ConversationSpec;

/**
 * A conversation arrives as a spec, then as patches — by the same transport
 * every block streams by (`@invana/blocks`), carrying {@link ConversationPatch}.
 * These are the ways the patches can arrive — one at a time or in batches,
 * from a fetch body, an EventSource, a generator, or a recorded script — all
 * read the same way by `<ChatSession stream>` and `useChatSession().stream()`.
 */
type PatchChunk = PatchChunk$1<ConversationPatch>;
type PatchSource = PatchSource$1<ConversationPatch>;
/** A patch and when it lands, in ms from the start of the script. */
type ScriptStep = ScriptStep$1<ConversationPatch>;
/** A recorded run: plain JSON, replayed by {@link playScript}. */
type PatchScript = PatchScript$1<ConversationPatch>;

/** Every patch of a source, flattened, in order. */
declare const patchesOf: (source: PatchSource) => AsyncGenerator<ConversationPatch[], any, any>;
/**
 * Patches from a newline-delimited JSON body: one patch, or an array of them,
 * per line. Pass the `Response` of a streaming `fetch`, or its body.
 */
declare const fromNdjson: (input: Response | ReadableStream<Uint8Array>) => AsyncGenerator<PatchChunk$1<ConversationPatch>, any, any>;
/** Patches from Server-Sent Events: each event's `data` is a patch, or an array of them. */
declare const fromEventSource: (source: EventSource, options?: EventSourceOptions) => AsyncGenerator<PatchChunk$1<ConversationPatch>, any, any>;
/**
 * A script as a stream: each step is yielded when it is due. Steps due at the
 * same moment are yielded together; aborting ends the stream where it stands.
 */
declare const playScript: (script: PatchScript, options?: PlayOptions) => AsyncGenerator<ConversationPatch[], any, any>;
/** Shift every step of a script by `ms` — to chain scripts one after another. */
declare const offsetScript: (script: PatchScript, ms: number) => PatchScript;

interface DeltaOptions {
    /** When the first delta lands, in ms. @default 0 */
    from?: number;
    /** The gap between deltas, in ms. @default 40 */
    every?: number;
    /** Stream word by word, or a few characters at a time. @default "word" */
    by?: "word" | "char";
}
/**
 * A block's words, streamed: `append-text` steps, one per word, into `field`
 * (default `text`) of block `block` (default the last).
 */
declare function textDeltas(turn: string, text: string, { from, every, by, block, field }?: DeltaOptions & {
    block?: number;
    field?: string;
}): PatchScript;
/** A step's reasoning, streamed: `append-thinking` steps, one per word. */
declare function thinkingDeltas(turn: string, step: string, text: string, { from, every, by }?: DeltaOptions): PatchScript;
/**
 * Whether an answer is still being produced. `partial` is not: it is an
 * answer given in part — the rest in the background, or not to be had.
 */
declare const isLive: (turn: AnswerTurn) => boolean;
/** Whether anything in the conversation is still running. */
declare function isRunning(spec: ConversationSpec): boolean;
/**
 * What stopping does, as patches: each running answer is marked `stopped`,
 * its running step `stopped` with the time it had run, the steps after it left
 * as they were — so the record shows how far it got. `now` is in ms.
 */
declare function stopPatches(spec: ConversationSpec, now?: number): ConversationPatch[];

/** `cli` is the console: caret prompts, status-dotted replies, step rows, a Tasks view. `web` is the chat: labelled turns, answer cards. */
type ChatSessionVariant = "cli" | "web";
/** The event of one type — `ChatSessionEventOf<"reply">` is `{ type: "reply"; turn; value }`. */
type ChatSessionEventOf<T extends ConversationEventType> = Extract<ConversationEvent, {
    type: T;
}>;
type Camel<S extends string> = S extends `${infer Head}-${infer Rest}` ? `${Head}${Capitalize<Camel<Rest>>}` : S;
/**
 * One typed callback per event: `onPrompt`, `onReply`, `onAction`,
 * `onOpenRun`, `onRate`, `onStop`, … Each receives exactly its event. They are
 * derived from {@link ConversationEvent}, so an event added to the protocol
 * gets its callback here with no other change.
 */
type ChatSessionHandlers = {
    [T in ConversationEventType as `on${Capitalize<Camel<T>>}`]?: (event: ChatSessionEventOf<T>) => void;
};
/**
 * The glyphs the session draws. The kit ships no icon set: pass your own nodes
 * (`{ send: <ArrowUp /> }`); anything left out falls back to a text glyph.
 */
interface ChatSessionIcons {
    send: React.ReactNode;
    stop: React.ReactNode;
    attach: React.ReactNode;
    close: React.ReactNode;
    retry: React.ReactNode;
    copy: React.ReactNode;
    steps: React.ReactNode;
    rateUp: React.ReactNode;
    rateDown: React.ReactNode;
}
/**
 * The actions on a settled answer, beside its time. `retry` is sent as
 * `retry`, `copy` as `copy` (and written to the clipboard), `steps` as
 * `toggle-steps`, `rate` as `rate`.
 */
type ChatSessionBuiltInAction = "retry" | "copy" | "steps" | "rate";
/** An action of your own on a settled answer, sent as an `action` event with its `id`. */
interface ChatSessionCustomAction {
    id: string;
    /** Its accessible name and tooltip. */
    label: string;
    icon: React.ReactNode;
    /** Only on answers in these states. Every settled state when left out. */
    states?: AnswerState[];
}
type ChatSessionAnswerAction = ChatSessionBuiltInAction | ChatSessionCustomAction;
declare const DEFAULT_ANSWER_ACTIONS: ChatSessionAnswerAction[];
/** What the CLI variant shows: the thread, or every step of every reply. */
type ChatSessionView = "chat" | "tasks";
interface ChatSessionProps extends ChatSessionHandlers {
    /**
     * The whole conversation, as JSON — what the API sends. Controlled: apply
     * patches to it (`applyPatch`, `useChatSession`) and pass the result, or
     * hand the patches over as `stream`.
     */
    spec: ConversationSpec;
    /** @default "web" */
    variant?: ChatSessionVariant;
    /**
     * Every event, whatever its type, after its own callback — the one place to
     * forward everything to an API.
     */
    onEvent?: (event: ConversationEvent) => void;
    /**
     * Patches to apply as they arrive — a streaming fetch (`fromNdjson`), an
     * EventSource (`fromEventSource`), a generator, or a recorded script
     * (`playScript`). The session draws `spec` with them applied; a new `spec`
     * starts over from it. Stopping ends the stream and records how far it got.
     *
     * Pass a function, `(signal) => source`, to open the source afresh each time
     * the session mounts — a generator can be read only once. Keep it stable
     * (module scope, `useCallback`): a new one starts a new stream.
     */
    stream?: PatchSource | ((signal: AbortSignal) => PatchSource) | null;
    /** The stream ended; `spec` is the conversation as it left it. */
    onStreamEnd?: (spec: ConversationSpec) => void;
    /** A patch did not apply, or the source failed. The stream stops there. */
    onStreamError?: (error: unknown) => void;
    /** Renderers and traits of your own asks and blocks, merged over the built-ins. */
    registry?: RegistryOverrides;
    icons?: Partial<ChatSessionIcons>;
    /**
     * The actions beside a settled answer's time, in order — the built-ins by
     * name, yours as `{ id, label, icon }`. `[]` shows none.
     * @default ["retry", "copy", "steps", "rate"]
     */
    actions?: ChatSessionAnswerAction[];
    /**
     * The clock, in ms. Left out, the session ticks while anything runs so
     * elapsed times move; a story passes a fixed one to read the same every run.
     */
    now?: number;
    /** Shows a close control in the header. */
    onClose?: () => void;
    /**
     * The header. `true` draws the session's own — title, turn count, close;
     * `false` draws none; any node is drawn in its place, so a host composes
     * its own header from whatever it needs. @default true when the spec has a title
     */
    header?: boolean | React.ReactNode;
    /** Shown when the spec has no turns yet. */
    emptyState?: React.ReactNode;
    /** The CLI's view, controlled. */
    view?: ChatSessionView;
    /** @default "chat" */
    defaultView?: ChatSessionView;
    onViewChange?: (view: ChatSessionView) => void;
    className?: string;
}
/** What a parent can do to a session it holds a ref to. */
interface ChatSessionHandle {
    /** Scroll a turn into view. */
    scrollToTurn: (turnId: string) => void;
    /** Open or fold an answer's steps. */
    showSteps: (turnId: string, open?: boolean) => void;
    /** Open one step's record — what went in and came out. */
    openStep: (turnId: string, stepId: string) => void;
    setView: (view: ChatSessionView) => void;
    /** Focus the composer. */
    focusComposer: () => void;
}

/**
 * A conversation with the assistant, drawn from JSON alone, in one of two
 * variants: `cli`, the console, or `web`, the chat.
 *
 * The API sends a {@link ConversationSpec}, then patches — pass the patched
 * spec, or the patches themselves as `stream`. Every ask and block is drawn by
 * the block registry, so templates of your own draw exactly like the
 * built-ins; the session itself knows no block. Everything the analyst does
 * comes back as a typed event: to its own callback (`onReply`, `onAction`,
 * `onOpenRun`, …) and then to `onEvent`.
 */
declare const ChatSession: React.ForwardRefExoticComponent<ChatSessionProps & React.RefAttributes<ChatSessionHandle>>;

interface UseChatSession {
    /** The conversation as it stands — pass it to `<ChatSession spec>`. */
    spec: ConversationSpec;
    /** Apply a patch, or several in order. */
    apply: (patch: ConversationPatch | ConversationPatch[]) => void;
    /**
     * Apply a stream of patches as they arrive — `fromNdjson(await fetch(…))`,
     * `fromEventSource(…)`, a generator. Resolves with the spec where it ended.
     * A stream started while another runs runs beside it; `stop()` ends both.
     */
    stream: (source: PatchSource) => Promise<ConversationSpec>;
    /** Replay a recorded script, on its own timing. */
    play: (script: PatchScript, options?: {
        speed?: number;
    }) => Promise<ConversationSpec>;
    /** End every stream, and mark what was running as stopped where it stood. */
    stop: () => void;
    /** Start over from a spec, ending every stream. */
    reset: (spec: ConversationSpec) => void;
    /** Whether a stream is still arriving. */
    streaming: boolean;
    /** Whether anything in the spec is still running. */
    running: boolean;
}
/**
 * A conversation's state for a host that drives it: the spec, and the ways
 * patches reach it. The session draws; this holds.
 *
 * ```tsx
 * const chat = useChatSession(initial)
 * <ChatSession spec={chat.spec} onPrompt={(e) => chat.stream(fromNdjson(await ask(e.text)))} onStop={chat.stop} />
 * ```
 */
declare function useChatSession(initial: ConversationSpec | (() => ConversationSpec)): UseChatSession;

interface ChatSessionTurnProps {
    turn: Turn;
    onEvent?: (event: ConversationEvent) => void;
    registry?: RegistryOverrides;
    /** The clock an answered ask's time is read against, in ms. Defaults to the time of render. */
    now?: number;
}
/**
 * One turn on its own, as the web variant draws it — the analyst's prompt,
 * an ask in its frame, or an answer's cards — without the thread around it.
 * For a block's board, where each cell is one turn.
 */
declare function ChatSessionTurn({ turn, onEvent, registry, now }: ChatSessionTurnProps): React.JSX.Element;

/**
 * How a thread writes time. Every function takes the clock it reads against,
 * so a story or a test reads the same every run.
 */
/** `912ms`, `1.4s`, `2m 5s`, `1h 20m` — `spaced` writes `1.4 s`, as a sentence does. */
declare function formatDuration(ms: number, { spaced }?: {
    spaced?: boolean;
}): string;
/** ms since an ISO time, never below zero; `undefined` when there is no time. */
declare function elapsedSince(iso: string | undefined, now: number): number | undefined;
/** `09:02` — the time a turn was sent, on a 24-hour clock. */
declare function clockTime(iso: string | undefined): string | undefined;
/** `Today · Wed 30 Sep`, `Yesterday · Tue 29 Sep`, `Mon 28 Sep`. */
declare function dayLabel(iso: string, now: number): string;

/**
 * The view model both variants draw from. Nothing here knows a kind: it
 * reads only the protocol's own fields — roles, kinds, states, the trace —
 * so an ask or a block of your own flows through exactly like a built-in.
 */
type AssistantTurn = AskTurn | AnswerTurn;
/** A prompt and everything the assistant said back to it, in order. */
interface Exchange {
    /** Stable across patches: the prompt's id, or the first reply's. */
    id: string;
    prompt?: AnalystTurn;
    replies: AssistantTurn[];
}
/** The thread as exchanges. Replies before any prompt form an exchange of their own. */
declare function exchangesOf(spec: ConversationSpec): Exchange[];
/** The step the run is on — running, retrying, or waiting on the analyst. */
declare function currentStep(answer: AnswerTurn): TraceStep | undefined;
/** A step's time: counting up while it runs, its duration once settled. */
declare function stepTime(step: TraceStep, now: number): number | undefined;
/**
 * An answer's time: counting up while it runs; once settled its `duration`,
 * else the span from `startedAt` to `at`, else the sum of its steps.
 */
declare function answerTime(answer: AnswerTurn, now: number): number | undefined;
type RunOutcome = "live" | "waiting" | "done" | "failed" | "stopped";
/** Where an answer's run stands, from its state and its steps. */
declare function runOutcome(answer: AnswerTurn): RunOutcome;
/**
 * Whether an ask holds the thread until it is answered. The session passes
 * the registry's answer — an ask drawn in the question card does; bare
 * follow-up chips do not — so no block is named here.
 */
type BlocksThread = (ask: AskTurn) => boolean;
/** The counts a status bar shows: what runs, what waits, how many steps in all. */
declare function threadCounts(spec: ConversationSpec, blocks?: BlocksThread): {
    running: number;
    waiting: number;
    steps: number;
};
/**
 * The words of a turn, for Copy: every string field named `text` on its
 * blocks, in order. Read by field, not by block, so a block of your own that
 * says something in `text` is copied too.
 */
declare function plainText(answer: AnswerTurn): string;

/**
 * The frame a session is drawn in: a scrolling stack that sticks to the
 * latest, with a fixed footer. `ChatSession` is the conversation itself, drawn
 * from JSON; this is only its layout.
 */
declare const ChatSessionFrame: typeof ChatSession$1;
/** The assistant's turn, with running, stopped, error and idle states. */
declare const ChatSessionMessage: typeof ChatSessionMessage$1;
/** Actions under a message: copy, retry, rate. */
declare const ChatSessionMessageOptions: typeof ChatSessionMessageOptions$1;
/** Prompt input with start and end slots, and send or stop. */
declare const ChatSessionComposer: typeof ChatSessionComposer$1;
/** A console row with the shared gutter glyph. */
declare const ChatSessionActivityRow: typeof ChatSessionActivityRow$1;
/** The indented line under an activity row. */
declare const ChatSessionActivitySubLine: typeof ChatSessionActivitySubLine$1;
/** The gutter every console row shares, so bodies line up. */
declare const chatSessionGutterClass = "w-3.5 shrink-0 flex justify-center";
/** The analyst's turn, on the shared gutter. */
declare const ChatSessionPromptRow: typeof ChatSessionPromptRow$1;
/** One-line status while work is in flight. */
declare const ChatSessionProgressLine: typeof ChatSessionProgressLine$1;
/** The cursor at the end of text still being written. */
declare const ChatSessionCaret: typeof ChatSessionCaret$1;
/** Collapsible detail under a row: query, preview, context. */
declare const ChatSessionDisclosure: typeof ChatSessionDisclosure$1;
/** The code a disclosure opens onto, keywords marked, when it opens onto more than code. */
declare const ChatSessionDisclosureCode: typeof ChatSessionDisclosureCode$1;
/** A method of several steps, numbered, each with its count or time. */
declare const ChatSessionDisclosureSteps: typeof ChatSessionDisclosureSteps$1;
/** A background task with its lifecycle. */
declare const ChatSessionTaskRow: typeof ChatSessionTaskRow$1;
/** A group of background tasks under one heading. */
declare const ChatSessionTaskGroup: typeof ChatSessionTaskGroup$1;
/** Slim bar under the composer: mode, counts, hints. */
declare const ChatSessionStatusBar: typeof ChatSessionStatusBar$1;
/** What the next question is about, bound from a selection. */
declare const ChatSessionContextChip: typeof ChatSessionContextChip$1;

interface TurnLabelProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Who is speaking — the analyst's name, or `Assistant`. */
    children: React.ReactNode;
    /** `end` over the analyst's prompt, which sits at the right; `start` over an ask. */
    align?: "start" | "end";
}
/**
 * Who is speaking, over the turn they spoke — `RESEARCHER`, `ASSISTANT`.
 *
 * Drawn over the analyst's prompts and the assistant's asks, the two kinds of
 * turn that address someone. An answer is a card with its own header and needs
 * no label. Mono, small and spaced, so it reads as a tag on the turn rather than
 * a heading of the thread.
 */
declare const TurnLabel: React.ForwardRefExoticComponent<TurnLabelProps & React.RefAttributes<HTMLDivElement>>;

/** The ask, through its whole life: pending, answered, skipped, superseded, expired. */
declare const ClarifyCard: React.ForwardRefExoticComponent<_invana_ui.ClarifyCardProps & React.RefAttributes<HTMLDivElement>>;
/** The line under an ask: why these options, or where a default came from. */
declare const ClarifyFootnote: React.ForwardRefExoticComponent<_invana_ui.ClarifyFootnoteProps & React.RefAttributes<HTMLParagraphElement>>;
/** The row of controls that answers, skips or changes an ask. */
declare const ClarifyActions: React.ForwardRefExoticComponent<_invana_ui.ClarifyActionsProps & React.RefAttributes<HTMLDivElement>>;

/**
 * An answer opened as a page: the blocks `@invana/blocks` draws, in order,
 * under the answer's title. What only a conversation shows — citations,
 * caveats, the trace — stays in the thread.
 */
declare function answerToPage(turn: AnswerTurn): PageSpec;

/** The answer card. An answer is its blocks inside this card. */
declare const EmissionCard: React.ForwardRefExoticComponent<_invana_ui.EmissionCardProps & React.RefAttributes<HTMLDivElement>>;
/** The card's body: its blocks in one padded column. */
declare const EmissionBody: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
/** The strip that says what an answer is and what it is grounded in. */
declare const EmissionHeader: React.ForwardRefExoticComponent<_invana_ui.EmissionHeaderProps & React.RefAttributes<HTMLDivElement>>;
/** The superscript that ties a clause to the records behind it. */
declare const CitationMarker: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>>;
/** Re-render the same records as another block. */
declare const TemplatePicker: React.ForwardRefExoticComponent<_invana_ui.TemplatePickerProps & React.RefAttributes<HTMLDivElement>>;

/**
 * What the compiler cannot see: a spec that arrived off the wire.
 *
 * `error` means the spec breaks the contract — an unknown block, a turn with
 * no id, an envelope field sent as a free block. `warning` means the spec is
 * valid but an answer does not match its pattern, which is how a change
 * explanation without a bridge gets noticed in fixtures and in development.
 */
interface ValidationIssue {
    level: "error" | "warning";
    /** The turn the issue is on, when there is one. */
    turn?: string;
    message: string;
}
interface ValidateOptions {
    /** Kinds a consumer registered beyond the grammar's. */
    extraAsks?: string[];
    extraBlocks?: string[];
}
declare function validate(spec: ConversationSpec, options?: ValidateOptions): ValidationIssue[];

export { ANSWER_INTENTS, ASK_INTENTS, type AccessModel, type AccessSpec, type AgentSpec, type AnalystTurn, type AnswerIntentId, type AnswerState, type AnswerTurn, type AskIntentId, type AskRegistry, type AskRenderer, type AskRendererProps, type AskTraits, type AskTurn, BUILT_IN_ASKS, BUILT_IN_ASK_TRAITS, BUILT_IN_BLOCKS, BUILT_IN_BLOCK_TRAITS, type BlockBase, type BlockRegistry, type BlockRenderer, type BlockRendererProps, type BlockSpec, type BlockTraits, ChatSession, ChatSessionActivityRow, ChatSessionActivitySubLine, type ChatSessionAnswerAction, type ChatSessionBuiltInAction, ChatSessionCaret, ChatSessionComposer, ChatSessionContextChip, type ChatSessionCustomAction, ChatSessionDisclosure, ChatSessionDisclosureCode, ChatSessionDisclosureSteps, type ChatSessionEventOf, ChatSessionFrame, type ChatSessionHandle, type ChatSessionHandlers, type ChatSessionIcons, ChatSessionMessage, ChatSessionMessageOptions, ChatSessionProgressLine, ChatSessionPromptRow, type ChatSessionProps, ChatSessionStatusBar, ChatSessionTaskGroup, ChatSessionTaskRow, ChatSessionTurn, type ChatSessionTurnProps, type ChatSessionVariant, type ChatSessionView, CitationMarker, ClarifyActions, ClarifyCard, ClarifyFootnote, type ComposerControl, type ComposerOption, type ComposerSpec, type ConversationEvent, type ConversationEventType, type ConversationPatch, type ConversationPatchOp, type ConversationSpec, DEFAULT_ANSWER_ACTIONS, type DeltaOptions, EVENT_TYPES, EmissionBody, EmissionCard, EmissionHeader, type Envelope, type Exchange, FLOWS, type FlowId, type GovernanceSpec, type Outcome, PATTERNS, type PatchChunk, PatchError, type PatchScript, type PatchSource, type PatternId, type RegistryOverrides, type ResolvedRegistry, type RunOutcome, STAGES, type ScriptStep, type StageId, TemplatePicker, type Turn, TurnLabel, type TurnLabelProps, type UseChatSession, type ValidateOptions, type ValidationIssue, answerTime, answerToPage, applyPatch, applyPatches, chatSessionGutterClass, clockTime, currentStep, dayLabel, elapsedSince, exchangesOf, formatDuration, fromEventSource, fromNdjson, isLive, isRunning, offsetScript, patchesOf, plainText, playScript, resolveRegistry, runOutcome, stepTime, stopPatches, textDeltas, thinkingDeltas, threadCounts, useChatSession, validate };
