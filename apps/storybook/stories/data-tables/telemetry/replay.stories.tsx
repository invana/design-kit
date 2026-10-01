import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { DataTable } from '@invana/tables';
import { Button, PanelBox, SegmentedControl, TaskGantt } from '@invana/ui';
import { SkipForward } from 'lucide-react';

import { ReplayFrame, type Replay } from '../../_story/replay';
import { jsx, snippet } from '../../_story/source';
import { VariantBoard, type Log } from '../../_story/variant-board';
import {
  EVENTS,
  RUN_SPAN_MS,
  eventsUntil,
  formatOffset,
  ganttTasks,
  slotLaneTasks,
  type TelemetryEvent,
} from './fixtures';
import { LOG_COLUMNS } from './log';

const SPEEDS = [
  { value: '0.25', label: '¼×' },
  { value: '0.5', label: '½×' },
  { value: '1', label: '1×' },
  { value: '2', label: '2×' },
];

const TAIL = 12;

const VARIANTS = [{ caption: 'Replay', wide: true }];

/**
 * The run's own clock, as a `Replay` for `ReplayFrame`: it advances on animation frames at
 * `speed`, so the bars grow at the pace the run had — and unlike a frame-per-event replay, it
 * can be set to any moment (`seek`), which is what a click on a log row does.
 */
function useRunClock(speed: number) {
  const [now, setNow] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const done = now >= RUN_SPAN_MS;

  React.useEffect(() => {
    if (!playing || done) return;
    let last = performance.now();
    let frame = requestAnimationFrame(function tick(t) {
      const dt = (t - last) * speed;
      last = t;
      setNow((n) => Math.min(n + dt, RUN_SPAN_MS));
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [playing, done, speed]);

  const replay: Replay = {
    at: eventsUntil(now).length,
    length: EVENTS.length,
    playing: playing && !done,
    done,
    play: () => setPlaying(true),
    pause: () => setPlaying(false),
    restart: () => {
      setNow(0);
      setPlaying(true);
    },
    finish: () => {
      setPlaying(false);
      setNow(RUN_SPAN_MS);
    },
  };
  const seek = (ms: number) => {
    setPlaying(false);
    setNow(ms);
  };
  return { now, replay, seek };
}

interface Args {
  onRowClick: (offsetMs: number) => void;
  onSpeedChange: (speed: string) => void;
}

function Live({ log, onRowClick, onSpeedChange }: Args & { log: Log }) {
  const [speed, setSpeed] = React.useState('1');
  const { now, replay, seek } = useRunClock(Number(speed));

  const seen = eventsUntil(now);
  const tasks = React.useMemo(() => ganttTasks(now), [now]);
  const lanes = React.useMemo(() => slotLaneTasks(now), [now]);
  const tail = seen.slice(-TAIL).reverse();
  const next = EVENTS.find((e) => e.offsetMs > now);

  return (
    <ReplayFrame replay={replay} noun="event" width={1200}>
      <SegmentedControl
        size="sm"
        options={SPEEDS}
        value={speed}
        onValueChange={(s) => {
          onSpeedChange(s);
          log('speed', s);
          setSpeed(s);
        }}
      />
      <Button size="sm" variant="outline" disabled={!next} onClick={() => next && seek(next.offsetMs)}>
        <SkipForward />
        Step
      </Button>
      <PanelBox
        title="Timeline"
        aside={`${formatOffset(now)} · ${tasks.length} tasks · ${seen.length} of ${EVENTS.length} events`}
      >
        <TaskGantt
          tasks={tasks}
          spanMs={RUN_SPAN_MS}
          ticks={9}
          nowMs={replay.done ? undefined : now}
          openEnded={!replay.done}
          showDetail={!replay.playing}
          labelWidth={132}
        />
      </PanelBox>
      <PanelBox title="Worker slots">
        <TaskGantt
          tasks={lanes}
          spanMs={RUN_SPAN_MS}
          ticks={9}
          nowMs={replay.done ? undefined : now}
          showDetail={false}
          labelWidth={132}
        />
      </PanelBox>
      <PanelBox title="Log" aside={`newest first · last ${tail.length} of ${seen.length}`}>
        <DataTable<TelemetryEvent>
          columns={LOG_COLUMNS}
          data={tail}
          density="compact"
          seamless
          onRowClick={(e) => {
            onRowClick(e.offsetMs);
            log('onRowClick', { seq: e.seq, offsetMs: e.offsetMs });
            seek(e.offsetMs);
          }}
          emptyState="Press play — the run has not started."
        />
      </PanelBox>
    </ReplayFrame>
  );
}

const meta = {
  title: 'Data Tables/Telemetry/Replay',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        code: snippet({
          imports: [
            "import { DataTable } from '@invana/tables';",
            "import { PanelBox, TaskGantt } from '@invana/ui';",
          ],
          comment: 'Every view is the same function of the log cut at `now` — nothing animates on its own',
          setup: [
            'const [now, setNow] = React.useState(0);',
            'const seen = events.filter((e) => e.offsetMs <= now);',
            'const tasks = ganttTasks(seen);   // one row per task, the attempt in flight running to now',
            'const lanes = slotLanes(seen);    // one row per worker slot',
            '// A click on a log row is the event: jump back to its moment.',
            'const onRowClick = (event) => setNow(event.offsetMs);',
          ].join('\n'),
          call: [
            '<>',
            '  <PanelBox title="Timeline">',
            `    <TaskGantt tasks={tasks} spanMs={${RUN_SPAN_MS}} ticks={9} nowMs={now} openEnded labelWidth={132} />`,
            '  </PanelBox>',
            '  <PanelBox title="Worker slots">',
            `    <TaskGantt tasks={lanes} spanMs={${RUN_SPAN_MS}} ticks={9} nowMs={now} showDetail={false} labelWidth={132} />`,
            '  </PanelBox>',
            '  <PanelBox title="Log">',
            `    ${jsx('DataTable', { columns: 'columns', data: `seen.slice(-${TAIL}).reverse()`, density: { literal: 'compact' }, seamless: 'true', onRowClick: 'onRowClick' }).replace(/\n/g, '\n    ')}`,
            '  </PanelBox>',
            '</>',
          ].join('\n'),
        }),
      },
    },
  },
  args: { onRowClick: fn(), onSpeedChange: fn() },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * The run replayed from its log (`fixtures/data-tables/telemetry-run.json`), so you can watch it
 * happen rather than read it afterwards. Tasks appear as outlines when spawned and fill as they
 * run; the slot lanes show three fetches start at once and the rest queue; the red attempt and
 * the failure land when they happened; the log tails the newest events.
 *
 * Every view is the same function of the log cut at *now*. **Step** jumps to the next event;
 * **click a log row** to jump back to its moment. There is no scrubber: the kit has no slider
 * outside `@invana/forms`, which is a gap this story surfaces.
 */
export const ReplayStory: Story = {
  name: 'Replay',
  render: (args) => <VariantBoard variants={VARIANTS}>{(_v, log) => <Live {...args} log={log} />}</VariantBoard>,
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Replay' }));
    // The replay's own count — the table under it has a status line too.
    const progress = () => cell.getAllByRole('status').find((s) => / \/ /.test(s.textContent ?? ''))!;
    await step('Step to the first events', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Step' }));
      await userEvent.click(cell.getByRole('button', { name: 'Step' }));
      await waitFor(() => expect(progress()).not.toHaveTextContent(/^0 \//));
    });
    await step('Skip to the end, then click the first log row to jump back to it', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Skip to end' }));
      await expect(progress()).toHaveTextContent(`${EVENTS.length} / ${EVENTS.length} events`);
      const last = EVENTS.at(-1)!;
      await userEvent.click(cell.getByText(last.detail));
      await expect(args.onRowClick).toHaveBeenCalledWith(last.offsetMs);
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent(`"offsetMs": ${last.offsetMs}`);
    });
  },
};
