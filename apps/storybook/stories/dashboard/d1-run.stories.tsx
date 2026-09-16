import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dashboard, type DashboardSpec } from '@invana/dashboard';

import { FlowPanel, ICONS, RUN_FLOW, RUN_LOG, RUN_TRACE, Surface, type WithFlow } from './_fixtures';

const meta: Meta<typeof Dashboard> = {
  title: 'Dashboard/D1 Run',
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
          kind: 'metrics',
          options: {
            tiles: [
              { label: 'Tasks', value: '4 / 7', caption: 'running', tone: 'running', meter: 4 / 7 },
              { label: 'Elapsed', value: '12s', caption: 'no timeout yet' },
              { label: 'Tokens', value: '8.2k', caption: 'of 40k ceiling', meter: 0.21 },
              { label: 'Cost', value: '$0.04', caption: 'of $2.00 budget', tone: 'info', meter: 0.02 },
              { label: 'Rows', value: '1,880', caption: 'so far' },
              { label: 'Lanes', value: '2 / 5', caption: 'execute_graph_query', meter: 0.4 },
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
          aside: 'where the time went',
          options: { labelWidth: 124, selectAction: 'filter-log', tasks: RUN_TRACE },
        },
        {
          kind: 'properties',
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
          kind: 'properties',
          title: 'Input · what opened this run',
          aside: 'rendered from result.json',
          options: {
            rows: [
              { label: 'trigger', value: 'session · message #214' },
              { label: 'asked', value: '"Which suppliers are exposed to the Red Sea route?"' },
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

/**
 * **D1 · the run dashboard** — the flow with status, the budget against its
 * ceiling, `result.json`.
 *
 * Artboard 34k, rendered from a `DashboardSpec` and nothing else. The flow is a
 * registered `flow` panel; a real `@invana/canvas` one registers identically.
 */
export const Default: Story = {
  render: () => {
    const [last, setLast] = React.useState('—');
    return (
      <Surface last={last}>
        <Dashboard
          spec={SPEC}
          registry={{ flow: FlowPanel as never }}
          icons={ICONS}
          onAction={(id, ctx) => setLast([id, ctx?.taskKey, ctx?.option].filter(Boolean).join(' · '))}
          className="min-h-0 flex-1"
        />
      </Surface>
    );
  },
};
