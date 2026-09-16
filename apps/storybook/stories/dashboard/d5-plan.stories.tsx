import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dashboard, type DashboardSpec } from '@invana/dashboard';

import { FlowPanel, ICONS, Surface, type FlowNode, type WithFlow } from './_fixtures';

const meta: Meta<typeof Dashboard> = {
  title: 'Dashboard/D5 Plan',
  component: Dashboard,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** The same eight tasks, painted with medians instead of status. */
const PLAN_FLOW: FlowNode[] = [
  { col: 1, row: 1, taskKey: 'check_bundle', bound: 'ingest', meta: 'p50 4ms · 14/14' },
  { col: 2, row: 1, taskKey: 'fetch_source', bound: 'network', status: 'warning', meta: 'p50 0.9s · 12/14' },
  { col: 3, row: 1, taskKey: 'validate_records', bound: 'ingest', meta: 'p50 1.2s · 14/14' },
  { col: 4, row: 1, taskKey: 'import_dataset', bound: 'ingest', meta: 'p50 3.4s · 14/14' },
  { col: 3, row: 2, taskKey: 'triage', bound: 'work_write', meta: 'ran 2 of 14', dim: true },
  { col: 4, row: 2, taskKey: 'verify_counts', bound: 'none', meta: 'p50 8ms · 14/14' },
  { col: 3, row: 3, taskKey: 'announce', bound: 'work_write', gate: true, meta: 'held p50 1m' },
  { col: 4, row: 3, taskKey: 'import_report', bound: 'ingest', meta: 'p50 40ms · 14/14' },
];

const SPEC: DashboardSpec<WithFlow> = {
  header: {
    crumbs: ['nightly-load'],
    chips: [
      { bound: 'ingest', label: 'ingest' },
      { label: 'promoted', tone: 'success' },
      { label: 'v4 · published', tone: 'success' },
      { label: 'plan dashboard' },
    ],
    actions: [
      { id: 'view', options: ['Dashboard', 'plan.yml'], value: 'Dashboard' },
      { id: 'run', label: 'Run', icon: 'play', variant: 'default' },
      { id: 'draft', label: 'Edit as a draft', variant: 'outline' },
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
              { label: 'Version', value: 'v4', caption: 'immutable · 3 before it' },
              { label: 'Served', value: '14', caption: 'last 6h ago' },
              { label: 'Succeeded', value: '12 / 14', caption: '1 failed · 1 held', tone: 'success', meter: 12 / 14 },
              { label: 'p50 duration', value: '4.9s', caption: 'p95 31s' },
              { label: 'Cost per run', value: '$0.00', caption: 'no llm bound' },
              { label: 'Held for approval', value: '1m', caption: 'median, on announce', tone: 'warning' },
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
          title: 'The flow · what it does, and how it has behaved',
          aside: 'click a task to set its parameters ›',
          flush: true,
          options: { nodes: PLAN_FLOW },
        },
      ],
    },
    {
      panels: [
        {
          kind: 'properties',
          title: 'Arguments · what a run must supply',
          aside: 'declared on the plan',
          options: {
            rows: [
              { label: 'bundle', value: 'str · required · no default' },
              { label: 'datasets', value: 'list · required · fanned out' },
              { label: 'model', value: 'str · default "Brokerage@latest"' },
              { label: 'mode', value: 'enum · default "upsert"' },
              { label: 'budget', value: '$2.00 · 40k tokens · 5 lanes' },
            ],
          },
        },
        {
          kind: 'list',
          title: 'Runs of this plan',
          aside: 'open in Runs ›',
          options: {
            items: [
              { id: 'r1', tone: 'success', title: 'nightly · 2026-09-16', meta: '4.7s', action: 'open-run' },
              { id: 'r2', tone: 'success', title: 'nightly · 2026-09-15', meta: '5.1s', action: 'open-run' },
              { id: 'r3', tone: 'error', title: 'nightly · 2026-09-14 · fetch refused', meta: '31s', action: 'open-run' },
              { id: 'r4', tone: 'success', title: 'nightly · 2026-09-13', meta: '4.4s', action: 'open-run' },
              { id: 'r5', tone: 'warning', title: 'manual · ravi · held on announce', meta: '1m 12s', action: 'open-run' },
            ],
          },
        },
      ],
    },
  ],
};

/**
 * **D5 · the plan dashboard** — the flow, its arguments, how it has behaved.
 *
 * Artboard 34o. The same `flow` panel as D1, painted with per-task medians
 * instead of status: one component, three renderings, so the views cannot drift
 * into three pictures of the same graph.
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
          onAction={(id, ctx) => setLast([id, ctx?.itemId, ctx?.option].filter(Boolean).join(' · '))}
          className="min-h-0 flex-1"
        />
      </Surface>
    );
  },
};
