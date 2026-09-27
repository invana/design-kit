import * as React from "react"

import { cn } from "../../lib/utils"

export type TypographyLargeProps = React.HTMLAttributes<HTMLDivElement>

const TypographyLarge = React.forwardRef<HTMLDivElement, TypographyLargeProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "text-lg font-semibold",
          className
        )}
        {...props}
      />
    )
  }
)
TypographyLarge.displayName = "TypographyLarge"

export { TypographyLarge }
