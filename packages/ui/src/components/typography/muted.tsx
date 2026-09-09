import * as React from "react"

import { cn } from "../../lib/utils"

export interface TypographyMutedProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

const TypographyMuted = React.forwardRef<HTMLParagraphElement, TypographyMutedProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          "text-muted-foreground",
          className
        )}
        {...props}
      />
    )
  }
)
TypographyMuted.displayName = "TypographyMuted"

export { TypographyMuted }
