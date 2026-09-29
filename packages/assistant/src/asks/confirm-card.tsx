import * as React from "react"
import { cn } from "@invana/ui"

import { ClarifyActions, ClarifyFootnote } from "@invana/ui"

export interface ConfirmCost {
  /** What it measures — `rows scanned`, `time`, `records written`. */
  label: React.ReactNode
  /** The figure, already written — `2.3B`, `about 40 s`, `0`. */
  value: React.ReactNode
  /** `warning` for the cost that changes something — records it will write. */
  tone?: "warning"
}

export interface ConfirmCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** What yes does, in one sentence. */
  question: React.ReactNode
  /** What yes costs, figure by figure, between the question and the buttons. */
  cost?: ConfirmCost[]
  /** The line under the buttons — where the default came from. */
  hint?: React.ReactNode
  /** The yes and no buttons. */
  children?: React.ReactNode
}

/**
 * Yes or no, where yes states what it costs: the rows it scans, the time it
 * takes, the records it writes. The cost is a row of figures of its own rather
 * than a clause in the sentence, so it is read before the button, not after.
 *
 * The body of a confirm ask, inside its `ClarifyCard`.
 */
export const ConfirmCard = React.forwardRef<HTMLDivElement, ConfirmCardProps>(
  ({ question, cost, hint, className, children, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-2", className)} {...props}>
      <p>{question}</p>
      {cost?.length ? (
        <dl className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {cost.map((c, i) => (
            <div key={i} className="flex items-baseline gap-1.5">
              <dd className={cn("font-mono", c.tone === "warning" && "text-warning")}>{c.value}</dd>
              <dt className="text-muted-foreground">{c.label}</dt>
            </div>
          ))}
        </dl>
      ) : null}
      <ClarifyActions>{children}</ClarifyActions>
      {hint ? <ClarifyFootnote>{hint}</ClarifyFootnote> : null}
    </div>
  ),
)
ConfirmCard.displayName = "ConfirmCard"
