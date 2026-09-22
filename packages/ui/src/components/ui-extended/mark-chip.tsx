import * as React from "react"

import { cn } from "../../lib/utils"

/** What the mark means, as a tone. The same seven `StatusDot` uses, less the dot. */
export type MarkTone =
  | "muted"
  | "info"
  | "success"
  | "warning"
  | "destructive"

const TONE: Record<MarkTone, string> = {
  muted: "border-muted-foreground/50 text-muted-foreground",
  info: "border-info/60 text-info",
  success: "border-success/60 text-success",
  warning: "border-warning/60 text-warning",
  destructive: "border-destructive/60 text-destructive",
}

export interface MarkChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: MarkTone
  /** `↺ 2 of 3`, `⏸ 1 of 3`, `live`, `↳ delegates`. */
  children?: React.ReactNode
}

/**
 * What happened to this row that its own columns cannot say.
 *
 * A run's trace row already carries a name, a description, a layer, a role and
 * a duration. What it does *not* carry is the exception: this step took two
 * attempts, this one is painting right now, this one asked a person, this one
 * delegated a run of its own. Those are marks — they appear on a handful of
 * rows and they are the rows a reader is looking for.
 *
 * **Outlined, never filled.** A filled chip competes with the row's own name at
 * the same size; an outline reads as an annotation on the name, which is what it
 * is. Mono, because most marks are counts against a bound (`2 of 3`) and the
 * bound is the engine's number.
 *
 * Distinct from `BoundChip`, and the distinction is the point: a bound is what a
 * callable **may** spend, declared before anything ran. A mark is what a run
 * **did** — it exists only in the record, and it is usually the reason a reader
 * opened the trace at all.
 */
export const MarkChip = React.forwardRef<HTMLSpanElement, MarkChipProps>(
  ({ tone = "warning", className, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex shrink-0 items-center rounded-control border px-1 py-px",
        "font-mono text-xs whitespace-nowrap",
        TONE[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  ),
)
MarkChip.displayName = "MarkChip"
