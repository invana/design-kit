import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dashboard, type DashboardSpec } from '@invana/dashboard';

import { FORM, RECORD, RUN_FIGURES, STEPS_TABLE, TIMESERIES } from '../../blocks/_fixtures';
import { ICONS, Surface } from '../_fixtures';

const meta: Meta<typeof Dashboard> = {
  title: 'Dashboard/Blocks/From Blocks',
  component: Dashboard,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A dashboard drawn only from blocks — the same specs the `Blocks/*` stories and a conversation
 * turn draw. The panel frames each one; its action comes back as `onAction(action, { panelId,
 * value })`, so picking a step is `select` from the `steps` panel.
 */
export const FromBlocks: Story = {
  render: () => {
    const [last, setLast] = React.useState('—');
    const [step, setStep] = React.useState(STEPS_TABLE.selected ?? null);

    const spec: DashboardSpec = {
      header: { tone: 'running', crumbs: ['Weekly demand', 'forecast run'] },
      rows: [
        { panels: [{ kind: 'grid', options: RUN_FIGURES }] },
        {
          panels: [
            { kind: 'timeseries', title: 'Weekly demand', aside: 'forecast from today', options: TIMESERIES },
            { kind: 'record', title: 'Account', width: 320, options: RECORD },
          ],
        },
        {
          panels: [
            { id: 'steps', kind: 'table', title: 'Steps', aside: 'pick a step', options: { ...STEPS_TABLE, selected: step } },
            { id: 'scenario', kind: 'form', title: 'Scenario', width: 320, options: FORM },
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
            if (id === 'select' && ctx?.panelId === 'steps') setStep(String(ctx.value));
          }}
        />
      </Surface>
    );
  },
};
