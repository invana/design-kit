/**
 * How long ago, in the words a thread uses — `just now`, `4 min ago`,
 * `3 h ago`, then the date, `28 Sep`. `now` is passed in, so a story or a
 * test reads the same every time it runs.
 */
export function relativeTime(iso: string, now: number): string | undefined {
  const then = Date.parse(iso)
  if (Number.isNaN(then)) return undefined
  const minutes = Math.floor((now - then) / 60_000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} h ago`
  return new Date(then).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
}
