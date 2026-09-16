import {
  CodePanel,
  ExchangePanel,
  GanttPanel,
  JsonPanel,
  MetricsPanel,
  PropertiesPanel,
  TablePanel,
} from "./panels/data"
import { ListPanel, LogPanel, ParamsPanel, TextPanel } from "./panels/rows"
import type { PanelRegistry } from "./types"

/**
 * The kinds a dashboard can draw without being told anything.
 *
 * Eleven, and the number is meant to stay near it. A twelfth belongs here only
 * when two unrelated surfaces both need it — otherwise it is a consumer's
 * registry entry, which costs nothing and keeps this list readable.
 *
 * Deliberately absent: **`canvas`**. A flow, a map or a graph needs
 * `@invana/canvas`, and importing it here would put PixiJS in the bundle of
 * every consumer that only wanted tiles and a log. It arrives as a registry
 * entry instead — see the `canvas` note in `types.ts`.
 */
export const BUILT_IN_PANELS: PanelRegistry = {
  metrics: MetricsPanel,
  properties: PropertiesPanel,
  json: JsonPanel,
  code: CodePanel,
  exchange: ExchangePanel,
  gantt: GanttPanel,
  table: TablePanel,
  log: LogPanel,
  list: ListPanel,
  params: ParamsPanel,
  text: TextPanel,
}

export function resolveRegistry(extra?: PanelRegistry): PanelRegistry {
  return extra ? { ...BUILT_IN_PANELS, ...extra } : BUILT_IN_PANELS
}
