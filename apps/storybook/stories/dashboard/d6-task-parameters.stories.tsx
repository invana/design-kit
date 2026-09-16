import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dashboard, type DashboardSpec } from '@invana/dashboard';

import { FlowPanel, ICONS, Surface, type FlowNode, type WithFlow } from './_fixtures';

const meta: Meta<typeof Dashboard> = {
  title: 'Dashboard/D6 Task Parameters',
  component: Dashboard,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** The draft, with one task picked — the third rendering of the same flow. */
const DRAFT_FLOW: FlowNode[] = [
  { col: 1, row: 1, taskKey: 'check_bundle', bound: 'ingest' },
  { col: 2, row: 1, taskKey: 'fetch_source', bound: 'network' },
  { col: 3, row: 1, taskKey: 'validate_records', bound: 'ingest' },
  { col: 4, row: 1, taskKey: 'import_dataset', bound: 'ingest', meta: 'map_over: datasets', selected: true },
  { col: 3, row: 2, taskKey: 'triage', bound: 'work_write', meta: 'when: counts differ' },
  { col: 4, row: 2, taskKey: 'verify_counts', bound: 'none' },
  { col: 3, row: 3, taskKey: 'announce', bound: 'work_write', gate: true, meta: 'approval before it writes' },
  { col: 4, row: 3, taskKey: 'import_report', bound: 'ingest' },
];

const SPEC: DashboardSpec<WithFlow> = {
  header: {
    tone: 'warning',
    crumbs: ['nightly-load', 'import_dataset'],
    chips: [{ bound: 'ingest', label: 'ingest' }, { label: 'draft v5', tone: 'warning' }],
    actions: [
      { id: 'prev', icon: 'prev', variant: 'ghost' },
      { id: 'next', icon: 'next', variant: 'ghost' },
      { id: 'view', options: ['Dashboard', 'plan.yml'], value: 'Dashboard' },
      { id: 'publish', label: 'Publish v5', icon: 'check', variant: 'default' },
      { id: 'more', icon: 'more', variant: 'ghost' },
    ],
  },
  rows: [
    {
      height: 348,
      panels: [
        {
          kind: 'flow',
          title: 'The flow · draft v5',
          aside: 'one task selected — its parameters are below',
          flush: true,
          options: { nodes: DRAFT_FLOW },
        },
      ],
    },
    {
      panels: [
        {
          id: 'params',
          kind: 'params',
          title: 'Parameters · import_dataset',
          asideChip: { label: 'draft v5', tone: 'warning' },
          options: {
            changeAction: 'edit-param',
            params: [
              { name: 'dataset', type: 'str · required', source: 'binding', value: '${lane.dataset}', note: 'one lane per entry in ${datasets}' },
              { name: 'model', type: 'str · required', source: 'argument', value: '${args.model} → "Brokerage@v2"', note: 'resolved from the plan argument, default "Brokerage@latest"' },
              { name: 'mode', type: 'enum · default upsert', source: 'literal', value: 'upsert', note: 'upsert · append' },
              { name: 'records', type: 'list · required', source: 'binding', value: '${steps.validate_records.rows}', note: 'validate_records is already ordered before this — required by the catalogue' },
              { name: 'batch_size', type: 'int · optional', source: 'literal', value: '5000', note: 'left at the catalogue default' },
              { name: 'map_over', type: 'list', source: 'binding', value: '${args.datasets}', note: 'fans this task out — 3 lanes last run' },
              { name: 'depends_on', type: 'list', source: 'literal', value: '[validate_records, fetch_source]' },
              { name: 'retry', type: 'obj', source: 'literal', value: '{attempts: 3, backoff: 2s}' },
              { name: 'when', type: 'expr', source: 'literal', value: '—', note: 'always runs', disabled: true },
              { name: 'approval', type: 'bool', source: 'literal', value: 'false', note: 'this task writes under ingest, not graph_write' },
            ],
          },
        },
        {
          kind: 'properties',
          title: 'Its contract · from the catalogue',
          aside: 'read-only',
          width: 330,
          options: {
            rows: [
              { label: 'bound', value: 'ingest' },
              { label: 'requires', value: 'validate_records' },
              { label: 'args', value: 'dataset, model, mode, records, batch_size' },
              { label: 'outputs', value: 'written int · reported int · dataset_id str' },
            ],
          },
        },
      ],
    },
    {
      panels: [
        {
          kind: 'text',
          title: 'Validation',
          asideChip: { label: 'legal', tone: 'success' },
          options: {
            text: 'Every arg resolves · ingest is granted to Loader · validate_records is ordered before this. Checked on every change, and again before publish.',
          },
        },
      ],
    },
    {
      panels: [
        {
          kind: 'text',
          options: {
            text: 'Changes are saved to draft v5 — v4 is untouched until you publish.',
            actions: [
              { id: 'save', label: 'Save to draft', icon: 'check', variant: 'default' },
              { id: 'revert', label: 'Revert this task', variant: 'outline' },
              { id: 'publish', label: 'Publish v5', variant: 'ghost' },
            ],
          },
        },
      ],
    },
  ],
};

/**
 * **D6 · setting a task's parameters** — the form is the catalogue contract.
 *
 * Artboard 34p. The `params` panel is generated from the contract beside it, so
 * a parameter the catalogue does not declare has no way to appear. The footer
 * is a `text` panel with actions and no `title`, which is why it renders bare
 * rather than in a box.
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
          onAction={(id, ctx) =>
            setLast([id, ctx?.param && `${ctx.param.name}=${ctx.param.value}`, ctx?.option].filter(Boolean).join(' · '))
          }
          className="min-h-0 flex-1"
        />
      </Surface>
    );
  },
};
