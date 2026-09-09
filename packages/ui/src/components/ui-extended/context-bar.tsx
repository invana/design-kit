import * as React from "react"

import { cn } from "../../lib/utils"

export interface ContextBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * What this surface is showing — usually tabs, or a tab-shaped set of views.
   * Sits first because it is the only thing here that changes what you see.
   */
  children?: React.ReactNode
  /**
   * Counts and states about the current view — `1 running`, `2 in review`.
   * Facts, never controls: nothing here should be clickable.
   */
  counters?: React.ReactNode
  /** The keyboard route out — `⌘↵ accept`, `⌘N new task`. */
  hint?: React.ReactNode
}

/**
 * The 28px bar between a panel and the status bar.
 *
 * It answers "where am I, and what is true right now" — the view switch, the
 * counts that matter for the work in front of you, and the shortcut that
 * finishes it.
 *
 * Distinct from `AppStatusBar` below it: this describes the *surface* you are
 * on and changes as you move around; the status bar describes the *session* and
 * barely changes at all. Two bars because they answer different questions —
 * merging them would make a stable line flicker with navigation.
 */
export const ContextBar = React.forwardRef<HTMLDivElement, ContextBarProps>(
  ({ counters, hint, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex h-7 shrink-0 items-center gap-3 border-t border-border px-2 text-meta",
        className,
      )}
      {...props}
    >
      {children ? (
        <div className="flex min-w-0 shrink-0 items-center gap-2">{children}</div>
      ) : null}
      {counters ? (
        <div className="flex min-w-0 flex-1 items-center gap-3 text-muted-foreground">
          {counters}
        </div>
      ) : (
        <span className="flex-1" />
      )}
      {hint != null ? (
        <span className="shrink-0 text-muted-foreground">{hint}</span>
      ) : null}
    </div>
  ),
)
ContextBar.displayName = "ContextBar"
