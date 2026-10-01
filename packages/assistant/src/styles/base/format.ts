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

/** `09:02` — the time a turn was sent, on a 24-hour clock. */
export function clockTime(iso: string | undefined): string | undefined {
  if (!iso) return undefined
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return undefined
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false })
}

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`

/** Whether two ISO times fall on the same local day. */
export function sameDay(a: string | undefined, b: string | undefined): boolean {
  if (!a || !b) return true
  return dayKey(new Date(a)) === dayKey(new Date(b))
}

/** `Today · Wed 30 Sep`, `Yesterday · Tue 29 Sep`, `Mon 28 Sep`. */
export function dayLabel(iso: string, now: number): string {
  const date = new Date(iso)
  const written = date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })
  const today = new Date(now)
  if (dayKey(date) === dayKey(today)) return `Today · ${written}`
  const yesterday = new Date(now - 86_400_000)
  if (dayKey(date) === dayKey(yesterday)) return `Yesterday · ${written}`
  return written
}
