import * as React from "react"

import { cn } from "../../lib/utils"

/**
 * The closed set of capabilities a callable may spend.
 *
 * Nine values, fixed. The catalogue is grouped by these and an envelope
 * ceilings them, so this is a vocabulary rather than a list that grows.
 */
export type Bound =
  | "none"
  | "network"
  | "graph_read"
  | "graph_write"
  | "schema_write"
  | "ingest"
  | "llm"
  | "plan_write"
  | "work_write"

/**
 * One hue per bound, fixed — colour follows the bound, never its position in a
 * list. Five come from the status tokens because they already mean the right
 * thing; the other four take data-palette slots, which are chosen for being
 * distinguishable from each other rather than for meaning anything.
 */
const SWATCH: Record<Bound, string> = {
  none: "bg-muted-foreground",
  network: "bg-warning",
  graph_read: "bg-success",
  graph_write: "bg-data-2",
  schema_write: "bg-data-4",
  ingest: "bg-info",
  llm: "bg-data-7",
  plan_write: "bg-data-5",
  work_write: "bg-destructive",
}

export interface BoundChipProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  bound: Bound
  /**
   * Render the swatch alone, for somewhere the name is already written beside
   * it. Use sparingly — see the note on colour below.
   */
  swatchOnly?: boolean
}

/**
 * What a task is allowed to spend, as a swatch and a name.
 *
 * It appears on a task node in a flow, in a run's record header, on a catalogue
 * row and in the parameter form's contract card — everywhere a reader has to
 * know *what this act costs* before reading what it does.
 *
 * **The name is always there.** The swatch is a scanning aid, not the carrier:
 * nine hues cannot be told apart reliably, several pairs are close, and a
 * colour-blind reader gets nothing from any of them. `swatchOnly` exists for
 * the one case where the name is already printed next to the chip.
 *
 * Deliberately not a `Badge`. A badge carries *state* and takes a tone from the
 * status palette; a bound is a fixed property of a callable and must not read
 * as "this went well" because it happens to be green.
 */
export const BoundChip = React.forwardRef<HTMLSpanElement, BoundChipProps>(
  ({ bound, swatchOnly, className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex max-w-full shrink-0 items-center gap-1.5 font-mono text-meta text-muted-foreground",
        className,
      )}
      aria-label={swatchOnly ? `bound: ${bound}` : undefined}
      {...props}
    >
      <span aria-hidden className={cn("size-1.5 shrink-0", SWATCH[bound])} />
      {swatchOnly ? null : <span className="truncate">{bound}</span>}
    </span>
  ),
)
BoundChip.displayName = "BoundChip"

export { SWATCH as boundSwatch }
