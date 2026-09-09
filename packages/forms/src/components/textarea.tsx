import * as React from "react"

import { cn } from "@invana/ui"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea"> & {
    /** Matches `Input`'s `inputSize`. `sm` tightens padding and the floor. */
    inputSize?: "default" | "sm"
  }
>(({ className, inputSize = "default", ...props }, ref) => {
  return (
    <textarea
      className={cn(
        inputSize === "sm" ? "min-h-[52px] px-2 py-1" : "min-h-[80px] px-3 py-2",
        "flex w-full rounded-control border border-input bg-background text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
