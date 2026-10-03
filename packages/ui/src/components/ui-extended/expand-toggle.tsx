import * as React from "react"
import { ChevronRight } from "lucide-react"

import { cn } from "../../lib/utils"

export interface ExpandToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  open: boolean
  /** What opens — `fetch_filings` — read as `Open fetch_filings` / `Close fetch_filings`. */
  label?: string
}

/**
 * The chevron that opens a row into the rows under it — a table's sub-rows, a
 * Gantt's subtasks, a heat strip's children — so every tree in the kit opens
 * with the same control and says the same thing to a screen reader.
 *
 * A leaf beside it keeps the chevron's room with `ExpandToggle.Spacer`, so its
 * text lines up with its expandable siblings.
 */
const ExpandToggleRoot = React.forwardRef<HTMLButtonElement, ExpandToggleProps>(
  ({ open, label, className, onClick, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-expanded={open}
      aria-label={label != null ? `${open ? "Close" : "Open"} ${label}` : open ? "Collapse row" : "Expand row"}
      onClick={(event) => {
        // The row around it may be pickable: opening is not picking.
        event.stopPropagation()
        onClick?.(event)
      }}
      className={cn(
        "inline-flex size-4 shrink-0 items-center justify-center rounded-control text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        className,
      )}
      {...props}
    >
      <ChevronRight
        aria-hidden
        className={cn("size-3.5 transition-transform motion-reduce:transition-none", open && "rotate-90")}
      />
    </button>
  ),
)
ExpandToggleRoot.displayName = "ExpandToggle"

function Spacer({ className }: { className?: string }) {
  return <span aria-hidden className={cn("size-4 shrink-0", className)} />
}

export const ExpandToggle = Object.assign(ExpandToggleRoot, { Spacer })
