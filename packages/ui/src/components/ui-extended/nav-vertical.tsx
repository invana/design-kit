import React from "react"
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
}


export const NavVertical: React.FC<NavVerticalProps> = ({
  className = '',
  top,
  topNavItems,
  middle,
  bottom,
  bottomNavItems
}) => {
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
