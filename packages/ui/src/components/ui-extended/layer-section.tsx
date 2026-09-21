import * as React from "react"

import { cn } from "../../lib/utils"
import { LayerChip, type Layer } from "./layer-chip"

export interface LayerSectionProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  layer: Layer
  /**
   * What this layer amounts to, in the reader's words — `permitted whole`,
   * `4 of 5 models · sliced`, `closed · nothing but the two below`.
   *
   * **A closed layer says so here.** Closing a layer is what picking four
   * models out of six means, and it is a stated field rather than something
   * inferred from *there is an allow rule in this band* — so the band has to
   * print it, or an auditor reads an allow-list as a list of exceptions.
   */
  summary?: React.ReactNode
  /** The layer's `RuleRow`s. None is a real state — see `summary`. */
  children?: React.ReactNode
  /** How many participants the layer holds, shown on the chip. */
  count?: number
  /** The layer is out of view for this lens: the whole band dims. */
  dim?: boolean
}

/**
 * One layer's band of rules, under the layer's own name and summary.
 *
 * A lens reads as five of these stacked — graph data, llm, third party, cache,
 * human — so *what is shut* is answered by scanning five summary lines rather
 * than by reading every rule. That is the shape the Worlds and Guardrails
 * drawers share, which is why the band is a component and not a heading each
 * screen retypes.
 *
 * **A band with no rules still appears.** An absent layer and a layer with
 * nothing in it are different facts: one is *this Graph has no third parties
 * configured*, the other is *it has them and this lens admits none*. A band
 * that vanished when empty would make the two look alike, and the second is the
 * one worth seeing.
 *
 * The rule is subordinate to the band, so the band's label is a `LayerChip`
 * rather than a heading — the panel's own title is the heading, and five
 * headings under it would compete with it.
 */
export const LayerSection = React.forwardRef<HTMLDivElement, LayerSectionProps>(
  ({ layer, summary, count, dim, className, children, ...props }, ref) => {
    const empty = React.Children.count(children) === 0

    return (
      <section
        ref={ref}
        className={cn("flex min-w-0 flex-col gap-1", className)}
        {...props}
      >
        <div className="flex min-w-0 items-baseline gap-2 border-b border-border pb-1">
          <LayerChip layer={layer} count={count} dim={dim} />
          {summary != null ? (
            <span className="ml-auto min-w-0 shrink truncate text-sm text-muted-foreground">
              {summary}
            </span>
          ) : null}
        </div>

        {empty ? (
          <p className="px-1 py-1 text-sm text-muted-foreground/70">
            no rules in this layer
          </p>
        ) : (
          <div className={cn("flex min-w-0 flex-col", dim && "opacity-60")}>
            {children}
          </div>
        )}
      </section>
    )
  },
)
LayerSection.displayName = "LayerSection"
