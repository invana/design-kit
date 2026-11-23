import * as React from "react"
import { MoreHorizontal } from "lucide-react"

import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

export interface OverflowMenuItem {
  key: string
  label: React.ReactNode
  onSelect: () => void
  disabled?: boolean
  /** It removes or deletes something: drawn in the destructive colour. */
  destructive?: boolean
  /** A line above this item, to set a group apart — Delete, usually. */
  separatorBefore?: boolean
}

export interface OverflowMenuProps {
  /**
   * The button's accessible name, naming what it acts on — "More for airways".
   * Required: an icon-only button has no other name.
   */
  label: string
  items: OverflowMenuItem[]
  align?: "start" | "end"
  className?: string
}

/**
 * The ⋯ button at the end of a row or a header, and the actions behind it.
 * It stops its clicks from reaching the row around it, so a row that opens on
 * click can still hold one.
 */
export function OverflowMenu({ label, items, align = "end", className }: OverflowMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={label}
          className={className}
          onClick={(event) => event.stopPropagation()}
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} onClick={(event) => event.stopPropagation()}>
        {items.map((item) => (
          <React.Fragment key={item.key}>
            {item.separatorBefore && <DropdownMenuSeparator />}
            <DropdownMenuItem
              disabled={item.disabled}
              className={item.destructive ? "text-destructive focus:bg-destructive/15 focus:text-destructive" : undefined}
              onSelect={item.onSelect}
            >
              {item.label}
            </DropdownMenuItem>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
