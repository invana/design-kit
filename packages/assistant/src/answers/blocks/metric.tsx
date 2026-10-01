import { Sparkline } from "@invana/charts"
import { MetricTile, type MetricTone } from "@invana/ui"

import type { BlockRendererProps } from "../../conversations/registry"
import type { MetricOptions, Tone } from "../../protocol/types"
import { figureText } from "./figure"

/** The grammar's tones, as the caption's. `neutral` leaves it muted. */
export const CAPTION_TONE: Record<Tone, MetricTone | undefined> = {
  good: "success",
  bad: "error",
  warn: "warning",
  neutral: undefined,
}

/** A figure's value, or a muted dash when there is none to give. */
export function metricValue(value: MetricOptions["value"]) {
  return value == null ? "—" : figureText(value)
}

/** The gauge's scale as the tile draws it: shares of the scale, and its ends and target written in `unit`. */
function gaugeOf(gauge: NonNullable<MetricOptions["gauge"]>) {
  const min = gauge.min ?? 0
  const span = gauge.max - min || 1
  const write = (n: number) => `${n.toLocaleString("en-GB")}${gauge.unit ?? ""}`
  return {
    fill: (gauge.value - min) / span,
    mark: (gauge.target - min) / span,
    labels: [write(min), `target ${write(gauge.target)}`, write(gauge.max)] as [string, string, string],
  }
}

/**
 * The one figure an answer turns on, with its comparison worded under it — and,
 * when the answer has them, a bar against its target or its recent run beside it.
 */
export function MetricBlock({ block }: BlockRendererProps<"metric">) {
  return (
    <MetricTile
      variant="hero"
      label={block.label}
      value={metricValue(block.value)}
      tone={block.value == null ? "muted" : undefined}
      caption={block.delta}
      captionTone={block.tone ? CAPTION_TONE[block.tone] : undefined}
      gauge={block.gauge ? gaugeOf(block.gauge) : undefined}
      aside={
        block.trend?.length ? (
          <Sparkline
            values={block.trend}
            width={96}
            height={32}
            strokeWidth={1.4}
            endMarker={false}
            color="color-mix(in srgb, var(--color-foreground) 70%, transparent)"
            label={`${block.label}, recent run`}
          />
        ) : undefined
      }
    />
  )
}
