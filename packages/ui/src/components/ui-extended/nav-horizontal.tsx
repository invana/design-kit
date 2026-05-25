import React from 'react';
import { NavBase } from './nav-base';
import { Button, Tooltip, TooltipTrigger, TooltipContent, Separator } from '../ui';
import type { LucideIcon } from "lucide-react";

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
export interface NavHorizontalItem {
  /** Optional unique key for React rendering */
  key?: string;
  /** Display name shown in tooltip */
  name: string;
  /** Optional label text to display next to the icon */
  label?: React.ReactNode;
  /** Navigation URL (for anchor tag) */
  href?: string;
  /** Click handler (for button behavior) */
  onClick?: () => void;
  /** Additional CSS classes for the item wrapper */
  className?: string;
  /** CSS classes applied when item is active */
  activeClass?: string;
  /** CSS classes for the icon */
  iconClassName?: string;
  /** Stroke width for the icon (default: 2) */
  iconStroke?: number;
  /** Tooltip position (default: 'bottom') */
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  /** Show a separator line after this item */
  showSeperator?: boolean;
  /** Lucide icon component */
  icon: React.ElementType | LucideIcon;
  /** Custom tooltip content (overrides name) */
  tooltip?: React.ReactNode;
}

export interface NavHorizontalItemsProps {
  items: NavHorizontalItem[];
}

export const NavHorizontalItems: React.FC<NavHorizontalItemsProps> = ({ items }) => {
  const [activeItem, setActiveItem] = React.useState<null | string>(null);

  return (
    <>
      {items.map((item) => (
        <React.Fragment key={item.key || item.name}>
          <Tooltip>
            <TooltipTrigger asChild>
              {item.href ? (
                <a
                  href={item.href}
                  onClick={() => setActiveItem(item.name)}
                  className={`flex border-0 items-center justify-center gap-2
                    transition-colors rounded-md h-full whitespace-nowrap
                    hover:bg-muted hover:text-foreground ${item.label ? 'px-3' : 'px-2'} ${item.className || ''}
                    ${activeItem === item.name ? 'bg-primary/15 text-primary ring-1 ring-primary/25' : ''}`}
                >
                  <item.icon
                    strokeWidth={item.iconStroke || 2}
                    className={item.iconClassName || "w-4 h-4 flex-shrink-0"}
                  />
                  {item.label && <span className="text-sm">{item.label}</span>}
                </a>
              ) : item.onClick ? (
                <Button
                  size={item.label ? "sm" : "icon"}
                  variant="ghost"
                  onClick={() => {
                    if (item.onClick) item.onClick();
                    setActiveItem(item.name === activeItem ? null : item.name);
                  }}
                  className={`h-full gap-2 whitespace-nowrap ${item.label ? 'w-auto px-3' : ''} ${item.className || ''}
                    ${activeItem === item.name ? ` ${item?.activeClass || ''}` : ''}`}
                >
                  <item.icon
                    strokeWidth={item.iconStroke || 2}
                    className={item.iconClassName || "w-4 h-4 flex-shrink-0"}
                  />
                  {item.label && <span className="text-sm">{item.label}</span>}
                </Button>
              ) : (
                <div
                  className={`flex border-0 items-center justify-center gap-2 h-full whitespace-nowrap
                    transition-colors rounded-md  ${item.label ? 'px-3' : 'px-2'} ${item.className || ''}
                    ${activeItem === item.name ? 'bg-primary/15 text-primary ring-1 ring-primary/25' : ''}`}
                >
                  <item.icon
                    strokeWidth={item.iconStroke || 2}
                    className={item.iconClassName || "w-4 h-4 flex-shrink-0"}
                  />
                  {item.label && <span className="text-sm">{item.label}</span>}
                </div>
              )}
            </TooltipTrigger>
            <TooltipContent side={item.tooltipSide || 'bottom'}>
              {item.tooltip || item.name}
            </TooltipContent>
          </Tooltip>
          {item.showSeperator && <Separator orientation="vertical" className="h-4" />}
        </React.Fragment>
      ))}
    </>
  );
};

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
