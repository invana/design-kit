import { BLOCK_RENDERERS, type BlockSpec as SharedBlockSpec, type PageSpec } from "@invana/blocks"

import type { AnswerTurn } from "../protocol/types"

/**
 * An answer opened as a page: the blocks `@invana/blocks` draws, in order,
 * under the answer's title. What only a conversation shows — citations,
 * caveats, the trace — stays in the thread.
 */
export function answerToPage(turn: AnswerTurn): PageSpec {
  // Drawn only: a kind with a renderer, and data that has arrived — not still
  // loading, and not empty (a page has no room for the thread's empty line).
  const blocks = turn.blocks.filter(
    (b) =>
      BLOCK_RENDERERS[b.kind as keyof typeof BLOCK_RENDERERS] != null &&
      b.status !== "loading" &&
      b.status !== "empty",
  ) as unknown as SharedBlockSpec[]
  return { title: turn.title, sections: [{ blocks }] }
}
