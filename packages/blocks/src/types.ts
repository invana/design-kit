import type { AnswerKind, AskKind, BlockKind } from "./kinds"

export type { AnswerKind, AskKind, BlockKind }
import type { ValueTypeId } from "./values"

/**
 * A figure with its type, written one way by `formatValue`. Until that lands
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

export interface NarrativeOptions {
  /**
   * Two or three sentences, leading with the number. `**…**` marks a figure;
   * `[n]` places the marker for source n where the clause it backs ends; a
   * figure led by `▲` or `▼` is drawn in the tone of its direction.
   */
  text: string
  /** Markers appended after the text, for prose that places none of its own. */
  cites?: number[]
  /** The source the reader is on: its marker is lit, as is its row in the citations. */
  active?: number
}

export interface MetricOptions {
  label: string
  /** `null` when there is no figure to give; `delta` then says why. Drawn as a muted `—`. */
  value: Figure | null
  /** The comparison, already worded — `▲ 3 pts vs Q2 · target 110%`. */
  delta?: string
  tone?: Tone
  /**
   * A bar under the figure: `value` against `target` on a scale from `min` to
   * `max`, with the scale's ends and the target written under it in `unit`.
   * Without a `target` it is a plain meter — how full a value with a real
   * ceiling is (`{ value: 0.42, max: 1 }`), with nothing written under it.
   */
  gauge?: { value: number; target?: number; min?: number; max: number; unit?: string }
  /** The recent run of the figure, oldest first, drawn as a sparkline beside it. */
  trend?: number[]
  /** Set on the warning ground: the one figure in a band that needs a second look. */
  flag?: boolean
}

export interface Column {
  key: string
  label: string
  align?: "left" | "right"
  /** Set the column in the mono face — an id, a key, a timestamp. */
  mono?: boolean
}

/** One label/value pair in a record. */
export interface RecordRow {
  label: string
  value: string
  /** Where the value came from — `last year's promotions`, `your input`. */
  source?: string
  /** `false` sets the value in the body face — prose rather than an id or a figure. */
  mono?: boolean
}

/** The options of the blocks first shared by the conversation and the page. */
interface SharedAnswerOptions {
  narrative: NarrativeOptions
  metric: MetricOptions
  grid: {
    tiles: MetricOptions[]
    /**
     * Fit as many tiles across as this width allows, in px — a strip of five or
     * six on a wide panel. Unset, three across, and four sit two by two.
     */
    minTileWidth?: number
  }
  table: {
    columns: Column[]
    rows: Record<string, Cell>[]
    /** How many rows exist; more than `rows` draws `Open all`, which sends the `open` action. */
    total?: number
    noun?: string
    /** What follows the count — `sorted by Δ`, `7 columns`. */
    note?: string
    /** The column the rows are ordered by, marked in its header. */
    sort?: { key: string; dir: "asc" | "desc" }
    /** Rows called out, by index in `rows`. */
    highlight?: number[]
    /** A total row under the rows, set bold. */
    totals?: Record<string, Cell>
    /**
     * The column whose value names a row. Set, a row can be picked: a click
     * sends the `select` action with that row's value.
     */
    rowKey?: string
    /** The `rowKey` value of the row drawn selected. */
    selected?: string | null
  }
  record: {
    rows?: RecordRow[]
    /** Rows under headings — `Identity`, `Performance, semi-arid`. Drawn after `rows`. */
    groups?: { label: string; rows: RecordRow[] }[]
    /** Who or what the record is, above its rows, with its state as a tag. */
    header?: { title: string; initials?: string; status?: { label: string; tone?: Tone } }
  }
  ranked: {
    /** `muted` is the rest folded into one line — `3 others`. */
    items: { label: string; value: number; display?: string; muted?: boolean }[]
    /** Bars grow both ways from a zero rule, with what each side means under them. */
    diverging?: { below: string; above: string }
  }
  timeseries: {
    /**
     * The first is the line; the rest are drawn behind it to read it against —
     * last year beside this — each named at its right end. A point with no
     * value — `null` — breaks the line rather than bridging the gap.
     */
    series: { name: string; points: [string, number | null][] }[]
    band?: { label?: string; lower: number; upper: number }
    /**
     * A line to read against — an alert level, a budget — drawn dashed and
     * named at the right. Every point above it is ringed in the `bad` tone.
     */
    reference?: { value: number; label: string }
    forecastFrom?: string
    /** Names the forecast boundary — `today`. Without one the rule is unlabelled. */
    forecastLabel?: string
    marks?: { at: string; label?: string; tone?: Tone }[]
    unit?: string
  }
  bars: {
    groups: string[]
    /** `muted` draws a series as the comparison — last quarter behind this one. */
    series: { name: string; values: number[]; muted?: boolean }[]
    target?: { value: number; label: string }
    /** A plan per group, drawn as a dashed column the actual stands inside. */
    plan?: { name: string; values: number[] }
    highlight?: string
    unit?: string
  }
}

// ── blocks that return a value: options in, value out ──────────────────────────────────────

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
/** One choice of a form field's `select` or `radio`. */
export interface FormOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
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
    /**
     * `textarea` is several lines of text; `checkbox` a yes/no with its label
     * beside the box; `radio` one of `options` drawn as a list, `select` one
     * of them in a menu.
     */
    type: "number" | "text" | "date" | "select" | "textarea" | "checkbox" | "radio"
    unit?: string
    /** A `checkbox` takes `true`/`false`; `select` and `radio` an option's `value`. */
    default?: string | number | boolean
    /**
     * The choices of a `select` or `radio`. A `description` is a muted line
     * under a radio's label; a `disabled` choice shows but can't be picked.
     */
    options?: FormOption[]
    /** A `textarea`'s visible lines. */
    rows?: number
    /** Text shown in an empty `text` or `textarea`. */
    placeholder?: string
    /** Must be answered — for a `checkbox`, ticked. Holds the submit back until it is. */
    required?: boolean
    /** Shown with its value but not changeable; the value is still sent. */
    disabled?: boolean
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




// ── blocks that show data: the options each reads ─────────────────────────────

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

/** One lane of the activity block: a layer, or a part of one when its parent is opened. */
export interface ActivityLane {
  id: string
  /** `Graph`, `Third party`, `Company.revenue`. */
  label: string
  /** What the lane is called at 280px — `3rd party`. Defaults to `label`. */
  short?: string
  /** At the right — `6.9K/s`, `86k tok`, `2 refused`, `quiet`. `—` when the layer is off. */
  rate?: string
  /** The rate is high: drawn in the info tone. `bad` draws it in the destructive tone. */
  rateTone?: "hot" | "bad"
  /** The layer is not open to this run: its label is muted, its cells hollow. */
  off?: boolean
  /** How busy each slice was, `0`–`1`, oldest first; `null` not touched. */
  cells: (number | null)[]
  /** Slices a rule refused, or where data left the boundary. */
  marks?: { at: number; kind: "refused" | "egress" }[]
  /** Its parts — a model's types and relations — drawn under it, indented, when it is open. */
  children?: ActivityLane[]
  /** Drawn open. The reader can open and close it either way. */
  open?: boolean
}

/** The operation behind a pinned slice — what the run did in that cell. */
export interface ActivityPin {
  /** The lane it is on, by id. */
  lane: string
  /** The cell. */
  at: number
  /** `Company.revenue · write`. */
  title: string
  /** `4.25–4.50 s`. */
  time?: string
  /** The statement, in mono — `SET c.revenue_q3 = $value · 512 rows`. */
  query?: string
  rows?: { label: string; value: string }[]
  /** Under the record — `1 of 3 operations in this window`. */
  note?: string
  /** Sent as an `action` event — `Open in the trace`. */
  action?: ActionOption
}

export interface ActivityOptions {
  /** `live` follows the last seconds; `settled` is the whole run; `stale` has lost the signal. */
  state?: "live" | "settled" | "stale"
  /** The steps over the lanes, in order, each as wide as its share of the axis. */
  bands?: { label: string; span: number; current?: boolean }[]
  /** Labels spread under the lanes — `0 s`, `10 s`, `21 s`. */
  axis?: string[]
  lanes: ActivityLane[]
  /** What one cell covers, for its title — `250 ms`. */
  cell?: string
  /** A line under the lanes — `Third party only in step 3`. `**bold**` as in a narrative. */
  hint?: string
  /** Show the key: touched, refused, left the boundary. */
  legend?: boolean
  /** A slice held open, with its record under the lanes. */
  pinned?: ActivityPin
  /** At the foot — `Open run detail` — sent as `action` events. */
  actions?: ActionOption[]
}

/** A bar's state on the gantt — the engine's own step statuses, as `Gantt` reads them; `refused` is what a rule stopped. */
export type GanttSpecStatus = "succeeded" | "running" | "failed" | "needs_input" | "stopped" | "skipped" | "queued" | "refused"

/** One bar on a row that holds many — a task a worker slot ran, a layer a task reached. */
export interface GanttSpecBar {
  startMs?: number
  durationMs?: number
  status?: GanttSpecStatus
  /** The hover text. */
  title?: string
  /** Names the bar: picking it sends `select` with this key, not the row's. */
  key?: string
  /** Written in the bar. */
  label?: string
  /** Which `palette` entry paints it, instead of its status. */
  group?: string
  /** `outline` is time held, not spent; `dashed` is time that may be spent. */
  variant?: "solid" | "outline" | "dashed"
  /** A second line under the label — `1,204 of 1,251`. */
  note?: string
  /** A badge at the bar's end — `{ "label": "503", "tone": "bad" }`. */
  chip?: { label: string; tone?: Tone }
  /** The bar's own hover card. Any one of these opens it. */
  summary?: string
  result?: Record<string, string | number>
  error?: { code?: string; message?: string }
  log?: string
}

/** One task of a run, on its clock — and the tasks it split into. */
export interface GanttSpecRow {
  /** `task_key` — what the log calls it. Also the row's label. */
  key: string
  /** A human name for the row, instead of the key. */
  label?: string
  /** From the run's zero. A task with neither, and no subtasks, never ran. */
  startMs?: number
  durationMs?: number
  status?: GanttSpecStatus
  /** Earlier attempts, oldest first — the rate-limited fetch before the retry that stuck. */
  attempts?: { startMs?: number; durationMs?: number; status?: GanttSpecStatus; title?: string }[]
  /** Many bars on one row, each its own thing — what a worker slot held, in order. */
  segments?: GanttSpecBar[]
  /** The right-hand cell, instead of the duration — `59% busy`. */
  duration?: string
  /** A sentence under the hover card's header. */
  summary?: string
  /** What it said last — the card's foot. */
  log?: string
  error?: { code?: string; message?: string }
  /** What it produced, as label/value pairs on the card — `{ rows: 412 }`. */
  result?: Record<string, string | number>
  /** The tasks it split into, indented under it. A task with no timing draws their stretch. */
  subtasks?: GanttSpecRow[]
  /** Drawn open. The reader can open and close it either way. */
  open?: boolean
}

export interface GanttOptions {
  /** In plan order. */
  tasks: GanttSpecRow[]
  /** The clock's ceiling — the run's length. Defaults to the last end. */
  spanMs?: number
  /** The *now* line, while the run is in flight. */
  nowMs?: number
  /** The run has not decided its length yet: the last tick reads `8s+`. */
  openEnded?: boolean
  /** Intervals on the axis. `4` by default. */
  ticks?: number
  /** The key column, in px. Defaults to the longest key, up to 40%. */
  labelWidth?: number
  /** The duration column, in px — set alike on Gantts stacked over one clock. */
  durationWidth?: number
  density?: "compact" | "comfortable"
  /** The task picked — a restored view. Picking one sends `select` with its key. */
  selected?: string
  /** A segment's `group` → the class that paints it — `{ "ingest": "bg-data-1" }`. */
  palette?: Record<string, string>
  /** Gates — a moment the run held and spent nothing — ruled under the row they follow. */
  seams?: GanttSpecSeam[]
  /**
   * What the clock counts. `elapsed` (the default) is milliseconds from the
   * run's zero. `seq` is a plan read in order, before it runs: `startMs` and
   * `durationMs` are step numbers, ticks read `step 3`, durations `2 steps`.
   */
  scale?: "elapsed" | "seq"
}

/** A gate, ruled across the stretch of clock it held. */
export interface GanttSpecSeam {
  /** The row it follows, by key. */
  after: string
  /** The label column's word — `approval`. */
  label: string
  startMs: number
  durationMs?: number
  /** Written on the rule — `held for approval`. */
  note?: string
}

/** One state a heat strip's square can be in — named in the legend, coloured by its tone. */
export interface HeatStripState {
  key: string
  label: string
  /** `good` · `bad` · `warn`; `neutral` (the default) is the muted ink. */
  tone?: Tone
  /** A ring, not a fill — for "nothing happened here". */
  hollow?: boolean
}

export interface HeatStripCell {
  /** When — `9:45`. In the square's title. */
  at: string
  /** Its state, by key. */
  state: string
  /** More for the title — `2 names: BPCL, HINDPETRO`. */
  detail?: string
}

/** One labelled strip, and the strips it opens into. */
export interface HeatStripRowOptions {
  id: string
  label: string
  cells: HeatStripCell[]
  children?: HeatStripRowOptions[]
  /** Drawn open. The reader can open and close it either way. */
  open?: boolean
}

export interface HeatStripOptions {
  states: HeatStripState[]
  /** One strip. Send this or `rows`. */
  cells?: HeatStripCell[]
  /** Labelled strips over one axis, each opening into its `children`. */
  rows?: HeatStripRowOptions[]
  /** Labels under the squares, by index — `[{ at: 0, label: "09" }]`. */
  ticks?: { at: number; label: string }[]
}

/** One dated event of the timeline block — and the smaller events it breaks into. */
export interface TimelineEvent {
  when: string
  text: string
  tone?: Tone
  /** A second line under the text. */
  detail?: string
  /** Starts a labelled run of events — `Before`, `Spike`, `After`. */
  section?: string
  /** Calls the event out. */
  highlight?: boolean
  /** The events it breaks into — a customs hold into its steps — drawn under it when it is open. */
  children?: TimelineEvent[]
  /** Drawn open. The reader can open and close it either way. */
  open?: boolean
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


export interface AnswerOptionsByKind extends SharedAnswerOptions {
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
    events: TimelineEvent[]
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
  activity: ActivityOptions
  gantt: GanttOptions
  heatstrip: HeatStripOptions
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




// ── every block ─────────────────────────────────────────────────────────────

/** Every block, by kind, and the options its spec carries. */
export interface BlockOptionsByKind extends AskOptionsByKind, AnswerOptionsByKind {}

/** A block as JSON: its kind and its options. The same object in a turn, a panel or a page. */
export type BlockSpec<K extends BlockKind = BlockKind> = {
  [P in K]: { kind: P } & BlockOptionsByKind[P]
}[K]

/** A block that returns a value, as JSON. Each step of a multi-step one is one of these. */
export type AskSpec = BlockSpec<AskKind>

/** Where a block that returns a value stands: open until answered, then settled. */
export type AskState = "pending" | "answered" | "skipped" | "superseded" | "expired"

export interface BlockProps<K extends BlockKind = BlockKind> {
  spec: BlockOptionsByKind[K]
  /**
   * Everything the reader does, by name, with what it carries: `reply` and
   * `change` with the value, `skip`, `open` on a table holding rows back,
   * `select` with a table row's key, `download` with a file's digest or name,
   * `prompt` with a follow-up's words, `scope` with `{ part, value }`. An
   * action the spec declares (`actions`, a caveat's `action`) is `action` with
   * its id, so its id can never be mistaken for one of these. The shell says
   * what each means.
   */
  onAction?: (action: string, value?: unknown) => void
  /** Where a block that returns a value stands. Unset, it is open. */
  state?: AskState
  /** The value given, once answered. */
  value?: unknown
  /** Names its form and fields. Unset, one is made. */
  id?: string
  /**
   * Set into running text: a table's outer cells sit flush with the words
   * around it. Only the assistant sets it; everywhere else a table keeps its
   * cell padding.
   */
  seamless?: boolean
}

// The options map and the kinds list must name the same kinds.
type Same<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false
const optionsMatchKinds: Same<keyof BlockOptionsByKind, BlockKind> = true
void optionsMatchKinds
