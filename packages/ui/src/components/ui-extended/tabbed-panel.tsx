import React from "react"
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs"
import { NavHorizontal, type NavHorizontalProps } from "./nav-horizontal"
import { ErrorBoundary } from "../ui-extended"
import { TooltipProvider } from "../ui/tooltip"

export interface TabConfig {
  /** Unique identifier for the tab */
  value: string
  /** Label text or custom React node to display in the tab */
  label: string | React.ReactNode
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
  
  /** Full NavHorizontal props for header right-side actions */
  headerActions?: NavHorizontalProps
  
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
  
  /** Whether to show default close button */
  showClose?: boolean
  /** Callback when close button is clicked */
  onClose?: () => void
  /** Custom close icon component */
  closeIcon?: React.ReactNode
}

export function TabbedPanel({
  tabs,
  defaultTab,
  activeTab,
  onTabChange,
  headerActions,
  className,
  headerClassName,
  bodyClassName,
  footerClassName,
  footerContent,
  showClose,
  onClose,
  closeIcon,
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

  return (
    <ErrorBoundary>
      <TooltipProvider delayDuration={0}>
        <Tabs value={currentTab} onValueChange={handleTabChange} className={`h-full ${className || ''}`}>
          <Card className="h-full border-none">
            {/* Header with tabs and actions */}
            <CardHeader className={`flex flex-row items-center justify-between py-0 border-b h-[30px] px-2 ${headerClassName || ''}`}>
            {/* Left: Tabs */}
            <TabsList className="h-full bg-transparent p-0 gap-1 rounded-none">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  disabled={tab.disabled}
                  className="h-full data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-3 text-xs"
                >
                  {tab.icon && <tab.icon className="h-3.5 w-3.5 mr-1.5" />}
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Right: Actions */}
            {headerActions && (
              <div className="flex items-center h-full">
                <NavHorizontal
                  className="h-full"
                  {...headerActions}
                />
              </div>
            )}
          </CardHeader>

          {/* Body: Tab content */}
          {tabs.map((tab) => (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className={`h-[calc(100%-30px)] m-0 ${bodyClassName || ''}`}
            >
              <CardContent className="overflow-y-auto h-full p-0">
                {tab.content}
              </CardContent>
            </TabsContent>
          ))}

          {/* Optional Footer */}
          {footerContent && (
            <CardFooter className={footerClassName}>
              {footerContent}
            </CardFooter>
          )}
        </Card>
      </Tabs>
      </TooltipProvider>
    </ErrorBoundary>
  )
}
