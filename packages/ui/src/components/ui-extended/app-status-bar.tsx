import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"
import { StatusDot } from "../ui/status-dot"

const stateVariants = cva("inline-flex shrink-0 items-center gap-1.5 font-medium", {
  variants: {
    tone: {
      active: "text-success",
      running: "text-primary",
      draft: "text-muted-foreground",
      review: "text-warning",
      error: "text-destructive",
    },
  },
  defaultVariants: { tone: "active" },
})

export interface AppStatusBarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stateVariants> {
  /** The session's state — `ACTIVE`, `DRAFT`, `RUNNING`, `REVIEW`. */
  state?: React.ReactNode
  /** What the session currently holds — `26 nodes · 41 edges · 60 fps`. */
  children?: React.ReactNode
  /** Right-hand slot. The build version, usually. */
  end?: React.ReactNode
}

/**
 * The 25px line at the bottom of the window.
 *
 * It describes the **session**, not the screen: what is loaded, what state it
 * is in, which build is running. That is why it barely changes as you navigate
 * — a status bar that flickered with every route would stop being somewhere the
 * eye can rest.
 *
 * Generalised from `ChatSessionStatusBar`, which is the same bar scoped to a
 * thread. This one adds the state marker, because at the application level
 * "what state is this in" is the first question and a bare row of counters does
 * not answer it.
 */
export const AppStatusBar = React.forwardRef<HTMLDivElement, AppStatusBarProps>(
  ({ state, tone, end, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex h-[25px] shrink-0 items-center gap-2 border-t border-border px-2 text-meta text-muted-foreground",
        className,
      )}
      {...props}
    >
      {state != null ? (
        <span className={cn(stateVariants({ tone }))}>
          <StatusDot
            tone={
              tone === "error"
                ? "error"
                : tone === "review"
                  ? "warning"
                  : tone === "running"
                    ? "running"
                    : tone === "draft"
                      ? "muted"
                      : "success"
            }
          />
          {state}
        </span>
      ) : null}
      {state != null && children ? <span aria-hidden>•</span> : null}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {end != null ? <span className="shrink-0">{end}</span> : null}
    </div>
  ),
)
AppStatusBar.displayName = "AppStatusBar"
