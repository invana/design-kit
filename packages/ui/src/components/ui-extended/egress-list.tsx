import * as React from "react"

import { cn } from "../../lib/utils"
import { AddressChip } from "./address-chip"

/**
 * What of the Graph's data may accompany a call across the boundary.
 *
 * A **closed** set, because an open one is a list nobody can audit: a reader
 * has to know that what is not named cannot be sent, and that only holds if the
 * vocabulary is fixed.
 */
export type EgressClass =
  | "type_names"
  | "property_names"
  | "the_question"
  | "property_values"
  | "record_ids"
  | "aggregates"
  | "everything"

export interface EgressListProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** The destination this governs — `llm/anthropic-prod/claude-opus-5`. */
  to: string
  /** What may be sent. **Empty is the default and means nothing may.** */
  classes?: EgressClass[]
  /**
   * What was actually withheld on a real crossing. Absent reads as a **rule**
   * at rest; present reads as an **event** — see the note below.
   */
  cut?: EgressClass[]
}

/**
 * Per destination: what may be sent, and what was cut.
 *
 * **Egress is declared per destination, on the rule that matched it.** A
 * run-wide setting would have to be the strictest of its destinations, which is
 * the least useful one — so this component is always about *one* address, and a
 * surface showing several renders several.
 *
 * **Reading a thing and sending it are different permissions.** A query may
 * filter on `Deal.revenue` while the value never enters a prompt — used to
 * **compute**, not to **reason**. That is the distinction this list exists to
 * make visible, and it is why `property_values` being absent is worth as much
 * screen as the classes that are present.
 *
 * **`cut` is what makes it evidence rather than configuration.** The same
 * component states the bound before a run and what the bound actually withheld
 * after one; without `cut`, a reader cannot tell a rule that did work from a
 * rule that never bit.
 *
 * An empty `classes` is drawn in words, because the lens default is `[]` and a
 * blank row would read as *not configured* rather than *nothing may leave*.
 */
export const EgressList = React.forwardRef<HTMLDivElement, EgressListProps>(
  ({ to, classes = [], cut = [], className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex min-w-0 flex-col gap-1", className)}
      {...props}
    >
      <AddressChip address={to} />

      <div className="flex min-w-0 flex-col gap-0.5 pl-3">
        {classes.length === 0 ? (
          <span className="text-sm text-destructive">
            nothing may be sent
          </span>
        ) : (
          <span className="flex min-w-0 flex-wrap items-center gap-1 text-sm text-muted-foreground">
            <span className="shrink-0">may send</span>
            {classes.map((c) => (
              <span
                key={c}
                className="rounded-control bg-muted px-1 font-mono text-foreground"
              >
                {c}
              </span>
            ))}
          </span>
        )}

        {cut.length ? (
          <span className="flex min-w-0 flex-wrap items-center gap-1 text-sm text-muted-foreground">
            <span className="shrink-0">cut</span>
            {cut.map((c) => (
              <span
                key={c}
                className="rounded-control bg-muted px-1 font-mono text-destructive line-through decoration-destructive/50"
              >
                {c}
              </span>
            ))}
          </span>
        ) : null}
      </div>
    </div>
  ),
)
EgressList.displayName = "EgressList"
