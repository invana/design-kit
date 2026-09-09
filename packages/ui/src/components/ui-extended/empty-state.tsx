import * as React from "react"

import { cn } from "../../lib/utils"

export interface EmptyStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** An icon or illustration. Sized by the caller. */
  icon?: React.ReactNode
  /** What is not here — `Nothing loaded yet`. States the fact, not an apology. */
  title: React.ReactNode
  /** The path out of it, in order. */
  description?: React.ReactNode
  /** Live actions the user can take now. */
  actions?: React.ReactNode
  /** What is not available yet, and what unlocks it. See `EmptyStateLock`. */
  locks?: React.ReactNode
}

export interface EmptyStateLockProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  icon?: React.ReactNode
  children?: React.ReactNode
}

/**
 * A surface with nothing in it yet.
 *
 * The important half is `locks`. An empty product that only says "nothing here"
 * leaves the user guessing whether they are stuck or simply early; naming the
 * thing that unlocks each surface turns an empty screen into a sequence.
 *
 * Separate from `UnderDevelopment`, which says *we* have not built it. This one
 * says *you* have not filled it — different cause, different next step.
 */
export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, actions, locks, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center gap-2 p-6 text-center",
        className,
      )}
      {...props}
    >
      {icon ? <div className="text-muted-foreground">{icon}</div> : null}
      <h3 className="font-medium">{title}</h3>
      {description != null ? (
        <p className="max-w-prose text-muted-foreground">{description}</p>
      ) : null}
      {actions ? (
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
          {actions}
        </div>
      ) : null}
      {locks ? (
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
          {locks}
        </div>
      ) : null}
    </div>
  ),
)
EmptyState.displayName = "EmptyState"

/** One not-yet-available surface, and the condition that opens it. */
export const EmptyStateLock = React.forwardRef<
  HTMLSpanElement,
  EmptyStateLockProps
>(({ icon, className, children, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "inline-flex h-6 items-center gap-1.5 border border-dashed border-border px-2 text-meta text-muted-foreground [&_svg]:size-3",
      className,
    )}
    {...props}
  >
    {icon}
    {children}
  </span>
))
EmptyStateLock.displayName = "EmptyStateLock"
