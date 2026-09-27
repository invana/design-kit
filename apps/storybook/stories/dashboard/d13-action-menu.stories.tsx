import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dashboard, type DashboardSpec } from '@invana/dashboard';

import { ICONS, Surface } from './_fixtures';

const meta: Meta<typeof Dashboard> = {
  title: 'Dashboard/D13 Action · a menu behind ⋯',
  component: Dashboard,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A record header whose `⋯` holds the readings that are not tabs. `menu`
 * draws the options behind the action's own button — acts, not a choice, so
 * nothing stays selected — and each dispatches as `{ option }`. With an icon,
 * `label` is the button's accessible name rather than text beside it.
 */
export const ActionMenu: Story = {
  render: function Render() {
    const [last, setLast] = React.useState('—');

    const spec: DashboardSpec = {
      header: {
        crumbs: ['library', 'nl-single@2'],
        chips: [{ label: 'v2' }, { label: 'published', variant: 'outline' }],
        actions: [
          { id: 'version', options: ['v1', 'v2'], value: 'v2' },
          {
            id: 'more',
            label: 'More',
            icon: 'more',
            menu: true,
            options: ['versions', 'arguments', 'export'],
            optionLabels: { versions: 'Versions', arguments: 'Arguments', export: 'Export YAML' },
          },
        ],
      },
      rows: [{ panels: [{ kind: 'text', options: { text: `Last act: ${last}` } }] }],
    };

    return (
      <Surface last={last}>
        <Dashboard
          className="min-h-0 flex-1"
          spec={spec}
          icons={ICONS}
          onAction={(id, ctx) => setLast(`${id} ${JSON.stringify(ctx ?? {})}`)}
        />
      </Surface>
    );
  },
};
