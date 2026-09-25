import * as React from "react"
import { ShieldX } from "lucide-react"

import { cn } from "../../lib/utils"

export interface RefusalCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Which bound refused it, as a short label — `refused · the agent's
   * guardrail`. The bound is the point: it says whom to ask.
   */
  label?: React.ReactNode
  /**
   * What was refused and why, in one or two sentences — *This ask was not run.
   * In Everything, decide is cast to … and … does not allow it.*
   */
  children?: React.ReactNode
  /** The way round it — another world, another agent, a person to ask. */
  remedy?: React.ReactNode
}

/**
 * A bound refused the work **before it ran**.
 *
 * Not a cannot-answer and not a failure, and its own component for the same
 * reason those are (DS8): nothing was read, so there is nothing the graph does
 * not hold; nothing broke, so there is no fault to diagnose. A rule said no,
 * and the card names the rule's side so the reader knows whose rule to change.
 *
 * Tinted with the destructive token, because the reader has to act before
 * anything happens — but no citation strip and no retry, since running it again
 * under the same bounds would be refused again.
 */
export const RefusalCard = React.forwardRef<HTMLDivElement, RefusalCardProps>(
  ({ label = "refused", remedy, className, children, ...props }, ref) => (
    <div
      ref={ref}
      role="note"
      className={cn(
        "flex flex-col gap-1 border border-destructive/40 bg-destructive/5 p-2",
        className,
      )}
      {...props}
    >
      <span className="flex items-center gap-1 text-sm font-medium text-destructive">
        <ShieldX className="size-3.5 shrink-0" aria-hidden />
        {label}
      </span>
      {/* The body sets its own ink: a refusal sits in rows that tint their
          text for an error, and the sentence is read, not alarmed at. */}
      <span className="text-foreground">{children}</span>
      {remedy != null ? (
        <span className="text-sm text-muted-foreground">{remedy}</span>
      ) : null}
    </div>
  ),
)
RefusalCard.displayName = "RefusalCard"
