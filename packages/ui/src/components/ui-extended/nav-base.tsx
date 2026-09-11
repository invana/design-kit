import React from "react";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  Separator,
} from "../ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "../../lib/utils";
import { useOverflowItems } from "../../hooks/use-overflow-items";
import type { LucideIcon } from "lucide-react";

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
  /** Optional unique key for React rendering, and the item's identity for
   *  `activeKey`. Falls back to `name`. */
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
  /** Classes for the label span alone — a truncation cap, usually
   *  (`max-w-[16ch] truncate`). */
  labelClassName?: string;
  /** Stroke width for the icon (default: 2) */
  iconStroke?: number;
  /** Tooltip position */
  tooltipSide?: "top" | "right" | "bottom" | "left";
  /** Show a separator line after this item */
  showSeperator?: boolean;
  /** Lucide icon component. Optional — items may be label-only (e.g. status-bar text). */
  icon?: React.ElementType | LucideIcon;
  /** Custom tooltip content (overrides name) */
  tooltip?: React.ReactNode;
  /** Greys the item out and drops every interaction on it. */
  disabled?: boolean;
  /**
   * Inline style passthrough — for a per-item value the theme cannot express,
   * such as a colour carried by the data (a page's own accent). Everything
   * static belongs in `className`.
   */
  style?: React.CSSProperties;
  /**
   * Rows of a dropdown opened by this item. With `menuItems` the item is a
   * menu trigger — it needs no `onClick`, and stays highlighted while its menu
   * is open. Ignored when `href` is set.
   */
  menuItems?: NavMenuItem[];
  /**
   * Where `menuItems` hangs off.
   *
   * `'item'` (the default) — the whole item is the trigger. Clicking anywhere
   * on it opens the menu.
   *
   * `'caret'` — a chevron button *inside* the item: the body still selects,
   * and only the caret opens the menu. That is what a page tab needs, and it
   * is why a tab strip could not be built on nav items before.
   */
  menuTrigger?: "item" | "caret";
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

/**
 * The visual treatments a strip of nav items can wear.
 *
 * One table, because the kit draws all three and used to draw two of them by
 * hand in separate components. `nav` is what nav items have always looked
 * like; `underline` and `folder` are the two tab strips — a panel's views and
 * a workbook's pages — lifted out of `TabbedPanel` and
 * `CanvasPagesViewPanel` unchanged, so migrating those renders identically.
 */
const VARIANT = {
  /** The capsule: a filled, ringed chip. Toolbars, rails, header actions. */
  nav: {
    item: "rounded-control ring-1 ring-transparent",
    hover: "hover:bg-primary/10 hover:text-primary hover:ring-primary/25",
    open: "data-[state=open]:bg-primary/15 data-[state=open]:text-primary data-[state=open]:ring-primary/25",
    active: "bg-primary/15 text-primary ring-primary/25",
    strip: "",
  },
  /** The panel tab: accented fill with a rule under it, merging into the body. */
  underline: {
    item: "h-full rounded-none px-3 py-2",
    hover: "hover:text-foreground",
    open: "data-[state=open]:text-foreground",
    active: "bg-primary/10 text-primary border-b-2 border-primary mb-[-1px]",
    strip: "items-stretch",
  },
  /**
   * The workbook tab: boxed on top / left / right with an *open bottom*, so it
   * punches through the strip's own rule — the classic folder-tab notch.
   */
  folder: {
    item: "h-full rounded-none px-3 py-2 gap-1.5",
    hover: "hover:text-foreground",
    open: "data-[state=open]:text-foreground",
    active:
      "mb-[-1px] rounded-t-md border border-b-0 border-primary text-primary",
    strip: "items-stretch",
  },
} as const;

export type NavItemsVariant = keyof typeof VARIANT;

export interface NavItemsProps {
  items: NavItemConfig[];
  /** Layout orientation — drives default icon size, padding, tooltip side and separator. */
  orientation?: "horizontal" | "vertical";
  /** Default tooltip side when an item doesn't specify one. */
  tooltipSide?: "top" | "right" | "bottom" | "left";
  /** Default icon classes when an item doesn't specify `iconClassName`. */
  iconClassName?: string;
  /** Visual treatment — see {@link VARIANT}. Defaults to `nav`. */
  variant?: NavItemsVariant;
  /**
   * The selected item's key (`item.key ?? item.name`).
   *
   * Passing it makes the strip **controlled**: the internal highlight is
   * bypassed entirely and the caller owns which item is lit. Omit it and the
   * strip keeps its own state exactly as it always has.
   */
  activeKey?: string;
  /** Fires with the item's key whenever selection changes, controlled or not. */
  onActiveChange?: (key: string) => void;
  /**
   * `'tabs'` announces the strip as a tab list and gives it tab keyboard
   * behaviour: `role="tablist"` on the container, `role="tab"` +
   * `aria-selected` per item, ONE tab stop for the whole strip (roving
   * tabindex), and ← → ↑ ↓ Home End moving between items with selection
   * following focus — the same model Radix's tabs use.
   *
   * `'none'` (the default) leaves items as the plain buttons and links they
   * have always been.
   */
  selectionMode?: "none" | "tabs";
  /** Item key → the `id` of the panel it controls, for `aria-controls`. */
  panelId?: (key: string) => string;
  /**
   * Fold the items that do not fit into a `…` dropdown at the end of the strip.
   *
   * **Off by default.** A strip only becomes responsive because its owner asked
   * it to — a toolbar that would rather scroll, or one whose items must all
   * stay visible, is unaffected by this existing.
   *
   * Requires the strip to have a bounded width to measure against: put
   * `min-w-0` on it (or on its flex parent) or it will report that everything
   * fits, forever. Ignored on a vertical strip, which grows downward.
   */
  overflow?: boolean;
  /** Accessible name and tooltip for the overflow trigger. */
  overflowLabel?: string;
  /** Classes for the strip container. Only rendered when the strip needs one —
   *  see the note on the return value in {@link NavItems}. */
  className?: string;
}

/** An item's stable identity: its `key`, or its `name` when it has none. */
const keyOf = (item: NavItemConfig): string => item.key ?? item.name;

/**
 * NavItems - Shared renderer for navigation items. Renders href / onClick /
 * static items with identical styling so all three share the same padding,
 * primary hover + active highlight, and icon size.
 *
 * **What it returns.** With neither `selectionMode` nor `overflow` set it
 * returns a bare fragment, exactly as it always has, and the caller's own
 * wrapper lays the items out — every existing consumer is untouched. Ask for
 * either and it renders its own container, because both need one: a tab list
 * needs an element to carry `role="tablist"` and the keyboard handler, and
 * overflow needs an element whose width is the budget.
 */
export const NavItems: React.FC<NavItemsProps> = ({
  items,
  orientation = "horizontal",
  tooltipSide = orientation === "vertical" ? "right" : "bottom",
  iconClassName = orientation === "vertical"
    ? "w-5 h-5"
    : "w-4 h-4 flex-shrink-0",
  variant = "nav",
  activeKey,
  onActiveChange,
  selectionMode = "none",
  panelId,
  overflow = false,
  overflowLabel = "More",
  className,
}) => {
  const isVertical = orientation === "vertical";
  const isTabs = selectionMode === "tabs";
  const V = VARIANT[variant];

  const [internalActive, setInternalActive] = React.useState<null | string>(
    null,
  );
  const isControlled = activeKey !== undefined;
  const currentKey = isControlled ? activeKey : internalActive;
  const activeIndex = items.findIndex((item) => keyOf(item) === currentKey);

  // Selection follows focus, so a key press has to move the DOM focus too —
  // and the item it moves to may have been folded a moment ago. Resolving the
  // node after the render that un-folds it is the only order that works.
  const nodes = React.useRef<Record<string, HTMLElement | null>>({});
  const pendingFocus = React.useRef<string | null>(null);
  React.useEffect(() => {
    const key = pendingFocus.current;
    if (!key) return;
    const node = nodes.current[key];
    // The item may still be folded on this pass: selecting it pins it, and the
    // fold is only lifted by the render that follows. Hold the request rather
    // than dropping it, and the next pass — the one that puts the item back on
    // the strip — is where the focus lands.
    if (!node) return;
    pendingFocus.current = null;
    node.focus();
  });

  const { containerRef, itemRef, hiddenIndices, isHidden } = useOverflowItems({
    count: items.length,
    enabled: overflow && !isVertical,
    pinnedIndex: activeIndex >= 0 ? activeIndex : undefined,
  });

  const select = React.useCallback(
    (item: NavItemConfig) => {
      if (item.disabled) return;
      const key = keyOf(item);
      item.onClick?.();
      if (!isControlled) {
        // A tab strip always has exactly one selection; a plain nav item is a
        // toggle, which is what it has always been.
        setInternalActive((prev) => (isTabs ? key : prev === key ? null : key));
      }
      onActiveChange?.(key);
    },
    [isControlled, isTabs, onActiveChange],
  );

  /** The next selectable index in `delta` direction, wrapping, skipping disabled. */
  const step = (from: number, delta: number): number => {
    if (items.length === 0) return -1;
    let i = from < 0 ? (delta > 0 ? -1 : 0) : from;
    for (let n = 0; n < items.length; n++) {
      i = (i + delta + items.length) % items.length;
      if (!items[i]?.disabled) return i;
    }
    return -1;
  };

  const edge = (delta: 1 | -1): number => {
    const start = delta > 0 ? -1 : items.length;
    return step(start, delta);
  };

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (!isTabs) return;
    const next = isVertical ? "ArrowDown" : "ArrowRight";
    const prev = isVertical ? "ArrowUp" : "ArrowLeft";

    let target = -1;
    if (event.key === next) target = step(activeIndex, 1);
    else if (event.key === prev) target = step(activeIndex, -1);
    else if (event.key === "Home") target = edge(1);
    else if (event.key === "End") target = edge(-1);
    else return;

    const item = items[target];
    if (!item) return;
    event.preventDefault();
    pendingFocus.current = keyOf(item);
    select(item);
  };

  const renderItem = (item: NavItemConfig, index: number): React.ReactNode => {
    const key = keyOf(item);
    const isActive = key === currentKey;
    const hasMenu = !item.href && Boolean(item.menuItems?.length);
    const asCaret = hasMenu && item.menuTrigger === "caret";
    // Static items (no href/onClick/menu) are plain text — no hover affordance.
    const isInteractive = Boolean(
      item.href || item.onClick || hasMenu || isTabs,
    );
    const padding =
      variant === "nav" ? (item.label ? "px-3 py-1.5" : "px-2 py-2") : "";

    const itemClass = cn(
      `relative inline-flex border-0 items-center justify-center gap-2
       whitespace-nowrap transition-colors
       ring-1 ring-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`,
      V.item,
      padding,
      isInteractive && !item.disabled && `cursor-pointer ${V.hover}`,
      hasMenu && !asCaret && V.open,
      item.disabled && "pointer-events-none opacity-50",
      isActive && cn(V.active, item.activeClass),
      item.className,
    );

    const icon = item.icon && (
      <item.icon
        strokeWidth={item.iconStroke || 2}
        className={item.iconClassName || iconClassName}
      />
    );
    const label = item.label && (
      <span className={item.labelClassName}>{item.label}</span>
    );
    const badge = item.badge != null && (
      <span
        className="pointer-events-none absolute -right-0.5 -top-0.5 inline-flex h-3.5
          min-w-3.5 items-center justify-center rounded-full bg-primary px-1
          text-[9px] font-semibold leading-none text-primary-foreground"
      >
        {item.badge}
      </span>
    );

    // Tab semantics: one tab stop for the strip, and the selected item is it.
    // With nothing selected the first item takes the stop, so the strip is
    // never unreachable by keyboard.
    const tabProps = isTabs
      ? {
          role: "tab",
          "aria-selected": isActive,
          "aria-controls": panelId?.(key),
          tabIndex: isActive || (activeIndex < 0 && index === 0) ? 0 : -1,
        }
      : {};

    const setNode = (el: HTMLElement | null): void => {
      nodes.current[key] = el;
      itemRef(index)(el);
    };

    const caret = asCaret && (
      <DropdownMenuTrigger asChild>
        <span
          role="button"
          tabIndex={-1}
          aria-label={`${item.name} menu`}
          onClick={(e) => e.stopPropagation()}
          className="ml-0.5 grid size-4 shrink-0 cursor-pointer place-items-center
            rounded-control text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <ChevronDown className="size-3" />
        </span>
      </DropdownMenuTrigger>
    );

    const inner = (
      <>
        {icon}
        {label}
        {caret}
        {badge}
      </>
    );

    // A caret item hosts a button, so it cannot itself be one — nested buttons
    // are invalid, and the browser resolves the click to the outer control.
    const control = asCaret ? (
      <div
        ref={setNode}
        {...tabProps}
        style={item.style}
        onClick={() => select(item)}
        className={itemClass}
      >
        {inner}
      </div>
    ) : item.href ? (
      <a
        ref={setNode as React.Ref<HTMLAnchorElement>}
        href={item.href}
        style={item.style}
        onClick={() => select(item)}
        className={itemClass}
      >
        {inner}
      </a>
    ) : item.onClick || hasMenu || isTabs ? (
      <button
        ref={setNode as React.Ref<HTMLButtonElement>}
        type="button"
        disabled={item.disabled}
        {...tabProps}
        style={item.style}
        onClick={() => {
          // A menu trigger owns its own open state; don't also latch it into
          // the nav's "active item" highlight.
          if (hasMenu) item.onClick?.();
          else select(item);
        }}
        className={itemClass}
      >
        {inner}
      </button>
    ) : (
      <div ref={setNode} style={item.style} className={itemClass}>
        {inner}
      </div>
    );

    const withTooltip = (
      <Tooltip>
        <TooltipTrigger asChild>
          {hasMenu && !asCaret ? (
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
              side={isVertical ? "right" : "bottom"}
              align={isVertical ? "start" : "end"}
            >
              {renderMenuRows(item.menuItems)}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          withTooltip
        )}
        {item.showSeperator && (
          <Separator
            orientation={isVertical ? "horizontal" : "vertical"}
            className={isVertical ? "" : "h-4"}
          />
        )}
      </React.Fragment>
    );
  };

  const rendered = items.map((item, index) =>
    isHidden(index) ? null : renderItem(item, index),
  );

  /**
   * The folded items, as one `…` dropdown. Rows carry the item's own icon and
   * label so the menu reads as a continuation of the strip rather than a
   * separate list; selecting one pins it, and the next fit brings it back onto
   * the strip.
   */
  const overflowTrigger = hiddenIndices.length > 0 && (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={overflowLabel}
              className={cn(
                `relative inline-flex shrink-0 items-center justify-center border-0
                 transition-colors ring-1 ring-transparent focus-visible:outline-none
                 focus-visible:ring-2 focus-visible:ring-ring cursor-pointer`,
                V.item,
                variant === "nav" && "px-2 py-2",
                V.hover,
                V.open,
              )}
            >
              <MoreHorizontal className={iconClassName} />
            </button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side={tooltipSide}>{overflowLabel}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end">
        {hiddenIndices.map((index) => {
          const item = items[index];
          if (!item) return null;
          const Icon = item.icon;
          return (
            <DropdownMenuItem
              key={keyOf(item)}
              disabled={item.disabled}
              onSelect={() => select(item)}
            >
              {Icon ? (
                <Icon />
              ) : (
                <span aria-hidden className="size-4 shrink-0" />
              )}
              <span className="truncate">{item.label ?? item.name}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Every item carries a tooltip, and Radix needs a provider above it. This
  // component supplies its own — the same call `PanelContent`, `PanelStack`,
  // `TabbedPanel` and `RichSelect` already make — so a strip works outside an
  // app shell (a page tab bar, a Storybook story) without the caller knowing
  // it owes one. Nesting inside an app's own provider is harmless.
  //
  // Neither a tab list nor an overflow budget is wanted: return the items bare,
  // exactly as this component always has, and let the caller's wrapper lay
  // them out.
  if (!isTabs && !overflow) {
    return <TooltipProvider delayDuration={0}>{rendered}</TooltipProvider>;
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div
        ref={containerRef}
        role={isTabs ? "tablist" : undefined}
        aria-orientation={isTabs ? orientation : undefined}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex min-w-0",
          isVertical ? "flex-col items-center gap-1" : "items-center gap-1",
          V.strip,
          className,
        )}
      >
        {rendered}
        {overflowTrigger}
      </div>
    </TooltipProvider>
  );
};

/** The rows of a nav item's dropdown, shared by every menu this file opens. */
function renderMenuRows(menuItems: NavMenuItem[] | undefined): React.ReactNode {
  // Once any row has an icon, the rest reserve its column — otherwise a
  // checkmark on one row shunts the labels of its neighbours out of line.
  const gutter = menuItems?.some((m) => m.icon);
  return menuItems?.map((menuItem) => {
    const MenuIcon = menuItem.icon;
    return (
      <React.Fragment key={menuItem.id}>
        {menuItem.separatorBefore && <DropdownMenuSeparator />}
        <DropdownMenuItem
          disabled={menuItem.disabled}
          onSelect={() => menuItem.onSelect?.()}
          className={cn(
            menuItem.destructive &&
              "text-destructive focus:bg-destructive/15 focus:text-destructive hover:bg-destructive/10 hover:text-destructive",
          )}
        >
          {MenuIcon ? (
            <MenuIcon />
          ) : gutter ? (
            <span aria-hidden className="size-4 shrink-0" />
          ) : null}
          <span className="truncate">{menuItem.label}</span>
          {menuItem.shortcut && (
            <DropdownMenuShortcut>{menuItem.shortcut}</DropdownMenuShortcut>
          )}
        </DropdownMenuItem>
      </React.Fragment>
    );
  });
}

export interface NavSection {
  content?: React.ReactNode;
  className?: string;
}

export interface BaseNavProps {
  className?: string;
  orientation: "horizontal" | "vertical";
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
export const NavBase: React.FC<BaseNavProps> = ({
  className = "",
  orientation,
  sections,
}) => {
  const isVertical = orientation === "vertical";

  const containerClass = isVertical
    ? `flex flex-col items-center h-full ${className}`
    : `flex items-center   w-full ${className}`;

  const sectionWrapperClass = isVertical
    ? "flex flex-col items-center gap-1"
    : "flex items-center gap-1 ";

  return (
    <nav className={containerClass}>
      {sections.start?.content && (
        <div
          className={`${sectionWrapperClass} ${sections.start.className || ""}`}
        >
          {sections.start.content}
        </div>
      )}

      {sections.center?.content ? (
        <div
          className={`flex-1 ${isVertical ? "" : "flex justify-center items-center gap-1"} ${sections.center.className || ""}`}
        >
          {sections.center.content}
        </div>
      ) : (
        // Empty spacer to push end section to the bottom/right
        <div className="flex-1" />
      )}

      {sections.end?.content && (
        <div
          className={`${sectionWrapperClass} ${isVertical ? "" : "ml-auto"} ${sections.end.className || ""}`}
        >
          {sections.end.content}
        </div>
      )}
    </nav>
  );
};
