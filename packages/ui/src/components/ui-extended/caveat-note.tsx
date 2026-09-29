import * as React from "react"

import { cn } from "../../lib/utils"

export interface CaveatNoteProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The kind of caveat, one word — `indicative`, `association`, `simulation`. */
  label: React.ReactNode
  /** What was excluded, imputed or assumed, and how far to trust the figure. */
  children?: React.ReactNode
}

/**
 * How far to trust the figure above it.
 *
 * What was excluded, imputed or assumed, said beside the answer rather than
 * in a footnote, and labelled with its kind so a reader scanning several
 * answers can tell an association from a simulation at a glance. Tinted, not
 * bordered: it qualifies the answer, it is not an error.
 */
export const CaveatNote = React.forwardRef<HTMLDivElement, CaveatNoteProps>(
  ({ label, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-baseline gap-2 bg-warning/15 px-2 py-1.5 text-sm", className)}
      {...props}
    >
      <span className="shrink-0 whitespace-nowrap font-mono text-xs font-semibold text-warning">
        {label}
      </span>
      <span className="min-w-0">{children}</span>
    </div>
  ),
)
CaveatNote.displayName = "CaveatNote"
