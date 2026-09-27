import * as React from "react"

import { cn } from "../../lib/utils"

export type TypographyListProps = React.HTMLAttributes<HTMLUListElement>

const TypographyList = React.forwardRef<HTMLUListElement, TypographyListProps>(
  ({ className, ...props }, ref) => {
    return (
      <ul
        ref={ref}
        className={cn(
          "my-6 ml-6 list-disc [&>li]:mt-2",
          className
        )}
        {...props}
      />
    )
  }
)
TypographyList.displayName = "TypographyList"

export { TypographyList }
