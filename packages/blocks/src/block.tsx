import type * as React from "react"

import { Placeholder } from "./placeholder"
import { BLOCK_RENDERERS } from "./registry"
import type { AskState, BlockKind, BlockProps, BlockSpec } from "./types"

export interface BlockComponentProps {
  spec: BlockSpec
  onAction?: (action: string, value?: unknown) => void
  /** Where a block that returns a value stands. Unset, it is open. */
  state?: AskState
  /** The value given, once answered. */
  value?: unknown
  id?: string
}

/**
 * One block, drawn bare from its spec: no card, no title. The shell around it
 * — an answer card, a question card, a `PanelBox`, a page section — adds the
 * frame. A kind with no renderer yet is a labelled placeholder with its JSON.
 */
export function Block({ spec, ...props }: BlockComponentProps) {
  const Renderer = BLOCK_RENDERERS[spec.kind] as React.ComponentType<BlockProps<BlockKind>> | null
  if (!Renderer) return <Placeholder kind={spec.kind} options={spec} />
  return <Renderer spec={spec} {...props} />
}
