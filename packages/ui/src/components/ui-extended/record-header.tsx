import * as React from "react"
import { ChevronRight } from "lucide-react"

import { cn } from "../../lib/utils"
import { StatusDot, type StatusDotProps } from "../ui/status-dot"

/** A crumb the reader can follow back — a section, a parent record. */
export interface RecordHeaderCrumb {
  label: React.ReactNode
  href?: string
  onClick?: () => void
}

export interface RecordHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /**
   * The record's state, as the dot on the left. Omit for a record that has no
   * state of its own — a catalogue entry, a draft being edited.
   */
  tone?: StatusDotProps["tone"]
  /**
   * The icon of the section the record lives in — the same icon its `leftNav`
   * item shows — drawn in a tinted tile before the crumbs. It says *what kind
   * of thing* this is without a kind label.
   */
  icon?: React.ReactNode
  /** The tile's tint, from the colour tokens. `primary` by default. */
  iconTone?: "primary" | "info" | "success" | "warning" | "muted"
  /**
   * The record and its parents, outermost first. The **last** crumb is the
   * record this surface is about and is set solid; the ones before it are the
   * path to it and are muted.
   *
   * One crumb is the normal case — a run, a plan. Two is a child: `a run › the
   * task inside it`. A crumb given as `{ label, href | onClick }` is a link
   * back — `Agents › Fare Analyst` — and the trail becomes a breadcrumb.
   */
  crumbs: (React.ReactNode | RecordHeaderCrumb)[]
  /** What is true about it — a `<BoundChip>`, a status `<Badge>`, a kind. */
  chips?: React.ReactNode
  /** What you can do to it — prev/next, a view switch, buttons, a `…` menu. */
  actions?: React.ReactNode
  /**
   * The bar's height, on the control scale — a bar is as tall as a control of
   * its size. `lg` (40px at a 13px root) tops a page or a board; `md`
   * (32px) tops a panel or a drawer, level with a `PanelBox` header. Either
   * holds `sm` chips and buttons.
   */
  size?: "md" | "lg"
  /**
   * How the crumbs read. `record` sets them mono — they are identifiers, a run
   * id, a task key. `page` sets them in the UI face, the last as the page's
   * title — the head of a detail page whose crumbs are names, not ids.
   */
  variant?: "record" | "page"
}

const SIZE = {
  md: "h-control-md gap-2 px-3",
  lg: "h-control-lg gap-2.5 px-4",
} as const

const TILE = { md: "size-control-xs [&_svg]:size-3.5", lg: "size-control-sm [&_svg]:size-4" } as const

const ICON_TONE = {
  primary: "bg-primary/15 text-primary",
  info: "bg-info/15 text-info",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  muted: "bg-muted text-muted-foreground",
} as const

const isLink = (c: React.ReactNode | RecordHeaderCrumb): c is RecordHeaderCrumb =>
  typeof c === "object" && c !== null && !React.isValidElement(c) && "label" in c

/**
 * Which record you are looking at, across the top of the surface showing it.
 *
 * A run board, a step board, a plan, a draft — every one of them opens
 * with this line, so a reader who followed a link knows what they are reading
 * before they read any of it.
 *
 * It is **not** a `ContextBar`. That is the `sm` bar under a panel and describes the
 * *view* — counts, a keyboard hint, a tab-shaped switch. This is above the
 * content and names the *record*, which is why the crumbs are mono by default:
 * they are identifiers, not prose.
 *
 * The head of a detail page is the same line in `variant="page"`: the
 * section's `icon` in a tile, the section as a link back, then the record's
 * name as the title, its chips and its acts — one row, no second line.
 *
 * Usage::
 *
 *   <RecordHeader
 *     variant="page"
 *     icon={<Bot />}
 *     crumbs={[{ label: "Agents", onClick: openAgents }, "Fare Analyst"]}
 *     chips={<Badge variant="outline" size="sm">v4</Badge>}
 *     actions={<Button size="sm">Run</Button>}
 *   />
 */
export const RecordHeader = React.forwardRef<HTMLDivElement, RecordHeaderProps>(
  (
    { tone, icon, iconTone = "primary", crumbs, chips, actions, size = "lg", variant = "record", className, ...props },
    ref,
  ) => {
    const linked = crumbs.some(isLink)
    const Trail = linked ? "nav" : "div"
    return (
      <div
        ref={ref}
        className={cn(
          "flex shrink-0 items-center border-b border-border bg-chrome",
          SIZE[size],
          className,
        )}
        {...props}
      >
        {tone ? <StatusDot tone={tone} size={size} /> : null}

        {icon ? (
          <span
            aria-hidden
            className={cn("inline-flex shrink-0 items-center justify-center rounded-control", TILE[size], ICON_TONE[iconTone])}
          >
            {icon}
          </span>
        ) : null}

        <Trail
          aria-label={linked ? "Breadcrumb" : undefined}
          className="flex min-w-0 items-center gap-1.5"
        >
          {crumbs.map((crumb, i) => {
            const last = i === crumbs.length - 1
            const cls = cn(
              "truncate",
              variant === "record" && "font-mono",
              // The **last** crumb gives way first. It is the record's own
              // name and the longest of them, and the reader is already on
              // it; the parents are what say *which board this is*, and
              // at four characters `runs` truncated to `ru…` leaves the one
              // question a crumb trail exists to answer unanswered.
              last
                ? "min-w-[6ch] shrink-[999] text-base font-semibold text-foreground"
                : "min-w-[3ch] text-muted-foreground",
            )
            return (
              <React.Fragment key={i}>
                {i > 0 ? (
                  <ChevronRight
                    aria-hidden
                    className="size-3.5 shrink-0 text-muted-foreground/60"
                  />
                ) : null}
                {isLink(crumb) && (crumb.href || crumb.onClick) ? (
                  <a
                    href={crumb.href ?? "#"}
                    onClick={
                      crumb.onClick
                        ? (e) => {
                            e.preventDefault()
                            crumb.onClick!()
                          }
                        : undefined
                    }
                    aria-current={last ? "page" : undefined}
                    className={cn(cls, "rounded-control hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring")}
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span className={cls} aria-current={linked && last ? "page" : undefined}>
                    {isLink(crumb) ? crumb.label : crumb}
                  </span>
                )}
              </React.Fragment>
            )
          })}
        </Trail>

        {chips ? (
          <span className="flex shrink-0 items-center gap-1.5">{chips}</span>
        ) : null}

        {actions ? (
          <span className="ml-auto flex shrink-0 items-center gap-1.5">{actions}</span>
        ) : null}
      </div>
    )
  },
)
RecordHeader.displayName = "RecordHeader"
