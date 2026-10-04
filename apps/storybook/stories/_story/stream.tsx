import * as React from 'react';
import { applyBlockPatches, scriptFrames, type BlockPatch, type PatchScript } from '@invana/blocks';

import { ReplayFrame, useReplay, type Replay } from './replay';
import type { Snippet } from './source';

/**
 * A spec and its recorded stream, replayed a batch at a time: `spec` is the spec with every
 * batch so far applied by `apply` — exactly what the shell's own stream would hold after them.
 * A story steps it with the replay's controls rather than `playScript`'s clock, so a test can
 * skip to the end.
 */
export function useScriptReplay<S, P>(
  spec: S,
  script: PatchScript<P>,
  apply: (spec: S, patches: P[]) => S,
  { every = 600 } = {},
): { spec: S; replay: Replay } {
  const frames = React.useMemo(() => scriptFrames(script), [script]);
  const replay = useReplay(frames.length, { every });
  const live = React.useMemo(
    () => apply(spec, frames.slice(0, replay.at).flatMap((f) => f.patches)),
    [apply, spec, frames, replay.at],
  );
  return { spec: live, replay };
}

/**
 * A block variant as it streams: with a `stream`, its spec is replayed under play / pause /
 * skip to end; without one it is drawn as given. Every block story draws through this, so a
 * variant streams by adding `stream` to its JSON.
 */
export function Streamed<S extends object>({
  spec,
  stream,
  width,
  children,
}: {
  spec: S;
  stream?: PatchScript<BlockPatch>;
  /** The frame's max width; left out, the cell's. */
  width?: number;
  children: (spec: S) => React.ReactNode;
}) {
  if (!stream) return <>{children(spec)}</>;
  return <Replaying spec={spec} stream={stream} width={width} render={children} />;
}

function Replaying<S extends object>({
  spec,
  stream,
  width,
  render,
}: {
  spec: S;
  stream: PatchScript<BlockPatch>;
  width?: number;
  render: (spec: S) => React.ReactNode;
}) {
  const live = useScriptReplay(spec, stream, applyBlockPatches<S>);
  return (
    <ReplayFrame replay={live.replay} noun="update" width={width ?? null}>
      {render(live.spec)}
    </ReplayFrame>
  );
}

// ── The Code tab ──

/** How many steps of a stream the Code tab writes out before it says how many more there are. */
const SHOWN = 3;

/**
 * A block variant's Code tab part: its spec and the call — and, when it streams, the first steps
 * of its stream and the hook that applies them, with the call drawing what the hook holds.
 */
export function blockSource(
  v: { caption: string; spec: unknown; stream?: PatchScript<BlockPatch> },
  { setup, call }: { setup?: string; call: (spec: string) => string },
): Omit<Snippet, 'imports'> {
  if (!v.stream) return { comment: v.caption, data: { spec: v.spec }, setup, call: call('spec') };
  const more = v.stream.length - SHOWN;
  return {
    comment: v.caption,
    data: { spec: v.spec, stream: v.stream.slice(0, SHOWN) },
    setup: [
      `// …and ${more} more steps: each { at, patch } a block patch — set, append, push or upsert.`,
      '// The block draws `spec` with each patch applied as it lands. Live, the source is the API:',
      '// (signal) => fromNdjson(await fetch(url, { signal })), or fromEventSource(…).',
      'const play = React.useCallback((signal) => playScript(stream, { signal }), []);',
      'const { live } = useBlockStream(spec, play);',
      setup,
    ]
      .filter(Boolean)
      .join('\n'),
    call: call('live'),
  };
}

/** The imports a set of variants needs: the stream's too, when any of them streams. */
export const streamImports = (picked: { stream?: unknown }[], imports: string[]) =>
  picked.some((v) => v.stream) ? [...imports, "import { playScript, useBlockStream } from '@invana/blocks';"] : imports;
