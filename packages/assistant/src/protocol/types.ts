import type {
  AskPresetId,
  BlockPresetId,
  FlowId,
  PatternId,
  StageId,
  ValueTypeId,
} from "../grammar"

/**
 * A conversation is **data**, like a dashboard. Everything in this file is
 * JSON-serialisable: the API sends a {@link ConversationSpec}, then patches;
 * the component renders whatever spec it is given and sends events back.
 *
 * The shapes are fixed by Analyst Flow Grammar. An ask preset fixes the type of
 * the value that comes back; a block preset fixes the options it reads; a
 * pattern fixes which blocks an answer has. A screen that needs more is a
 * grammar change or a new preset, never an extra field here.
 */

// ── values ──────────────────────────────────────────────────────────────────

/**
 * A figure with its type, written by `formatValue`. Until `formatValue` lands
 * in `@invana/ui`, a figure may also arrive already written, as a string.
 */
export interface TypedValue {
  value: number
  type: ValueTypeId
  /** Open vocabulary — `kg/ha`, `plots`, `pollinations`. */
  unit?: string
  /** The interval of an estimate, with its level. */
  ci?: [number, number]
  level?: number
  /** The count the figure rests on. */
  n?: number
}

export type Figure = string | number | TypedValue

/** A table cell that says whether its change is good or bad. */
export type Cell = Figure | null | { value: Figure; tone?: "good" | "bad"; strong?: boolean }

export type Tone = "good" | "bad" | "warn" | "neutral"

// ── ask presets: options in, value out ──────────────────────────────────────

/** A choice the data model holds. `detail` names where it comes from. */
export interface ChoiceOption {
  value: string
  label: string
  detail?: string
  disabled?: boolean
  /** Why it is off or on — `on the causal path`. */
  note?: string
}

export interface ConfirmOptions {
  /** What yes does or costs, in one sentence. `**bold**` marks the cost. */
  question: string
  yes: string
  no: string
  default?: boolean
  hint?: string
}
export interface SingleOptions {
  question: string
  options: ChoiceOption[]
  default?: string
  /** Offer an “Other…” answer typed by the analyst. */
  other?: boolean
  hint?: string
}
export interface MultiOptions {
  question: string
  options: ChoiceOption[]
  default?: string[]
  min?: number
  max?: number
  hint?: string
}
export interface QuickOptions {
  question: string
  options: { value: string; label: string }[]
  default?: string
  hint?: string
}
export interface PeriodOptions {
  question: string
  options: { value: string; label: string; from: string; to: string }[]
  default?: string
  custom?: boolean
  hint?: string
}
export interface NumberOptions {
  question: string
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
  /** Each step is an ask of its own; the value is keyed by step id. */
  steps: ({ id: string } & AskSpec)[]
}
export interface FormOptions {
  question: string
  fields: {
    name: string
    label: string
    type: "number" | "text" | "date" | "select"
    unit?: string
    default?: string | number
    /** Shown beside the value — `quoted 14 d`. */
    aside?: string
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
 * Ask preset → the options it reads.
 *
 * Keyed by exactly the grammar's ask preset ids; `grammar.test.ts` checks it.
 */
export interface AskOptionsByPreset {
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
}

/** Ask preset → the type of the value the analyst's reply carries. */
export interface AskValueByPreset {
  confirm: boolean
  single: string
  multi: string[]
  quick: string
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
}

export type AskSpec = {
  [P in AskPresetId]: { preset: P } & AskOptionsByPreset[P]
}[AskPresetId]

// ── block presets: the options each block reads ─────────────────────────────

export interface ActionOption {
  id: string
  label: string
  variant?: "primary" | "secondary" | "ghost"
}

export interface MetricOptions {
  label: string
  value: Figure
  /** The comparison, already worded — `▲ 3 pts vs Q2 · target 110%`. */
  delta?: string
  tone?: Tone
}

export interface Column {
  key: string
  label: string
  align?: "left" | "right"
}

export interface BlockOptionsByPreset {
  narrative: { text: string; cites?: number[] }
  metric: MetricOptions
  grid: { tiles: MetricOptions[] }
  table: { columns: Column[]; rows: Record<string, Cell>[]; total?: number; noun?: string }
  attr: {
    columns: (Column & { dir?: "higher" | "lower" })[]
    rows: Record<string, Cell>[]
    total?: number
    noun?: string
  }
  record: { rows: { label: string; value: string }[] }
  ranked: { items: { label: string; value: number; display?: string }[] }
  timeseries: {
    series: { name: string; points: [string, number][] }[]
    band?: { label?: string; lower: number; upper: number }
    forecastFrom?: string
    marks?: { at: string; label?: string; tone?: Tone }[]
    unit?: string
  }
  bars: {
    groups: string[]
    series: { name: string; values: number[] }[]
    target?: { value: number; label: string }
    highlight?: string
    unit?: string
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
  timeline: { events: { when: string; text: string; tone?: Tone }[] }
  subgraph: { nodes: { id: string; label: string }[]; edges: { from: string; to: string }[] }
  method: { label?: string; code: string; meta?: string }
  citations: { sources: { label: string; count?: Figure }[] }
  files: { files: { name: string; size: string; digest: string }[] }
  proposal: { title?: string; rows: { label: string; value: string }[]; consequence: string; actions: ActionOption[] }
  cannot: { reason: string; remedy: string; nearest?: string }
  caveat: { label: string; text: string }
  scope: { parts: string[] }
  checks: { rows: { label: string; ok: boolean; count?: Figure }[] }
  suggestions: { items: string[] }
  trace: { steps: TraceStep[] }
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
}

export type BlockSpec = {
  [P in BlockPresetId]: BlockBase & { preset: P } & BlockOptionsByPreset[P]
}[BlockPresetId]

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

export interface TraceStep {
  id?: string
  label: string
  detail?: string
  state: "done" | "running" | "pending"
}

// ── turns ───────────────────────────────────────────────────────────────────

export type AskState = "pending" | "answered" | "skipped" | "superseded" | "expired"
export type AnswerState = "running" | "partial" | "complete" | "cannot" | "error" | "stopped"

export interface AnalystTurn {
  id: string
  role: "analyst"
  text: string
  /** What the prompt was about — carried scope, a selection. */
  context?: string[]
}

export interface AskTurn {
  id: string
  role: "assistant"
  kind: "ask"
  stage: StageId
  state: AskState
  ask: AskSpec
  /** The analyst's reply, once answered. Its type is fixed by the preset. */
  value?: unknown
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
  envelope?: Envelope
  /** Streamed while the answer runs; kept as the record of what was done. */
  trace?: TraceStep[]
  blocks: BlockSpec[]
  suggestions?: string[]
}

export type Turn = AnalystTurn | AskTurn | AnswerTurn

export interface ConversationSpec {
  id: string
  title?: string
  /** Scope carried by the whole thread, until a turn changes it. */
  scope?: Record<string, string>
  turns: Turn[]
}
