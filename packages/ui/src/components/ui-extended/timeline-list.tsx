import * as React from "react"

import { cn } from "../../lib/utils"

/**
 * How the list arranges one entry.
 *
 * `columns` — `when` is a fixed left column, entries divided by a rule. The
 * dense-log shape: `when` is short and uniform (`Fri 08:00`) and a reader
 * scanning for "what changed on Friday" reads down one edge. Needs the width.
 *
 * `rail` — `when` sits above the title and a line threads the markers. For a
 * narrow card or sidebar, where a 72px column would eat a third of the width
 * and titles wrap anyway; the rail supplies the alignment the column was.
 */
export type TimelineVariant = "columns" | "rail"

const TimelineVariantContext = React.createContext<TimelineVariant>("columns")

/**
 * Half of a `text-meta` line box (0.923rem × 1.5), so the marker centres on
 * the `when` line rather than on the middle of the entry.
 */
const RAIL_MARKER_OFFSET = "h-[0.692rem]"

/**
 * The footer's top padding (`pt-1.5`) plus that same half line box, so the
 * rail stops exactly where the next marker would have sat.
 */
const RAIL_FOOTER_TAIL = "h-[1.067rem]"

export interface TimelineEntryProps
  // `title` is the entry's heading, not the element's tooltip attribute.
  extends Omit<React.HTMLAttributes<HTMLLIElement>, "title"> {
  /** When — `Fri 5 Sep`, `09:47`, `Sun`. */
  when: React.ReactNode
  /** A one-line summary. The body below carries the detail. */
  title?: React.ReactNode
  /** A marker in the rail — a `StatusDot`, usually. */
  marker?: React.ReactNode
  children?: React.ReactNode
}

export interface TimelineListProps
  extends React.HTMLAttributes<HTMLOListElement> {
  /** @default "columns" */
  variant?: TimelineVariant
  children?: React.ReactNode
}

export interface TimelineFooterProps
  extends React.HTMLAttributes<HTMLLIElement> {
  children?: React.ReactNode
}

/**
 * What happened, newest first.
 *
 * A task's history, a session's past rounds, a schedule's firings. An `<ol>`
 * because the order carries meaning — these are events in sequence, not a set.
 *
 * Both variants take the same entries; only the arrangement differs. See
 * `TimelineVariant` for which one a surface wants.
 */
export const TimelineList = React.forwardRef<
  HTMLOListElement,
  TimelineListProps
>(({ className, variant = "columns", children, ...props }, ref) => (
  <TimelineVariantContext.Provider value={variant}>
    <ol ref={ref} className={cn("flex flex-col", className)} {...props}>
      {children}
    </ol>
  </TimelineVariantContext.Provider>
))
TimelineList.displayName = "TimelineList"

/**
 * The rail's line, drawn as two segments per entry — one above the marker and
 * one below — rather than one line behind them.
 *
 * A `queued` marker is hollow, so a line running behind it shows through, and
 * the usual fix (a ring in the surface colour) would force the entry to know
 * what it is sitting on — card, popover, sidebar, each a different colour.
 * Segments never pass under the marker, so the rail is right on any surface
 * with any tone.
 *
 * The group variants close the ends: the first entry has no line above its
 * marker, and the last has none below — unless a `TimelineFooter` follows, in
 * which case that entry is no longer `:last-child` and the rail runs on into
 * the footer.
 */
function RailGutter({ marker }: { marker?: React.ReactNode }) {
  return (
    <span className="flex w-2.5 shrink-0 flex-col items-center">
      <span
        aria-hidden
        className={cn(
          "w-px shrink-0 bg-border group-first/entry:bg-transparent",
          RAIL_MARKER_OFFSET,
        )}
      />
      {marker}
      <span
        aria-hidden
        className="w-px flex-1 bg-border group-last/entry:bg-transparent"
      />
    </span>
  )
}

export const TimelineEntry = React.forwardRef<
  HTMLLIElement,
  TimelineEntryProps
>(({ when, title, marker, className, children, ...props }, ref) => {
  const variant = React.useContext(TimelineVariantContext)

  if (variant === "rail") {
    return (
      <li
        ref={ref}
        className={cn("group/entry flex gap-2.5", className)}
        {...props}
      >
        <RailGutter marker={marker} />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 pb-4 group-last/entry:pb-0">
          <span className="text-meta text-muted-foreground">{when}</span>
          {title != null ? <span className="font-medium">{title}</span> : null}
          {children}
        </div>
      </li>
    )
  }

  return (
    <li
      ref={ref}
      className={cn("flex gap-2 border-b border-border py-1.5 last:border-b-0", className)}
      {...props}
    >
      <span className="flex w-[72px] shrink-0 items-baseline gap-1.5 text-meta text-muted-foreground">
        {marker ? <span className="translate-y-1">{marker}</span> : null}
        <span className="truncate">{when}</span>
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {title != null ? <span className="font-medium">{title}</span> : null}
        {children}
      </div>
    </li>
  )
})
TimelineEntry.displayName = "TimelineEntry"

/**
 * What to do next, at the end of the rail — `View changelog →`, `See all runs`.
 *
 * The rail runs into it, which is what says the list continues rather than
 * stops. `role="presentation"` because a footer is not one of the events: it
 * drops the `<li>` from the list's count while its content stays readable.
 *
 * `columns` has no rail to run on, so the footer is a plain last row there.
 */
export const TimelineFooter = React.forwardRef<
  HTMLLIElement,
  TimelineFooterProps
>(({ className, children, ...props }, ref) => {
  const variant = React.useContext(TimelineVariantContext)

  if (variant === "rail") {
    return (
      <li
        ref={ref}
        role="presentation"
        className={cn("flex gap-2.5", className)}
        {...props}
      >
        <span className="flex w-2.5 shrink-0 justify-center">
          <span aria-hidden className={cn("w-px bg-border", RAIL_FOOTER_TAIL)} />
        </span>
        <div className="min-w-0 flex-1 pt-1.5">{children}</div>
      </li>
    )
  }

  return (
    <li ref={ref} role="presentation" className={cn("pt-1.5", className)} {...props}>
      {children}
    </li>
  )
})
TimelineFooter.displayName = "TimelineFooter"
