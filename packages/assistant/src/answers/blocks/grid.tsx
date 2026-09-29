import { MetricGrid, MetricTile, type MetricTone } from "@invana/ui"

import type { BlockRendererProps } from "../../conversations/registry"
import type { Tone } from "../../protocol/types"
import { figureText } from "./figure"

/** The grammar's tones, as the tile's. `neutral` leaves the caption muted. */
const CAPTION_TONE: Record<Tone, MetricTone | undefined> = {
  good: "success",
  bad: "error",
  warn: "warning",
  neutral: undefined,
}

/** A band of figures that belong to one answer, each with its change beneath it. */
export function GridBlock({ block }: BlockRendererProps<"grid">) {
  return (
    <MetricGrid joined>
      {block.tiles.map((tile) => (
        <MetricTile
          key={tile.label}
          variant="figure"
          label={tile.label}
          value={figureText(tile.value)}
          caption={tile.delta}
          captionTone={tile.tone ? CAPTION_TONE[tile.tone] : undefined}
        />
      ))}
    </MetricGrid>
  )
}
