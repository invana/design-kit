import * as React from 'react';
import { Button } from '@invana/ui';

export interface Replay {
  /** How many frames have arrived — 0 before the first. */
  at: number;
  length: number;
  playing: boolean;
  done: boolean;
  play: () => void;
  pause: () => void;
  restart: () => void;
  /** Jump to the last frame — what a test or an impatient reader wants. */
  finish: () => void;
}

/**
 * Plays `length` frames, one every `every` ms — a feed arriving, without a server. A story
 * derives what it draws from `at`, so the component sees new props exactly as it would
 * from a live source.
 */
export function useReplay(length: number, { every = 800, autoplay = true } = {}): Replay {
  const [at, setAt] = React.useState(0);
  const [playing, setPlaying] = React.useState(autoplay);
  const done = at >= length;

  React.useEffect(() => {
    if (!playing || done) return;
    const timer = setTimeout(() => setAt((a) => a + 1), every);
    return () => clearTimeout(timer);
  }, [playing, done, at, every]);

  return {
    at,
    length,
    playing: playing && !done,
    done,
    play: () => setPlaying(true),
    pause: () => setPlaying(false),
    restart: () => {
      setAt(0);
      setPlaying(true);
    },
    finish: () => setAt(length),
  };
}

/**
 * Story chrome: play, pause and restart a replay and how far it has got, over what it feeds.
 * `width` is the frame's max width, so a story sets no classes.
 */
export function ReplayFrame({
  replay,
  noun = 'event',
  width = 576,
  children,
}: {
  replay: Replay;
  noun?: string;
  width?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3" style={{ maxWidth: width }}>
      <ReplayBar replay={replay} noun={noun} />
      {children}
    </div>
  );
}

function ReplayBar({ replay, noun }: { replay: Replay; noun: string }) {
  return (
    <div className="flex items-center gap-2">
      {replay.playing ? (
        <Button size="xs" variant="outline" onClick={replay.pause}>
          Pause
        </Button>
      ) : (
        <Button size="xs" variant="outline" onClick={replay.done ? replay.restart : replay.play}>
          {replay.done ? 'Replay' : 'Play'}
        </Button>
      )}
      <Button size="xs" variant="ghost" onClick={replay.finish} disabled={replay.done}>
        Skip to end
      </Button>
      <span role="status" className="ms-auto font-mono text-sm text-muted-foreground">
        {replay.at} / {replay.length} {noun}s
      </span>
    </div>
  );
}
