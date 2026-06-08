import React from 'react';
import { Tooltip, TooltipTrigger, TooltipContent, Separator } from '../ui';
import type { LucideIcon } from 'lucide-react';

/**
 * NavItemConfig - Shared configuration for a single navigation item, used by
 * both NavHorizontal and NavVertical. An item renders as an `<a>` (when `href`
 * is set), a `<button>` (when `onClick` is set), or a static `<div>`.
 */
export interface NavItemConfig {
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
  /** Tooltip position */
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  /** Show a separator line after this item */
  showSeperator?: boolean;
  /** Lucide icon component */
  icon: React.ElementType | LucideIcon;
  /** Custom tooltip content (overrides name) */
  tooltip?: React.ReactNode;
}

export interface NavItemsProps {
  items: NavItemConfig[];
  /** Layout orientation — drives default icon size, padding, tooltip side and separator. */
  orientation?: 'horizontal' | 'vertical';
  /** Default tooltip side when an item doesn't specify one. */
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  /** Default icon classes when an item doesn't specify `iconClassName`. */
  iconClassName?: string;
}

/**
 * NavItems - Shared renderer for navigation items. Renders href / onClick /
 * static items with identical styling so all three share the same padding,
 * primary hover + active highlight, and icon size.
 */
export const NavItems: React.FC<NavItemsProps> = ({
  items,
  orientation = 'horizontal',
  tooltipSide = orientation === 'vertical' ? 'right' : 'bottom',
  iconClassName = orientation === 'vertical' ? 'w-5 h-5' : 'w-4 h-4 flex-shrink-0',
}) => {
  const isVertical = orientation === 'vertical';
  const [activeItem, setActiveItem] = React.useState<null | string>(null);

  return (
    <>
      {items.map((item) => {
        const isActive = activeItem === item.name;
        const padding = item.label ? 'px-3 py-1.5' : 'px-2 py-2';

        const itemClass = `inline-flex border-0 items-center justify-center gap-2
          whitespace-nowrap rounded-md cursor-pointer transition-colors
          ring-1 ring-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
          ${padding}
          hover:bg-primary/10 hover:text-primary hover:ring-primary/25
          ${isActive ? `bg-primary/15 text-primary ring-primary/25 ${item.activeClass || ''}` : ''}
          ${item.className || ''}`;

        const icon = (
          <item.icon
            strokeWidth={item.iconStroke || 2}
            className={item.iconClassName || iconClassName}
          />
        );
        const label = item.label && <span className="text-sm">{item.label}</span>;

        return (
          <React.Fragment key={item.key || item.name}>
            <Tooltip>
              <TooltipTrigger asChild>
                {item.href ? (
                  <a
                    href={item.href}
                    onClick={() => setActiveItem(item.name)}
                    className={itemClass}
                  >
                    {icon}
                    {label}
                  </a>
                ) : item.onClick ? (
                  <button
                    type="button"
                    onClick={() => {
                      item.onClick?.();
                      setActiveItem(isActive ? null : item.name);
                    }}
                    className={itemClass}
                  >
                    {icon}
                    {label}
                  </button>
                ) : (
                  <div className={itemClass}>
                    {icon}
                    {label}
                  </div>
                )}
              </TooltipTrigger>
              <TooltipContent side={item.tooltipSide || tooltipSide}>
                {item.tooltip || item.name}
              </TooltipContent>
            </Tooltip>
            {item.showSeperator && (
              <Separator
                orientation={isVertical ? 'horizontal' : 'vertical'}
                className={isVertical ? '' : 'h-4'}
              />
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

export interface NavSection {
  content?: React.ReactNode;
  className?: string;
}

export interface BaseNavProps {
  className?: string;
  orientation: 'horizontal' | 'vertical';
  sections: {
    start?: NavSection;
    center?: NavSection;
    end?: NavSection;
  };
}

/**
 * Base navigation component that handles both orientations
 * Use NavHorizontal or NavVertical wrappers for better DX
 */
export const NavBase: React.FC<BaseNavProps> = ({ className = '', orientation, sections }) => {
  const isVertical = orientation === 'vertical';

  const containerClass = isVertical
    ? `flex flex-col items-center h-full ${className}`
    : `flex items-center   w-full ${className}`;

  const sectionWrapperClass = isVertical
    ? 'flex flex-col items-center gap-1'
    : 'flex items-center gap-1 ';

  return (
    <nav className={containerClass}>
      {sections.start?.content && (
        <div className={`${sectionWrapperClass} ${sections.start.className || ''}`}>
          {sections.start.content}
        </div>
      )}

      {sections.center?.content ? (
        <div className={`flex-1 ${isVertical ? '' : 'flex justify-center items-center gap-1'} ${sections.center.className || ''}`}>
          {sections.center.content}
        </div>
      ) : (
        // Empty spacer to push end section to the bottom/right
        <div className="flex-1" />
      )}

      {sections.end?.content && (
        <div className={`${sectionWrapperClass} ${isVertical ? '' : 'ml-auto'} ${sections.end.className || ''}`}>
          {sections.end.content}
        </div>
      )}
    </nav>
  );
};
