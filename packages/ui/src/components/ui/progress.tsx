import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

/**
 * `sm` (4px) is the inline meter — a budget bar under a figure, a quota in a
 * row. At that height it reads as part of the number above it rather than as a
 * control, which is the point: nobody drags it.
 */
type ProgressSize = "default" | "sm"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    size?: ProgressSize
  }
>(({ className, value, size = "default", ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative w-full overflow-hidden rounded-full bg-secondary",
      size === "sm" ? "h-1" : "h-4",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
