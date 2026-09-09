import React from "react"

import { cn } from "../../lib/utils"
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card"
import { TooltipProvider } from "../ui/tooltip"
import { ErrorBoundary } from "./error-boundary"
import { NavHorizontalItems, type NavHorizontalItem } from "./nav-horizontal"


export interface PanelContentProps {
  /** Header title as a node — rendered as-is, so you own its typography. */
  title?: React.ReactNode
  /** Header title as plain text, rendered in the default panel header style. */
  titleText?: string
  children?: React.ReactNode
  /** Classes for the outer card. */
  className?: string
  headerClassName?: string
  bodyClassName?: string
  footerContent?: React.ReactNode
  footerClassName?: string
  /**
   * Actions on the right of the title bar, as `NavHorizontal` items. A panel
   * header has one action area — the right — so this is the item list itself
   * rather than the full `NavHorizontal` props that `PanelStack` and
   * `TabbedPanel` take: there is no left or centre slot to fill here, and the
   * title already owns the left.
   *
   * Give an item `menuItems` and it becomes a `…` overflow dropdown.
   *
   * ```tsx
   * headerActions={[
   *   { name: "Refresh", icon: RefreshCw, onClick: refetch },
   *   { name: "More options", icon: MoreHorizontal, menuItems: [
   *     { id: "export", label: "Export as CSV", onSelect: exportCsv },
   *   ] },
   *   { name: "Close panel", icon: X, onClick: close },
   * ]}
   * ```
   *
   * Closing is one of these and nothing more — there is no `onClose` prop. A
   * panel that dismisses lists a close item like any other action, which is
   * why the two look and behave identically.
   */
  headerActions?: NavHorizontalItem[]
  /**
   * Keep the header actions hidden until the header is hovered or focused (or
   * a menu inside them is open). Defaults to `false` — unlike a `PanelStack`
   * section, a `PanelContent` is one panel rather than one of a column, so its
   * actions are not noise. A close affordance in particular should not have to
   * be hunted for.
   */
  actionsOnHover?: boolean
}

export function PanelContent({
  title, titleText, children,
  className, headerClassName, bodyClassName, footerContent, footerClassName,
  headerActions, actionsOnHover = false,
}: PanelContentProps) {
  return (
    <ErrorBoundary>
      {/* Header actions are nav items, and those carry tooltips — provide the
          context here so a panel works outside an app shell too. Nesting
          inside an app's own provider is harmless. */}
      <TooltipProvider delayDuration={0}>
        {/* The card is the flex column: header and footer hold their height,
            the body is the only part that scrolls. */}
        <Card className={cn("flex h-full min-h-0 flex-col border-none", className)}>
          <CardHeader
            className={cn(
              "group/panel-header flex h-[35px] shrink-0 flex-row items-center gap-2",
              "space-y-0 border-b py-0 pr-1",
              headerClassName
            )}
          >
            {title && <span className="min-w-0 truncate font-bold leading-none">{title}</span>}
            {titleText && <h4 className="min-w-0 truncate font-bold leading-none">{titleText}</h4>}
            {headerActions && headerActions.length > 0 && (
              <div
                className={cn(
                  "ml-auto flex shrink-0 items-center gap-1 pl-2",
                  actionsOnHover &&
                    "opacity-0 transition-opacity group-hover/panel-header:opacity-100 focus-within:opacity-100 has-[[data-state=open]]:opacity-100"
                )}
              >
                <NavHorizontalItems items={headerActions} />
              </div>
            )}
          </CardHeader>
          <CardContent className={cn("min-h-0 flex-1 overflow-y-auto", bodyClassName)}>
            {children}
          </CardContent>
          {footerContent ? (
            <CardFooter className={cn("shrink-0 border-t", footerClassName)}>
              {footerContent}
            </CardFooter>
          ) : null}
        </Card>
      </TooltipProvider>
    </ErrorBoundary>
  )
}
