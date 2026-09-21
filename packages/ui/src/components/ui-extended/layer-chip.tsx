import * as React from "react"

import { cn } from "../../lib/utils"

/**
 * The five governed classes of participant, plus the spine.
 *
 * Fixed — a Graph does not add a layer. `agent` is the **spine**: the runtime
 * itself, which does the participating rather than being a participant, and is
 * never governed. It is addressed and drawn like the rest so the ledger has one
 * shape.
 */
export type Layer =
  | "graph_data"
  | "llm"
  | "third_party"
  | "cache"
  | "human"
  | "agent"

/** What a reader calls the layer. The address segment is not the label. */
const LABEL: Record<Layer, string> = {
  graph_data: "graph data",
  llm: "llm",
  third_party: "third party",
  cache: "cache",
  human: "human",
  agent: "agent",
}

/**
 * One hue per layer, fixed — colour follows the layer, never its position.
 *
 * Four are the data-palette slots `BoundChip` left free, so the two can sit in
 * one row on A2 without sharing a hue between different vocabularies. Two are
 * deliberate:
 *
 * - `llm` takes `data-7`, the slot `BoundChip` gives the `llm` **bound**. Same
 *   concept, same hue; two hues for one idea is the confusion worth avoiding.
 * - `agent` is `muted-foreground`, because the spine is never governed and must
 *   not read as a bound somebody could set. `BoundChip` spends the same token on
 *   `none` for the same reason — *nothing to set here*.
 */
const SWATCH: Record<Layer, string> = {
  graph_data: "bg-data-1",
  llm: "bg-data-7",
  third_party: "bg-data-8",
  cache: "bg-data-3",
  human: "bg-data-6",
  agent: "bg-muted-foreground",
}

export interface LayerChipProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  layer: Layer
  /**
   * How many participants this layer holds — `graph data 4`. Omit where the
   * count is already in the row, and note that `0` is a fact worth printing:
   * *nothing is configured* reads differently from *nothing matched*.
   */
  count?: number
  /**
   * The layer is closed, empty or out of view: the swatch drops to the muted
   * token and the label goes with it. The chip stays legible — this is *not
   * in play*, never *not there*.
   */
  dim?: boolean
}

/**
 * One class of participant, as a swatch and a name.
 *
 * It heads a `LayerSection`, bands a run's `LayerStrip`, and counts a layer in
 * the Worlds drawer — everywhere a reader has to know *what kind of thing this
 * is* before reading which one.
 *
 * **The name is always there.** Six hues cannot be told apart reliably and a
 * colour-blind reader gets nothing from any of them: the swatch speeds up
 * scanning a list you can already read, and carries nothing on its own.
 *
 * Deliberately not a `Badge` and deliberately not `BoundChip`. A badge carries
 * *state* from the status palette; a bound is what a callable may **spend**; a
 * layer is what a participant **is**. The two chips co-occur on the agent
 * boards, which is why they never share a hue.
 */
export const LayerChip = React.forwardRef<HTMLSpanElement, LayerChipProps>(
  ({ layer, count, dim, className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex max-w-full shrink-0 items-center gap-1.5 font-mono text-sm",
        dim ? "text-muted-foreground/70" : "text-muted-foreground",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 shrink-0",
          dim ? "bg-muted-foreground/50" : SWATCH[layer],
        )}
      />
      <span className="truncate">{LABEL[layer]}</span>
      {count != null ? (
        <span className="shrink-0 tabular-nums opacity-70">{count}</span>
      ) : null}
    </span>
  ),
)
LayerChip.displayName = "LayerChip"

export { SWATCH as layerSwatch, LABEL as layerLabel }
