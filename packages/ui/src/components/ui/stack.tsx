import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

/**
 * Things laid out one after another, a set gap apart: a column (the default)
 * or a row. The layout every screen and story otherwise writes by hand as
 * `flex flex-col gap-4` — so the gaps come from one short scale, in `rem`, and
 * follow the root as the type does.
 *
 * `gap` is the space between, never around: a stack draws no padding, border
 * or background, so it can sit inside anything without changing its frame.
 */
const stackVariants = cva("flex min-w-0", {
  variants: {
    direction: {
      column: "flex-col",
      row: "flex-row",
    },
    gap: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-3",
      lg: "gap-4",
      xl: "gap-6",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
    },
    /** A row that runs out of width carries on below — chips, badges, buttons. */
    wrap: {
      true: "flex-wrap",
      false: "",
    },
    /**
     * A page: the stack takes its parent's height and its last child grows
     * into what the others leave — a header, then a canvas or a split.
     */
    fill: {
      true: "h-full min-h-0 [&>:last-child]:min-h-0 [&>:last-child]:flex-1",
      false: "",
    },
  },
  defaultVariants: {
    direction: "column",
    gap: "md",
  },
})

export interface StackProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof stackVariants> {}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, direction, gap, align, justify, wrap, fill, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        stackVariants({
          direction,
          gap,
          // A row lines its items up on their centres unless told otherwise.
          align: align ?? (direction === "row" ? "center" : undefined),
          justify,
          wrap,
          fill,
        }),
        className,
      )}
      {...props}
    />
  ),
)
Stack.displayName = "Stack"

export { Stack, stackVariants }
