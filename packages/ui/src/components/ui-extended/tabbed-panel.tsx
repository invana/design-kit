import React from "react"
import { cn } from "../../lib/utils"
import { Card, CardFooter } from "../ui/card"
import { NavHorizontalItems, type NavHorizontalItem } from "./nav-horizontal"
import { NavItems } from "./nav-base"
import { ErrorBoundary } from "../ui-extended"
import { TooltipProvider } from "../ui/tooltip"

export interface TabConfig {
  /** Unique identifier for the tab */
  value: string
  /** Label text or custom React node to display in the tab */
  label: string | React.ReactNode
  /**
   * Plain-text name for the tab's tooltip and its accessible name. Only needed
   * when `label` is a node rather than a string — the value is used otherwise.
   */
  name?: string
  /** Optional icon component to show before the label */
  icon?: React.ElementType
  /** Content to display when this tab is active */
  content: React.ReactNode
  /** Whether this tab should be disabled */
  disabled?: boolean
}

export interface TabbedPanelProps {
  /** Array of tab configurations */
  tabs: TabConfig[]
  /** Default active tab value (uncontrolled mode) */
  defaultTab?: string
  /** Controlled active tab value */
  activeTab?: string
  /** Callback when tab changes */
  onTabChange?: (value: string) => void

  /**
   * Actions on the right of the tab bar, as `NavHorizontal` items. A panel
   * header has one action area — the right — so this is the item list itself
   * rather than full `NavHorizontal` props: the tabs already own the left.
   *
   * Give an item `menuItems` and it becomes a `…` overflow dropdown. Closing
   * is one of these items and nothing more; there is no close prop.
   *
   * ```tsx
   * headerActions={[
   *   { name: "Split editor", icon: Columns2, onClick: split },
   *   { name: "Close panel", icon: X, onClick: close },
   * ]}
   * ```
   */
  headerActions?: NavHorizontalItem[]

  /**
   * Fold the tabs that do not fit the header into a `…` dropdown at the end of
   * the strip, instead of letting the strip set the panel's minimum width.
   *
   * **Off by default**, so an existing panel renders exactly as it did. Turn it
   * on for a panel whose width the user controls — a resizable inspector, a
   * side panel — or any strip carrying more than a handful of tabs. The active
   * tab never folds, and arrowing onto a folded one brings it back.
   *
   * ```tsx
   * <TabbedPanel overflow tabs={nineOfThem} />
   * ```
   */
  overflow?: boolean
  /** Accessible name for the overflow trigger. */
  overflowLabel?: string

  /**
   * Keep every tab's content mounted and hide the inactive ones, instead of
   * mounting only the active tab.
   *
   * Off by default. Turn it on when a panel's tabs hold state worth keeping —
   * a scroll position, a half-typed edit, a live canvas — and pay for it in
   * the work every hidden tab keeps doing.
   */
  keepMounted?: boolean

  /** Additional CSS classes for the container */
  className?: string
  /** Additional CSS classes for the header */
  headerClassName?: string
  /** Additional CSS classes for the body/content area */
  bodyClassName?: string
  /** Additional CSS classes for the footer */
  footerClassName?: string

  /** Optional footer content */
  footerContent?: React.ReactNode
}

/**
 * TabbedPanel — a panel whose views sit behind one 30px tab strip.
 *
 * The strip is a `NavItems` tab list (`variant="underline"`), not a Radix
 * `Tabs`: the same component draws this kit's nav rails and its workbook tabs,
 * so tab keyboard behaviour, the `…` overflow and the three visual treatments
 * are written once. Switching content here is a plain `active === value`,
 * which is what makes `keepMounted` possible — Radix unmounts an inactive
 * `TabsContent`, and a panel that tears its canvas down on every tab switch is
 * not a panel anyone wants.
 */
export function TabbedPanel({
  tabs,
  defaultTab,
  activeTab,
  onTabChange,
  headerActions,
  overflow = false,
  overflowLabel = "More panels",
  keepMounted = false,
  className,
  headerClassName,
  bodyClassName,
  footerClassName,
  footerContent,
}: TabbedPanelProps) {
  const [internalTab, setInternalTab] = React.useState(defaultTab || tabs[0]?.value)

  // Use controlled value if provided, otherwise use internal state
  const currentTab = activeTab !== undefined ? activeTab : internalTab

  const handleTabChange = (value: string) => {
    if (activeTab === undefined) {
      setInternalTab(value)
    }
    onTabChange?.(value)
  }

  // `aria-controls` needs a real id per panel, and a panel may be on screen
  // more than once.
  const uid = React.useId()
  const panelId = (value: string) => `${uid}-panel-${value}`

  const items = React.useMemo(
    () =>
      tabs.map((tab) => ({
        key: tab.value,
        name: tab.name ?? (typeof tab.label === "string" ? tab.label : tab.value),
        label: tab.label,
        icon: tab.icon,
        disabled: tab.disabled,
      })),
    [tabs]
  )

  return (
    <ErrorBoundary>
      <TooltipProvider delayDuration={0}>
        {/* The card is the flex column: the header holds its height and the
            body is the only part that grows. That replaces the old
            `h-[calc(100%-30px)]` arithmetic, which assumed a header that could
            never wrap or change height. */}
        <Card className={cn("flex h-full min-h-0 flex-col border rounded-none", className)}>
          <div
            className={cn(
              "flex h-[30px] shrink-0 flex-row items-stretch border-b",
              headerClassName
            )}
          >
            {/* Left: the tabs. `min-w-0 flex-1` is what gives overflow a budget
                to measure against — without it the strip reports that
                everything fits and sets the panel's minimum width instead. */}
            <NavItems
              items={items}
              variant="underline"
              selectionMode="tabs"
              activeKey={currentTab}
              onActiveChange={handleTabChange}
              panelId={panelId}
              overflow={overflow}
              overflowLabel={overflowLabel}
              className="min-w-0 flex-1 gap-0"
              iconClassName="h-3.5 w-3.5 shrink-0"
            />

            {/* Right: Actions */}
            {headerActions && headerActions.length > 0 && (
              <div className="ml-auto flex h-full shrink-0 items-center gap-1 pr-1">
                <NavHorizontalItems items={headerActions} />
              </div>
            )}
          </div>

          {/* Body: Tab content */}
          {tabs.map((tab) => {
            const active = tab.value === currentTab
            if (!keepMounted && !active) return null
            return (
              <div
                key={tab.value}
                id={panelId(tab.value)}
                role="tabpanel"
                aria-label={tab.name ?? (typeof tab.label === "string" ? tab.label : tab.value)}
                hidden={!active}
                // Nothing here sets `display`, so preflight's `[hidden]` rule
                // is what takes a kept-but-inactive panel out of flow. Any
                // `bodyClassName` that sets one (`flex`, `grid`) would win over
                // it — pass the display on an inner element instead.
                className={cn("m-0 min-h-0 flex-1 overflow-y-auto", bodyClassName)}
              >
                {tab.content}
              </div>
            )
          })}

          {/* Optional Footer */}
          {footerContent && (
            <CardFooter className={cn("shrink-0", footerClassName)}>
              {footerContent}
            </CardFooter>
          )}
        </Card>
      </TooltipProvider>
    </ErrorBoundary>
  )
}
