import * as React from 'react';

/** Stable empty result, so "nothing folds" never re-renders a consumer. */
const NONE: readonly number[] = Object.freeze([]);

export interface UseOverflowItemsOptions {
  /** How many items the strip renders. */
  count: number;
  /**
   * Off when false: nothing is measured, nothing folds, and the hook costs a
   * consumer nothing but a ref it can ignore. This is what keeps `overflow` an
   * opt-in on every component that wires the hook up.
   */
  enabled?: boolean;
  /**
   * An index that must never fold — the selected tab. A strip whose active
   * item has folded reads as having no selection at all, and arrowing onto a
   * folded tab is what brings it back (the new active index is pinned, so the
   * next fit keeps it).
   */
  pinnedIndex?: number;
  /**
   * Width to keep free for the overflow trigger, in px. Only charged when
   * something actually folds — see `fit`.
   */
  reserve?: number;
}

export interface UseOverflowItemsResult {
  /** Attach to the element whose width is the budget. */
  containerRef: React.RefCallback<HTMLElement>;
  /** Attach to item `index`. Stable per index, so items don't re-attach. */
  itemRef: (index: number) => React.RefCallback<HTMLElement>;
  /** Indices that do not fit, ascending. Identity is stable while unchanged. */
  hiddenIndices: readonly number[];
  /** `true` when item `index` should not be rendered on the strip. */
  isHidden: (index: number) => boolean;
}

/** Two index lists are the same run of numbers. */
function same(a: readonly number[], b: readonly number[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

/**
 * Measure a horizontal strip and report which of its items do not fit.
 *
 * The hook owns **only the arithmetic**. It renders nothing, knows nothing
 * about tabs, nav items or menus, and takes no opinion on what a consumer does
 * with the overflow — `NavItems` folds it into a `…` dropdown, but a
 * breadcrumb could collapse it to an ellipsis and a toolbar could drop it
 * entirely. That is the whole reason it is a hook and not a prop on one
 * component: the three strips in this kit render through three different
 * components and share no markup.
 *
 * **How it measures.** An item that has been folded has no box to measure, so
 * the hook caches each item's natural width the last time it was on the strip
 * and plans with that. The first render therefore lays every item out — that
 * pass is what fills the cache — and the fold is applied in a layout effect,
 * before the browser paints, so there is no flash of an overflowing strip.
 *
 * **How it avoids looping.** Folding changes the DOM, which fires the observers
 * again; the result only reaches React when the index list actually differs,
 * and widths are cached only from items that are currently laid out (a
 * `display:none` item reports `0`, which would otherwise poison the cache).
 *
 * @example
 * ```tsx
 * const { containerRef, itemRef, hiddenIndices, isHidden } = useOverflowItems({
 *   count: items.length,
 *   enabled: overflow,
 *   pinnedIndex: items.findIndex((i) => i.key === activeKey),
 * });
 *
 * <div ref={containerRef} className="flex min-w-0 flex-1 items-center gap-1">
 *   {items.map((item, i) =>
 *     isHidden(i) ? null : <button key={item.key} ref={itemRef(i)}>{item.label}</button>
 *   )}
 *   {hiddenIndices.length > 0 && <OverflowMenu items={hiddenIndices.map((i) => items[i])} />}
 * </div>
 * ```
 */
export function useOverflowItems({
  count,
  enabled = true,
  pinnedIndex,
  reserve = 32,
}: UseOverflowItemsOptions): UseOverflowItemsResult {
  const containerEl = React.useRef<HTMLElement | null>(null);
  const itemEls = React.useRef<(HTMLElement | null)[]>([]);
  /** Last known natural width per index, the strip's column gap included. */
  const widths = React.useRef<number[]>([]);
  /** One stable ref callback per index — a fresh closure would detach on every render. */
  const itemRefs = React.useRef<React.RefCallback<HTMLElement>[]>([]);

  const [hidden, setHidden] = React.useState<readonly number[]>(NONE);

  const fit = React.useCallback(() => {
    const el = containerEl.current;
    if (!el || !enabled) {
      setHidden((prev) => (prev === NONE ? prev : NONE));
      return;
    }

    // Refresh the cache from whatever is laid out right now. `offsetParent` is
    // null for a `display:none` ancestor too, which is exactly right: a strip
    // inside a hidden panel must not overwrite good widths with zeroes.
    const gap = Number.parseFloat(getComputedStyle(el).columnGap) || 0;
    for (let i = 0; i < count; i++) {
      const item = itemEls.current[i];
      if (item && item.offsetParent !== null) widths.current[i] = item.offsetWidth + gap;
    }

    const budget = el.clientWidth;
    // A container that has not been laid out yet (a closed panel, a hidden
    // tab) measures 0. Folding everything on the strength of that is wrong, so
    // leave the strip alone until it has a real width.
    if (budget <= 0) return;

    let total = 0;
    for (let i = 0; i < count; i++) total += widths.current[i] ?? 0;

    // The reserve is only owed once a trigger is actually drawn. Charging for
    // it unconditionally folds one item too many at every width — the strip
    // would make room for a `…` that then never appears.
    if (total <= budget + gap) {
      setHidden((prev) => (prev === NONE ? prev : NONE));
      return;
    }

    const next: number[] = [];
    let used = pinnedIndex != null ? (widths.current[pinnedIndex] ?? 0) : 0;
    for (let i = 0; i < count; i++) {
      if (i === pinnedIndex) continue;
      const w = widths.current[i] ?? 0;
      if (used + w <= budget - reserve) used += w;
      else next.push(i);
    }

    setHidden((prev) => (same(prev, next) ? prev : next));
  }, [count, enabled, pinnedIndex, reserve]);

  // A changed item count invalidates an index-keyed cache wholesale: index 4
  // is a different tab than it was. Drop both and let the next pass re-measure
  // with everything laid out.
  React.useLayoutEffect(() => {
    widths.current = [];
    itemEls.current.length = count;
    setHidden((prev) => (prev === NONE ? prev : NONE));
  }, [count]);

  React.useLayoutEffect(() => {
    fit();
    if (!enabled || typeof ResizeObserver === 'undefined') return;

    // The container is the budget; the items are the demand. Watching both
    // means a label that grows re-fits the strip without the panel moving.
    const observer = new ResizeObserver(() => fit());
    if (containerEl.current) observer.observe(containerEl.current);
    for (const item of itemEls.current) if (item) observer.observe(item);
    return () => observer.disconnect();
  }, [fit, enabled, hidden]);

  const containerRef = React.useCallback<React.RefCallback<HTMLElement>>((el) => {
    containerEl.current = el;
  }, []);

  const itemRef = React.useCallback((index: number): React.RefCallback<HTMLElement> => {
    let fn = itemRefs.current[index];
    if (!fn) {
      fn = (el: HTMLElement | null) => {
        itemEls.current[index] = el;
      };
      itemRefs.current[index] = fn;
    }
    return fn;
  }, []);

  const isHidden = React.useCallback(
    (index: number) => hidden.includes(index),
    [hidden],
  );

  return { containerRef, itemRef, hiddenIndices: hidden, isHidden };
}
