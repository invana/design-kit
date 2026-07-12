import { Group, Panel, Separator } from "react-resizable-panels"

import { cn } from "@/lib/utils"

// The library already sets display:flex, flex-direction and 100% width/height on
// the group, and stretches children across the cross-axis — so wrappers only add
// theming. Orientation is read from the separator's aria-orientation attribute.

const ResizablePanelGroup = (props: React.ComponentProps<typeof Group>) => (
  <Group {...props} />
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
      // A themed gap between panels. The separator has no intrinsic size, so give
      // it an explicit one on the main axis or it collapses to 0.
      "relative flex items-center justify-center bg-background transition-colors",
      "aria-[orientation=vertical]:w-1 aria-[orientation=vertical]:cursor-col-resize",
      "aria-[orientation=horizontal]:h-1 aria-[orientation=horizontal]:cursor-row-resize",
      "data-[separator=hover]:bg-accent data-[separator=active]:bg-accent",
      "[&[aria-orientation=horizontal]>div]:rotate-90",
      className
    )}
    {...props}
  >
    {withHandle && (
      // A subtle pill grip centered in the gutter; rotate handles orientation.
      <div className="z-10 h-6 w-[3px] rounded-full bg-muted-foreground/40" />
    )}
  </Separator>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
