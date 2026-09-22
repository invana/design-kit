import * as React from "react"

import { cn } from "../../lib/utils"

/**
 * Why a band is not drawn — **and these are three different facts.**
 *
 * - `unrecorded` — nobody wrote this document. A step in flight has no
 *   `result.json` because the interpreter writes it when the row settles.
 * - `purged` — it was written, and retention removed it. The counts and the
 *   outcome stay; the input, the output and the log do not.
 * - `declared-none` — the step declares no such output at all: a `notify` step
 *   returns nothing, and a read under `read_only: true` writes nothing.
 *
 * Collapsing them into one *empty* is the thing this component exists to stop.
 * An empty table claims a step returned an empty result; *purged* claims it
 * returned nothing. Both are lies about a different record.
 */
export type AbsenceReason = "unrecorded" | "purged" | "declared-none"

const WORD: Record<AbsenceReason, string> = {
  unrecorded: "nothing recorded",
  purged: "purged",
  "declared-none": "none declared",
}

export interface AbsenceNoteProps extends React.HTMLAttributes<HTMLDivElement> {
  reason: AbsenceReason
  /** Overrides the word. The engine's own term is better where there is one — `read_only: true`. */
  label?: React.ReactNode
  /** Why, in the record's terms. One or two sentences, and it is not optional in spirit. */
  children?: React.ReactNode
}

/**
 * A band with nothing in it, saying which kind of nothing.
 *
 * It is not `EmptyState`: that invites an action — *load a dataset*, *ask a
 * question* — and there is no action here. A step that recorded nothing is a
 * finished fact about a finished record, and the only thing owed to the reader
 * is which fact it is.
 */
export const AbsenceNote = React.forwardRef<HTMLDivElement, AbsenceNoteProps>(
  ({ reason, label, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-1 px-2.5 py-2", className)}
      {...props}
    >
      {/* Not uppercased: the label is often the engine's own term —
          `read_only: true` — and a page that shouts it back as
          `READ_ONLY: TRUE` has stopped printing the value it is quoting. */}
      <span className="font-mono text-xs tracking-wide text-muted-foreground">
        {label ?? WORD[reason]}
      </span>
      <span className="text-sm leading-relaxed text-muted-foreground">
        {children}
      </span>
    </div>
  ),
)
AbsenceNote.displayName = "AbsenceNote"
