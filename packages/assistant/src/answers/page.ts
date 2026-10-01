import { BLOCK_RENDERERS, type BlockSpec as SharedBlockSpec, type PageSpec } from "@invana/blocks"

import type { AnswerTurn } from "../protocol/types"

/**
 * An answer opened as a page: the blocks `@invana/blocks` draws, in order,
 * under the answer's title. What only a conversation shows — citations,
 * caveats, the trace — stays in the thread.
 */
export function answerToPage(turn: AnswerTurn): PageSpec {
  const blocks = turn.blocks.filter(
    (b) => Object.hasOwn(BLOCK_RENDERERS, b.kind) && b.status !== "loading",
  ) as unknown as SharedBlockSpec[]
  return { title: turn.title, sections: [{ blocks }] }
}
