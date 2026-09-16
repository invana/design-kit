import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dashboard, type DashboardSpec } from '@invana/dashboard';

import { ICONS, Surface, WHERE_IT_SITS } from './_fixtures';

const meta: Meta<typeof Dashboard> = {
  title: 'Dashboard/D2 Step Import',
  component: Dashboard,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const SPEC: DashboardSpec = {
  header: {
    tone: 'success',
    crumbs: ['orders.csv → Brokerage.Order', 'import_dataset'],
    chips: [{ bound: 'ingest', label: 'ingest' }, { label: 'succeeded', tone: 'success' }, { label: 'step dashboard' }],
    actions: [
      { id: 'prev', icon: 'prev', variant: 'ghost' },
      { id: 'next', icon: 'next', variant: 'ghost' },
      { id: 'view', options: ['Dashboard', 'dashboard.yml'], value: 'Dashboard' },
      { id: 'more', icon: 'more', variant: 'ghost' },
    ],
  },
  rows: [
    { panels: [{ kind: 'metrics', options: { tiles: [
      { label: 'Status', value: 'ok', caption: 'first attempt', tone: 'success' },
      { label: 'Duration', value: '3.4s', caption: '72% of the run' },
      { label: 'Written', value: '1,204', caption: 'of 1,251 read' },
      { label: 'Lanes', value: '3', caption: '402 · 402 · 400' },
      { label: 'Cost', value: '$0.00', caption: 'no llm bound' },
    ] } }] },
    {
      panels: [
        {
          kind: 'properties',
          title: 'Input · the request, resolved',
          aside: 'args after ${…} binding',
          options: { rows: [
            { label: 'dataset', value: '"orders"' },
            { label: 'model', value: '"Brokerage@v2"' },
            { label: 'mode', value: '"upsert"' },
            { label: 'records', value: '${steps.validate_records.rows} → 1,204' },
            { label: 'map_over', value: '${datasets} → 3 lanes' },
          ] },
        },
        {
          kind: 'json',
          title: 'result.json',
          aside: 'rendered from result.json',
          width: 340,
          flush: true,
          options: { maxHeight: 232, value: {
            task: 'import_dataset',
            status: 'ok',
            outputs: { written: 1204, reported: 47, dataset_id: 'ds_9f2c' },
            graph: { nodes: { Order: 1204 }, edges: { FOR: 1204 } },
            artifacts: ['orders.csv', 'rejects.csv'],
            timing: { ms: 3402 },
          } },
        },
      ],
    },
    {
      panels: [
        {
          kind: 'properties',
          title: 'Output · graph data',
          aside: 'what this task wrote',
          options: {
            rows: [
              { label: 'model', value: 'Brokerage@v2' },
              { label: 'Order', value: '1,204 new · 0 updated' },
              { label: 'FOR', value: '1,204 new' },
              { label: 'mode', value: 'upsert · by isin' },
            ],
          },
        },
        {
          kind: 'list',
          title: 'Artifacts',
          aside: '2',
          width: 340,
          options: { items: [
              { id: 'orders', icon: 'file', title: 'orders.csv', mono: true, meta: '1.4 MB · the input it read', chip: { label: 'input' }, action: 'open-artifact' },
              { id: 'rejects', icon: 'file', title: 'rejects.csv', mono: true, meta: '47 rows · 12 KB', chip: { label: 'output' }, action: 'open-artifact' },
            ] },
        },
      ],
    },
    {
      panels: [
        {
          kind: 'log',
          title: 'Log · this task only',
          aside: '4 lines',
          flush: true,
          options: { lines: [
              { time: '02.15', level: 'info', source: 'import_dataset', message: 'fan-out · 3 lanes of 402' },
              { time: '03.40', level: 'info', source: 'import_dataset', message: 'lane 1 · 402 Order, 402 FOR' },
              { time: '04.20', level: 'info', source: 'import_dataset', message: 'lane 2 · 402 Order, 402 FOR' },
              { time: '05.50', level: 'info', source: 'import_dataset', message: 'lane 3 · 400 Order, 400 FOR' },
            ] },
        },
        {
          kind: 'properties',
          title: 'Where it sits',
          width: 340,
          options: WHERE_IT_SITS('import_dataset', '2 of 3'),
        },
      ],
    },
  ],
};

/**
 * **D2 · a step that writes to the graph** — `import_dataset`.
 *
 * Artboard 34l. Only the **Output** panel differs from D3 and D4: the tiles,
 * Input, `result.json`, Artifacts, Where it sits and the Log are the same
 * bands with the same kinds, because the runtime records them the same way.
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
