import type * as React from "react"

import { Placeholder } from "./placeholder"
import { BLOCK_RENDERERS } from "./registry"
import { type BlockPatch, type SpecStream, useBlockStream } from "./stream"
import type { AskState, BlockKind, BlockProps, BlockSpec } from "./types"

export interface BlockComponentProps {
  spec: BlockSpec
  onAction?: (action: string, value?: unknown) => void
  /** Where a block that returns a value stands. Unset, it is open. */
  state?: AskState
  /** The value given, once answered. */
  value?: unknown
  id?: string
  /**
   * Set into running text: the outer cells of a table sit flush with the words
   * around it. The assistant sets it; a board panel or a page section does not,
   * so its tables keep their padding.
   */
  seamless?: boolean
  /**
   * Patches to `spec` as they arrive — the block draws `spec` with them
   * applied, and a new `spec` starts over from it. See `useBlockStream`.
   */
  stream?: SpecStream<BlockPatch>
  /** The stream ended; the spec as it left it. */
  onStreamEnd?: (spec: BlockSpec) => void
  /** A patch did not apply, or the source failed. The stream stops there. */
  onStreamError?: (error: unknown) => void
}

/**
 * One block, drawn bare from its spec: no card, no title. The shell around it
 * — an answer card, a question card, a `PanelBox`, a page section — adds the
 * frame. A kind with no renderer yet is a labelled placeholder with its JSON.
 */
export function Block({ spec, stream, onStreamEnd, onStreamError, ...props }: BlockComponentProps) {
  const { live } = useBlockStream(spec, stream, { onEnd: onStreamEnd, onError: onStreamError })
  const Renderer = BLOCK_RENDERERS[live.kind] as React.ComponentType<BlockProps<BlockKind>> | null
  if (!Renderer) return <Placeholder kind={live.kind} options={live} />
  return <Renderer spec={live} {...props} />
}
