import * as React from "react"

import { cn } from "@invana/ui"

/**
 * The control scale: `sm` (26px) is the application field — a property
 * editor, a settings row, a form inside a 420px panel; `default` (32px) a
 * standalone form or dialog; `lg` (40px) a form page.
 *
 * Named `inputSize` because `size` is already an `<input>` attribute meaning
 * "how many characters wide", and shadowing it would silently drop that.
 */
export type InputSize = "sm" | "default" | "lg"

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & { inputSize?: InputSize }
>(
  ({ className, type, inputSize = "default", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "py-0",
          inputSize === "sm" ? "h-control-sm px-2" : inputSize === "lg" ? "h-control-lg px-3" : "h-control-md px-2.5",
          "flex w-full rounded-control border border-input bg-background text-base ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
