import type { Meta, StoryObj } from '@storybook/react-vite';
import { Eyebrow, TaskGantt, type TaskGanttTask } from '@invana/ui';

const meta: Meta<typeof TaskGantt> = {
  title: 'UI/UI Extended/TaskGantt',
  component: TaskGantt,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The run's `steps`, exactly as the trace hands them over — `task_key`,
 * `status`, `started_at`, `finished_at`, `duration_ms`. Four have run, one is
 * in flight, three have not started, so they carry no clock at all.
 */
const STEPS = [
  { task_key: 'understand', status: 'succeeded', started_at: '2026-09-16T11:12:00.000Z', finished_at: '2026-09-16T11:12:00.700Z', duration_ms: 700, last_log: 'asked back once · answered' },
  { task_key: 'plan_queries', status: 'succeeded', started_at: '2026-09-16T11:12:00.700Z', finished_at: '2026-09-16T11:12:01.900Z', duration_ms: 1200, last_log: 'drafted 5 queries · 2 lanes' },
  { task_key: 'translate_thought', status: 'succeeded', started_at: '2026-09-16T11:12:01.900Z', finished_at: '2026-09-16T11:12:03.600Z', duration_ms: 1700, last_log: 'cypher · 5 of 5 validated' },
  { task_key: 'execute_graph_query', status: 'running', started_at: '2026-09-16T11:12:03.600Z', finished_at: null, duration_ms: null, last_log: 'lane 2 of 5 · 1,880 rows so far' },
  { task_key: 'verify_result', status: 'queued', started_at: null, finished_at: null, duration_ms: null, last_log: 'waiting on execute_graph_query' },
  { task_key: 'summarise', status: 'queued', started_at: null, finished_at: null, duration_ms: null, last_log: 'not started' },
  { task_key: 'emit_table', status: 'queued', started_at: null, finished_at: null, duration_ms: null, last_log: 'not started' },
] as const;

const RUN_STARTED_AT = '2026-09-16T11:12:00.000Z';
const NOW_MS = 5100;

const tasks: TaskGanttTask[] = STEPS.map((s) => ({
  key: s.task_key,
  status: s.status,
  startedAt: s.started_at ?? undefined,
  // A running task is drawn up to *now*; it has not finished, so it cannot say when.
  finishedAt: s.finished_at ?? (s.status === 'running' ? new Date(Date.parse(RUN_STARTED_AT) + NOW_MS) : undefined),
  durationMs: s.duration_ms ?? undefined,
  log: s.last_log,
}));

/**
 * A run in flight, in the Runs drawer — the `Performance` band of the three.
 *
 * The clock is open-ended (`8s+`) because the run has not decided its own
 * length yet, the *now* line threads every row, and the three tasks that have
 * not started are outlines rather than bars. Nothing here is a separate live
 * view: when the run ends, the same component drops `nowMs` and `openEnded`.
 */
export const InFlight: Story = {
  render: () => (
    <div className="w-[420px] border border-border bg-card">
      <div className="px-3 pt-2 pb-1">
        <Eyebrow aside={<>now <span className="font-mono">5.1s</span></>}>Performance</Eyebrow>
      </div>
      <div className="px-3 pb-2">
        <TaskGantt
          tasks={tasks}
          origin={RUN_STARTED_AT}
          spanMs={8000}
          nowMs={NOW_MS}
          openEnded
          density="compact"
          labelWidth={104}
        />
      </div>
    </div>
  ),
};
