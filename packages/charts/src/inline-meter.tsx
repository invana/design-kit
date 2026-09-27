/**
 * A share, drawn as a bar inside a table cell with its value beside it — a
 * model's share of queries, a step's share of a plan's work.
 *
 * DOM, not canvas: it sits in every row of a table, sets in the row's own type
 * and needs nothing a canvas gives.
 *
 * The bar's length is `value ÷ max`; the number is `value` itself. A column of
 * small shares can pass `max` = the largest share so the longest bar fills the
 * track while every number stays the true share. Zero, or no value, reads `—`
 * with no track: an empty bar looks like a measured zero, and a dash says there
 * is nothing to measure.
 *
 * `tone` is the fill's job: `primary` by default, `muted` for a secondary column,
 * and the status tones only when the share *is* a status. When the row is an
 * entity with its own colour — a model, a node type — pass `color` instead, so
 * the meter carries the same hue as the entity everywhere else.
 */
import * as React from "react"
import { cn } from "@invana/ui"

export type InlineMeterTone = "primary" | "muted" | "success" | "warning" | "destructive"

const TONE: Record<InlineMeterTone, string> = {
  primary: "bg-primary",
  muted: "bg-muted-foreground",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
}

export interface InlineMeterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** The share, on the same scale as `max` — `0.32` of 1. `null` reads as `—`. */
  value: number | null | undefined
  /** What a full track means. Default 1. */
  max?: number
  /** How the value is written. Default: a whole percentage of 1 — `32%`. */
  format?: (value: number) => string
  tone?: InlineMeterTone
  /** An entity's colour, as CSS — `var(--color-data-2)`. Overrides `tone`. */
  color?: string
  /** What is being measured, for assistive tech — `share of queries`. */
  label?: string
}

const percent = (v: number) => `${Math.round(v * 100)}%`

export const InlineMeter = React.forwardRef<HTMLDivElement, InlineMeterProps>(
  ({ value, max = 1, format = percent, tone = "primary", color, label, className, ...props }, ref) => {
    const none = value == null || value <= 0
    const share = none ? 0 : Math.min(1, value / (max || 1))
    return (
      <div
        ref={ref}
        role={none ? undefined : "meter"}
        aria-label={label}
        aria-valuenow={none ? undefined : value}
        aria-valuemin={none ? undefined : 0}
        aria-valuemax={none ? undefined : max}
        className={cn("flex min-w-0 items-center gap-2", className)}
        {...props}
      >
        {none ? null : (
          <span aria-hidden className="h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-muted">
            <span
              className={cn("block h-full rounded-full", color ? undefined : TONE[tone])}
              style={{ width: `${share * 100}%`, background: color }}
            />
          </span>
        )}
        <span className="text-sm tabular-nums text-muted-foreground">
          {none ? "—" : format(value)}
        </span>
      </div>
    )
  },
)
InlineMeter.displayName = "InlineMeter"
