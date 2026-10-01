import { MetricGrid, MetricTile } from "@invana/ui"

import { CAPTION_TONE, gaugeProps, metricValue } from "../format"
import type { BlockProps } from "../types"

/** Three across; four sit two by two rather than three and one; more wrap in threes. */
const columnsFor = (n: number) => (n === 4 ? 2 : Math.min(n, 3))

/**
 * A band of figures that belong to one answer, each with its change beneath it
 * and, where a figure has a ceiling or a target, a bar under it.
 */
export function GridBlock({ spec }: BlockProps<"grid">) {
  return (
    <MetricGrid
      joined
      seamless
      minTileWidth={spec.minTileWidth}
      columns={spec.minTileWidth ? undefined : columnsFor(spec.tiles.length)}
    >
      {spec.tiles.map((tile) => (
        <MetricTile
          key={tile.label}
          variant="figure"
          label={tile.label}
          value={metricValue(tile.value)}
          tone={tile.value == null ? "muted" : undefined}
          caption={tile.delta}
          captionTone={tile.tone ? CAPTION_TONE[tile.tone] : undefined}
          flagged={tile.flag}
          {...gaugeProps(tile.gauge)}
        />
      ))}
    </MetricGrid>
  )
}
