import { Sparkline } from "@invana/charts"
import { MetricTile } from "@invana/ui"

import { CAPTION_TONE, gaugeProps, metricValue } from "../format"
import type { BlockProps } from "../types"

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
      {...gaugeProps(spec.gauge)}
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
