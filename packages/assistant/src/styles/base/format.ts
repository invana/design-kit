/**
 * How a thread writes time. Every function takes the clock it reads against,
 * so a story or a test reads the same every run.
 */

/** `912ms`, `1.4s`, `2m 5s`, `1h 20m` — `spaced` writes `1.4 s`, as a sentence does. */
export function formatDuration(ms: number, { spaced = false }: { spaced?: boolean } = {}): string {
  const gap = spaced ? " " : ""
  if (!Number.isFinite(ms) || ms < 0) return `0${gap}ms`
  if (ms < 1000) return `${Math.round(ms)}${gap}ms`
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}${gap}s`
  const pair = (big: number, bigUnit: string, small: number, smallUnit: string) =>
    small ? `${big}${gap}${bigUnit} ${small}${gap}${smallUnit}` : `${big}${gap}${bigUnit}`
  if (ms < 3_600_000) return pair(Math.floor(ms / 60_000), "m", Math.round((ms % 60_000) / 1000), "s")
  return pair(Math.floor(ms / 3_600_000), "h", Math.round((ms % 3_600_000) / 60_000), "m")
}

/** ms since an ISO time, never below zero; `undefined` when there is no time. */
export function elapsedSince(iso: string | undefined, now: number): number | undefined {
  if (!iso) return undefined
  const then = Date.parse(iso)
  return Number.isNaN(then) ? undefined : Math.max(0, now - then)
}

/** `09:02` — the time an answer settled, on a 24-hour clock. */
export function clockTime(iso: string | undefined): string | undefined {
  if (!iso) return undefined
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return undefined
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false })
}
