import * as React from "react"
import { Check, ChevronDown, Menu } from "lucide-react"

import { cn } from "../../lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

/** One product in the menu. */
export interface ProductMenuItem {
  key: string
  name: string
  /** One line under the name — what the product is for. */
  description?: React.ReactNode
  icon?: React.ElementType
  /** A tag after the name — "Experimental". */
  badge?: React.ReactNode
  /** The open product: ticked, and named on the trigger. */
  current?: boolean
  onSelect?: () => void
}

/** Products under one optional label — "Invana", "This Graph · airways". */
export interface ProductMenuGroup {
  label?: React.ReactNode
  items: ProductMenuItem[]
}

export interface ProductMenuProps {
  /** The wordmark on the trigger — "Invana". */
  title: React.ReactNode
  groups: ProductMenuGroup[]
  /** Class on the trigger. */
  className?: string
  /** Class on the menu. */
  contentClassName?: string
}

/**
 * The product menu at the left of an app header: a trigger with the wordmark
 * and the open product ("Invana Model ▾"), opening a menu of every product in
 * groups, each with its icon, name, description and badge, the open one
 * ticked. Pass it as `HeaderTrail`'s `brand` to put the trail after it.
 *
 * @example
 * ```tsx
 * <ProductMenu
 *   title="Invana"
 *   groups={[{ label: "Invana", items: [
 *     { key: "home", name: "Home", icon: House, onSelect: () => navigate("/") },
 *     { key: "model", name: "Model", icon: Hexagon, current: true, onSelect: () => navigate("/model") },
 *   ] }]}
 * />
 * ```
 */
export function ProductMenu({ title, groups, className, contentClassName }: ProductMenuProps) {
  const current = groups.flatMap((g) => g.items).find((i) => i.current)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={current ? `Products, ${current.name} open` : "Products"}
          className={cn(
            "flex h-control-sm items-center gap-2 rounded-control border border-border bg-card px-2.5 text-base font-normal text-foreground outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4 [&_svg]:shrink-0",
            className,
          )}
        >
          <Menu aria-hidden />
          <span className="font-bold">{title}</span>
          {current ? <span>{current.name}</span> : null}
          <ChevronDown aria-hidden className="text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className={cn("w-80", contentClassName)}>
        {groups.map((group, i) => (
          <React.Fragment key={i}>
            {i > 0 ? <DropdownMenuSeparator /> : null}
            <DropdownMenuGroup>
              {group.label ? <DropdownMenuLabel>{group.label}</DropdownMenuLabel> : null}
              {group.items.map((item) => {
                const Icon = item.icon
                return (
                  <DropdownMenuItem
                    key={item.key}
                    aria-current={item.current ? "page" : undefined}
                    onSelect={item.onSelect}
                  >
                    {Icon ? <Icon aria-hidden className="size-4 text-primary" /> : null}
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="flex items-center gap-2">
                        {item.name}
                        {item.badge}
                      </span>
                      {item.description != null ? (
                        <span className="text-xs text-muted-foreground">{item.description}</span>
                      ) : null}
                    </span>
                    {item.current ? <Check aria-hidden className="size-4 text-primary" /> : null}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuGroup>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
