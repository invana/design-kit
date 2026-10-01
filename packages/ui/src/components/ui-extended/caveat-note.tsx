import * as React from "react"

import { cn } from "../../lib/utils"

export interface CaveatNoteProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The kind of caveat, one word — `indicative`, `association`, `simulation`. */
  label: React.ReactNode
  /** What was excluded, imputed or assumed, and how far to trust the figure. */
  children?: React.ReactNode
  /**
   * `warning` (the default) qualifies the figure. `info` says what was filled
   * in rather than measured; `destructive` says the data itself is wrong or late.
   */
  tone?: "warning" | "info" | "destructive"
  /** A link after the text, to what the caveat is about — `Show the 4 stores`. */
  action?: React.ReactNode
  onAction?: () => void
}

const TONE = {
  warning: { box: "bg-warning/15", label: "text-warning" },
  info: { box: "bg-info/15", label: "text-info" },
  destructive: { box: "bg-destructive/15", label: "text-destructive" },
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
  ({ label, tone = "warning", action, onAction, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-baseline gap-2 px-2 py-1.5 text-sm", TONE[tone].box, className)}
      {...props}
    >
      <span className={cn("shrink-0 whitespace-nowrap font-mono text-xs font-semibold", TONE[tone].label)}>
        {label}
      </span>
      <span className="min-w-0">
        {children}
        {action != null ? (
          <>
            {" "}
            <button
              type="button"
              onClick={onAction}
              className="whitespace-nowrap text-xs text-primary hover:underline focus-visible:underline focus-visible:outline-none"
            >
              {action}
            </button>
          </>
        ) : null}
      </span>
    </div>
  ),
)
CaveatNote.displayName = "CaveatNote"
