import * as React from 'react';
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
 * An import that finished. `fetch_source` was refused once and retried, so it
 * carries two attempts; `validate_records` failed nothing but reported 47 rows;
 * `triage` never ran, because the counts matched.
 *
 * `result` is the task's `result.json` as the engine wrote it — the card renders
 * it, so nothing has to be flattened into a caption first.
 */
const TASKS: TaskGanttTask[] = [
  {
    key: 'check_bundle',
    status: 'succeeded',
    startMs: 0,
    durationMs: 4,
    result: { datasets: 1, manifest: 'orders-2026-09.yaml' },
    log: 'manifest read · 1 dataset',
  },
  {
    key: 'fetch_source',
    status: 'succeeded',
    startMs: 320,
    durationMs: 900,
    attempts: [
      { startMs: 40, durationMs: 270, status: 'failed', title: 'refused · 429, retried after 50ms' },
    ],
    summary: 'refused once, then 200',
    result: { bytes: '1.4 MB', source: 'https://erp.internal/orders.csv', etag: 'W/"3f1c"' },
    log: 'refused once, then 200 · 1.4 MB',
  },
  {
    key: 'validate_records',
    status: 'succeeded',
    startMs: 1220,
    durationMs: 1200,
    result: { read: 1251, valid: 1204, reported: 47, reasons: { missing_sku: 31, bad_date: 12, duplicate: 4 } },
    log: '1,204 of 1,251 valid · 47 reported',
  },
  {
    key: 'import_dataset',
    status: 'succeeded',
    startMs: 2420,
    durationMs: 3400,
    result: { lanes: 3, nodes_written: 1204, edges_written: 1204, node_label: 'Order', edge_type: 'FOR' },
    log: '3 lanes · 1,204 Order, 1,204 FOR',
  },
  {
    key: 'verify_counts',
    status: 'succeeded',
    startMs: 5820,
    durationMs: 8,
    result: { expected: 1204, found: 1204 },
    log: '1,204 = 1,204',
  },
  {
    key: 'notify_owner',
    status: 'failed',
    startMs: 5830,
    durationMs: 60,
    error: {
      code: 'webhook_unreachable',
      message: 'The dataset owner’s webhook did not answer.',
      detail: 'POST https://hooks.internal/imports → ECONNREFUSED after 3 attempts',
    },
    summary: 'the import stands; only the notice failed',
    log: 'gave up after 3 attempts',
  },
  { key: 'triage', status: 'skipped', duration: '—', summary: 'counts matched, so there was nothing to triage' },
  {
    key: 'import_report',
    status: 'succeeded',
    startMs: 5900,
    durationMs: 40,
    result: { rejections: 47, reasons: 3, report: 'reported.csv' },
    log: '47 rejections, 3 reasons',
  },
];

/**
 * A run that finished, and what each task produced — on hover, not under the row.
 *
 * A line of log per row doubled the Gantt's height and could still only carry
 * one truncated sentence. The card carries the task's `result.json`, its error
 * and its last log line, which is what a reader hovering the slow bar came for,
 * and the rows stay a chart.
 *
 * Picking a row still filters the log to that task (SR15), so the rows are
 * pickable and the selected one stays lit.
 */
export const Finished: Story = {
  render: function Render() {
    const [selected, setSelected] = React.useState<string | null>('import_dataset');
    return (
      <div className="w-[460px] border border-border bg-card">
        <div className="px-3 pt-2 pb-1">
          <Eyebrow aside={<span className="font-mono">6.3s</span>}>Performance</Eyebrow>
        </div>
        <div className="px-3 pb-2">
          <TaskGantt
            tasks={TASKS}
            selectedKey={selected}
            onSelectTask={(key) => setSelected((prev) => (prev === key ? null : key))}
            detailProps={{ side: 'right', align: 'start', width: 320 }}
          />
        </div>
      </div>
    );
  },
};
