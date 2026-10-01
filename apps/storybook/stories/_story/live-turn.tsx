import * as React from 'react';
import type { AnswerKind, AskKind } from '@invana/blocks';
import {
  applyPatch,
  ChatSessionTurn,
  type AnswerTurn,
  type AskSpec,
  type AskTurn,
  type BlockSpec,
  type ConversationEvent,
  type ConversationPatch,
  type ConversationSpec,
  type StageId,
} from '@invana/assistant';

import type { BlockVariant } from '../../fixtures/blocks';
import type { Log } from './variant-board';

/** A block variant as the ask turn the API would send for it. */
export function askTurn<K extends AskKind>(kind: K, v: BlockVariant<K>): AskTurn {
  return {
    id: v.turn.id,
    role: 'assistant',
    kind: 'ask',
    stage: (v.turn.stage ?? 'scope') as StageId,
    state: v.state ?? 'pending',
    ask: { kind, ...v.spec } as AskSpec,
    ...(v.value !== undefined ? { value: v.value } : {}),
    ...(v.turn.answeredAt ? { answeredAt: v.turn.answeredAt } : {}),
  };
}

/**
 * A block variant as the answer turn the API would send for it: the block alone, with the
 * card's fields (`label`, `title`, `state`, the envelope) from the variant's `turn`.
 */
export function answerTurn<K extends AnswerKind>(kind: K, v: BlockVariant<K>): AnswerTurn {
  const { id, stage: _stage, answeredAt: _at, ...card } = v.turn;
  return {
    id,
    role: 'assistant',
    kind: 'answer',
    state: 'complete',
    label: kind,
    blocks: [{ kind, ...v.spec } as BlockSpec],
    ...card,
  } as AnswerTurn;
}

/**
 * The patch the API answers an event with, for the events a turn settles on. A story
 * stands in for the server here; anything else is logged and left for the API.
 */
export function patchFor(event: ConversationEvent): ConversationPatch | undefined {
  if (event.type === 'reply') return { op: 'set-state', turn: event.turn, state: 'answered', value: event.value };
  if (event.type === 'skip') return { op: 'set-state', turn: event.turn, state: 'skipped' };
  return undefined;
}

/**
 * One turn, round-tripped: what the analyst does goes to `onEvent` as a `ConversationEvent`,
 * the story answers with the patch the API would send, and `applyPatch` settles the turn —
 * both are written to the cell's log, so the story shows the whole contract.
 */
export function LiveTurn({
  turn,
  now,
  onEvent,
  log,
}: {
  turn: AskTurn | AnswerTurn;
  now?: string;
  onEvent?: (event: ConversationEvent) => void;
  log: Log;
}) {
  const [spec, setSpec] = React.useState<ConversationSpec>({ id: `story-${turn.id}`, turns: [turn] });
  const handle = (event: ConversationEvent) => {
    onEvent?.(event);
    log('event', event);
    const patch = patchFor(event);
    if (!patch) return;
    log('patch', patch);
    setSpec((s) => applyPatch(s, patch));
  };
  return <ChatSessionTurn turn={spec.turns[0]} onEvent={handle} now={now ? Date.parse(now) : undefined} />;
}
