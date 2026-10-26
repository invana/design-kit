import * as React from "react"
import { Sparkle } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { FilterChip } from "./filter-bar"

/** One filter that is narrowing a list right now. */
export interface AppliedFilter {
  /** The key the list is filtered by — `agent`, `status`, `since`. */
  field: string
  /** What the reader calls the field — `agent`. */
  title: string
  /** The value as the list's query holds it — `route-auditor`. */
  value: string
  /** The value as the reader reads it — `Route Auditor`. */
  label: string
}

export interface AppliedFiltersProps extends React.HTMLAttributes<HTMLDivElement> {
  filters: AppliedFilter[]
  /** Drop one filter; receives its field and value. */
  onRemove?: (field: string, value: string) => void
  /** Drop every filter at once. Without it there is no `Clear all`. */
  onClearAll?: () => void
  /** Who applied them, when it was not the reader — `the assistant` reads `set by the assistant`. */
  setBy?: string
}

/**
 * The filters narrowing a list, read back as one line over it.
 *
 * `Filtered`, then a chip per filter — `status not served` — each with the ×
 * that drops that one, then who set them when it was not the reader (a link
 * the assistant opened arrives already filtered), then `Clear all` at the far
 * end. It is the answer to "why are only two rows here?", so it draws nothing
 * when nothing is filtered.
 *
 * The chips are `FilterChip`s in `readOnly`: shown, not picked. The list's own
 * `FilterBar` is where a filter is chosen; this is where it is seen and undone.
 */
export const AppliedFilters = React.forwardRef<HTMLDivElement, AppliedFiltersProps>(
  ({ filters, onRemove, onClearAll, setBy, className, ...props }, ref) => {
    if (filters.length === 0) return null
    return (
      <div
        ref={ref}
        role="group"
        aria-label="Applied filters"
        className={cn("flex min-w-0 flex-wrap items-center gap-1.5", className)}
        {...props}
      >
        <span className="text-sm text-muted-foreground">Filtered</span>
        {filters.map((f) => (
          <FilterChip
            key={`${f.field}:${f.value}`}
            readOnly
            label={f.title}
            value={f.label}
            onRemove={onRemove ? () => onRemove(f.field, f.value) : undefined}
            removeLabel={`Remove ${f.title} ${f.label}`}
          />
        ))}
        {setBy ? (
          <span className="inline-flex items-center gap-1 text-sm text-primary">
            <Sparkle className="size-3" aria-hidden="true" />
            set by {setBy}
          </span>
        ) : null}
        {onClearAll ? (
          <Button type="button" variant="link" size="xs" className="ml-auto px-0" onClick={onClearAll}>
            Clear all
          </Button>
        ) : null}
      </div>
    )
  },
)
AppliedFilters.displayName = "AppliedFilters"
