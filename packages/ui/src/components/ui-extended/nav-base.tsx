import React from 'react';
import { Tooltip, TooltipTrigger, TooltipContent, Separator } from '../ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { cn } from '../../lib/utils';
import type { LucideIcon } from 'lucide-react';

/**
 * NavMenuItem - one row of the dropdown a nav item can open. Give an item
 * `menuItems` and it becomes a menu trigger instead of a plain button: the
 * `…` overflow in a panel header, a "New…" split action, an account menu.
 */
export interface NavMenuItem {
  /** Unique identifier within the menu. */
  id: string;
  /** Row label — a string, or any node if you need your own markup. */
  label: React.ReactNode;
  /** Optional leading icon component. */
  icon?: React.ElementType;
  /** Keyboard hint, shown right-aligned (display only — bind the key yourself). */
  shortcut?: string;
  disabled?: boolean;
  /** Render the row in the destructive colour (delete, drop, remove…). */
  destructive?: boolean;
  /** Draw a separator immediately above this row. */
  separatorBefore?: boolean;
  onSelect?: () => void;
}

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
  /** Lucide icon component. Optional — items may be label-only (e.g. status-bar text). */
  icon?: React.ElementType | LucideIcon;
  /** Custom tooltip content (overrides name) */
  tooltip?: React.ReactNode;
  /**
   * Rows of a dropdown opened by this item. With `menuItems` the item is a
   * menu trigger — it needs no `onClick`, and stays highlighted while its menu
   * is open. Ignored when `href` is set.
   */
  menuItems?: NavMenuItem[];
  /**
   * A count pinned to the item's top-right — unread reviews, waiting questions.
   *
   * The one place in the kit where a rounded capsule is right: a count bubble
   * is a round object, not a rectangle with soft ends (see `@invana/styling`
   * › border radius). Keep it short; it is a signal, not a readout.
   *
   * The badge text sits inside the item, so it contributes to the accessible
   * name; the item's `name` reaches assistive tech through its tooltip. Pass a
   * bare number — anything longer belongs in the tooltip.
   */
  badge?: React.ReactNode;
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
        const hasMenu = !item.href && Boolean(item.menuItems?.length);
        // Static items (no href/onClick/menu) are plain text — no hover affordance.
        const isInteractive = Boolean(item.href || item.onClick || hasMenu);

        const itemClass = `relative inline-flex border-0 items-center justify-center gap-2
          whitespace-nowrap rounded-control transition-colors
          ring-1 ring-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
          ${padding}
          ${isInteractive ? 'cursor-pointer hover:bg-primary/10 hover:text-primary hover:ring-primary/25' : ''}
          ${hasMenu ? 'data-[state=open]:bg-primary/15 data-[state=open]:text-primary data-[state=open]:ring-primary/25' : ''}
          ${isActive ? `bg-primary/15 text-primary ring-primary/25 ${item.activeClass || ''}` : ''}
          ${item.className || ''}`;

        const icon = item.icon && (
          <item.icon
            strokeWidth={item.iconStroke || 2}
            className={item.iconClassName || iconClassName}
          />
        );
        const label = item.label && <span>{item.label}</span>;
        const badge = item.badge != null && (
          <span
            className="pointer-events-none absolute -right-0.5 -top-0.5 inline-flex h-3.5
              min-w-3.5 items-center justify-center rounded-full bg-primary px-1
              text-[9px] font-semibold leading-none text-primary-foreground"
          >
            {item.badge}
          </span>
        );

        const inner = (
          <>
            {icon}
            {label}
            {badge}
          </>
        );

        const control = item.href ? (
          <a
            href={item.href}
            onClick={() => setActiveItem(item.name)}
            className={itemClass}
          >
            {inner}
          </a>
        ) : item.onClick || hasMenu ? (
          <button
            type="button"
            onClick={() => {
              item.onClick?.();
              // A menu trigger owns its own open state; don't also latch it
              // into the nav's "active item" highlight.
              if (!hasMenu) setActiveItem(isActive ? null : item.name);
            }}
            className={itemClass}
          >
            {inner}
          </button>
        ) : (
          <div className={itemClass}>{inner}</div>
        );

        const withTooltip = (
          <Tooltip>
            <TooltipTrigger asChild>
              {hasMenu ? (
                <DropdownMenuTrigger asChild>{control}</DropdownMenuTrigger>
              ) : (
                control
              )}
            </TooltipTrigger>
            <TooltipContent side={item.tooltipSide || tooltipSide}>
              {item.tooltip || item.name}
            </TooltipContent>
          </Tooltip>
        );

        return (
          <React.Fragment key={item.key || item.name}>
            {hasMenu ? (
              <DropdownMenu>
                {withTooltip}
                <DropdownMenuContent
                  // A vertical rail is narrow: open beside it, not over it.
                  side={isVertical ? 'right' : 'bottom'}
                  align={isVertical ? 'start' : 'end'}
                >
                  {item.menuItems?.map((menuItem) => {
                    const MenuIcon = menuItem.icon;
                    // Once any row has an icon, the rest reserve its column —
                    // otherwise a checkmark on one row shunts the labels of
                    // its neighbours out of line.
                    const gutter = item.menuItems?.some((m) => m.icon);
                    return (
                      <React.Fragment key={menuItem.id}>
                        {menuItem.separatorBefore && <DropdownMenuSeparator />}
                        <DropdownMenuItem
                          disabled={menuItem.disabled}
                          onSelect={() => menuItem.onSelect?.()}
                          className={cn(
                            menuItem.destructive &&
                              'text-destructive focus:bg-destructive/15 focus:text-destructive hover:bg-destructive/10 hover:text-destructive'
                          )}
                        >
                          {MenuIcon ? (
                            <MenuIcon />
                          ) : gutter ? (
                            <span aria-hidden className="size-4 shrink-0" />
                          ) : null}
                          <span className="truncate">{menuItem.label}</span>
                          {menuItem.shortcut && (
                            <DropdownMenuShortcut>
                              {menuItem.shortcut}
                            </DropdownMenuShortcut>
                          )}
                        </DropdownMenuItem>
                      </React.Fragment>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              withTooltip
            )}
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
