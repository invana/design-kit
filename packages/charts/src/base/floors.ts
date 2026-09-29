/**
 * The floors every chart holds, so a thin period never draws a false picture.
 */

/**
 * A count axis never tops out below this. One run on a quiet day would
 * otherwise scale to a full-height column and read as a busy one.
 */
export const COUNT_FLOOR = 5

/** No bar or column is drawn wider than this, however few periods there are. */
export const MAX_BAR_WIDTH = 24

/** The gap in the surface colour between touching segments. */
export const SEGMENT_GAP = 2

/** The rounded data end of a bar. The baseline end stays square. */
export const BAR_RADIUS = 4

export interface Scale {
  /** The top of the axis. The bottom is always 0. */
  ceiling: number
  /** A hairline and a label at each: 0, then every step to the ceiling. */
  splits: number[]
}

/**
 * A clean axis for values running 0 → `max`: a step of 1, 2 or 5 × 10ⁿ, and
 * two to four of them to the top — 0 · 20 · 40 · 60 for a busiest day of 51,
 * 0 · 50K · 100K · 150K for 128,120. A count axis steps in whole numbers.
 */
export function niceScale(max: number, { integers = false } = {}): Scale {
  const top = max > 0 ? max : 1
  let power = 10 ** Math.floor(Math.log10(top / 4))
  if (integers) power = Math.max(1, power)
  for (;;) {
    for (const m of [1, 2, 5]) {
      const step = m * power
      const k = Math.max(1, Math.ceil(top / step - 1e-9))
      if (k <= 4) return { ceiling: step * k, splits: Array.from({ length: k + 1 }, (_, i) => i * step) }
    }
    power *= 10
  }
}

/**
 * A clean axis for values running `min` → `max` that need not start at 0 — a
 * lead time moving between 16 and 28 days reads as a flat line on a 0-based
 * axis. The same 1, 2 or 5 × 10ⁿ step, two to four of them, with the floor on
 * a step below the lowest value: 15 · 20 · 25 · 30 for 16.3 → 29.2.
 */
export function niceRange(min: number, max: number): Scale & { floor: number } {
  const span = max > min ? max - min : Math.abs(max) || 1
  let power = 10 ** Math.floor(Math.log10(span / 4))
  for (;;) {
    for (const m of [1, 2, 5]) {
      const step = m * power
      const floor = Math.floor(min / step + 1e-9) * step
      const k = Math.max(1, Math.ceil((max - floor) / step - 1e-9))
      if (k <= 4) {
        return {
          floor,
          ceiling: floor + step * k,
          splits: Array.from({ length: k + 1 }, (_, i) => floor + i * step),
        }
      }
    }
    power *= 10
  }
}

/** A count axis: clean, and never topping out below {@link COUNT_FLOOR}. */
export function countScale(max: number): Scale {
  return niceScale(Math.max(max, COUNT_FLOOR), { integers: true })
}

/** Splits for a caller-fixed ceiling: 0, the middle and the top. */
export function fixedSplits(ceiling: number): number[] {
  return [0, ceiling / 2, ceiling]
}

const compact = new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 })
const whole = new Intl.NumberFormat()

/** `1,284` under ten thousand, `12.9K` above it. */
export function formatCount(value: number): string {
  return Math.abs(value) < 10_000 ? whole.format(value) : compact.format(value)
}
