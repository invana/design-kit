import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dashboard, RUN_PANELS, type DashboardSpec, type RunPanelOptions } from '@invana/dashboard';

import { ICONS, Surface } from './_fixtures';

const meta: Meta<typeof Dashboard> = {
  title: 'Dashboard/D10 Run · tabs, a step inside',
  component: Dashboard,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const STEPS = [
  { id: 's1', label: 'parse_intent', aside: '0.9s', tone: 'success' as const },
  { id: 's2', label: 'ask_user', aside: '41.2s', tone: 'success' as const },
  { id: 's5', label: 'build_query', aside: '1.4s', tone: 'success' as const },
  { id: 's7', label: 'execute_query', aside: '2.1s', tone: 'success' as const },
  { id: 's9', label: 'deliver', aside: '0.1s', tone: 'success' as const },
];

/**
 * A run page read as a report header over tabs, and a step opened inside it.
 *
 * `tabs` carry their own bands under one header; `tabAction` makes the strip
 * controlled. On a step, the run's crumb is a link back (`crumbActions`) and
 * the step's crumb opens every step of the run (`crumbMenu`) — the tab strip
 * is the step's own.
 */
export const RunTabsStepInside: Story = {
  render: function Render() {
    const [last, setLast] = React.useState('—');
    const [step, setStep] = React.useState<string | null>(null);
    const [tab, setTab] = React.useState('overview');
    const current = STEPS.find((s) => s.id === step);

    const spec: DashboardSpec<RunPanelOptions> = current
      ? {
          header: {
            tone: 'success',
            crumbs: ['run:7d3184f1', `step:9b1c40e2 ${current.label}`],
            crumbActions: ['open-run'],
            crumbMenu: { action: 'open-step', placeholder: 'Jump to a step', items: STEPS, selected: current.id },
            chips: [{ label: 'graph_read' }, { label: 'succeeded' }],
          },
          rows: [],
          tabs: [
            {
              id: 'overview',
              label: 'Overview',
              rows: [{ panels: [{ kind: 'metrics', options: { tiles: [{ label: 'Duration', value: '2.1s' }, { label: 'Rows', value: '1,284' }] } }] }],
            },
            { id: 'touched', label: 'Touched', rows: [{ panels: [{ kind: 'text', title: 'Touched', options: { text: 'graph_data/model/Routes@v4 · 1,284 rows' } }] }] },
            { id: 'log', label: 'Log', rows: [{ panels: [{ kind: 'log', title: 'Log', options: { lines: [{ time: '+76.7s', level: 'info', message: 'cursor drained · 1,284 rows' }] } }] }] },
          ],
        }
      : {
          header: {
            tone: 'success',
            crumbs: ['run:7d3184f1'],
            chips: [{ label: 'succeeded' }, { label: '9 events' }],
            actions: [{ id: 'compare', label: 'Compare with the plan', variant: 'outline' }],
          },
          rows: [],
          tab,
          tabAction: 'tab',
          tabs: [
            {
              id: 'overview',
              label: 'Overview',
              rows: [
                {
                  panels: [
                    {
                      kind: 'list',
                      title: 'Steps',
                      aside: 'click one to open it inside the run',
                      options: { items: STEPS.map((s) => ({ id: s.id, tone: s.tone, title: s.label, meta: s.aside, mono: true, action: 'open-step' })) },
                    },
                  ],
                },
              ],
            },
            { id: 'layers', label: 'Layers', rows: [{ panels: [{ kind: 'text', title: 'Layers', options: { text: 'The strip on the run’s own clock.' } }] }] },
            { id: 'flow', label: 'Flow', rows: [{ panels: [{ kind: 'text', title: 'Flow', options: { text: 'The plan, with status on it.' } }] }] },
            { id: 'touched', label: 'Touched', rows: [{ panels: [{ kind: 'text', title: 'Touched', options: { text: 'Allowed, touched, never touched, refused.' } }] }] },
          ],
        };

    return (
      <Surface last={last}>
        <Dashboard
          className="min-h-0 flex-1"
          spec={spec}
          registry={RUN_PANELS}
          icons={ICONS}
          onAction={(id, ctx) => {
            setLast(`${id}${ctx?.itemId ? ` · ${ctx.itemId}` : ''}${ctx?.option ? ` · ${ctx.option}` : ''}`);
            if (id === 'tab' && ctx?.option) setTab(ctx.option);
            if (id === 'open-step' && ctx?.itemId) setStep(ctx.itemId);
            if (id === 'open-run') setStep(null);
          }}
        />
      </Surface>
    );
  },
};
