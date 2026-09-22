import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "../ui/button"

export interface RecordPagerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Where the reader is — `step 7 of 9`. */
  position?: React.ReactNode
  onPrevious?: () => void
  onNext?: () => void
  /** What the two controls are called. The defaults name the *record*, not the direction. */
  previousLabel?: string
  nextLabel?: string
}

/**
 * The record before this one, and the one after.
 *
 * A step opened from a run's trace is one of nine, and the reader almost always
 * wants the next one — so walking the run costs two keystrokes rather than a
 * return to the list and a second drill-in.
 *
 * **Both controls carry a name.** An icon-only button with no accessible name
 * is a control a screen reader announces as "button", which is the one thing a
 * pager must not be; `previousLabel` and `nextLabel` name the record, so it
 * reads *previous step* rather than *left*.
 *
 * At either end the control is **disabled, not hidden**: a pager that loses a
 * button at the edges moves the other one under the reader's cursor.
 */
export const RecordPager = React.forwardRef<HTMLDivElement, RecordPagerProps>(
  (
    {
      position,
      onPrevious,
      onNext,
      previousLabel = "Previous",
      nextLabel = "Next",
      className,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-1.5", className)}
      {...props}
    >
      {position != null ? (
        <span className="shrink-0 text-sm text-muted-foreground">{position}</span>
      ) : null}
      <span className="flex items-center">
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label={previousLabel}
          disabled={!onPrevious}
          onClick={onPrevious}
        >
          <ChevronLeft aria-hidden />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label={nextLabel}
          disabled={!onNext}
          onClick={onNext}
        >
          <ChevronRight aria-hidden />
        </Button>
      </span>
    </div>
  ),
)
RecordPager.displayName = "RecordPager"
