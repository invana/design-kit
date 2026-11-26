/**
 * A colour for any string — a node type, a relationship type, a model's name.
 *
 * Every categorical thing that needs a default colour gets one slot of the data
 * palette (`themes/data-palette.css`), chosen by hashing its name. Same string,
 * same slot, always: a type keeps its colour across canvases, lists and reloads,
 * and it does not shift when a sibling is added or the list is re-sorted —
 * colour follows the entity, never its rank.
 *
 * A set can hold more names than the palette has slots; past the eighth, slots
 * repeat. That is admissible only because every use names the thing beside its
 * swatch — colour is never the only carrier of identity.
 *
 * Three rungs, pick the one the surface can take:
 *
 * | Function | Returns | For |
 * |---|---|---|
 * | `colorSlotByString` | `1`…`8` | storing or binding the slot itself |
 * | `colorVarByString` | `var(--color-data-<hue>)` | anything that takes CSS |
 * | `colorByString` | `rgb(…)`, resolved live | a canvas that needs a concrete value |
 */

/**
 * The data palette's hues, in slot order: `--color-data-<hue>`. Slot 1 is the
 * first series on every chart. A theme may re-step a hue's lightness, never its
 * hue; a different palette is a different file, not a rename.
 */
export const DATA_HUES = ['blue', 'orange', 'aqua', 'yellow', 'magenta', 'green', 'violet', 'red'] as const;

/** One of the palette's hue names. */
export type DataHue = (typeof DATA_HUES)[number];

/** How many slots the data palette defines. */
export const DATA_PALETTE_SLOTS = DATA_HUES.length;

/** The token of a 1-based slot as a CSS value: `dataVar(3)` → `var(--color-data-aqua)`. Wraps past the eighth. */
export function dataVar(slot: number, fallback?: string): string {
  const hue = DATA_HUES[(((Math.trunc(slot) - 1) % DATA_PALETTE_SLOTS) + DATA_PALETTE_SLOTS) % DATA_PALETTE_SLOTS];
  return fallback ? `var(--color-data-${hue}, ${fallback})` : `var(--color-data-${hue})`;
}

/** Neutral stand-in when a slot will not resolve (older styling, no theme yet). */
const FALLBACK_VAR = '--color-muted-foreground';

/** The palette slot (1-based) a string lands in. Empty → slot 1. */
export function colorSlotByString(value: string | null | undefined): number {
  if (!value) return 1;
  let h = 0;
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) >>> 0;
  return (h % DATA_PALETTE_SLOTS) + 1;
}

/** The slot's token as a CSS value, with a neutral fallback baked in. */
export function colorVarByString(value: string | null | undefined): string {
  return dataVar(colorSlotByString(value), `var(${FALLBACK_VAR})`);
}

/*
 * Resolved colours, keyed by the root's theme stamp. A canvas asks once per
 * item on every restyle and each probe forces a style recalc, so reads are
 * cached; the theme lives on the root's class and inline style, so a theme or
 * mode switch changes the stamp and the next read re-resolves.
 */
let cacheStamp = '';
const cache = new Map<string, string | undefined>();

/** Resolve any CSS colour value to the concrete `rgb(…)` the browser computes. */
export function resolveCssColor(css: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const root = document.documentElement;
  const stamp = `${root.className}|${root.getAttribute('style') ?? ''}`;
  if (stamp !== cacheStamp) {
    cacheStamp = stamp;
    cache.clear();
  }
  if (cache.has(css)) return cache.get(css);
  const probe = document.createElement('span');
  probe.style.color = css;
  probe.style.display = 'none';
  root.appendChild(probe);
  const rgb = getComputedStyle(probe).color || undefined;
  probe.remove();
  cache.set(css, rgb);
  return rgb;
}

/**
 * The live colour for a string: `explicit` if given, else its palette slot
 * resolved against the active theme. Falls back to the token string when there
 * is no DOM to resolve against.
 */
export function colorByString(value: string | null | undefined, explicit?: string): string {
  if (explicit) return explicit;
  const css = colorVarByString(value);
  return resolveCssColor(css) ?? css;
}
