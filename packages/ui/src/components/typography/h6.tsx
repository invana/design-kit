import * as React from "react"

import { cn } from "../../lib/utils"

export type TypographyH6Props = React.HTMLAttributes<HTMLHeadingElement>

const TypographyH6 = React.forwardRef<HTMLHeadingElement, TypographyH6Props>(
  ({ className, ...props }, ref) => {
    return (
      <h6
        ref={ref}
        className={cn(
          "scroll-m-20 text-base font-semibold tracking-tight",
          className
        )}
        {...props}
      />
    )
  }
)
TypographyH6.displayName = "TypographyH6"

export { TypographyH6 }
