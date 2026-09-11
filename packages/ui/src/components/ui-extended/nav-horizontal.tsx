import React from 'react';
import { NavBase, NavItems, type NavItemConfig, type NavItemsProps } from './nav-base';

/**
 * NavHorizontalItem - Configuration for a single horizontal navigation item
 * 
 * @example
 * ```tsx
 * const items: NavHorizontalItem[] = [
 *   { 
 *     name: 'Dashboard', 
 *     icon: Home,
 *     label: 'Dashboard', // Optional: shows text next to icon
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
export type NavHorizontalItem = NavItemConfig;

/**
 * Everything `NavItems` takes except the orientation, which this component
 * fixes. Forwarding the whole surface is what lets a header opt into
 * `overflow`, `variant` or tab semantics without reaching past the wrapper.
 */
export interface NavHorizontalItemsProps extends Omit<NavItemsProps, 'orientation' | 'items'> {
  items: NavHorizontalItem[];
}

export const NavHorizontalItems: React.FC<NavHorizontalItemsProps> = (props) => (
  <NavItems {...props} orientation="horizontal" />
);

/**
 * NavHorizontal - Horizontal navigation component for headers/top navigation
 * 
 * @example
 * ```tsx
 * <NavHorizontal
 *   // Custom content at left (e.g., logo, brand)
 *   left={<Logo />}
 *   
 *   // Navigation items in the left section
 *   leftNavItems={[
 *     { name: 'Home', label: 'Home', onClick: () => navigate('/') },
 *     { name: 'Products', label: 'Products', href: '/products' }
 *   ]}
 *   
 *   // Content that should be centered
 *   center={<SearchBar />}
 *   
 *   // Navigation items in the center
 *   centerNavItems={[
 *     { name: 'Features', label: 'Features', href: '/features' }
 *   ]}
 *   
 *   // Right side navigation items
 *   rightNavItems={[
 *     { name: 'Login', label: 'Login', variant: 'outline', onClick: handleLogin }
 *   ]}
 *   
 *   // Custom content at right (e.g., user menu, notifications)
 *   right={<UserMenu />}
 * />
 * ```
 * 
 * @remarks
 * - `left`/`center`/`right`: For arbitrary React content
 * - `leftNavItems`/`centerNavItems`/`rightNavItems`: For navigation items with labels and click handlers
 * - All props are optional - use only what you need
 */
export interface NavHorizontalProps {
  /** Custom content rendered on the left */
  left?: React.ReactNode;
  /** Navigation items for the left section */
  leftNavItems?: NavHorizontalItem[];
  /** Custom content rendered in the center */
  center?: React.ReactNode;
  /** Navigation items for the center section */
  centerNavItems?: NavHorizontalItem[];
  /** Custom content rendered on the right */
  right?: React.ReactNode;
  /** Navigation items for the right section */
  rightNavItems?: NavHorizontalItem[];
  /** Additional CSS classes for the navigation container */
  className?: string;
}

export const NavHorizontal: React.FC<NavHorizontalProps> = ({
  left,
  leftNavItems,
  center,
  centerNavItems,
  right,
  rightNavItems,
  className = ''
}) => {
  return (
    <NavBase
      orientation="horizontal"
      className={className}
      sections={{
        start: (left || leftNavItems) ? {
          content: (
            <>
              {left}
              {leftNavItems && <NavHorizontalItems items={leftNavItems} />}
            </>
          ),
          className: 'text-foreground'
        } : undefined,
        center: (center || centerNavItems) ? {
          content: (
            <>
              {center}
              {centerNavItems && <NavHorizontalItems items={centerNavItems} />}
            </>
          )
        } : undefined,
        end: (right || rightNavItems) ? {
          content: (
            <>
              {rightNavItems && <NavHorizontalItems items={rightNavItems} />}
              {right}
            </>
          )
        } : undefined,
      }}
    />
  );
};
