import type {
  FlowId,
  PatternId,
  StageId,
} from "../grammar"
import type {
  AnswerKind,
  ActionOption,
  AnswerOptionsByKind,
  ApprovalOptions,
  AskOptionsByKind,
  AskSpec,
  AskState,
  AskText,
  AskValueByKind,
  BlockOptionsByKind,
  CannotOptions,
  CaveatNoteOptions,
  CaveatOptions,
  CaveatTone,
  Cell,
  ChoiceFigure,
  ChoiceOption,
  CitationSource,
  CitationsOptions,
  Column,
  ConfirmOptions,
  CostFigure,
  EntityOptions,
  Figure,
  FileItem,
  ForkOptions,
  FormOptions,
  HypothesisOptions,
  InterpretationOptions,
  LongOptions,
  MethodOptions,
  MetricOptions,
  ModelSpecOptions,
  MultiOptions,
  MultistepOptions,
  NarrativeOptions,
  NumberOptions,
  PeriodOptions,
  PlanOptions,
  ProposalOptions,
  QuickOptions,
  QuickPick,
  RangeOptions,
  RecordRow,
  ScaleOptions,
  ScopeOptions,
  ScopePart,
  ShortOptions,
  SingleOptions,
  SuggestionsOptions,
  Tone,
  TraceIoRow,
  TraceOptions,
  TraceStep,
  TypedValue,
  WeightsOptions,
} from "@invana/blocks"

export type {
  ActionOption,
  AnswerOptionsByKind,
  ApprovalOptions,
  AskOptionsByKind,
  AskSpec,
  AskState,
  AskText,
  AskValueByKind,
  BlockOptionsByKind,
  CannotOptions,
  CaveatNoteOptions,
  CaveatOptions,
  CaveatTone,
  Cell,
  ChoiceFigure,
  ChoiceOption,
  CitationSource,
  CitationsOptions,
  Column,
  ConfirmOptions,
  CostFigure,
  EntityOptions,
  Figure,
  FileItem,
  ForkOptions,
  FormOptions,
  HypothesisOptions,
  InterpretationOptions,
  LongOptions,
  MethodOptions,
  MetricOptions,
  ModelSpecOptions,
  MultiOptions,
  MultistepOptions,
  NarrativeOptions,
  NumberOptions,
  PeriodOptions,
  PlanOptions,
  ProposalOptions,
  QuickOptions,
  QuickPick,
  RangeOptions,
  RecordRow,
  ScaleOptions,
  ScopeOptions,
  ScopePart,
  ShortOptions,
  SingleOptions,
  SuggestionsOptions,
  Tone,
  TraceIoRow,
  TraceOptions,
  TraceStep,
  TypedValue,
  WeightsOptions,
}

/**
 * A conversation is **data**, like a dashboard. Everything in this file is
 * JSON-serialisable: the API sends a {@link ConversationSpec}, then patches;
 * the component renders whatever spec it is given and sends events back.
 *
 * The shapes are fixed by the Design Kit Spec. An block fixes the type of
 * the value that comes back; a block fixes the options it reads; a
 * pattern fixes which blocks an answer has. A screen that needs more is a
 * grammar change or a new block, never an extra field here.
 */

// ── values ──────────────────────────────────────────────────────────────────






/** Everything a block carries apart from its options. */
export interface BlockBase {
  /** The line under a block — `kg/ha per step of each trait`. */
  caption?: string
  /** `warn` when the line is a warning — `North rests on 9 stores · indicative`. */
  captionTone?: Tone
  /**
   * `loading` draws the block's skeleton while its data is on the way; `empty`
   * says there is nothing to draw, in `emptyText`. The card's header stays in both.
   */
  status?: "loading" | "empty"
  /** What is missing, said out loud — `No renewals fell due in September`. */
  emptyText?: string
  /** Follow-ups under an empty block that would find something — `Search “Acme”`. */
  emptySuggestions?: string[]
}

export type BlockSpec = {
  [P in AnswerKind]: BlockBase & { kind: P } & AnswerOptionsByKind[P]
}[AnswerKind]

// ── the envelope ────────────────────────────────────────────────────────────

/**
 * What every analytic answer states, in the same place. These sit on the
 * answer, never as free blocks, so no answer can forget one or move it.
 */
export interface Envelope {
  /** Period, filters and population, exactly as applied. */
  scope?: string[]
  /** How many records the answer rests on. Zero is said, never left out. */
  grounding?: { records: number; noun: string }
  /** When the data was last loaded — `28 Sep 06:00`. Shown as `as of …`. */
  freshness?: string
  /** The formula, query or model behind the figure. */
  method?: string
  caveats?: { label: string; text: string }[]
}

// ── turns ───────────────────────────────────────────────────────────────────

/**
 * `running` is being produced; `partial` is answered in part — settled, the
 * rest in the background or not to be had; `stopped` was interrupted.
 */
export type AnswerState = "running" | "partial" | "complete" | "cannot" | "error" | "stopped"

export interface AnalystTurn {
  id: string
  role: "analyst"
  text: string
  /** What the prompt was about — carried scope, a selection. */
  context?: string[]
  /** When it was sent, as an ISO 8601 time. */
  at?: string
}

export interface AskTurn {
  id: string
  role: "assistant"
  kind: "ask"
  stage: StageId
  state: AskState
  ask: AskSpec
  /** The analyst's reply, once answered. Its type is fixed by the block. */
  value?: unknown
  /** When it was answered, as an ISO 8601 time. Shown as `just now`, `2 min ago`. */
  answeredAt?: string
  /** How long a pending ask has been left, already worded — `parked 1 min`. */
  waiting?: string
}

export interface AnswerTurn {
  id: string
  role: "assistant"
  kind: "answer"
  state: AnswerState
  flow?: FlowId
  pattern?: PatternId
  /** The word on the card's header strip — `chart`, `ranked`. */
  label?: string
  /** What the card shows — `P&L attribution, £M`. */
  title?: string
  /** The right of the header strip when nothing is cited — `3 files · 166 KB`. */
  aside?: string
  envelope?: Envelope
  /** Streamed while the answer runs; kept as the record of what was done. */
  trace?: TraceStep[]
  blocks: BlockSpec[]
  /** When the run started, as an ISO 8601 time. A running answer counts up from it. */
  startedAt?: string
  /** When it settled, as an ISO 8601 time. */
  at?: string
  /** How long the run took, in ms — `Answered in 1.4 s`. */
  duration?: number
  /** The run's facts in one line — `local · qwen3-27b · 14 rows · query 1.4 s`. */
  meta?: string
  /** What the run produced, outside the thread, and what can be done with it. */
  outcome?: Outcome
  /** How the analyst rated it — `1` good, `-1` not what they wanted. Sent as a `rate` event. */
  rating?: number
}

/**
 * What a run produced, outside the thread — `14 nodes · 212 relationships`
 * with `Load to canvas`; or, when it failed, what to do next. Each action is
 * sent as an `action` event.
 */
export interface Outcome {
  text?: string
  actions?: ActionOption[]
}

export type Turn = AnalystTurn | AskTurn | AnswerTurn

export interface ConversationSpec {
  id: string
  title?: string
  /**
   * What the analyst is called in this thread — `Planner`, `Researcher`. When
   * set, their prompts and the assistant's asks are labelled with who is
   * speaking; answers are cards and need no label.
   */
  analyst?: string
  /** What the assistant is called in this thread — `Analyst`. Labels its turns where speakers are labelled. */
  assistant?: string
  /** Scope carried by the whole thread, until a turn changes it. */
  scope?: Record<string, string>
  /** What the composer offers besides the text — mode, model, timeout, files. */
  composer?: ComposerSpec
  turns: Turn[]
}

// ── the composer ────────────────────────────────────────────────────────────

/** One choice of a composer control. */
export interface ComposerOption {
  value: string
  label: string
  /** The composer's placeholder while this is picked — `MATCH (n) WHERE … RETURN n`. */
  placeholder?: string
  /** Set the prompt in mono while this is picked — a query language. */
  mono?: boolean
}

/**
 * A select in the composer's toolbar — `Natural Language`, `local · qwen3-27b`,
 * `2m`. What is picked is sent with every prompt, under its `id`.
 */
export interface ComposerControl {
  id: string
  /** Its accessible name and tooltip — `Model`, `LLM + query timeout`. */
  label: string
  options: ComposerOption[]
  /** Picked at first. Defaults to the first option. */
  default?: string
  /** `start` sits with the text controls; `end` beside send. @default "start" */
  align?: "start" | "end"
  /** An icon before the value: the path data of a 16×16 stroked icon. */
  icon?: string
  /** Muted: a setting, not the mode. */
  quiet?: boolean
}

export interface ComposerSpec {
  placeholder?: string
  controls?: ComposerControl[]
  /** Offer attaching files; `accept` is the input's accept list. */
  attach?: boolean | { accept?: string; multiple?: boolean }
  /** Keyboard hints under the composer — `↵ send`, `esc stop`. @default true */
  hints?: boolean
}
