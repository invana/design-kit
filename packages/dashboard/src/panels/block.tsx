import { BLOCKS, Block, type BlockSpec } from "@invana/blocks"

import type { PanelRegistry, PanelRendererProps } from "../types"

/**
 * A block as a panel: the same JSON a conversation turn draws, framed by the
 * panel. The block draws bare — its title and aside are the panel's — and what
 * it does arrives as `onAction(action, { panelId, value })`, so a row picked in
 * a `table` is `select` with the row's key, told apart by the panel it came from;
 * an action its spec declares arrives by its own id — `approve`.
 */
export function BlockPanel({ panel, options, onAction }: PanelRendererProps) {
  return (
    <Block
      spec={{ kind: panel.kind, ...options } as BlockSpec}
      id={panel.id}
      state={panel.state}
      value={panel.value}
      onAction={(action, value) =>
        // An action the spec declares arrives by its own id, as every panel's does.
        action === "action" ? onAction(String(value), { panelId: panel.id }) : onAction(action, { panelId: panel.id, value })
      }
    />
  )
}

/** Every block kind, drawn by {@link BlockPanel}. A kind with no renderer yet is a labelled placeholder. */
export const BLOCK_PANELS: PanelRegistry = Object.fromEntries(BLOCKS.map((b) => [b.id, BlockPanel]))
