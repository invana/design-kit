import { Sparkline } from "@invana/charts"
import { MetricTile } from "@invana/ui"

import { CAPTION_TONE, metricValue } from "../format"
import type { BlockProps, MetricOptions } from "../types"

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
export function MetricBlock({ spec }: BlockProps<"metric">) {
  return (
    <MetricTile
      variant="hero"
      label={spec.label}
      value={metricValue(spec.value)}
      tone={spec.value == null ? "muted" : undefined}
      caption={spec.delta}
      captionTone={spec.tone ? CAPTION_TONE[spec.tone] : undefined}
      gauge={spec.gauge ? gaugeOf(spec.gauge) : undefined}
      aside={
        spec.trend?.length ? (
          <Sparkline
            values={spec.trend}
            width={96}
            height={32}
            strokeWidth={1.4}
            endMarker={false}
            color="color-mix(in srgb, var(--color-foreground) 70%, transparent)"
            label={`${spec.label}, recent run`}
          />
        ) : undefined
      }
    />
  )
}
