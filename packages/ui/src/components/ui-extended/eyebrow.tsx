import * as React from "react"

import { cn } from "../../lib/utils"

export interface EyebrowProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Right-aligned trailing text — a count, a position, a state. Kept separate
   * from `children` so the label stays left and the fact stays right without
   * every call site building its own flex row.
   */
  aside?: React.ReactNode
  /**
   * `muted` (default) for a label being scanned past, `foreground` when it
   * titles a card that has no other heading, `accent` when it names something
   * the reader is being taught.
   */
  tone?: "muted" | "foreground" | "accent"
  children?: React.ReactNode
}

/**
 * The smallest heading in the system: a label over the thing it names.
 *
 * `WHY IT MATTERS`, `1 · CONNECTED`, `OPTIONAL`, `REFERENCED COMPONENTS`. It
 * titles a band of content without the weight — or the 35px and the rule — of
 * a {@link SectionHeader}, so several can sit in one scrolling column and still
 * read as subordinate to the panel's own title.
 *
 * Uppercase at `text-sm` with tracking, because at this size caps are what
 * separate a label from the sentence under it; lowercase at 11px reads as body
 * copy set small. That is also why it is a component rather than four utility
 * classes: the treatment was being retyped, and a label that drifts a weight or
 * a tracking step in one panel stops reading as the same kind of thing.
 *
 * `tone="accent"` is for a label that names something the reader is being
 * *taught* rather than something they are scanning — a callout's kind, a
 * concept's name. Use it rarely; muted is the default for a reason.
 */
export const Eyebrow = React.forwardRef<HTMLDivElement, EyebrowProps>(
  ({ aside, tone = "muted", className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-baseline gap-2 text-sm font-semibold uppercase tracking-wide",
        tone === "muted" && "text-muted-foreground",
        tone === "foreground" && "text-foreground",
        tone === "accent" && "text-primary",
        className,
      )}
      {...props}
    >
      <span className="min-w-0 truncate">{children}</span>
      {aside != null ? (
        <span className="ml-auto shrink-0 font-normal normal-case tracking-normal text-muted-foreground">
          {aside}
        </span>
      ) : null}
    </div>
  ),
)
Eyebrow.displayName = "Eyebrow"
