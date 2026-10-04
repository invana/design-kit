import * as React from 'react';
import type { AnswerKind, AskKind, BlockPatch, PatchScript } from '@invana/blocks';
import {
  applyPatch,
  applyPatches,
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
import { ReplayFrame } from './replay';
import { useScriptReplay } from './stream';
import type { Log } from './variant-grid';

/** A block variant as the ask turn the API would send for it. */
export function askTurn<K extends AskKind>(kind: K, v: BlockVariant<K>): AskTurn {
  const { id: _id, stage: _stage, ...rest } = v.turn;
  return {
    id: v.turn.id,
    role: 'assistant',
    kind: 'ask',
    stage: (v.turn.stage ?? 'scope') as StageId,
    state: v.state ?? 'pending',
    ask: { kind, ...v.spec } as AskSpec,
    ...(v.value !== undefined ? { value: v.value } : {}),
    // Any other turn field the variant sets — `answeredAt`, `waiting`.
    ...rest,
  } as AskTurn;
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
  stream,
  onEvent,
  log,
}: {
  turn: AskTurn | AnswerTurn;
  now?: string;
  /** The block's stream, as the variant records it — the turn replays it as `patch-block`. */
  stream?: PatchScript<BlockPatch>;
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
  const draw = (live: ConversationSpec) => (
    <ChatSessionTurn turn={live.turns[0]} onEvent={handle} now={now ? Date.parse(now) : undefined} />
  );
  if (!stream || turn.kind !== 'answer') return draw(spec);
  return <StreamedTurn spec={spec} script={turnScript(turn.id, stream)} draw={draw} />;
}

/**
 * A block's stream as the conversation carries it: each block patch as `patch-block` on the
 * turn's block, the answer `running` until the last step settles it `complete`.
 */
export function turnScript(turn: string, stream: PatchScript<BlockPatch>): PatchScript<ConversationPatch> {
  const toTurn = (patch: BlockPatch): ConversationPatch => ({ op: 'patch-block', turn, block: 0, patch });
  const last = stream.reduce((m, s) => Math.max(m, s.at), 0);
  return [
    { at: 0, patch: { op: 'set-state', turn, state: 'running' } },
    ...stream.map((s) => ({ at: s.at, patch: (Array.isArray(s.patch) ? s.patch : [s.patch]).map(toTurn) })),
    { at: last, patch: { op: 'set-state', turn, state: 'complete' } },
  ];
}

function StreamedTurn({
  spec,
  script,
  draw,
}: {
  spec: ConversationSpec;
  script: PatchScript<ConversationPatch>;
  draw: (spec: ConversationSpec) => React.ReactNode;
}) {
  const live = useScriptReplay(spec, script, applyPatches);
  return (
    <ReplayFrame replay={live.replay} noun="update" width={null}>
      {draw(live.spec)}
    </ReplayFrame>
  );
}
