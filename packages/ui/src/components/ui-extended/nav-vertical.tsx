import React from "react"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"

import { cn } from "../../lib/utils"
import { Eyebrow } from "./eyebrow"
import { NavBase, NavItems, type NavItemConfig, type NavItemsProps } from './nav-base';


/**
 * NavVerticalItem - Configuration for a single navigation item
 *
 * @example
 * ```tsx
 * const items: NavVerticalItem[] = [
 *   {
 *     name: 'Dashboard',
 *     icon: Home,
 *     onClick: () => navigate('/dashboard')
 *   },
 *   {
 *     name: 'Settings',
 *     icon: Settings,
 *     href: '/settings',
 *     showSeperator: true
 *   }
 * ];
 * ```
 */
export type NavVerticalItem = NavItemConfig & {
  /** How many things the view holds, right-aligned; hidden when collapsed. */
  count?: React.ReactNode
};

/** Views under one optional label, in the views column. */
export interface NavVerticalGroup {
  label?: React.ReactNode
  items: NavVerticalItem[]
}

/** The views column's head: its title, its buttons, and a slot under them (a picker card). */
export interface NavVerticalHeader {
  title: React.ReactNode
  actions?: React.ReactNode
  below?: React.ReactNode
}

/**
 * Everything `NavItems` takes except the orientation, which this component
 * fixes — so a rail can opt into `variant`, controlled selection or tab
 * semantics without reaching past the wrapper. (`overflow` is ignored on a
 * vertical strip: it grows downward, where there is always room.)
 */
export interface NavVerticalItemsProps extends Omit<NavItemsProps, 'orientation' | 'items'> {
  items: NavVerticalItem[]
}

export const NavVerticalItems: React.FC<NavVerticalItemsProps> = (props) => (
  <NavItems {...props} orientation="vertical" />
)


/**
 * NavVertical - Vertical navigation component for sidebars
 * 
 * @example
 * ```tsx
 * <NavVertical
 *   // Custom content at top (e.g., logo, branding)
 *   top={<div className="p-2"><Logo /></div>}
 *   
 *   // Navigation items with icons, tooltips, and interactions
 *   topNavItems={[
 *     { name: 'Home', icon: Home, onClick: () => navigate('/') },
 *     { name: 'Search', icon: Search, href: '/search' },
 *     { name: 'Settings', icon: Settings, onClick: handleSettings, showSeperator: true }
 *   ]}
 *   
 *   // Content that should be centered/flexible (e.g., notifications, status)
 *   middle={<NotificationBell />}
 *   
 *   // Bottom navigation items
 *   bottomNavItems={[
 *     { name: 'Help', icon: HelpCircle, onClick: openHelp },
 *     { name: 'Profile', icon: User, href: '/profile' }
 *   ]}
 *   
 *   // Custom content at bottom (e.g., user avatar, logout button)
 *   bottom={<UserAvatar />}
 * />
 * ```
 * 
 * @remarks
 * - `top`/`bottom`: For arbitrary React content (logos, avatars, custom JSX)
 * - `topNavItems`/`bottomNavItems`: For navigation items with icons, tooltips, and click handlers
 * - `middle`: Content that fills the flexible space between top and bottom
 * - All props are optional - use only what you need
 */
export interface NavVerticalProps {
  /** Custom content rendered at the very top */
  top?: React.ReactNode;
  /** Navigation items with icons and interactions for the top section */
  topNavItems?: NavVerticalItem[];
  /** Custom content rendered in the flexible middle section */
  middle?: React.ReactNode;
  /** Custom content rendered at the very bottom */
  bottom?: React.ReactNode;
  /** Navigation items with icons and interactions for the bottom section */
  bottomNavItems?: NavVerticalItem[];
  /** Additional CSS classes for the navigation container */
  className?: string;
  /**
   * Views in groups, each with an optional label. Passing them makes this the
   * views column: 240px wide with labels and counts, or a 56px icon rail when
   * `collapsed`. `topNavItems` is ignored then.
   */
  groups?: NavVerticalGroup[];
  /** The views column's title, buttons and the slot under them. */
  header?: NavVerticalHeader;
  /** The views column folded to its icon rail; each label moves to a tooltip. */
  collapsed?: boolean;
  /** Given, the header draws a collapse button that calls it. */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** The open view's key (`key ?? name`). */
  activeKey?: string;
}


export const NavVertical: React.FC<NavVerticalProps> = ({
  className = '',
  top,
  topNavItems,
  middle,
  bottom,
  bottomNavItems,
  groups,
  header,
  collapsed = false,
  onCollapsedChange,
  activeKey,
}) => {
  if (groups) {
    return (
      <ViewsColumn
        className={className}
        groups={groups}
        header={header}
        collapsed={collapsed}
        onCollapsedChange={onCollapsedChange}
        activeKey={activeKey}
        bottom={bottom}
      />
    )
  }
  return (
    <NavBase
      orientation="vertical"
      className={`w-[45px]  h-full  flex flex-col items-center ${className}`}
      sections={{
        start: (top || topNavItems) ? {
          content: (
            <>
              {top}
              {topNavItems && <NavVerticalItems items={topNavItems} />}
            </>
          )
        } : undefined,
        center: middle ? { content: middle } : undefined,
        end: (bottom || bottomNavItems) ? {
          content: (
            <>
              {bottomNavItems && <NavVerticalItems items={bottomNavItems} />}
              {bottom}
            </>
          )
        } : undefined,
      }}
    />
  );
}

const row =
  "flex h-control-sm w-full items-center gap-2 rounded-control px-2 text-left text-foreground outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground"
const activeRow = "bg-accent shadow-[inset_2px_0_0_var(--color-primary)]"

/** One view: its icon, label and count, as a link or a button. */
function ViewRow({ item, active }: { item: NavVerticalItem; active: boolean }) {
  const Icon = item.icon
  const body = (
    <>
      {Icon ? <Icon aria-hidden /> : null}
      <span className="min-w-0 flex-1 truncate">{item.label ?? item.name}</span>
      {item.count != null ? (
        <span className="shrink-0 text-sm text-muted-foreground">{item.count}</span>
      ) : null}
    </>
  )
  const className = cn(row, active && activeRow, item.disabled && "pointer-events-none opacity-50", item.className)
  return item.href ? (
    <a href={item.href} onClick={item.onClick} aria-current={active ? "page" : undefined} className={className}>
      {body}
    </a>
  ) : (
    <button type="button" onClick={item.onClick} disabled={item.disabled} aria-current={active ? "page" : undefined} className={className}>
      {body}
    </button>
  )
}

/**
 * The views column: a head (title, buttons, a slot under them), then the views
 * in groups, each a row with an icon, a label and a count. Collapsed, it is a
 * 56px icon rail: the same views as icons, their labels in tooltips.
 */
function ViewsColumn({
  className,
  groups,
  header,
  collapsed,
  onCollapsedChange,
  activeKey,
  bottom,
}: Required<Pick<NavVerticalProps, "groups" | "collapsed">> &
  Pick<NavVerticalProps, "className" | "header" | "onCollapsedChange" | "activeKey" | "bottom">) {
  const toggle = onCollapsedChange ? (
    <button
      type="button"
      aria-label={collapsed ? "Expand" : "Collapse"}
      onClick={() => onCollapsedChange(!collapsed)}
      className="flex size-control-sm shrink-0 items-center justify-center rounded-control text-muted-foreground hover:bg-accent hover:text-foreground [&_svg]:size-4"
    >
      {collapsed ? <PanelLeftOpen aria-hidden /> : <PanelLeftClose aria-hidden />}
    </button>
  ) : null

  if (collapsed) {
    return (
      <nav aria-label="Views" className={cn("flex h-full w-14 flex-col items-center gap-2 py-2", className)}>
        {toggle}
        {groups.map((group, i) => (
          <div key={i} className={cn("flex flex-col items-center gap-1", i > 0 && "border-t border-border pt-2")}>
            <NavVerticalItems items={group.items} activeKey={activeKey} />
          </div>
        ))}
      </nav>
    )
  }

  return (
    <nav aria-label="Views" className={cn("flex h-full w-60 flex-col gap-3 p-2", className)}>
      {header || toggle ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <span className="min-w-0 flex-1 truncate px-2 font-semibold">{header?.title}</span>
            {header?.actions}
            {toggle}
          </div>
          {header?.below}
        </div>
      ) : null}
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
        {groups.map((group, i) => (
          <div key={i} className="flex flex-col gap-0.5">
            {group.label ? (
              <Eyebrow className="px-2 pb-1">{group.label}</Eyebrow>
            ) : null}
            {group.items.map((item) => (
              <ViewRow key={item.key ?? item.name} item={item} active={activeKey === (item.key ?? item.name)} />
            ))}
          </div>
        ))}
      </div>
      {bottom}
    </nav>
  )
}
