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
   */
  gauge?: { value: number; target: number; min?: number; max: number; unit?: string }
  /** The recent run of the figure, oldest first, drawn as a sparkline beside it. */
  trend?: number[]
  /** Set on the warning ground: the one figure in a band that needs a second look. */
  flag?: boolean
}

export interface Column {
  key: string
  label: string
  align?: "left" | "right"
}

/** One label/value pair in a record. */
export interface RecordRow {
  label: string
  value: string
  /** Where the value came from — `last year's promotions`, `your input`. */
  source?: string
}

/** Every block this package draws, by kind, and the options its spec carries. */
export interface BlockOptionsByKind {
  narrative: NarrativeOptions
  metric: MetricOptions
  grid: { tiles: MetricOptions[] }
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
    series: { name: string; points: [string, number][] }[]
    band?: { label?: string; lower: number; upper: number }
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

export type BlockKind = keyof BlockOptionsByKind

/** A block as JSON: its kind and its options. The same object in a turn, a panel or a page. */
export type BlockSpec<K extends BlockKind = BlockKind> = {
  [P in K]: { kind: P } & BlockOptionsByKind[P]
}[K]

export interface BlockProps<K extends BlockKind = BlockKind> {
  spec: BlockOptionsByKind[K]
  /**
   * What the reader did, by name — `open` on a table that holds rows back. The
   * shell says what it means: a conversation event, a panel action.
   */
  onAction?: (action: string) => void
}
