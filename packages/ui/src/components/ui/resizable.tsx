import { GripHorizontal } from "lucide-react"
import { Group, Panel, Separator } from "react-resizable-panels"

import { cn } from "@/lib/utils"

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof Group>) => (
  <Group
    className={cn(
      "flex h-full w-full data-[orientation=vertical]:flex-col",
      className
    )}
    {...props}
  />
)

const ResizablePanel = Panel

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof Separator> & {
  withHandle?: boolean
}) => (
  <Separator
    className={cn(
      "relative flex items-center justify-center  transition-colors",
      "[aria-orientation=vertical]:h-2 [aria-orientation=vertical]:w-full [aria-orientation=vertical]:cursor-row-resize",
      "[aria-orientation=horizontal]:w-2 [aria-orientation=horizontal]:h-full [aria-orientation=horizontal]:cursor-col-resize",
      "hover:bg-ring/30 focus:bg-ring/30", 
      "focus-visible:outline-none \
      focus-visible:ring-ring \
      focus-visible:ring-offset-3",
      "[&[aria-orientation=vertical]>div]:rotate-90",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-3 w-4 items-center justify-center rounded-sm border bg-border">
        <GripHorizontal />
      </div>
    )}
  </Separator>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
