import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { BarChartH } from '@invana/charts';
import {
  Button,
  PanelBox,
  TaskGantt,
  TaskGanttDetailCard,
  type TaskGanttBracket,
  type TaskGanttDetailProps,
  type TaskGanttProps,
  type TaskGanttSeam,
  type TaskGanttStatus,
  type TaskGanttTask,
} from '@invana/ui';

import DATA from '../../../../fixtures/ui-extended/task-gantt.json';
import { ReplayFrame, useReplay } from '../../../_story/replay';
import { inline, jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Log } from '../../../_story/variant-board';

/** A task as JSON holds it: a chart and an action name stand in for a custom card body. */
type JsonTask = Omit<TaskGanttTask, 'status' | 'detail'> & {
  status?: TaskGanttStatus;
  chart?: { caption: string; labelWidth: number; data: { label: string; value: number; display: string }[] };
  action?: string;
};

/** The run's `steps` exactly as the trace API returns them. */
interface TraceStepJson {
  task_key: string;
  status: TaskGanttStatus;
  started_at: string | null;
  finished_at: string | null;
  duration_ms: number | null;
  last_log: string;
}

interface StepEvent {
  nowMs: number;
  task: string;
  status: TaskGanttStatus;
  log?: string;
}

interface GanttVariant {
  caption: string;
  wide?: boolean;
  width?: number;
  live?: boolean;
  title: string;
  aside: string;
  /** Present (even `null`) means the rows are pickable. */
  selected?: string | null;
  tasks?: JsonTask[];
  steps?: TraceStepJson[];
  keys?: string[];
  events?: StepEvent[];
  origin?: string;
  spanMs?: number;
  nowMs?: number;
  openEnded?: boolean;
  density?: TaskGanttProps['density'];
  labelWidth?: number;
  ticks?: number;
  brackets?: TaskGanttBracket[];
  seams?: TaskGanttSeam[];
  detailProps?: TaskGanttDetailProps;
  partOf?: string;
}

const VARIANTS = DATA as GanttVariant[];

/** The trace's steps as tasks. A running step is drawn up to *now* — it cannot say when it ends. */
function fromSteps(v: GanttVariant): TaskGanttTask[] {
  return (v.steps ?? []).map((s) => ({
    key: s.task_key,
    status: s.status,
    startedAt: s.started_at ?? undefined,
    finishedAt: s.finished_at ?? (s.status === 'running' ? Date.parse(v.origin!) + v.nowMs! : undefined),
    durationMs: s.duration_ms ?? undefined,
    log: s.last_log,
  }));
}

/** A task with a `chart` gets a card body of its own, composed around the shared header. */
function toTask(t: JsonTask): TaskGanttTask {
  const { chart, action, ...task } = t;
  if (!chart) return task;
  return {
    ...task,
    detail: (
      <TaskGanttDetailCard
        task={{
          ...task,
          result: <BarChartH caption={chart.caption} labelWidth={chart.labelWidth} data={chart.data} />,
          log: action ? (
            <Button size="sm" variant="outline">
              {action}
            </Button>
          ) : undefined,
        }}
      />
    ),
  };
}

function useSelection(v: GanttVariant, log: Log, onSelectTask: Args['onSelectTask']) {
  const [selected, setSelected] = React.useState<string | null>(v.selected ?? null);
  if (v.selected === undefined) return {};
  return {
    selectedKey: selected,
    onSelectTask: (key: string) => {
      onSelectTask(key);
      log('onSelectTask', key);
      setSelected((prev) => (prev === key ? null : key));
    },
  };
}

function Static({ v, log, onSelectTask }: { v: GanttVariant; log: Log; onSelectTask: Args['onSelectTask'] }) {
  const selection = useSelection(v, log, onSelectTask);
  const tasks = v.steps ? fromSteps(v) : (v.tasks ?? []).map(toTask);
  return (
    <PanelBox title={v.title} aside={v.aside}>
      <TaskGantt
        tasks={tasks}
        origin={v.origin}
        spanMs={v.spanMs}
        nowMs={v.nowMs}
        openEnded={v.openEnded}
        density={v.density}
        labelWidth={v.labelWidth}
        ticks={v.ticks}
        brackets={v.brackets}
        seams={v.seams}
        detailProps={v.detailProps}
        renderDetail={
          v.partOf
            ? (task) =>
                task.detail ?? (
                  <TaskGanttDetailCard
                    task={{ ...task, log: [task.log, `part of ${v.partOf}`].filter(Boolean).join(' · ') }}
                  />
                )
            : undefined
        }
        {...selection}
      />
    </PanelBox>
  );
}

/** The tasks after `events`: queued until an event names one, running up to now, then as it last said. */
function tasksAfter(v: GanttVariant, events: StepEvent[], nowMs: number): TaskGanttTask[] {
  return (v.keys ?? []).map((key) => {
    const mine = events.filter((e) => e.task === key);
    if (!mine.length) return { key, status: 'queued' };
    const last = mine[mine.length - 1];
    const startMs = mine[0].nowMs;
    const log = [...mine].reverse().find((e) => e.log)?.log;
    return {
      key,
      status: last.status,
      startMs,
      durationMs: (last.status === 'running' ? nowMs : last.nowMs) - startMs,
      log,
    };
  });
}

function Live({ v, log, onSelectTask }: { v: GanttVariant; log: Log; onSelectTask: Args['onSelectTask'] }) {
  const events = v.events ?? [];
  const replay = useReplay(events.length, { every: 500 });
  const received = events.slice(0, replay.at);
  const nowMs = received.length ? received[received.length - 1].nowMs : 0;
  const selection = useSelection({ ...v, selected: null }, log, onSelectTask);
  return (
    <ReplayFrame replay={replay} noun="event" width={v.width}>
      <PanelBox title={v.title} aside={replay.done ? `${(nowMs / 1000).toFixed(1)}s` : `now ${(nowMs / 1000).toFixed(1)}s`}>
        <TaskGantt
          tasks={tasksAfter(v, received, nowMs)}
          spanMs={replay.done ? undefined : Math.max(v.spanMs ?? 0, nowMs)}
          nowMs={replay.done ? undefined : nowMs}
          openEnded={!replay.done}
          density={v.density}
          labelWidth={v.labelWidth}
          {...selection}
        />
      </PanelBox>
    </ReplayFrame>
  );
}

// ── The Code tab ──

const PROPS = ['origin', 'spanMs', 'nowMs', 'openEnded', 'density', 'labelWidth', 'ticks', 'detailProps'] as const;

function source(v: GanttVariant) {
  const pickable = v.selected !== undefined || v.live;
  const scalarProps = Object.fromEntries(
    PROPS.filter((k) => v[k] !== undefined && !v.live).map((k) => [
      k,
      typeof v[k] === 'string' ? { literal: v[k] as string } : inline(v[k]),
    ]),
  );
  const handler = pickable
    ? [
        `const [selected, setSelected] = React.useState(${JSON.stringify(v.selected ?? null)});`,
        '// `onSelectTask` receives the task key — "import_dataset". Picking it again clears the filter.',
        'const onSelectTask = (key) => setSelected((prev) => (prev === key ? null : key));',
      ]
    : [];
  const steps = v.steps
    ? [
        '// The trace hands over snake_case steps; a running one is drawn up to now.',
        'const tasks = steps.map((s) => ({',
        '  key: s.task_key, status: s.status, startedAt: s.started_at ?? undefined,',
        `  finishedAt: s.finished_at ?? (s.status === 'running' ? Date.parse(origin) + ${v.nowMs} : undefined),`,
        '  durationMs: s.duration_ms ?? undefined, log: s.last_log,',
        '}));',
      ]
    : [];
  const live = v.live
    ? [
        '// Each event — { nowMs: 5100, task: "execute_graph_query", status: "running", log: "lane 2 of 5" } —',
        '// moves one task; while the run is open the clock is open-ended and *now* threads every row.',
        'const { tasks, nowMs, done } = useRunSteps(runId);',
      ]
    : [];
  const call = jsx('TaskGantt', {
    tasks: 'tasks',
    ...scalarProps,
    ...(v.live ? { nowMs: 'done ? undefined : nowMs', openEnded: '!done' } : {}),
    brackets: v.brackets ? 'brackets' : undefined,
    seams: v.seams ? 'seams' : undefined,
    renderDetail: v.partOf ? 'renderDetail' : undefined,
    selectedKey: pickable ? 'selected' : undefined,
    onSelectTask: pickable ? 'onSelectTask' : undefined,
  });
  return {
    comment: v.caption,
    data: {
      ...(v.steps ? { origin: v.origin, steps: v.steps } : {}),
      ...(v.tasks ? { tasks: v.tasks.map(({ chart, action, ...t }) => (chart ? { ...t, detail: '<TaskGanttDetailCard … BarChartH />' } : t)) } : {}),
      ...(v.brackets ? { brackets: v.brackets } : {}),
      ...(v.seams ? { seams: v.seams } : {}),
    },
    setup: [
      ...steps,
      ...live,
      ...handler,
      ...(v.partOf
        ? [
            '// Every row without its own `detail` keeps the shared card, with one line of context.',
            `const renderDetail = (task) => task.detail ?? <TaskGanttDetailCard task={{ ...task, log: \`\${task.log} · part of ${v.partOf}\` }} />;`,
          ]
        : []),
    ].join('\n') || undefined,
    call: `<PanelBox title="${v.title}" ${v.live ? 'aside={`now ${nowMs / 1000}s`}' : `aside="${v.aside}"`}>\n  ${call.split('\n').join('\n  ')}\n</PanelBox>`,
  };
}

interface Args {
  variant: string;
  onSelectTask: (key: string) => void;
}

const meta = {
  title: 'UI/UI Extended/TaskGantt',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(["import { PanelBox, TaskGantt, TaskGanttDetailCard } from '@invana/ui';"], picked.map(source)),
        ),
      },
    },
  },
  args: { variant: 'All', onSelectTask: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * A run's tasks on its clock, from `fixtures/ui-extended/task-gantt.json`.
 *
 * Finished, each row's `result.json`, error and last log line come **on hover**, not under the
 * row, so the rows stay a chart. In flight, the clock is open-ended, the *now* line threads every
 * row and unstarted tasks are outlines — and the live cell plays that run to its end, when the same
 * component drops `nowMs` and `openEnded`. A loop is a **bracket** over its rounds; a gate is a
 * **seam** across the stretch of clock it held. The card is yours: `task.detail` for one row,
 * `renderDetail` for all, composed around `TaskGanttDetailCard`. Pick a row: the key is logged and
 * the row stays lit; pick it again to clear.
 */
export const TaskGanttStory: Story = {
  name: 'TaskGantt',
  render: ({ variant, onSelectTask }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) =>
        v.live ? <Live v={v} log={log} onSelectTask={onSelectTask} /> : <Static v={v} log={log} onSelectTask={onSelectTask} />
      }
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const finished = within(canvas.getByRole('group', { name: VARIANTS[0].caption }));
    await step('Pick a task to filter the log to it', async () => {
      await userEvent.click(finished.getByRole('button', { name: /verify_counts/ }));
      await expect(args.onSelectTask).toHaveBeenCalledWith('verify_counts');
      await expect(finished.getByRole('button', { name: /verify_counts/ })).toHaveAttribute('aria-pressed', 'true');
      await expect(finished.getByRole('list', { name: 'Events' })).toHaveTextContent('"verify_counts"');
    });
    const live = within(canvas.getByRole('group', { name: 'Live — a run streaming its steps' }));
    await step('The live run plays to its end', async () => {
      await waitFor(() => expect(live.getByRole('status')).not.toHaveTextContent(/^0 \//), { timeout: 3000 });
      await userEvent.click(live.getByRole('button', { name: 'Skip to end' }));
      await expect(live.getByRole('status')).toHaveTextContent('15 / 15 events');
      await expect(live.queryByText(/^now /)).toBeNull();
    });
  },
};
