import * as React from "react"

import { cn } from "../../lib/utils"
import { Card } from "../ui/card"
import { Eyebrow } from "./eyebrow"

export interface PanelBoxProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /**
   * What this band is — `Input · what opened this run`, `result.json`, `Log`.
   * Without one there is no label bar: the box still frames its content, which
   * is how a band of figures sits on a board as it sits in an answer card.
   */
  title?: React.ReactNode
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
  /**
   * Take the parent's height instead of the content's, the body growing into
   * it — a canvas or a map that is the whole page, which has no content height
   * of its own and would otherwise draw at 0.
   */
  fill?: boolean
  children?: React.ReactNode
  headerClassName?: string
  bodyClassName?: string
}

/**
 * One band of a board: a bordered box, with a label bar over it when it
 * has a `title`.
 *
 * A board is a scrolling column of these — tiles, then the flow, then
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
    { title, aside, flush, fill, className, headerClassName, bodyClassName, children, ...props },
    ref,
  ) => (
    <Card
      ref={ref}
      className={cn(
        // A band is flat: the lift belongs to cards that float, and twenty of
        // these in a column would read as twenty floating things rather than
        // one page. Its corner is the surface dial, as a Card's is.
        "flex min-w-0 flex-col overflow-hidden rounded-surface shadow-none",
        fill && "h-full min-h-0",
        className,
      )}
      {...props}
    >
      {title != null ? (
        <div
          className={cn(
            "flex h-control-md shrink-0 items-center border-b border-border bg-chrome px-2.5",
            headerClassName,
          )}
        >
          <Eyebrow aside={aside} className="w-full">
            {title}
          </Eyebrow>
        </div>
      ) : null}
      <div
        // 10/12 under a label bar rather than a uniform 12: the header rule is
        // already holding the top edge, so equal padding all round reads as
        // too much air above the first row. With no bar, the box's own border
        // holds every edge alike.
        className={cn(
          "flex min-w-0 flex-col",
          fill && "min-h-0 flex-1",
          flush ? "p-0" : title != null ? "px-2.5 py-2" : "p-2.5",
          bodyClassName,
        )}
      >
        {children}
      </div>
    </Card>
  ),
)
PanelBox.displayName = "PanelBox"
