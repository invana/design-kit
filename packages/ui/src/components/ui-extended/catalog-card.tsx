import * as React from "react"
import { Plus } from "lucide-react"

import { cn } from "../../lib/utils"

export interface CatalogCardProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "title"> {
  /** The logo on the left — a `BrandMark` at `lg`, usually. */
  media?: React.ReactNode
  title: React.ReactNode
  /** What it does, in a sentence; clamped to two lines. */
  description?: React.ReactNode
  /** One line under the description; its parts are joined with " · ". */
  meta?: React.ReactNode[]
}

/**
 * One choice in a catalog grid — a connector to connect, a plugin to add. The
 * whole card is one button; a + shows on hover and focus to say that picking
 * it adds one. Lay cards out in a grid; each takes the width it is given.
 */
export const CatalogCard = React.forwardRef<HTMLButtonElement, CatalogCardProps>(
  ({ media, title, description, meta, className, ...props }, ref) => {
    const parts = (meta ?? []).filter((part) => part !== null && part !== undefined && part !== false && part !== "")
    return (
      <button
        ref={ref}
        type="button"
        data-slot="catalog-card"
        className={cn(
          "group/card relative flex w-full items-start gap-3 rounded-md p-3 text-left outline-none transition-colors",
          "hover:bg-accent/50 focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      >
        {media}
        <span className="flex min-w-0 flex-1 flex-col gap-0.5 pr-8">
          <span className="font-medium">{title}</span>
          {description && <span className="line-clamp-2 text-muted-foreground">{description}</span>}
          {parts.length > 0 && (
            <span className="truncate text-sm text-muted-foreground">
              {parts.map((part, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span aria-hidden> · </span>}
                  {part}
                </React.Fragment>
              ))}
            </span>
          )}
        </span>
        <span
          aria-hidden
          className="absolute right-3 top-3 flex size-control-sm items-center justify-center rounded-control border border-border bg-background opacity-0 transition-opacity group-hover/card:opacity-100 group-focus-visible/card:opacity-100 [&_svg]:size-4"
        >
          <Plus />
        </span>
      </button>
    )
  }
)
CatalogCard.displayName = "CatalogCard"
