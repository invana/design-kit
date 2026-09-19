import * as React from "react"

import { cn } from "../../lib/utils"
import { AddressChip } from "./address-chip"
import { SliceSummary, type RuleSelect } from "./slice-summary"

/** Which properties of the matched participant survive into the answer. */
export interface RuleProperties {
  /**
   * Excluded by name. Exclusion is the only form: an allow-list of properties
   * would silently drop a property added to the model later, which is the kind
   * of bound that stops applying without anybody editing it.
   */
  exclude?: string[]
}

/** What may accompany a crossing to this destination. */
export interface RuleEgress {
  may_send: string[]
}

export type { RuleSelect }

export interface RuleRowProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** The address pattern this rule matches — `graph_data/model/Deals@*`. */
  match: string
  /** `true` allows, `false` denies. Deny wins at any specificity. */
  allow: boolean
  properties?: RuleProperties
  select?: RuleSelect
  egress?: RuleEgress
  /**
   * The row is being read rather than authored. Read-only rows lose the hover
   * affordance, so a guardrail somebody cannot edit does not look pressable.
   */
  readOnly?: boolean
}

/**
 * One rule, read as a sentence: what it matches, whether it allows, and what it
 * narrows.
 *
 * It is the unit of a `LayerSection`, so a lens reads as five bands of these
 * rather than a table of five columns most of which are empty — a rule that
 * slices carries a select line, one that does not carries nothing.
 *
 * **Deny is the loud one.** An allow is the ordinary state and sits muted; a
 * deny takes the destructive token, because [deny wins at any specificity] and
 * a reader scanning a long lens for *what is shut* should find it without
 * reading every row.
 *
 * The sub-lines are facts about the match, so they hang under it and inherit
 * its indent rather than becoming columns. A row with none of them is one line
 * tall, which is what most rows are.
 */
export const RuleRow = React.forwardRef<HTMLDivElement, RuleRowProps>(
  (
    { match, allow, properties, select, egress, readOnly, className, ...props },
    ref,
  ) => {
    const excluded = properties?.exclude ?? []
    const sends = egress?.may_send ?? []
    const sliced = Boolean(
      select?.time || select?.geo || Object.keys(select?.dims ?? {}).length,
    )

    return (
      <div
        ref={ref}
        className={cn(
          // The verb column is `5ch` — the width of `allow` in the mono face it
          // is set in. A character unit rather than a pixel one, so the indent
          // holds when `data-density` moves the font size, and so every row
          // aligns whether its verb is `allow` or `deny`.
          "grid min-w-0 grid-cols-[5ch_minmax(0,1fr)] items-baseline gap-x-2 gap-y-0.5",
          "rounded-control px-1 py-1",
          !readOnly && "hover:bg-accent",
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            "font-mono text-meta",
            allow ? "text-muted-foreground" : "font-semibold text-destructive",
          )}
        >
          {allow ? "allow" : "deny"}
        </span>
        <AddressChip
          address={match}
          tone={allow ? "allowed" : "denied"}
          className="min-w-0"
        />

        {excluded.length || sliced || sends.length ? (
          <div className="col-start-2 flex min-w-0 flex-col gap-0.5">
            {excluded.length ? (
              <span className="truncate text-meta text-muted-foreground">
                excludes {excluded.join(", ")}
              </span>
            ) : null}
            {sliced ? <SliceSummary select={select} variant="line" /> : null}
            {sends.length ? (
              <span className="truncate text-meta text-muted-foreground">
                may send {sends.join(", ")}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    )
  },
)
RuleRow.displayName = "RuleRow"
