import { cn, Skeleton } from "@invana/ui"

import { SuggestionChips } from "../asks/suggestion-chips"
import type { Tone } from "../protocol/types"

/** One bar of a skeleton: its width as a share of the block, and a height in px when it is not a text line. */
type Bar = [width: number, height?: number]

const LINES: Bar[] = [[0.6], [0.75], [0.5]]
/** A chart: the plot, then its legend. */
const CHART: Bar[] = [[1, 110], [0.55, 7]]
/** A ranked list or a timeline: rows that shorten, then the line under them. */
const ROWS: Bar[] = [[0.92], [0.74], [0.55], [0.38], [0.4, 7]]

/**
 * The skeleton each block draws while its data is on the way, shaped like the
 * block so the card does not jump when it lands. A preset not named here gets
 * text lines.
 */
const SHAPE: Record<string, Bar[]> = {
  metric: [[0.45], [0.3, 22], [0.55]],
  grid: [[1, 56]],
  record: [[0.6], [0.75], [0.5], [0.68]],
  table: [[1, 7], [1], [1], [1]],
  attr: [[1, 7], [1], [1], [1]],
  pivot: [[1, 7], [1], [1], [1]],
  coef: [[1, 7], [1], [1], [1]],
  files: [[0.7], [0.55], [0.62]],
  ranked: ROWS,
  timeline: ROWS,
  funnel: ROWS,
  pareto: ROWS,
  tornado: ROWS,
  forest: ROWS,
  dumbbell: ROWS,
  timeseries: CHART,
  bars: CHART,
  waterfall: CHART,
  histogram: CHART,
  matrix: CHART,
  correlation: CHART,
  scatter: CHART,
  box: CHART,
  control: CHART,
  survival: CHART,
  decomposition: CHART,
  modeleval: CHART,
  quantiles: CHART,
  subgraph: CHART,
}

/** A block whose data is on the way. */
export function BlockSkeleton({ preset }: { preset: string }) {
  const bars = SHAPE[preset] ?? LINES
  return (
    <div role="status" aria-label="Loading" className="flex flex-col gap-1.5 py-0.5">
      {bars.map(([width, height], i) => (
        <Skeleton
          key={i}
          className="rounded-[2px]"
          style={{ width: `${width * 100}%`, height: height ?? 9 }}
        />
      ))}
    </div>
  )
}

/**
 * A block with nothing to draw, saying what is missing — never a blank card.
 * Follow-ups that would find something sit under it.
 */
export function BlockEmpty({
  text,
  suggestions,
  onSuggest,
}: {
  text: string
  suggestions?: string[]
  onSuggest: (text: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="m-0 rounded-[3px] border border-dashed border-border px-2 py-3.5 text-center text-sm text-muted-foreground">
        {text}
      </p>
      {suggestions?.length ? <SuggestionChips items={suggestions} onSelect={onSuggest} /> : null}
    </div>
  )
}

/** The line under a block. A warning is inked as one. */
export function BlockCaption({ text, tone }: { text: string; tone?: Tone }) {
  return (
    <p
      className={cn(
        "m-0 text-xs",
        tone === "warn" ? "text-warning" : tone === "bad" ? "text-destructive" : "text-muted-foreground",
      )}
    >
      {text}
    </p>
  )
}
