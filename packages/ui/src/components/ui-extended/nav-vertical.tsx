import React from "react"

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
export type NavVerticalItem = NavItemConfig;

/** Items under one optional label; the label shows only when the rail is expanded. */
export interface NavVerticalGroup {
  label?: React.ReactNode
  items: NavVerticalItem[]
}

/**
 * The rail's own expand / collapse switcher, drawn as the last item at its foot
 * by the same `NavItems` as every other item. Icons are the caller's, so the
 * kit names no icon library.
 */
export interface NavVerticalToggle {
  /** Shown while folded: the item that opens the rail. */
  expandIcon: React.ElementType
  /** Shown while open: the item that folds it. */
  collapseIcon: React.ElementType
  /** Defaults to "Expand". */
  expandLabel?: string
  /** Defaults to "Collapse". */
  collapseLabel?: string
}

/** The expanded rail's head: its title, its buttons, and a slot under them (a picker card). */
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
   * Items in groups, after `topNavItems`. Expanded, each group's `label` is
   * drawn over it; folded, groups are split by a rule.
   */
  groups?: NavVerticalGroup[];
  /** The expanded rail's title, its buttons and a slot under them; hidden when folded. */
  header?: NavVerticalHeader;
  /**
   * The rail opened to show each item's label and `count` beside its icon.
   * Every item is drawn by the same `NavItems` either way, so icon, padding,
   * hover and active state do not change — only the width and the text.
   * Passing it makes the rail controlled; omit it and the rail keeps its own
   * state, starting at `defaultExpanded`.
   */
  expanded?: boolean;
  /** Where an uncontrolled rail starts. Defaults to folded. */
  defaultExpanded?: boolean;
  /** Fires with the new state whenever the switcher flips it. */
  onExpandedChange?: (expanded: boolean) => void;
  /** Draws the expand / collapse switcher as the rail's last item. */
  toggle?: NavVerticalToggle;
  /** The lit item's key (`key ?? name`), across every list on the rail. */
  activeKey?: string;
}

export const NavVertical: React.FC<NavVerticalProps> = ({
  className,
  top,
  topNavItems,
  middle,
  bottom,
  bottomNavItems,
  groups,
  header,
  expanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
  toggle,
  activeKey,
}) => {
  const [ownExpanded, setOwnExpanded] = React.useState(defaultExpanded)
  const expanded = expandedProp ?? ownExpanded
  const setExpanded = (next: boolean) => {
    if (expandedProp === undefined) setOwnExpanded(next)
    onExpandedChange?.(next)
  }
  const items = (list: NavVerticalItem[]) => (
    <NavVerticalItems items={list} activeKey={activeKey} expanded={expanded} />
  )
  // Expanded, sections stretch so each row fills the rail. Both states share
  // the rail's padding (`px-2.5`), so an icon's x is that padding plus the
  // item's own — the same whether the rail is folded or open. Folded, the rail
  // is exactly padding + one item + padding (`w-fit`), so nothing is centred
  // and a border cannot shift the icon by a fraction.
  const section = expanded ? "items-stretch" : undefined
  const hasStart = top || header || topNavItems || groups?.length

  return (
    <NavBase
      orientation="vertical"
      className={cn("shrink-0 px-2.5", expanded ? "w-60 items-stretch" : "w-fit", className)}
      sections={{
        start: hasStart ? {
          className: section,
          content: (
            <>
              {top}
              {expanded && header ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1">
                    <span className="min-w-0 flex-1 truncate px-2 font-semibold">{header.title}</span>
                    {header.actions}
                  </div>
                  {header.below}
                </div>
              ) : null}
              {topNavItems && items(topNavItems)}
              {groups?.map((group, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex flex-col gap-1",
                    !expanded && "items-center",
                    !expanded && (i > 0 || Boolean(topNavItems?.length)) && "border-t border-border pt-1",
                  )}
                >
                  {expanded && group.label ? <Eyebrow className="px-2 pt-2">{group.label}</Eyebrow> : null}
                  {items(group.items)}
                </div>
              ))}
            </>
          ),
        } : undefined,
        center: middle ? { content: middle } : undefined,
        end: (bottom || bottomNavItems || toggle) ? {
          className: section,
          content: (
            <>
              {bottomNavItems && items(bottomNavItems)}
              {bottom}
              {toggle ? (
                // Its own list, held at no selection: a switcher is never the lit item.
                <NavVerticalItems
                  activeKey=""
                  expanded={expanded}
                  items={[{
                    key: "nav-vertical-toggle",
                    name: expanded ? (toggle.collapseLabel ?? "Collapse") : (toggle.expandLabel ?? "Expand"),
                    icon: expanded ? toggle.collapseIcon : toggle.expandIcon,
                    onClick: () => setExpanded(!expanded),
                  }]}
                />
              ) : null}
            </>
          ),
        } : undefined,
      }}
    />
  )
}
