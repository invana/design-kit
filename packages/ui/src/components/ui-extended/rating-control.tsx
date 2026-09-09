import * as React from "react"

import { cn } from "../../lib/utils"

export type Verdict = "appreciate" | "depreciate"

export interface DotRatingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: number
  max?: number
  onChange?: (value: number) => void
  /** Read-only display, e.g. inside a history entry. */
  readOnly?: boolean
  label?: string
}

export interface RatingControlProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  verdict?: Verdict
  onVerdictChange?: (v: Verdict) => void
  weight: number
  onWeightChange?: (w: number) => void
  maxWeight?: number
  /** What the rating refines — a pattern name. */
  refines?: React.ReactNode
  /** Who is rating. An `AgentChip`, usually. */
  by?: React.ReactNode
  /** The note field, and anything else the caller wants under the controls. */
  children?: React.ReactNode
}

/**
 * A small integer, as dots.
 *
 * Weight is 1–3, so a slider or a number input would both be heavier than the
 * value they carry. Dots read at a glance and are still a real radio group
 * underneath. Lives beside `RatingControl` rather than in `ui/` because it is
 * the only thing that uses it; promote it if a second caller appears.
 */
export const DotRating = React.forwardRef<HTMLDivElement, DotRatingProps>(
  ({ value, max = 3, onChange, readOnly, label, className, ...props }, ref) => (
    <div
      ref={ref}
      role={readOnly ? "img" : "radiogroup"}
      aria-label={label ?? `weight ${value} of ${max}`}
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    >
      {Array.from({ length: max }, (_, i) => {
        const n = i + 1
        const on = n <= value
        if (readOnly) {
          return (
            <span
              key={n}
              aria-hidden
              className={cn(
                "size-2.5 rounded-full border",
                on
                  ? "border-primary bg-primary"
                  : "border-muted-foreground bg-transparent",
              )}
            />
          )
        }
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={String(n)}
            onClick={() => onChange?.(n)}
            className={cn(
              "size-2.5 cursor-pointer rounded-full border",
              on
                ? "border-primary bg-primary"
                : "border-muted-foreground bg-transparent",
            )}
          />
        )
      })}
    </div>
  ),
)
DotRating.displayName = "DotRating"

/**
 * A person's verdict on an agent's result.
 *
 * This is the capture signal the learning loop runs on: accepting or rejecting
 * with a weight becomes a Learning that rates the observation and refines the
 * pattern behind it. So the control states its consequence rather than implying
 * it — `by` and `refines` are shown on the control itself.
 *
 * Appreciate and depreciate are one control with two positions, not two
 * buttons: it is a single decision with a sign, and two buttons would invite
 * pressing both.
 */
export const RatingControl = React.forwardRef<
  HTMLDivElement,
  RatingControlProps
>(
  (
    {
      verdict,
      onVerdictChange,
      weight,
      onWeightChange,
      maxWeight = 3,
      refines,
      by,
      className,
      children,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-2 border border-border bg-card p-2", className)}
      {...props}
    >
      <div className="flex items-center gap-2 text-meta">
        <span className="font-medium">Your verdict</span>
        <span className="text-muted-foreground">becomes a Learning</span>
        <span className="flex-1" />
        {by}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div role="radiogroup" className="inline-flex border border-border">
          {(["appreciate", "depreciate"] as const).map((v) => (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={verdict === v}
              onClick={() => onVerdictChange?.(v)}
              className={cn(
                "h-[22px] px-2 text-meta capitalize",
                verdict === v
                  ? v === "appreciate"
                    ? "bg-success text-success-foreground"
                    : "bg-warning text-warning-foreground"
                  : "text-muted-foreground hover:bg-accent",
              )}
            >
              {v}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-meta text-muted-foreground">weight</span>
          <DotRating value={weight} max={maxWeight} onChange={onWeightChange} />
          <span className="text-meta tabular-nums">{weight}</span>
        </div>

        {refines != null ? (
          <span className="text-meta text-muted-foreground">
            refines <span className="text-foreground">{refines}</span>
          </span>
        ) : null}
      </div>

      {children}
    </div>
  ),
)
RatingControl.displayName = "RatingControl"
