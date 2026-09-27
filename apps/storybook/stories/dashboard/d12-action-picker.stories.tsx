import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dashboard, type DashboardSpec } from '@invana/dashboard';

import { ICONS, Surface } from './_fixtures';

const meta: Meta<typeof Dashboard> = {
  title: 'Dashboard/D12 Action · a picker beside a switch',
  component: Dashboard,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const AGENTS: Record<string, string> = {
  all: 'all agents',
  'a-7d31': 'Query',
  'a-9b1c': 'Explorer',
  'a-40e2': 'Route desk coordinator',
};

const RUNS = [
  { id: 'r1', run: 'run:7d3184f1', agent: 'a-7d31', status: 'succeeded', when: '2h ago' },
  { id: 'r2', run: 'run:9b1c40e2', agent: 'a-9b1c', status: 'failed', when: '5h ago' },
  { id: 'r3', run: 'run:2c5ee656', agent: 'a-7d31', status: 'succeeded', when: 'yesterday' },
  { id: 'r4', run: 'run:c0dace0d', agent: 'a-40e2', status: 'succeeded', when: '3 days ago' },
];

/**
 * A table's header carries two filters. `status` is a few short words, so it
 * is a segmented switch; `agent` is a choice among named records, so it is a
 * `picker` — a dropdown that shows each agent's name through `optionLabels`
 * and dispatches its id as `{ option }`.
 */
export const ActionPicker: Story = {
  render: function Render() {
    const [last, setLast] = React.useState('—');
    const [status, setStatus] = React.useState('all');
    const [agent, setAgent] = React.useState('all');

    const rows = RUNS.filter(
      (r) => (status === 'all' || r.status === status) && (agent === 'all' || r.agent === agent),
    ).map((r) => ({ ...r, agent: AGENTS[r.agent] }));

    const spec: DashboardSpec = {
      rows: [
        {
          panels: [
            {
              kind: 'table',
              title: 'Runs',
              flush: true,
              actions: [
                { id: 'status', options: ['all', 'succeeded', 'failed'], value: status },
                {
                  id: 'agent',
                  label: 'agent',
                  picker: true,
                  options: Object.keys(AGENTS),
                  optionLabels: AGENTS,
                  value: agent,
                },
              ],
              options: {
                columns: [
                  { key: 'run', label: 'run' },
                  { key: 'agent', label: 'agent', mono: false },
                  { key: 'status', label: 'status', mono: false },
                  { key: 'when', label: 'when', mono: false },
                ],
                rows,
                rowKey: 'id',
              },
            },
          ],
        },
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
            if (id === 'status' && ctx?.option) setStatus(ctx.option);
            if (id === 'agent' && ctx?.option) setAgent(ctx.option);
          }}
        />
      </Surface>
    );
  },
};
