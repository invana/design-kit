import * as React from 'react'
import { flushSync } from 'react-dom'
import { ChevronRight, LucideIcon } from 'lucide-react'
import { cn } from '../../lib/utils'


export interface MenuItem {
  id: string
  label: string
  icon?: React.ElementType | LucideIcon
  shortcut?: string
  className?: string
  href?: string
  onClick?: () => void
  children?: MenuItem[]
}

export interface MenuItemProps extends MenuItem {
  level?: number
}
/**
 * A row of a menu; with `children`, a submenu that opens beside it. The submenu
 * opens on hover and on focus, and from the keyboard: → or Enter opens it on its
 * first row, ← or Escape closes it back to its row.
 */
export const MenuItem: React.FC<MenuItemProps> = ({
  label,
  icon: Icon,
  shortcut,
  children,
  className,
  level = 0,
  href,
  onClick
}) => {
  const hasChildren = !!children && children.length > 0
  const [open, setOpen] = React.useState(false)
  const row = React.useRef<HTMLElement>(null)
  const list = React.useRef<HTMLUListElement>(null)
  const ButtonOrLink = href ? 'a' : 'button'

  const clickTrigger = href ? { href: href } : { onClick: onClick }

  // Opened from the keyboard: the list is shown first, so its first row can take focus.
  const openInto = () => {
    flushSync(() => setOpen(true))
    const first = list.current?.querySelector<HTMLElement>(':scope > li > a, :scope > li > button')
    first?.focus()
  }
  const closeBack = () => {
    setOpen(false)
    row.current?.focus()
  }

  return (
    <li
      className="relative"
      onMouseEnter={hasChildren ? () => setOpen(true) : undefined}
      onMouseLeave={hasChildren ? () => setOpen(false) : undefined}
      onBlur={
        hasChildren
          ? (e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false)
            }
          : undefined
      }
    >
      <ButtonOrLink
        {...clickTrigger}
        ref={row as React.Ref<never>}
        className={cn(
          "flex w-full items-center justify-between  px-4 py-2 ",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none",
          className,
          level === 0 ? "font-medium" : "font-normal",
        )}
        role={hasChildren ? 'menuitem' : undefined}
        aria-haspopup={hasChildren ? 'menu' : undefined}
        aria-expanded={hasChildren ? open : undefined}
        onKeyDown={
          hasChildren
            ? (e: React.KeyboardEvent) => {
                if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  openInto()
                }
              }
            : undefined
        }
      >
        <span className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4" />}
          <span>{label}</span>
        </span>
        <span className="flex items-center gap-2">
          {shortcut && (
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground opacity-100">
              {shortcut}
            </kbd>
          )}
          {hasChildren && (
            <ChevronRight className="h-4 w-4" />
          )}
        </span>
      </ButtonOrLink>
      {hasChildren && (
        <ul
          ref={list}
          className={cn(
            "absolute left-full top-0 min-w-[240px] border p-1  bg-card text-card-foreground  shadow-md",
            // Visibility flips at once (only the fade and slide animate), so a row can take focus as it opens.
            "transition-[opacity,transform] duration-150 ease-in-out",
            open ? "visible opacity-100 translate-x-0" : "invisible opacity-0 translate-x-2",
          )}
          style={{
            zIndex: 50 + level
          }}
          role="menu"
          aria-label={label}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft' || e.key === 'Escape') {
              e.preventDefault()
              e.stopPropagation()
              closeBack()
            }
          }}
        >
          {children!.map((item) => (
            <MenuItem key={item.id} {...item} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  )
}
