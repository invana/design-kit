import * as React from "react"

import { cn } from "../../lib/utils"

export interface TypographyInlineCodeProps
  extends React.HTMLAttributes<HTMLElement> {}

const TypographyInlineCode = React.forwardRef<HTMLElement, TypographyInlineCodeProps>(
  ({ className, ...props }, ref) => {
    return (
      <code
        ref={ref}
        className={cn(
          "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
          className
        )}
        {...props}
      />
    )
  }
)
TypographyInlineCode.displayName = "TypographyInlineCode"

export { TypographyInlineCode }
