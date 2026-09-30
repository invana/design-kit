import { MetricGrid, MetricTile } from "@invana/ui"

import type { BlockRendererProps } from "../../conversations/registry"
import { CAPTION_TONE, metricValue } from "./metric"

/** Three across; four sit two by two rather than three and one; more wrap in threes. */
const columnsFor = (n: number) => (n === 4 ? 2 : Math.min(n, 3))

/** A band of figures that belong to one answer, each with its change beneath it. */
export function GridBlock({ block }: BlockRendererProps<"grid">) {
  return (
    <MetricGrid joined seamless columns={columnsFor(block.tiles.length)}>
      {block.tiles.map((tile) => (
        <MetricTile
          key={tile.label}
          variant="figure"
          label={tile.label}
          value={metricValue(tile.value)}
          tone={tile.value == null ? "muted" : undefined}
          caption={tile.delta}
          captionTone={tile.tone ? CAPTION_TONE[tile.tone] : undefined}
          flagged={tile.flag}
        />
      ))}
    </MetricGrid>
  )
}
