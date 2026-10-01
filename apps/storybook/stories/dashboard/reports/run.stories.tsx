import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dashboard, type DashboardSpec } from '@invana/dashboard';

import { FlowPanel, ICONS, RUN_FLOW, RUN_LOG, RUN_TRACE, Surface, type WithFlow } from '../_fixtures';

const meta: Meta<typeof Dashboard> = {
  title: 'Dashboard/Reports/Run',
  component: Dashboard,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const SPEC: DashboardSpec<WithFlow> = {
  title: 'Red Sea exposure',
  header: {
    tone: 'info',
    crumbs: ['Which suppliers are exposed to the Red Sea route?'],
    chips: [{ label: 'ask' }, { label: 'running', tone: 'info' }, { label: 'run dashboard' }],
    actions: [
      { id: 'view', options: ['Dashboard', 'dashboard.yml'], value: 'Dashboard' },
      { id: 'cancel', label: 'Cancel', variant: 'outline' },
      { id: 'more', icon: 'more', variant: 'ghost' },
    ],
  },
  rows: [
    {
      panels: [
        {
          kind: 'grid',
          options: {
            minTileWidth: 130,
            tiles: [
              { label: 'Tasks', value: '4 / 7', delta: 'running', gauge: { value: 4, max: 7 } },
              { label: 'Elapsed', value: '12s', delta: 'no timeout yet' },
              { label: 'Tokens', value: '8.2k', delta: 'of 40k ceiling', gauge: { value: 8.2, max: 40 } },
              { label: 'Cost', value: '$0.04', delta: 'of $2.00 budget', gauge: { value: 0.04, max: 2 } },
              { label: 'Rows', value: '1,880', delta: 'so far' },
              { label: 'Lanes', value: '2 / 5', delta: 'execute_graph_query', gauge: { value: 2, max: 5 } },
            ],
          },
        },
      ],
    },
    {
      height: 348,
      panels: [
        {
          kind: 'flow',
          title: 'The flow · status as it ran',
          aside: 'click a task for its step detail ›',
          flush: true,
          options: { nodes: RUN_FLOW },
        },
      ],
    },
    {
      panels: [
        {
          id: 'performance',
          kind: 'gantt',
          title: 'Performance',
          aside: 'pick a task to open it',
          options: { labelWidth: 124, selectAction: 'open-step', tasks: RUN_TRACE },
        },
        {
          kind: 'record',
          title: 'Reported',
          asideChip: { label: '47', tone: 'warning' },
          width: 340,
          options: {
            rows: [
              { label: 'unresolved isin', value: '31' },
              { label: 'bad quantity', value: '12' },
              { label: 'out of window', value: '4' },
            ],
          },
        },
      ],
    },
    {
      panels: [
        {
          kind: 'record',
          title: 'Input · what opened this run',
          aside: 'rendered from result.json',
          options: {
            rows: [
              { label: 'trigger', value: 'session · message #214' },
              { label: 'asked', value: '"Which suppliers are exposed to the Red Sea route?"', mono: false },
              { label: 'plan', value: 'market-brief v1 · reused' },
              { label: 'agent', value: 'Scout · envelope Analyst-2' },
              { label: 'lens', value: '4 models · 6 stitches · frozen' },
              { label: 'budget', value: '$2.00 · 40k tokens · 5 lanes' },
            ],
          },
        },
        {
          kind: 'json',
          title: 'result.json · so far',
          aside: 'every task merges into it',
          flush: true,
          options: {
            maxHeight: 150,
            value: {
              run: '9f2c…a41',
              status: 'running',
              tasks: { done: 4, total: 7 },
              emissions: [
                { kind: 'table', rows: 1880 },
                { kind: 'subgraph', nodes: 62 },
              ],
              citations: 12,
              spend: { tokens: 8200, usd: 0.04 },
            },
          },
        },
      ],
    },
    {
      panels: [
        {
          kind: 'log',
          title: 'Log',
          aside: '214 lines · tailing',
          flush: true,
          options: { lines: RUN_LOG },
        },
      ],
    },
  ],
};

// ── a step, opened inside the run ──────────────────────────────────────────

type Task = (typeof RUN_TRACE)[number];

const STEP_TONE = { succeeded: 'success', skipped: 'queued', needs_input: 'warning' } as const;

function seconds(ms?: number) {
  return ms === undefined ? '—' : ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}

function stepSpec(task: Task): DashboardSpec {
  const lines = RUN_LOG.filter((line) => line.source === task.key);
  const attempts = ('attempts' in task ? (task.attempts?.length ?? 0) : 0) + 1;
  return {
    header: {
      tone: STEP_TONE[task.status],
      crumbs: ['Red Sea exposure', task.key],
      crumbActions: ['open-run'],
      crumbMenu: {
        action: 'open-step',
        placeholder: 'Jump to a task',
        items: RUN_TRACE.map((t) => ({ id: t.key, label: t.key, aside: seconds(t.durationMs), tone: STEP_TONE[t.status] })),
        selected: task.key,
      },
      chips: [{ label: task.status.replace('_', ' ') }],
    },
    rows: [],
    tabs: [
      {
        id: 'overview',
        label: 'Overview',
        rows: [
          {
            panels: [
              {
                kind: 'grid',
                options: {
                  tiles: [
                    { label: 'Status', value: task.status.replace('_', ' ') },
                    { label: 'Duration', value: seconds(task.durationMs) },
                    { label: 'Attempts', value: String(attempts), flag: attempts > 1 },
                  ],
                },
              },
            ],
          },
          {
            panels: [
              {
                kind: 'list',
                title: 'Artifacts',
                options: {
                  items: [
                    { id: 'input', icon: 'file', title: 'input.json', mono: true, meta: 'the request, resolved', chip: { label: 'input' } },
                    { id: 'result', icon: 'file', title: 'result.json', mono: true, meta: 'what it merged', chip: { label: 'output' } },
                  ],
                },
              },
            ],
          },
        ],
      },
      {
        id: 'exchange',
        label: 'Exchange',
        rows: [
          {
            panels: [
              {
                kind: 'exchange',
                title: 'What went in, what came out',
                options: {
                  blocks: [
                    { label: 'Input', language: 'json', value: JSON.stringify({ task: task.key, run: '9f2c…a41' }, null, 2) },
                    { label: 'Output', language: 'json', value: JSON.stringify({ status: task.status, ms: task.durationMs ?? null }, null, 2) },
                  ],
                },
              },
            ],
          },
        ],
      },
      {
        id: 'log',
        label: 'Log',
        rows: [
          {
            panels: [
              lines.length
                ? { kind: 'log', title: 'Log · this task only', flush: true, options: { lines } }
                : { kind: 'log', title: 'Log · this task only', options: { lines: [] }, absent: { reason: 'unrecorded', note: 'This task wrote nothing to the log.' } },
            ],
          },
        ],
      },
    ],
  };
}

/**
 * **A run, read as a report** — the flow with status, the budget against its
 * ceiling, where the time went, `result.json` and the log.
 *
 * Rendered from a `DashboardSpec` and nothing else; the flow is a registered
 * `flow` panel, which is how a real `@invana/canvas` one arrives. Pick a task
 * in **Performance** to open it inside the run: the run's crumb becomes a link
 * back (`crumbActions`), the task's crumb opens every task of the run
 * (`crumbMenu`), and the step carries its own tabs.
 */
export const Run: Story = {
  render: function Render() {
    const [last, setLast] = React.useState('—');
    const [step, setStep] = React.useState<string | null>(null);
    const task = RUN_TRACE.find((t) => t.key === step);
    return (
      <Surface last={last}>
        <Dashboard
          key={task?.key ?? 'run'}
          spec={(task ? stepSpec(task) : SPEC) as DashboardSpec<WithFlow>}
          registry={{ flow: FlowPanel as never }}
          icons={ICONS}
          onAction={(id, ctx) => {
            setLast([id, ctx?.taskKey, ctx?.itemId, ctx?.option].filter(Boolean).join(' · '));
            if (id === 'open-step') setStep(ctx?.taskKey ?? ctx?.itemId ?? null);
            if (id === 'open-run') setStep(null);
          }}
          className="min-h-0 flex-1"
        />
      </Surface>
    );
  },
};
