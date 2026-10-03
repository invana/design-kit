import * as React from "react"

import { Button, PropertyList, PropertyRow, cn } from "@invana/ui"

export interface RecordDescriptionDetail {
  label: React.ReactNode
  value: React.ReactNode
  /** The value in the mono face — an id, a mode, a date. */
  mono?: boolean
}

export interface RecordDescriptionProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** The one field a reader scans — one line, truncated, until `More`. */
  description?: React.ReactNode
  /** What `More` shows beneath the full description, as label/value pairs. */
  details?: RecordDescriptionDetail[]
  moreLabel?: string
  lessLabel?: string
}

/**
 * A record's own metadata, on the line under its `RecordHeader`.
 *
 * The description reads on one line, and `More` puts the rest — the whole
 * description, then the record's facts as a `PropertyList` — in place, and
 * `Less` folds it back. Not in a tooltip or a dialog: the reader is already
 * looking at the record.
 *
 * `More` is there only when there is more: details to show, or a description
 * the line cuts.
 */
export const RecordDescription = React.forwardRef<HTMLDivElement, RecordDescriptionProps>(
  (
    { description, details, moreLabel = "More", lessLabel = "Less", className, ...props },
    ref,
  ) => {
    const [expanded, setExpanded] = React.useState(false)
    const [clipped, setClipped] = React.useState(false)
    const lineRef = React.useRef<HTMLParagraphElement>(null)

    React.useLayoutEffect(() => {
      const el = lineRef.current
      if (!el || expanded) return
      const measure = () => setClipped(el.scrollWidth - el.clientWidth > 1)
      measure()
      const observer = new ResizeObserver(measure)
      observer.observe(el)
      return () => observer.disconnect()
    }, [expanded, description])

    const hasMore = clipped || expanded || (details?.length ?? 0) > 0

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-1 border-b border-border bg-card px-3 pb-2", className)}
        {...props}
      >
        <div className="flex min-w-0 items-baseline gap-2">
          <p
            ref={lineRef}
            className={cn(
              "min-w-0 flex-1 text-sm text-muted-foreground",
              expanded ? "whitespace-pre-line" : "truncate",
            )}
          >
            {description}
          </p>
          {hasMore ? (
            <Button
              type="button"
              variant="link"
              size="sm"
              className="h-auto shrink-0 p-0"
              aria-expanded={expanded}
              onClick={() => setExpanded((open) => !open)}
            >
              {expanded ? lessLabel : moreLabel}
            </Button>
          ) : null}
        </div>
        {expanded && details?.length ? (
          <PropertyList labelWidth={110}>
            {details.map((d, i) => (
              <PropertyRow key={i} label={d.label} mono={d.mono}>
                {d.value}
              </PropertyRow>
            ))}
          </PropertyList>
        ) : null}
      </div>
    )
  },
)
RecordDescription.displayName = "RecordDescription"
