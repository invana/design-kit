import * as React from "react"

import { cn } from "../../lib/utils"
import { StatusDot } from "../ui/status-dot"

export interface StageTrailStep {
  id: string
  /** `Research`, `Dataset`. */
  label: string
  /** Done, the one the work is at, or not reached yet. */
  state: "done" | "current" | "todo"
}

export interface StageTrailProps extends Omit<React.HTMLAttributes<HTMLElement>, "onSelect"> {
  steps: StageTrailStep[]
  /** A step was picked — open its page. Without it the trail only shows. */
  onPick?: (id: string) => void
}

const TONE = { done: "success", current: "info", todo: "queued" } as const

/**
 * Where a piece of work stands in a fixed run of stages — Research, Dataset,
 * Model, Import, Explore — each a dot and its name, joined by a short rule.
 * It sits in an app header's centre, so it gives up width before anything
 * else does: under 560px of its own width only the current stage keeps its
 * name (the others keep a dot, and name themselves on hover), and the rules
 * shorten. It never pushes the header wider.
 *
 * Not {@link TimelineList}, which is events in time; this is a fixed sequence
 * and where the work is in it.
 */
export const StageTrail = React.forwardRef<HTMLElement, StageTrailProps>(
  ({ steps, onPick, className, ...props }, ref) => (
    <nav
      ref={ref}
      aria-label="Stages"
      className={cn("@container/trail flex w-full min-w-0 justify-center", className)}
      {...props}
    >
      <ol className="flex min-w-0 items-center gap-1">
        {steps.map((step, i) => {
          const current = step.state === "current"
          return (
            <li key={step.id} className="flex min-w-0 items-center gap-1">
              {i ? <span aria-hidden className="h-px w-3 shrink bg-border @min-[560px]/trail:w-8" /> : null}
              <button
                type="button"
                disabled={!onPick}
                aria-current={current ? "step" : undefined}
                aria-label={`${step.label} · ${step.state === "todo" ? "not started" : step.state}`}
                title={step.label}
                onClick={() => onPick?.(step.id)}
                className={cn(
                  "inline-flex h-control-sm shrink-0 items-center gap-1.5 rounded-control px-2 text-muted-foreground",
                  "enabled:hover:bg-accent enabled:hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-default",
                  current && "bg-secondary text-foreground",
                )}
              >
                <StatusDot tone={TONE[step.state]} />
                <span className={cn("truncate", !current && "@max-[559px]/trail:sr-only")}>{step.label}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  ),
)
StageTrail.displayName = "StageTrail"
