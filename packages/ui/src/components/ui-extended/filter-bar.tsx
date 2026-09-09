import * as React from "react"

import { cn } from "../../lib/utils"
import { Button } from "../ui/button"

export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The filter controls. `FilterChip`s, a `SearchInput`, a toggle. */
  children?: React.ReactNode
  /**
   * What the filters left behind — `8 datasets`, `6 tasks`, `7 waiting`.
   *
   * Sits after a spacer, hard right. It is the answer to the question the
   * filters ask, so it belongs on the same line as them and nowhere else.
   */
  summary?: React.ReactNode
}

export interface FilterChipProps
  // `value` is narrowed here to a node — the chip shows what the filter is set
  // to, which is not the button element's form value.
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  /** The dimension — `status`, `kind`, `agent`, `age`. */
  label: React.ReactNode
  /** What it is narrowed to. Absent means "not filtered". */
  value?: React.ReactNode
  /** Marks the chip as narrowing the list, so an active filter is visible while scrolling. */
  active?: boolean
}

/**
 * The row above a list that narrows it.
 *
 * Every list surface in the system has one: the roster, datasets, tasks,
 * schedules, workflows, the review queue. It is a `<Toolbar>`-shaped thing but
 * kept separate — a toolbar holds actions that *do* something, this holds
 * controls that *hide* rows, and mixing them costs the reader the guarantee
 * that nothing here changes their data.
 */
export const FilterBar = React.forwardRef<HTMLDivElement, FilterBarProps>(
  ({ summary, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex h-[30px] shrink-0 items-center gap-1.5 border-b border-border px-2",
        className,
      )}
      {...props}
    >
      {children}
      <span className="flex-1" />
      {summary != null ? (
        <span className="shrink-0 text-meta text-muted-foreground">{summary}</span>
      ) : null}
    </div>
  ),
)
FilterBar.displayName = "FilterBar"

/**
 * One dimension, as a chip that opens a menu.
 *
 * The caret is drawn rather than iconised so the chip stays 22px and reads as
 * one token — `status ▾` — instead of a control with an icon glued to it.
 */
export const FilterChip = React.forwardRef<HTMLButtonElement, FilterChipProps>(
  ({ label, value, active, className, ...props }, ref) => (
    <Button
      ref={ref}
      type="button"
      variant="outline"
      size="xs"
      data-active={active || undefined}
      className={cn(
        "h-[22px] gap-1 px-1.5 font-normal",
        active && "border-primary/40 text-primary",
        className,
      )}
      {...props}
    >
      <span className={cn(value != null && "text-muted-foreground")}>{label}</span>
      {value != null ? <span className="truncate">{value}</span> : null}
      <span aria-hidden className="text-muted-foreground">
        ▾
      </span>
    </Button>
  ),
)
FilterChip.displayName = "FilterChip"
