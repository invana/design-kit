import * as React from "react"

import { cn } from "../../lib/utils"

export interface DiagnosisCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Where it broke and how — `execute · connection_refused`. Shown in mono. */
  code: React.ReactNode
  /** One sentence a person can act on. Not a stack trace. */
  children?: React.ReactNode
  /** The query, command or request that was attempted. Mono, wraps. */
  attempted?: React.ReactNode
  /** What it ran against, and how hard — `bolt://…:7687 · 2 attempts · 4.1s`. */
  target?: React.ReactNode
  /** `Open the trace`, `Retry`. */
  actions?: React.ReactNode
}

/**
 * Something broke, and it is named.
 *
 * One of the four run outcomes, and its own component (DS8) — a failure must
 * never be one prop away from an answer.
 *
 * Built from evidence: what was tried, against what, how many times. It carries
 * its next step, and nothing partial is dressed up as a result — which is why
 * there is no slot here for "the rows we did get".
 */
export const DiagnosisCard = React.forwardRef<
  HTMLDivElement,
  DiagnosisCardProps
>(({ code, attempted, target, actions, className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-2 border border-destructive/40 bg-card p-2", className)}
    {...props}
  >
    <div className="flex items-center gap-2 text-meta">
      <span className="shrink-0 font-medium text-destructive">diagnosis</span>
      <span className="truncate font-mono text-muted-foreground">{code}</span>
    </div>
    {children != null ? <div>{children}</div> : null}
    {attempted != null || target != null ? (
      <div className="flex flex-col gap-1 border border-border bg-muted/40 p-1.5">
        <span className="text-meta text-muted-foreground">what was tried</span>
        {attempted != null ? (
          <code className="whitespace-pre-wrap break-all font-mono text-meta">
            {attempted}
          </code>
        ) : null}
        {target != null ? (
          <span className="text-meta text-muted-foreground">{target}</span>
        ) : null}
      </div>
    ) : null}
    {actions ? <div className="flex items-center gap-1.5">{actions}</div> : null}
  </div>
))
DiagnosisCard.displayName = "DiagnosisCard"
