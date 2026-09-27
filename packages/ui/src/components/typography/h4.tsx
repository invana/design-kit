import * as React from "react"

import { cn } from "../../lib/utils"

export type TypographyH4Props = React.HTMLAttributes<HTMLHeadingElement>

const TypographyH4 = React.forwardRef<HTMLHeadingElement, TypographyH4Props>(
  ({ className, ...props }, ref) => {
    return (
      <h4
        ref={ref}
        className={cn(
          "scroll-m-20 text-xl font-semibold tracking-tight",
          className
        )}
        {...props}
      />
    )
  }
)
TypographyH4.displayName = "TypographyH4"

export { TypographyH4 }
