import type { AskState, BlockKind, BlockOptionsByKind } from '@invana/blocks';

import confirm from './confirm.json';

/**
 * One variant of a block, as its board on the Design Kit Spec draws it. `spec` is the block's
 * options — exactly what the API sends — so the `Blocks/<Kind>` story, the conversation's board
 * and a dashboard panel all draw the same JSON. The rest is the shell's: `state` and `value`
 * for an answered ask, `turn` and `now` for the conversation.
 */
export interface BlockVariant<K extends BlockKind> {
  caption: string;
  /** Draw the cell at 280px — the board's "At 280px" variant. */
  narrow?: boolean;
  spec: BlockOptionsByKind[K];
  state?: AskState;
  value?: unknown;
  /**
   * The conversation turn around it: its id, an ask's stage and answer time, and for an answer
   * the card's own fields (`label`, `title`, `state`, `scope`, …) — anything `AnswerTurn` takes.
   */
  turn: { id: string; stage?: string; answeredAt?: string; [field: string]: unknown };
  /** The clock an answered ask's time is read against (ISO 8601), so it reads the same every run. */
  now?: string;
}

// JSON widens `"strip"` to `string`; the shapes are the kinds' own, so this is the one cast.
const as = <K extends BlockKind>(_kind: K, data: unknown) => data as BlockVariant<K>[];

export const BLOCK_VARIANTS = {
  confirm: as('confirm', confirm),
};
