import { CodePanel, ExchangePanel, JsonPanel } from "./panels/data"
import { BLOCK_PANELS } from "./panels/block"
import { ListPanel, LogPanel, ParamsPanel, TextPanel } from "./panels/rows"
import type { PanelRegistry } from "./types"

/**
 * The panels only a board has. Everything a conversation also draws — a
 * table, a band of figures, a record, a chart — is a block, and every block
 * kind is a panel kind too (see `BLOCK_PANELS`).
 *
 * Eight, and the number is meant to stay near it. Another belongs here only
 * when two unrelated surfaces both need it and a conversation does not —
 * otherwise it is a block, or a consumer's registry entry.
 *
 * Deliberately absent: **`canvas`**. A flow, a map or a graph needs
 * `@invana/canvas`, and importing it here would put PixiJS in the bundle of
 * every consumer that only wanted tiles and a log. It arrives as a registry
 * entry instead — see the `canvas` note in `types.ts`.
 */
export const BUILT_IN_PANELS: PanelRegistry = {
  json: JsonPanel,
  code: CodePanel,
  exchange: ExchangePanel,
  log: LogPanel,
  list: ListPanel,
  params: ParamsPanel,
  text: TextPanel,
}

/**
 * Every kind a board can draw: the blocks, then the panels only a
 * board has, then the consumer's own. Later entries win, so a registered
 * kind replaces a block of the same name — `RUN_PANELS`' `trace` does.
 */
export function resolveRegistry(extra?: PanelRegistry): PanelRegistry {
  return { ...BLOCK_PANELS, ...BUILT_IN_PANELS, ...extra }
}
