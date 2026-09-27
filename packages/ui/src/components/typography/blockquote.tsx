import * as React from "react"

import { cn } from "../../lib/utils"

export type TypographyBlockquoteProps = React.BlockquoteHTMLAttributes<HTMLQuoteElement>

const TypographyBlockquote = React.forwardRef<HTMLQuoteElement, TypographyBlockquoteProps>(
  ({ className, ...props }, ref) => {
    return (
      <blockquote
        ref={ref}
        className={cn(
          "mt-6 border-l-2 pl-6 italic",
          className
        )}
        {...props}
      />
    )
  }
)
TypographyBlockquote.displayName = "TypographyBlockquote"

export { TypographyBlockquote }
