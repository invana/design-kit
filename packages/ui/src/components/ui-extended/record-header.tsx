import * as React from "react"
import { ChevronRight } from "lucide-react"

import { cn } from "../../lib/utils"
import { StatusDot, type StatusDotProps } from "../ui/status-dot"

export interface RecordHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /**
   * The record's state, as the dot on the left. Omit for a record that has no
   * state of its own — a catalogue entry, a draft being edited.
   */
  tone?: StatusDotProps["tone"]
  /**
   * The record and its parents, outermost first. The **last** crumb is the
   * record this surface is about and is set solid; the ones before it are the
   * path to it and are muted.
   *
   * One crumb is the normal case — a run, a plan. Two is a child: `a run › the
   * task inside it`.
   */
  crumbs: React.ReactNode[]
  /** What is true about it — a `<BoundChip>`, a status `<Badge>`, a kind. */
  chips?: React.ReactNode
  /** What you can do to it — prev/next, a view switch, buttons, a `…` menu. */
  actions?: React.ReactNode
  /**
   * The bar's height, on the control scale — a bar is as tall as a control of
   * its size. `lg` (40px at a 13px root) tops a page or a dashboard; `md`
   * (32px) tops a panel or a drawer, level with a `PanelBox` header. Either
   * holds `sm` chips and buttons.
   */
  size?: "md" | "lg"
}

const SIZE = {
  md: "h-control-md gap-2 px-3",
  lg: "h-control-lg gap-2.5 px-4",
} as const

/**
 * Which record you are looking at, across the top of the surface showing it.
 *
 * A run dashboard, a step dashboard, a plan, a draft — every one of them opens
 * with this line, so a reader who followed a link knows what they are reading
 * before they read any of it.
 *
 * It is **not** a `ContextBar`. That is the `sm` bar under a panel and describes the
 * *view* — counts, a keyboard hint, a tab-shaped switch. This is above the
 * content and names the *record*, which is why the crumbs are mono: they are
 * identifiers, not prose.
 *
 * It is not a `Breadcrumb` either, though it contains one shape of one. A
 * breadcrumb is navigation up a tree; these two crumbs are a record and its
 * parent, shown so the child is not read out of context.
 */
export const RecordHeader = React.forwardRef<HTMLDivElement, RecordHeaderProps>(
  ({ tone, crumbs, chips, actions, size = "lg", className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex shrink-0 items-center border-b border-border bg-card",
        SIZE[size],
        className,
      )}
      {...props}
    >
      {tone ? <StatusDot tone={tone} size={size} /> : null}

      <div className="flex min-w-0 items-center gap-1.5">
        {crumbs.map((crumb, i) => {
          const last = i === crumbs.length - 1
          return (
            <React.Fragment key={i}>
              {i > 0 ? (
                <ChevronRight
                  aria-hidden
                  className="size-3.5 shrink-0 text-muted-foreground/60"
                />
              ) : null}
              <span
                className={cn(
                  "truncate font-mono",
                  // The **last** crumb gives way first. It is the record's own
                  // name and the longest of them, and the reader is already on
                  // it; the parents are what say *which dashboard this is*, and
                  // at four characters `runs` truncated to `ru…` leaves the one
                  // question a crumb trail exists to answer unanswered.
                  last
                    ? "min-w-[6ch] shrink-[999] text-base font-semibold text-foreground"
                    : "min-w-[3ch] text-muted-foreground",
                )}
              >
                {crumb}
              </span>
            </React.Fragment>
          )
        })}
      </div>

      {chips ? (
        <span className="flex shrink-0 items-center gap-1.5">{chips}</span>
      ) : null}

      {actions ? (
        <span className="ml-auto flex shrink-0 items-center gap-1.5">{actions}</span>
      ) : null}
    </div>
  ),
)
RecordHeader.displayName = "RecordHeader"
