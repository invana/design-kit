import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dashboard, type DashboardSpec } from '@invana/dashboard';

import { ICONS, Surface, WHERE_IT_SITS } from './_fixtures';

const meta: Meta<typeof Dashboard> = {
  title: 'Dashboard/D3 Step Query',
  component: Dashboard,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const SPEC: DashboardSpec = {
  header: {
    tone: 'info',
    crumbs: ['orders.csv → Brokerage.Order', 'execute_graph_query'],
    chips: [{ bound: 'graph_read', label: 'graph_read', swatch: 'bg-success' }, { label: 'running', tone: 'info' }, { label: 'step dashboard' }],
    actions: [
      { id: 'prev', icon: 'prev', variant: 'ghost' },
      { id: 'next', icon: 'next', variant: 'ghost' },
      { id: 'view', options: ['Dashboard', 'dashboard.yml'], value: 'Dashboard' },
      { id: 'more', icon: 'more', variant: 'ghost' },
    ],
  },
  rows: [
    { panels: [{ kind: 'metrics', options: { tiles: [
      { label: 'Status', value: 'running', caption: 'lane 2 of 5', tone: 'running' },
      { label: 'Elapsed', value: '3.4s', caption: 'no timeout yet' },
      { label: 'Rows', value: '1,880', caption: 'so far' },
      { label: 'Lanes', value: '2 / 5', caption: '1 done · 3 queued', meter: 0.4 },
      { label: 'Cost', value: '$0.00', caption: 'graph_read' },
    ] } }] },
    {
      panels: [
        {
          kind: 'properties',
          title: 'Input · the request, resolved',
          aside: 'args after ${…} binding',
          options: { rows: [
            { label: 'query', value: 'MATCH (s:Supplier)-[:SHIPS_VIA]->(r:Route)…' },
            { label: 'params', value: '{"route": "RED_SEA", "quarter": "Q3 2026"}' },
            { label: 'language', value: 'cypher · validated' },
            { label: 'map_over', value: '${steps.plan_queries.queries} → 5 lanes' },
          ] },
        },
        {
          kind: 'json',
          title: 'result.json',
          aside: 'rendered from result.json',
          width: 340,
          flush: true,
          options: { maxHeight: 232, value: {
            task: 'execute_graph_query',
            status: 'running',
            outputs: { rows: 1880, count: 1880, truncated: false },
            lanes: [
              { lane: 1, rows: 1204, ms: 900 },
              { lane: 2, rows: 676, ms: null },
            ],
            artifacts: ['rows.parquet'],
          } },
        },
      ],
    },
    {
      panels: [
        {
          kind: 'table',
          title: 'Output · rows',
          aside: '1,880 rows · first 4',
          flush: true,
          options: {
            columns: [
              { key: 'supplier', label: 'supplier' },
              { key: 'route', label: 'route' },
              { key: 'orders', label: 'orders', align: 'right' },
              { key: 'exposure', label: 'exposure', align: 'right' },
            ],
            rows: [
              { supplier: 'Meridian Parts', route: 'RED_SEA', orders: '412', exposure: '0.82' },
              { supplier: 'Kalyan Steel', route: 'RED_SEA', orders: '288', exposure: '0.71' },
              { supplier: 'Onyx Logistics', route: 'SUEZ', orders: '190', exposure: '0.44' },
              { supplier: 'Hartley Tools', route: 'RED_SEA', orders: '96', exposure: '0.38' },
            ],
          },
        },
        {
          kind: 'list',
          title: 'Artifacts',
          aside: '1',
          width: 340,
          options: { items: [
              { id: 'rows', icon: 'file', title: 'rows.parquet', mono: true, meta: '1,880 rows · 210 KB', chip: { label: 'output' }, action: 'open-artifact' },
            ] },
        },
      ],
    },
    {
      panels: [
        {
          kind: 'log',
          title: 'Log · this task only',
          aside: '2 lines',
          flush: true,
          options: { lines: [
              { time: '03.62', level: 'info', source: 'execute_graph_query', message: 'lane 1 · 1,204 rows · 0.9s' },
              { time: '05.10', level: 'info', source: 'execute_graph_query', message: 'lane 2 · running…' },
            ] },
        },
        {
          kind: 'properties',
          title: 'Where it sits',
          width: 340,
          options: WHERE_IT_SITS('execute_graph_query', '2 of 5'),
        },
      ],
    },
  ],
};

/**
 * **D3 · a step that reads the graph** — `execute_graph_query`, still running.
 *
 * Artboard 34m. The Output panel is a `table`; everything else is D2's spec
 * with different data. One kind swapped, not one screen rewritten.
 */
export const Default: Story = {
  render: () => {
    const [last, setLast] = React.useState('—');
    return (
      <Surface last={last}>
        <Dashboard
          spec={SPEC}
          icons={ICONS}
          onAction={(id, ctx) => setLast([id, ctx?.itemId, ctx?.option].filter(Boolean).join(' · '))}
          className="min-h-0 flex-1"
        />
      </Surface>
    );
  },
};
