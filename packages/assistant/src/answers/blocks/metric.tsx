import { MetricTile, type MetricTone } from "@invana/ui"

import type { BlockRendererProps } from "../../conversations/registry"
import type { Tone } from "../../protocol/types"
import { figureText } from "./figure"

/** The grammar's tones, as the caption's. `neutral` leaves it muted. */
const CAPTION_TONE: Record<Tone, MetricTone | undefined> = {
  good: "success",
  bad: "error",
  warn: "warning",
  neutral: undefined,
}

/** The one figure an answer turns on, with its comparison worded under it. */
export function MetricBlock({ block }: BlockRendererProps<"metric">) {
  return (
    <MetricTile
      variant="hero"
      label={block.label}
      value={figureText(block.value)}
      caption={block.delta}
      captionTone={block.tone ? CAPTION_TONE[block.tone] : undefined}
    />
  )
}
