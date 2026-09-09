import * as React from "react"

import { cn } from "../../lib/utils"

export interface TimelineEntryProps
  // `title` is the entry's heading, not the element's tooltip attribute.
  extends Omit<React.HTMLAttributes<HTMLLIElement>, "title"> {
  /** When — `Fri 5 Sep`, `09:47`, `Sun`. */
  when: React.ReactNode
  /** A one-line summary. The body below carries the detail. */
  title?: React.ReactNode
  /** A marker in the rail — a `StatusDot`, usually. */
  marker?: React.ReactNode
  children?: React.ReactNode
}

export interface TimelineListProps
  extends React.HTMLAttributes<HTMLOListElement> {
  children?: React.ReactNode
}

/**
 * What happened, newest first.
 *
 * A task's history, a session's past rounds, a schedule's firings. An `<ol>`
 * because the order carries meaning — these are events in sequence, not a set.
 *
 * `when` is a column rather than a line above the entry, so a reader scanning
 * for "what changed on Friday" reads down one edge instead of hunting through
 * prose.
 */
export const TimelineList = React.forwardRef<
  HTMLOListElement,
  TimelineListProps
>(({ className, children, ...props }, ref) => (
  <ol ref={ref} className={cn("flex flex-col", className)} {...props}>
    {children}
  </ol>
))
TimelineList.displayName = "TimelineList"

export const TimelineEntry = React.forwardRef<
  HTMLLIElement,
  TimelineEntryProps
>(({ when, title, marker, className, children, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("flex gap-2 border-b border-border py-1.5 last:border-b-0", className)}
    {...props}
  >
    <span className="flex w-[72px] shrink-0 items-baseline gap-1.5 text-meta text-muted-foreground">
      {marker ? <span className="translate-y-1">{marker}</span> : null}
      <span className="truncate">{when}</span>
    </span>
    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
      {title != null ? <span className="font-medium">{title}</span> : null}
      {children}
    </div>
  </li>
))
TimelineEntry.displayName = "TimelineEntry"
