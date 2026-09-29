import * as React from "react"

import { cn } from "../../lib/utils"

export interface ScopeLineProps extends React.HTMLAttributes<HTMLDivElement> {
  /** What the figure covers, in order — period, comparison, filters, population, freshness. */
  parts: React.ReactNode[]
}

/**
 * What an answer covers, stated in one strip: `Q3 2026 · vs Q2 · Stores,
 * Online · 214 stores · as of 06:00`.
 *
 * Every analytic answer carries one, above its figures, so a number is never
 * read without the period and population it was computed over. The parts are
 * exactly as applied — the filters the query ran with, not the ones asked for.
 */
export const ScopeLine = React.forwardRef<HTMLDivElement, ScopeLineProps>(
  ({ parts, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex w-fit max-w-full flex-wrap border border-border font-mono text-xs text-muted-foreground",
        className,
      )}
      {...props}
    >
      {parts.map((part, i) => (
        <span key={i} className="border-r border-border/60 px-2 py-0.5 last:border-r-0">
          {part}
        </span>
      ))}
    </div>
  ),
)
ScopeLine.displayName = "ScopeLine"
