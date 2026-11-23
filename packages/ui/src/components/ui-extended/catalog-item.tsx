import * as React from "react"

import { cn } from "../../lib/utils"

export interface CatalogItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** The logo or icon on the left — a `BrandMark`, usually. Omit on a `sm` row. */
  media?: React.ReactNode
  title: React.ReactNode
  /** Right after the title — a `StatusDot`, a verified mark. */
  titleMark?: React.ReactNode
  /** One line under the title; its parts are joined with " · ". */
  meta?: React.ReactNode[]
  /** The primary action, before the menu — a `Connect` button. */
  action?: React.ReactNode
  /** The ⋯ at the end — an `OverflowMenu`. */
  menu?: React.ReactNode
  /** The row opens what it names. The title becomes the button; `action` and `menu` stay clickable on their own. */
  onOpen?: () => void
  /** `md` is a list row; `sm` a denser row, nested under another or in a narrow panel. */
  size?: "md" | "sm"
}

/**
 * One thing in a catalog list — a connection, a connector, a skill, a plugin:
 * its mark, its name, one line about it, and what can be done to it.
 *
 * With `onOpen`, the whole row opens it: the title is a real button whose hit
 * area covers the row, and the action and menu sit above it, so nothing is
 * nested inside a button and each control keeps its own name.
 */
export function CatalogItem({
  media,
  title,
  titleMark,
  meta,
  action,
  menu,
  onOpen,
  size = "md",
  className,
  ...props
}: CatalogItemProps) {
  const parts = (meta ?? []).filter((part) => part !== null && part !== undefined && part !== false && part !== "")
  return (
    <div
      data-slot="catalog-item"
      data-size={size}
      className={cn(
        "relative flex items-center rounded-md transition-colors",
        size === "md" ? "min-h-control-lg gap-3 px-2 py-2" : "min-h-control-md gap-2 px-2 py-1",
        onOpen && "hover:bg-accent/50 has-[[data-slot=catalog-item-open]:focus-visible]:ring-[3px] has-[[data-slot=catalog-item-open]:focus-visible]:ring-ring/50",
        className
      )}
      {...props}
    >
      {media}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex min-w-0 items-center gap-1.5 font-medium">
          {onOpen ? (
            <button
              type="button"
              data-slot="catalog-item-open"
              onClick={onOpen}
              className="truncate text-left outline-none after:absolute after:inset-0 after:content-['']"
            >
              {title}
            </button>
          ) : (
            <span className="truncate">{title}</span>
          )}
          {titleMark}
        </div>
        {parts.length > 0 && (
          <div className="truncate text-sm text-muted-foreground">
            {parts.map((part, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span aria-hidden> · </span>}
                {part}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
      {(action || menu) && (
        <div className="relative z-10 flex shrink-0 items-center gap-1">
          {action}
          {menu}
        </div>
      )}
    </div>
  )
}
