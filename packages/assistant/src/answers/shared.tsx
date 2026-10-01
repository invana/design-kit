import type * as React from "react"
import { BLOCK_RENDERERS, NarrativeBlock, type BlockKind, type BlockProps } from "@invana/blocks"

import type { BlockRenderer, BlockRendererProps } from "../conversations/registry"
import { ChatSessionCaret } from "../conversations/thread"
import { useCiteFocus } from "./blocks/cite-focus"

/**
 * A block from `@invana/blocks`, drawn in an answer. Its actions become
 * conversation events: `open` asks for the rows a table holds back, anything
 * else is an `action` on the turn.
 */
export function shared<K extends Exclude<BlockKind, "narrative">>(kind: K): BlockRenderer<K> {
  const Renderer = BLOCK_RENDERERS[kind] as React.ComponentType<BlockProps<K>>
  function SharedBlock({ turn, block, onEvent }: BlockRendererProps<K>) {
    const index = (turn.blocks as unknown[]).indexOf(block)
    return (
      <Renderer
        spec={block}
        onAction={(action) => {
          if (action !== "open") onEvent({ type: "action", turn: turn.id, action })
          else if (index >= 0) onEvent({ type: "open", turn: turn.id, block: index })
        }}
      />
    )
  }
  SharedBlock.displayName = `Shared(${kind})`
  return SharedBlock
}

/**
 * The narrative, with what only a conversation has: the source lit across the
 * answer's blocks, and the caret while the answer is still being written.
 */
export function NarrativeAnswer({ block, turn }: BlockRendererProps<"narrative">) {
  const [active, setActive] = useCiteFocus(turn.id, block.active)
  const writing = turn.state === "running" && turn.blocks[turn.blocks.length - 1] === block
  return (
    <NarrativeBlock
      spec={block}
      active={active}
      onActiveChange={setActive}
      trailing={writing ? <ChatSessionCaret /> : null}
    />
  )
}
