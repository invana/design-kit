import * as React from "react"

import { cn } from "../../lib/utils"

export interface SectionHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Sits before the title. A 14px lucide icon, usually. */
  icon?: React.ReactNode
  /** What this section is. */
  title: React.ReactNode
  /**
   * How many things are in it — `4`, `6 shown · 1 hidden`, `derived`.
   *
   * Kept separate from `actions` because a count is a fact about the section
   * and an action is something you do to it. They read differently and they
   * align differently.
   */
  count?: React.ReactNode
  /** Trailing controls — `+ add`, `edit`, a toggle. */
  actions?: React.ReactNode
  /** Renders the header without its bottom rule, for a section that opens a card. */
  bare?: boolean
}

/**
 * The bar that titles one section of a panel.
 *
 * A panel is a stack of these: Node types, Edge types, Relationships, Selected,
 * Anchors, Recent plans. It is 35px because that is what reads as a heading
 * against 30px rows without becoming a second toolbar.
 *
 * Not a `<Card>` header — a section is a band inside a scrolling panel, not a
 * container, so it carries a rule rather than a border box.
 */
export const SectionHeader = React.forwardRef<
  HTMLDivElement,
  SectionHeaderProps
>(({ icon, title, count, actions, bare, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-[35px] shrink-0 items-center gap-2 px-2",
      !bare && "border-b border-border",
      className,
    )}
    {...props}
  >
    {icon ? (
      <span className="flex shrink-0 items-center text-muted-foreground [&_svg]:size-3.5">
        {icon}
      </span>
    ) : null}
    <span className="flex-1 truncate font-medium">{title}</span>
    {count != null ? (
      <span className="shrink-0 text-meta text-muted-foreground">{count}</span>
    ) : null}
    {actions ? (
      <span className="flex shrink-0 items-center gap-1">{actions}</span>
    ) : null}
  </div>
))
SectionHeader.displayName = "SectionHeader"
