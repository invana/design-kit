import * as React from "react"

import { cn } from "../../lib/utils"
import { Card } from "../ui/card"
import { Eyebrow } from "./eyebrow"

export interface PanelBoxProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** What this band is — `Input · what opened this run`, `result.json`, `Log`. */
  title: React.ReactNode
  /**
   * The fact on the right of the header — `214 lines · tailing`, `rendered from
   * result.json`, a `<Badge>`, a count.
   *
   * Facts and affordances, never a toolbar. A band that needs icon buttons in
   * its header is a panel, and a panel is {@link PanelContent}.
   */
  aside?: React.ReactNode
  /**
   * Drop the body padding, so a full-bleed child meets the border: a canvas, a
   * `DataTable` whose header rule should line up with the box, a chart.
   */
  flush?: boolean
  children?: React.ReactNode
  headerClassName?: string
  bodyClassName?: string
}

/**
 * One band of a dashboard: a bordered box with a label bar over it.
 *
 * A dashboard is a scrolling column of these — tiles, then the flow, then
 * Input beside `result.json`, then the Log. Each box is **content-height and
 * owns no scroller**: the column scrolls, so a band that scrolled itself would
 * hide its own content behind a second bar.
 *
 * Not {@link PanelContent}, which is the other shape: that one fills its
 * parent's height, owns an `overflow-y-auto` body, drops its border because it
 * sits inside panel chrome, and types its header's right side as nav items. All
 * four are wrong for a band. Two components because they are two objects, not
 * one object with a variant.
 *
 * Not {@link SectionHeader} either — that titles a section *inside* a scrolling
 * panel and carries a rule instead of a border box. This is the border box, so
 * its label is an {@link Eyebrow}: the smallest heading, subordinate to the
 * page's own title, which is what a band of six should be.
 */
export const PanelBox = React.forwardRef<HTMLDivElement, PanelBoxProps>(
  (
    { title, aside, flush, className, headerClassName, bodyClassName, children, ...props },
    ref,
  ) => (
    <Card
      ref={ref}
      className={cn(
        // A band is square and flat: the radius and the lift belong to cards
        // that float, and twenty of these in a column would read as twenty
        // floating things rather than one page.
        "flex min-w-0 flex-col overflow-hidden rounded-control shadow-none",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "flex h-[31px] shrink-0 items-center border-b border-border px-2.5",
          headerClassName,
        )}
      >
        <Eyebrow aside={aside} className="w-full">
          {title}
        </Eyebrow>
      </div>
      <div
        // 10/12 rather than a uniform 12: a band's header rule is already
        // holding the top edge, so equal padding all round reads as too much
        // air above the first row and not enough between bands.
        className={cn(
          "flex min-w-0 flex-col",
          flush ? "p-0" : "px-2.5 py-2",
          bodyClassName,
        )}
      >
        {children}
      </div>
    </Card>
  ),
)
PanelBox.displayName = "PanelBox"
