import * as React from "react"

import { cn } from "../../lib/utils"

export interface RepairNoteProps extends React.HTMLAttributes<HTMLDivElement> {
  /** What was wrong — `unknown property Theme.velocity5d`. */
  from: React.ReactNode
  /** What it became — `Theme.velocity_5d`. */
  to: React.ReactNode
}

/**
 * The query went back once, carrying its error, and came back correct.
 *
 * One of the four run outcomes (DS8). It renders **on the step that repaired
 * it**, never as a message in the thread — a repair is a detail of how the
 * answer was reached, not something asked of the reader. Promoting it to a card
 * would make a successful run look like a problem.
 */
export const RepairNote = React.forwardRef<HTMLDivElement, RepairNoteProps>(
  ({ from, to, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-wrap items-center gap-1 py-0.5 pl-4 text-meta text-muted-foreground",
        className,
      )}
      {...props}
    >
      <span className="font-mono line-through decoration-muted-foreground/60">{from}</span>
      <span aria-hidden>→</span>
      <span className="font-mono text-foreground">{to}</span>
    </div>
  ),
)
RepairNote.displayName = "RepairNote"
