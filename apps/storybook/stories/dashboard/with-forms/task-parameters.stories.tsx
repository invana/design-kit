import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dashboard, type DashboardSpec, type ParamsOptions } from '@invana/dashboard';

import { FlowPanel, ICONS, Surface, useLoaded, type FlowNode, type WithFlow } from '../_fixtures';

const meta: Meta<typeof Dashboard> = {
  title: 'Dashboard/With Forms/Task Parameters',
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

type Param = ParamsOptions['params'][number];

/** `import_dataset`'s parameters, as the draft stores them. */
const PARAMS: Param[] = [
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
];

/**
 * The page for one state of the draft: `params` is what the form holds now
 * (`null` until it loads), `changed` how many differ from what was saved.
 */
function spec(params: Param[] | null, changed: string[], version: number): DashboardSpec<WithFlow> {
  const problems = params?.filter((p) => p.invalid).map((p) => p.name) ?? [];
  const dirty = changed.length > 0;
  return {
    header: {
      tone: dirty ? 'warning' : 'success',
      crumbs: ['nightly-load', 'import_dataset'],
      chips: [
        { bound: 'ingest', label: 'ingest' },
        dirty ? { label: `${changed.length} unsaved`, tone: 'warning' } : { label: `draft v5 · save ${version}`, variant: 'outline' },
      ],
      actions: [
        { id: 'prev', icon: 'prev', variant: 'ghost' },
        { id: 'next', icon: 'next', variant: 'ghost' },
        { id: 'view', options: ['Dashboard', 'plan.yml'], value: 'Dashboard' },
        { id: 'publish', label: 'Publish v5', icon: 'check', variant: 'default', disabled: dirty },
      ],
    },
    staged: dirty
      ? {
          items: changed.map((name) => ({ id: name, op: 'change', name, note: 'parameter' })),
          discardAction: 'revert-one',
          discardAllAction: 'revert',
        }
      : undefined,
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
          params
            ? {
                id: 'params',
                kind: 'params',
                title: 'Parameters · import_dataset',
                asideChip: dirty ? { label: 'edited', tone: 'warning' } : { label: 'saved', variant: 'outline' },
                options: { changeAction: 'edit-param', params },
              }
            : { kind: 'text', title: 'Parameters · import_dataset', options: { text: 'Loading the draft…' } },
          {
            kind: 'record',
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
            asideChip: problems.length ? { label: `${problems.length} to fix`, tone: 'error' } : { label: 'legal', tone: 'success' },
            options: problems.length
              ? { tone: 'error', text: `No value for ${problems.join(', ')}. A parameter the catalogue requires cannot be empty.` }
              : { text: 'Every arg resolves · ingest is granted to Loader · validate_records is ordered before this. Checked on every change, and again before publish.' },
          },
        ],
      },
      {
        panels: [
          {
            kind: 'text',
            options: {
              text: dirty ? 'Unsaved changes to this task — v4 is untouched until you publish.' : 'Draft v5 is saved — v4 is untouched until you publish.',
              actions: [
                { id: 'save', label: 'Save to draft', icon: 'check', variant: 'default', disabled: !dirty || problems.length > 0 },
                { id: 'revert', label: 'Revert this task', variant: 'outline', disabled: !dirty },
              ],
            },
          },
        ],
      },
    ],
  };
}

const REQUIRED = new Set(PARAMS.filter((p) => p.type?.includes('required')).map((p) => p.name));

/**
 * **Load, edit, save** — a task's parameters, in a draft.
 *
 * The draft's parameters arrive after the page draws. Each edit dispatches
 * `edit-param` with `{ name, source, value }` and the story keeps it; the
 * `staged` bar lists every parameter that differs from the last save, with an
 * `×` to revert one. **Save to draft** commits them, **Revert** throws them
 * away, and emptying a required parameter fails validation and holds Save.
 * The `params` panel is generated from the catalogue contract beside it, so a
 * parameter the catalogue does not declare has no way to appear.
 */
export const TaskParameters: Story = {
  render: function Render() {
    const [last, setLast] = React.useState('—');
    const loaded = useLoaded(PARAMS);
    const [saved, setSaved] = React.useState<Param[] | null>(null);
    const [params, setParams] = React.useState<Param[] | null>(null);
    const [version, setVersion] = React.useState(1);

    React.useEffect(() => {
      setSaved(loaded);
      setParams(loaded);
    }, [loaded]);

    const changed =
      params && saved
        ? params.filter((p, i) => p.value !== saved[i].value || p.source !== saved[i].source).map((p) => p.name)
        : [];

    return (
      <Surface last={last}>
        <Dashboard
          spec={spec(params, changed, version)}
          registry={{ flow: FlowPanel as never }}
          icons={ICONS}
          onAction={(id, ctx) => {
            setLast([id, ctx?.param && `${ctx.param.name}=${ctx.param.value}`, ctx?.itemId, ctx?.option].filter(Boolean).join(' · '));
            if (id === 'edit-param' && ctx?.param) {
              const { name, source, value } = ctx.param;
              setParams((ps) =>
                ps?.map((p) =>
                  p.name === name
                    ? { ...p, source: source as Param['source'], value, invalid: REQUIRED.has(name) && !value.trim() }
                    : p,
                ) ?? ps,
              );
            }
            if (id === 'revert-one' && ctx?.itemId && saved) {
              const was = saved.find((p) => p.name === ctx.itemId);
              setParams((ps) => ps?.map((p) => (p.name === ctx.itemId && was ? was : p)) ?? ps);
            }
            if (id === 'revert') setParams(saved);
            if (id === 'save') {
              setSaved(params);
              setVersion((v) => v + 1);
            }
          }}
          className="min-h-0 flex-1"
        />
      </Surface>
    );
  },
};
