import * as React from "react"

import { cn } from "../../lib/utils"

export interface CannotAnswerCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** What the graph does not hold. One sentence, in the graph's own terms. */
  children?: React.ReactNode
  /**
   * What would change the answer — an import, a connector, a missing model.
   *
   * Not optional in spirit. A refusal without a next step is a dead end, and the
   * reader is left unable to tell "never" from "not yet".
   */
  remedy?: React.ReactNode
  /** Overrides the label. Defaults to `cannot answer`. */
  label?: React.ReactNode
}

/**
 * The graph does not hold what was asked.
 *
 * One of the four run outcomes, and its own component rather than a variant
 * (DS8) — because it is neither a failure nor an empty answer, and it must not
 * be reachable by flipping a prop on either.
 *
 * Dashed, and with **no citation strip**: there is nothing to cite, and an empty
 * strip would read as an uncited claim. This is the surface that keeps the
 * system's promise that it says so when it cannot answer.
 */
export const CannotAnswerCard = React.forwardRef<
  HTMLDivElement,
  CannotAnswerCardProps
>(({ label = "cannot answer", remedy, className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col gap-1 border border-dashed border-border bg-card p-2",
      className,
    )}
    {...props}
  >
    <span className="text-meta font-medium text-muted-foreground">{label}</span>
    <span>{children}</span>
    {remedy != null ? (
      <span className="text-meta text-muted-foreground">{remedy}</span>
    ) : null}
  </div>
))
CannotAnswerCard.displayName = "CannotAnswerCard"
