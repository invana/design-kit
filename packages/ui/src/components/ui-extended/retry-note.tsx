import * as React from "react"

import { cn } from "../../lib/utils"

export interface RetryNoteProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Which attempt this is — `retry 1 of 2`. */
  attempt?: React.ReactNode
  /** What happened, in time — `no response in 2.0s; the second returned in 0.6s`. */
  children?: React.ReactNode
}

/**
 * The database was slow, not wrong.
 *
 * One of the four run outcomes (DS8), and like a repair it renders on its step
 * rather than as a card. Transient: nothing is asked of the reader, because it
 * is already retrying — visibly — and the answer still arrives.
 *
 * Separate from `RepairNote` on purpose. A retry means *the same query, again*;
 * a repair means *a different query*. Collapsing them into one component with a
 * `reason` prop would lose the only distinction that matters to the reader.
 */
export const RetryNote = React.forwardRef<HTMLDivElement, RetryNoteProps>(
  ({ attempt, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-wrap items-baseline gap-1.5 py-0.5 pl-4 text-meta text-muted-foreground",
        className,
      )}
      {...props}
    >
      {attempt != null ? (
        <span className="shrink-0 font-medium text-warning">{attempt}</span>
      ) : null}
      <span>{children}</span>
    </div>
  ),
)
RetryNote.displayName = "RetryNote"
