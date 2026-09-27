import * as React from "react"

import { cn } from "../../lib/utils"

export type TypographyLeadProps = React.HTMLAttributes<HTMLParagraphElement>

const TypographyLead = React.forwardRef<HTMLParagraphElement, TypographyLeadProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          "text-xl text-muted-foreground",
          className
        )}
        {...props}
      />
    )
  }
)
TypographyLead.displayName = "TypographyLead"

export { TypographyLead }
