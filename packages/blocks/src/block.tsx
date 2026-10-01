import type * as React from "react"

import { BLOCK_RENDERERS } from "./registry"
import type { BlockKind, BlockProps, BlockSpec } from "./types"

export interface BlockComponentProps {
  spec: BlockSpec
  onAction?: (action: string) => void
}

/**
 * One block, drawn bare from its spec: no card, no title. The shell around it
 * — an answer card, a `PanelBox`, a page section — adds the frame.
 */
export function Block({ spec, onAction }: BlockComponentProps) {
  const Renderer = BLOCK_RENDERERS[spec.kind] as React.ComponentType<BlockProps<BlockKind>>
  return <Renderer spec={spec} onAction={onAction} />
}
