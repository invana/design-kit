import type { MetricTone } from "@invana/ui"

import type { Figure, MetricOptions, Tone } from "./types"

/**
 * A figure as text. A string arrives already written; a number or a typed
 * value is written here, plainly, until `formatValue` lands in `@invana/ui`.
 */
export function figureText(figure: Figure): string {
  if (typeof figure === "string") return figure
  if (typeof figure === "number") return figure.toLocaleString("en-GB")
  const n = figure.value.toLocaleString("en-GB")
  return figure.unit ? `${n} ${figure.unit}` : n
}

/** A figure's value, or a muted dash when there is none to give. */
export function metricValue(value: MetricOptions["value"]) {
  return value == null ? "—" : figureText(value)
}

/** The tones, as a caption's. `neutral` leaves it muted. */
export const CAPTION_TONE: Record<Tone, MetricTone | undefined> = {
  good: "success",
  bad: "error",
  warn: "warning",
  neutral: undefined,
}

/** The tones, as a `Badge`'s. */
export const BADGE_TONE: Record<Tone, "success" | "destructive" | "warning" | "muted"> = {
  good: "success",
  bad: "destructive",
  warn: "warning",
  neutral: "muted",
}

/**
 * A metric's gauge as the tile draws it: shares of the scale, and its ends and
 * target written in `unit` — or, with no target, a plain meter.
 */
export function gaugeProps(gauge: MetricOptions["gauge"]) {
  if (!gauge) return {}
  const min = gauge.min ?? 0
  const span = gauge.max - min || 1
  const fill = (gauge.value - min) / span
  if (gauge.target == null) return { meter: fill }
  const write = (n: number) => `${n.toLocaleString("en-GB")}${gauge.unit ?? ""}`
  return {
    gauge: {
      fill,
      mark: (gauge.target - min) / span,
      labels: [write(min), `target ${write(gauge.target)}`, write(gauge.max)] as [string, string, string],
    },
  }
}

/**
 * How long something has waited, in its two largest units: `12s`, `1m 2s`,
 * `1h 3m`, `1d 1h`. A whole unit alone is written alone — `2m`, `1d`.
 */
export function humanWait(ms: number): string {
  const total = Number.isFinite(ms) && ms > 0 ? Math.floor(ms / 1000) : 0
  const units: [string, number][] = [
    ["d", 86_400],
    ["h", 3_600],
    ["m", 60],
    ["s", 1],
  ]
  const at = units.findIndex(([, size]) => total >= size)
  if (at < 0) return "0s"
  const [unit, size] = units[at]
  const rest = total - Math.floor(total / size) * size
  const next = units[at + 1]
  const small = next ? Math.floor(rest / next[1]) : 0
  const head = `${Math.floor(total / size)}${unit}`
  return next && small ? `${head} ${small}${next[0]}` : head
}
