import * as React from "react"

import { cn } from "../../lib/utils"

export interface TypographySmallProps
  extends React.HTMLAttributes<HTMLElement> {}

const TypographySmall = React.forwardRef<HTMLElement, TypographySmallProps>(
  ({ className, ...props }, ref) => {
    return (
      <small
        ref={ref}
        className={cn(
          "text-sm font-medium leading-none",
          className
        )}
        {...props}
      />
    )
  }
)
TypographySmall.displayName = "TypographySmall"

export { TypographySmall }
