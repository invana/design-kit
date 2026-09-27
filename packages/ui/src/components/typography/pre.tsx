import * as React from "react"

import { cn } from "../../lib/utils"

export type TypographyPreProps = React.HTMLAttributes<HTMLPreElement>

const TypographyPre = React.forwardRef<HTMLPreElement, TypographyPreProps>(
  ({ className, ...props }, ref) => {
    return (
      <pre
        ref={ref}
        className={cn(
          "mt-6 mb-4 overflow-x-auto rounded-lg border bg-muted p-4",
          className
        )}
        {...props}
      />
    )
  }
)

TypographyPre.displayName = "TypographyPre"

export { TypographyPre }
