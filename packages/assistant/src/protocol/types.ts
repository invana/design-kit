import type {
  AskKind,
  AnswerKind,
  FlowId,
  PatternId,
  StageId,
} from "../grammar"
import type {
  BlockOptionsByKind,
  Cell,
  Column,
  Figure,
  MetricOptions,
  NarrativeOptions,
  RecordRow,
  Tone,
  TypedValue,
} from "@invana/blocks"

export type { BlockOptionsByKind, Cell, Column, Figure, MetricOptions, NarrativeOptions, RecordRow, Tone, TypedValue }

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





// ── ask kinds: options in, value out ──────────────────────────────────────

/**
 * What every ask says before its control. `hint`, where an ask has one, is the
 * line under it: `**bold**` marks a figure and `` `Enter` `` a key.
 */
export interface AskText {
  /** The question. `**bold**` marks what matters in it. */
  question: string
  /** A muted line under the question — what the answer is used for. Makes the question a heading. */
  description?: string
  /** Set the question as a heading, bold — a short question over a longer body. */
  heading?: boolean
  /** What the answer is called once settled, in its summary — `Margin`, `Yield floor`. */
  label?: string
}

/** A figure on the right of a choice — `2,480` over `kg/ha`, `−8.4%` over `vs LY`. */
export interface ChoiceFigure {
  value: string
  unit?: string
  tone?: Tone
}

/** A choice the data model holds. `detail` names where it comes from. */
export interface ChoiceOption {
  value: string
  label: string
  detail?: string
  disabled?: boolean
  /** Why it is off or on — `on the causal path`. */
  note?: string
  /** A second line under the label — `Adjusts for seasonality`. */
  description?: string
  /** A short tag in a box before the label — `BV`. */
  lead?: string
  /**
   * An icon in that box instead: the path data of a 16×16 stroked icon, so
   * the API can send one without the kit shipping an icon set.
   */
  icon?: string
  /** What picking it would give, on the right in place of `detail`. */
  figure?: ChoiceFigure
  /** How the pick reads in a summary, when not as its label — `Semi-arid, 3 sites`. */
  summary?: string
}

/** One figure of what yes costs — `2.3B` `rows scanned`. */
export interface CostFigure {
  label: string
  /** The figure. `about **40 s**` bolds only the figure in a `line`. */
  value: string
  /** `warn` for a cost that changes something — records it writes. */
  tone?: Tone
}

export interface ConfirmOptions extends AskText {
  /** What yes costs, stated before the buttons: the rows it scans, the time it takes, what it writes. */
  cost?: CostFigure[]
  /**
   * `line` writes the cost as a sentence under the question, each figure
   * before its label; `strip` sets the figures in cells, each label above.
   * @default "line"
   */
  costAs?: "line" | "strip"
  /** Something the analyst should weigh before answering — `data gap`. */
  caveat?: { label: string; text: string }
  yes: string
  no: string
  default?: boolean
  /** The no is a dismissal — `Not now` — and draws quiet. */
  dismiss?: boolean
  /**
   * `end` sets the default at the card's right edge, the other at its left;
   * `start` sets them together at the left, the default first.
   * @default "start"
   */
  align?: "start" | "end"
  /** How the decision reads once made — `Narrowed to Q3 first`. Defaults to the button's words. */
  settled?: { yes?: string; no?: string }
  hint?: string
}
export interface SingleOptions extends AskText {
  options: ChoiceOption[]
  default?: string
  /** Offer an “Other…” choice, answered in the analyst's own words. */
  other?: boolean
  /** Send with a button of these words — `Next` — rather than on the pick. */
  submit?: string
  /** Offer Skip, which keeps the default. */
  skippable?: boolean
  hint?: string
}
export interface MultiOptions extends AskText {
  options: ChoiceOption[]
  default?: string[]
  min?: number
  max?: number
  /**
   * The submit's words, `{count}` standing for how many are ticked — `Hold
   * {count} fixed`. Defaults to the question's own verb, or `Use {count} selected`.
   */
  submit?: string
  /** Offer Select all beside the question. */
  selectAll?: boolean
  hint?: string
}
/** One row of a quick ask: a question and two to five short answers. */
export interface QuickPick {
  question: string
  /** What the answer is called once settled, in its summary — `Trend by`. */
  label?: string
  /** Each option; `sub` is a second line under it — `±1.4 pp`. */
  options: { value: string; label: string; sub?: string }[]
  default?: string
  hint?: string
}
export interface QuickOptions extends AskText, QuickPick {
  /** Stretch the row across the card, each option an equal share. */
  stretch?: boolean
  /**
   * Further rows answered in the same card — `Confidence level` under `Show
   * the trend by`. With any, the value is keyed: `id` for each of these,
   * `label` (or the question) for the first.
   */
  more?: (QuickPick & { id: string })[]
}
export interface PeriodOptions {
  question: string
  options: { value: string; label: string; from: string; to: string }[]
  default?: string
  custom?: boolean
  hint?: string
}
export interface NumberOptions extends AskText {
  unit?: string
  min?: number
  max?: number
  step?: number
  default?: number
  hint?: string
}
export interface ShortOptions {
  question: string
  default?: string
  hint?: string
}
export interface LongOptions {
  question: string
  placeholder?: string
  optional?: boolean
}
export interface EntityOptions {
  question: string
  /** Suggested or found entities, each with its type. */
  results: { id: string; label: string; type?: string }[]
  default?: string[]
  /** An action that runs once the pick is made — `Simulate 3 crosses`. */
  submit?: string
  hint?: string
}
export interface ScaleOptions {
  question: string
  min: number
  max: number
  low?: string
  high?: string
  default?: number
}
export interface MultistepOptions {
  /**
   * Each step is an ask of its own; the value is keyed by step id. A
   * `required` step holds Next back until it is answered, and has no Skip.
   */
  steps: ({ id: string; required?: boolean } & AskSpec)[]
  /** Show the answers for a last look, each with Edit, before they are sent. */
  review?: boolean
}
export interface FormOptions extends AskText {
  /**
   * `side` sets each label in a column at the left; `top` sets it over its
   * field, two fields to a row where the card is wide enough.
   * @default "side"
   */
  labels?: "side" | "top"
  fields: {
    name: string
    label: string
    type: "number" | "text" | "date" | "select"
    unit?: string
    default?: string | number
    /** Shown beside the value — `quoted 14 d`. */
    aside?: string
    /** A line under the field — `From last year's promotions`. */
    hint?: string
    /** The section the field sits in, under its name — `Price`, `Timing`. */
    group?: string
    /** A number must be greater than this — an elasticity `above` 0. */
    above?: number
    /** A number must be less than this. */
    below?: number
  }[]
  submit?: string
  hint?: string
}
export interface WeightsOptions {
  question: string
  objectives: { id: string; label: string }[]
  default: Record<string, number>
  total?: number
  hint?: string
}
export interface ApprovalOptions {
  rows: { label: string; value: string }[]
  consequence: string
  actions: ActionOption[]
}
export interface InterpretationOptions {
  question?: string
  slots: { id: "measure" | "window" | "population" | "baseline" | (string & {}); label: string; value: string }[]
}
export interface ForkOptions {
  question: string
  readings: { id: string; label: string; preview?: string; hint?: string }[]
  default?: string
}
export interface PlanOptions {
  question?: string
  steps: { id: string; label: string; cost?: string; on: boolean }[]
  submit?: string
}
export interface ModelSpecOptions {
  question?: string
  outcome: { field: string; type: string }
  predictors: string[]
  controls: string[]
  group?: string
  hint?: string
}
export interface HypothesisOptions {
  question: string
  test: string
  /** Why this test — shown beside it as `suggested`. */
  suggested?: boolean
  tails: 1 | 2
  alpha: number
  hint?: string
}
export interface RangeOptions {
  question: string
  unit?: string
  default: { min: number; max: number }
  hint?: string
}

/**
 * Follow-ups after an answer, each a whole prompt that reuses the current
 * scope. The reply is the one picked, and the API sends it on as the next
 * prompt; the one picked stays, dimmed.
 */
export interface SuggestionsOptions {
  items?: string[]
  /** Follow-ups under a heading each — `Go deeper`, `Act`. */
  groups?: { label: string; items: string[] }[]
  /** `stack` puts one per line, full width. Narrow threads stack on their own. */
  layout?: "wrap" | "stack"
}

/**
 * Kind → the options it reads.
 *
 * Keyed by exactly the grammar's ask kinds; `grammar.test.ts` checks it.
 */
export interface AskOptionsByKind {
  confirm: ConfirmOptions
  single: SingleOptions
  multi: MultiOptions
  quick: QuickOptions
  period: PeriodOptions
  number: NumberOptions
  short: ShortOptions
  long: LongOptions
  entity: EntityOptions
  scale: ScaleOptions
  multistep: MultistepOptions
  form: FormOptions
  weights: WeightsOptions
  approval: ApprovalOptions
  interpretation: InterpretationOptions
  fork: ForkOptions
  plan: PlanOptions
  modelspec: ModelSpecOptions
  hypothesis: HypothesisOptions
  range: RangeOptions
  suggestions: SuggestionsOptions
}

/** Kind → the type of the value the analyst's reply carries. */
export interface AskValueByKind {
  confirm: boolean
  single: string
  multi: string[]
  /** Keyed by row when the ask has `more` rows. */
  quick: string | Record<string, string>
  period: { from: string; to: string; label: string }
  number: number
  short: string
  long: string
  entity: string[]
  scale: number
  multistep: Record<string, unknown>
  form: Record<string, unknown>
  weights: Record<string, number>
  approval: "approve" | "reject"
  interpretation: Record<string, string>
  fork: string
  plan: string[]
  modelspec: { outcome: string; predictors: string[]; group?: string; controls: string[] }
  hypothesis: { test: string; tails: 1 | 2; alpha: number }
  range: { min: number; max: number }
  /** The follow-up picked, as it reads. */
  suggestions: string
}

export type AskSpec = {
  [P in AskKind]: { kind: P } & AskOptionsByKind[P]
}[AskKind]

// ── block kinds: the options each block reads ─────────────────────────────

export interface ActionOption {
  id: string
  label: string
  variant?: "primary" | "secondary" | "ghost" | "link"
  /** Starts the right-hand group: this action and those after it sit at the far end. */
  push?: boolean
}


export interface MethodOptions {
  /** The word on the line — `method`, `query`, `model`, `3 steps`. */
  label?: string
  /** The formula, query or model. `**…**` marks its keywords. */
  code?: string
  /** At the right of the line — `12,408 rows · 18 ms`. */
  meta?: string
  /** What the model rests on, under the code — `Plots 1,284`. */
  facts?: { label: string; value: string }[]
  /** A method of several steps, in order, each with its count or time. */
  steps?: { label: string; detail?: string }[]
  /** Drawn open. Closed, the line alone says what was run. */
  open?: boolean
}

export interface CitationSource {
  label: string
  count?: Figure
  /** What kind of source and how fresh — `table · loaded 28 Sep 06:00`. */
  detail?: string
}

export interface CitationsOptions {
  sources: CitationSource[]
  /** The source the reader is on, lit with its marker in the prose. */
  active?: number
  /** One line — `▸ 3 sources`, the record total at the right — until opened. */
  folded?: boolean
  /** Said under the sources. When they hold no records it is said as a warning. */
  note?: string
}

export interface ProposalOptions {
  /** Where it came from, on the card's header — `from this answer`. */
  title?: string
  /** What it proposes, in one line above the draft. */
  heading?: string
  /** The draft, label by label. */
  rows?: { label: string; value: string }[]
  /** What writing it does, as figures — `Rules 1`, `Recipients 214`. */
  figures?: { label: string; value: string }[]
  /** What writing it does, in words. */
  consequence?: string
  actions: ActionOption[]
  /** Written: the stamp that says so, and when, on the header. */
  done?: { label: string; at?: string }
}

export interface CannotOptions {
  reason: string
  remedy: string
  /** Nearby questions the data can answer; each is sent as a `prompt`. */
  nearest?: string[]
  /** Answered for part of what was asked; the reason says which part is missing. */
  partial?: boolean
}

export type CaveatTone = "warning" | "info" | "bad"

export interface CaveatNoteOptions {
  label: string
  text: string
  /** `warning` (the default) qualifies; `info` says what was filled in; `bad` says what is wrong with the data. */
  tone?: CaveatTone
  /** A link after the text — `Show the 4 stores` — sent as an `action` event. */
  action?: { id: string; label: string }
}

/** One caveat, or several folded behind one line — `▸ 2 caveats`. */
export type CaveatOptions =
  | (CaveatNoteOptions & { items?: never; folded?: never })
  | { items: CaveatNoteOptions[]; folded?: boolean; label?: never; text?: never }

export interface ScopePart {
  text: string
  /** `changed` — this part differs from the question it was carried from; `stale` — the data behind it is late. */
  mark?: "changed" | "stale"
  /** What this part can be changed to; opening the part lists them. */
  choices?: { value: string; label: string; detail?: string }[]
}

export interface ScopeOptions {
  parts: (string | ScopePart)[]
  /** The line under the scope. Said as a warning when a part is stale. */
  hint?: string
  /** The part whose choices are showing — a restored view, or a story. */
  openPart?: number
}

export interface TraceOptions {
  steps: TraceStep[]
  /** One line — `▸ 4 steps` with `summary` at the right — until opened. */
  folded?: boolean
  /** At the right of the folded line — `4.2 s · 16,319 rows`. */
  summary?: string
  /** Under a failed step — `Retry`, `Skip this step` — sent as `action` events. */
  actions?: ActionOption[]
}



/** A file an answer hands over. */
export interface FileItem {
  name: string
  size?: string
  /** Eight characters, mono — what a reader quotes. */
  digest?: string
  /** What the file is, in a line — `412 rows · missing store code`. */
  note?: string
  /** A word on the file's state — `rejected`. */
  status?: { label: string; tone?: Tone }
}


export interface AnswerOptionsByKind extends BlockOptionsByKind {
  attr: {
    columns: (Column & { dir?: "higher" | "lower" })[]
    rows: Record<string, Cell>[]
    total?: number
    noun?: string
  }
  waterfall: { start?: { label: string; value: number }; steps: { label: string; value: number }[]; end: { label: string; value: number }; unit?: string }
  matrix: { rows: string[]; cols: string[]; values: (number | null)[][]; scale: "sequential" | "diverging" }
  funnel: { steps: { label: string; count: number }[] }
  histogram: {
    bins: { from: number; to: number; count: number }[]
    threshold?: { value: number; label: string }
    outliers?: number
    unit?: string
  }
  timeline: {
    /**
     * `detail` is a second line under the text. `section` starts a labelled run
     * of events — `Before`, `Spike`, `After`; `highlight` calls one out.
     */
    events: { when: string; text: string; tone?: Tone; detail?: string; section?: string; highlight?: boolean }[]
  }
  subgraph: { nodes: { id: string; label: string }[]; edges: { from: string; to: string }[] }
  method: MethodOptions
  citations: CitationsOptions
  files: {
    files: FileItem[]
    /** Each file gets its type icon and a `Download` link. */
    download?: boolean
  }
  proposal: ProposalOptions
  cannot: CannotOptions
  caveat: CaveatOptions
  scope: ScopeOptions
  checks: { rows: { label: string; ok: boolean; count?: Figure }[] }
  trace: TraceOptions
  test: {
    verdict: string
    evidence?: "strong" | "moderate" | "weak"
    groups?: string
    statistic: string
    p: Figure
    effect: Figure
    assumptions: { label: string; ok: boolean; detail?: string }[]
  }
  coef: { terms: { term: string; est: number; se: number; lo: number; hi: number; p: Figure; strong?: boolean }[] }
  forest: { rows: { label: string; est: number; lo: number; hi: number; overall?: boolean }[]; nullAt: number; unit?: string }
  scatter: { points: [number, number][]; fit?: { slope: number; intercept: number }; r2?: number; x: string; y: string }
  box: { groups: { label: string; min: number; q1: number; median: number; q3: number; max: number; outliers?: number[] }[]; unit?: string }
  correlation: { vars: string[]; values: number[][] }
  control: { series: [string, number][]; centre: number; ucl: number; lcl: number; breaches?: string[] }
  pareto: { items: { label: string; value: number }[] }
  survival: { curves: { label: string; points: [number, number][] }[]; atRisk?: { at: number; n: number }[]; unit?: string }
  tornado: { base: number; inputs: { label: string; low: number; high: number; note?: string }[]; unit?: string }
  decomposition: { x: string[]; trend: number[]; seasonal: number[]; residual: number[] }
  modeleval: {
    confusion: { tp: number; fp: number; fn: number; tn: number }
    threshold?: number
    gains?: [number, number][]
    labels?: { positive: string; negative: string }
  }
  pivot: { rowLabel: string; rows: string[]; cols: string[]; cells: Cell[][]; totals?: { rows: Cell[]; cols: Cell[]; all: Cell } }
  profile: { columns: { name: string; type: string; nulls: Figure; spread?: number[]; flag?: boolean }[] }
  evidence: { level: "strong" | "moderate" | "weak"; reason: string }
  dumbbell: { rows: { label: string; a: number; b: number }[]; a: string; b: string; unit?: string }
  quantiles: { label?: string; p10: number; p50: number; p90: number; unit: string; max?: number }
}

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

/** One row of what a step read or wrote — `prompt`, `rows`, `query`. */
export interface TraceIoRow {
  label: string
  value: string
  /** Set the value as code, keeping its line breaks — a query, a formula. */
  code?: boolean
}

/**
 * A step of the run behind an answer. Only `label` and `state` are required;
 * everything else is the step's record, filled in as the run streams — its
 * time, its attempts, the reasoning it streamed, what went in and came out.
 */
export interface TraceStep {
  id?: string
  label: string
  /** What the step is doing or did, in a line — `14 rows · 3 batches`. */
  detail?: string
  /**
   * `failed` stops the run at this step; `waiting` is a step held on the
   * analyst — an ask; `retrying` is a failed attempt about to go again;
   * `stopped` is a step the analyst interrupted.
   */
  state: "done" | "running" | "pending" | "failed" | "waiting" | "retrying" | "stopped"
  /** Why a failed step failed, under it. */
  error?: string
  /** The step's machine name, in mono on its record — `translate_thought`. */
  key?: string
  /** When the step started, as an ISO 8601 time. A running step counts up from it. */
  startedAt?: string
  /** How long it took, in ms, once settled. */
  duration?: number
  /** Which attempt this is, and of how many allowed — `retrying 2/3`. */
  attempt?: number
  attempts?: number
  /** The model's reasoning, streamed under the step while it runs. */
  thinking?: string
  /** What went in and what came out — the step's audit record. */
  io?: { input?: TraceIoRow[]; output?: TraceIoRow[] }
}

// ── turns ───────────────────────────────────────────────────────────────────

export type AskState = "pending" | "answered" | "skipped" | "superseded" | "expired"
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
