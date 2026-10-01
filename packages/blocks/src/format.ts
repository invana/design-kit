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
