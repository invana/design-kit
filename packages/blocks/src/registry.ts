import type * as React from "react"

import { BarsBlock } from "./blocks/bars"
import { GridBlock } from "./blocks/grid"
import { MetricBlock } from "./blocks/metric"
import { NarrativeBlock } from "./blocks/narrative"
import { RankedBlock } from "./blocks/ranked"
import { RecordBlock } from "./blocks/record"
import { TableBlock } from "./blocks/table"
import { TimeseriesBlock } from "./blocks/timeseries"
import type { BlockKind, BlockProps } from "./types"

export type BlockRenderers = { [K in BlockKind]: React.ComponentType<BlockProps<K>> }

/** What draws each kind. Keyed by `BlockKind`, so a kind without a renderer does not compile. */
export const BLOCK_RENDERERS: BlockRenderers = {
  narrative: NarrativeBlock,
  metric: MetricBlock,
  grid: GridBlock,
  table: TableBlock,
  record: RecordBlock,
  ranked: RankedBlock,
  timeseries: TimeseriesBlock,
  bars: BarsBlock,
}
