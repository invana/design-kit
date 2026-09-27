import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dashboard, type DashboardSpec } from '@invana/dashboard';

import { ICONS, Surface } from './_fixtures';

const meta: Meta<typeof Dashboard> = {
  title: 'Dashboard/D11 Plan · a window, and a step picked',
  component: Dashboard,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const STEPS = [
  { step: 'translate', layer: 'llm', ran_in: '100%', p50: '5.8s', p95: '10.9s', failed: '0' },
  { step: 'validate', layer: 'agent', ran_in: '100%', p50: '2ms', p95: '3ms', failed: '0' },
  { step: 'execute', layer: 'graph data', ran_in: '100%', p50: '48ms', p95: '200ms', failed: '1' },
  { step: 'verify_result', layer: 'agent', ran_in: '96%', p50: '3ms', p95: '5ms', failed: '0' },
];

/**
 * A plan read over a window. `tabActions` puts the `7 · 30 · 90 days` switch
 * on the right of the tab strip, where it applies to every tab; the step table
 * names its rows by `rowKey` and reports a pick through `selectAction`.
 */
export const PlanWindowAndSteps: Story = {
  render: function Render() {
    const [last, setLast] = React.useState('—');
    const [window, setWindow] = React.useState('30 days');
    const [tab, setTab] = React.useState('overview');
    const [step, setStep] = React.useState<string | null>(null);

    const spec: DashboardSpec = {
      header: { crumbs: ['library', 'nl-single@2'], chips: [{ label: 'published' }] },
      rows: [],
      tab,
      tabAction: 'tab',
      tabActions: [{ id: 'window', options: ['7 days', '30 days', '90 days'], value: window }],
      tabs: [
        {
          id: 'overview',
          label: 'Overview',
          rows: [
            {
              panels: [
                {
                  kind: 'metrics',
                  options: {
                    tiles: [
                      { label: 'runs', value: '25', caption: `over ${window}` },
                      { label: 'served', value: '71%' },
                      { label: 'work p50', value: '12.9s' },
                      { label: 'failed', value: '1', tone: 'error' },
                    ],
                  },
                },
              ],
            },
            {
              panels: [
                {
                  kind: 'table',
                  title: 'Each step, across 25 runs',
                  aside: 'pick a step',
                  flush: true,
                  options: {
                    columns: [
                      { key: 'step', label: 'step' },
                      { key: 'layer', label: 'layer', mono: false },
                      { key: 'ran_in', label: 'ran in', align: 'right' },
                      { key: 'p50', label: 'p50', align: 'right' },
                      { key: 'p95', label: 'p95', align: 'right' },
                      { key: 'failed', label: 'failed', align: 'right' },
                    ],
                    rows: STEPS,
                    rowKey: 'step',
                    selectAction: 'select-step',
                    selected: step,
                  },
                },
              ],
            },
          ],
        },
        { id: 'activity', label: 'Activity', rows: [{ panels: [{ kind: 'text', options: { text: `Runs over ${window}.` } }] }] },
      ],
    };

    return (
      <Surface last={last}>
        <Dashboard
          className="min-h-0 flex-1"
          spec={spec}
          icons={ICONS}
          onAction={(id, ctx) => {
            setLast(`${id} ${JSON.stringify(ctx ?? {})}`);
            if (id === 'tab' && ctx?.option) setTab(ctx.option);
            if (id === 'window' && ctx?.option) setWindow(ctx.option);
            if (id === 'select-step') setStep(ctx?.itemId === step ? null : (ctx?.itemId ?? null));
          }}
        />
      </Surface>
    );
  },
};
