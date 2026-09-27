import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dashboard, type DashboardSpec } from '@invana/dashboard';

import { ICONS, Surface } from './_fixtures';

const meta: Meta<typeof Dashboard> = {
  title: 'Dashboard/D14 Header · description, staged set, a locked tab',
  component: Dashboard,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A record being edited. `header.description` reads on one line under the
 * crumbs, with `More` for `details`; `staged` draws the draft's changes as a
 * bar between the header and the tabs, on every tab; a `locked` tab is dimmed
 * with a lock and cannot be picked; a `disabled` tab action greys the window
 * on a tab it does not apply to; a `fill` row takes the height the tab has
 * left, for a canvas, and a `flush` tab drops its padding so the canvas meets
 * the tab strip.
 */
export const HeaderStagedLocked: Story = {
  render: function Render() {
    const [last, setLast] = React.useState('—');
    const [tab, setTab] = React.useState('model');

    const spec: DashboardSpec = {
      header: {
        crumbs: ['Models', 'AirRoutes'],
        chips: [{ label: 'v2 · draft', tone: 'info' }, { label: 'v1 · active', variant: 'outline' }],
        actions: [
          { id: 'publish', label: 'Publish v2', variant: 'default' },
          { id: 'discard', label: 'Discard draft', variant: 'outline' },
        ],
        description: 'Airports, countries and continents, and the routes flown between them',
        details: [
          { label: 'Validation', value: 'strict', mono: true },
          { label: 'Origin', value: 'starter' },
        ],
      },
      staged: {
        items: [
          { id: '1', op: 'add', name: 'airport.timezone', note: 'property' },
          { id: '2', op: 'add', name: 'airport_city', note: 'index on airport.city' },
          { id: '3', op: 'change', name: 'route.dist', note: 'integer → float' },
        ],
        discardAction: 'discard-one',
        discardAllAction: 'discard-all',
        hint: '⌘↵ publish',
      },
      tabs: [
        { id: 'overview', label: 'Overview', rows: [{ panels: [{ kind: 'text', options: { text: 'Overview' } }] }] },
        { id: 'model', label: 'Model', flush: true, rows: [{ fill: true, panels: [{ kind: 'text', title: 'Canvas', options: { text: 'A row with `fill` takes the height the tab has left.' } }] }] },
        { id: 'usage', label: 'Usage', locked: true, rows: [] },
      ],
      tab,
      tabAction: 'tab',
      tabActions: [{ id: 'window', options: ['7 days', '30 days', '90 days'], value: '30 days', disabled: tab === 'model' }],
      rows: [],
    };

    return (
      <Surface last={last}>
        <Dashboard
          className="min-h-0 flex-1"
          spec={spec}
          icons={ICONS}
          onAction={(id, ctx) => {
            if (id === 'tab' && ctx?.option) setTab(ctx.option);
            setLast(`${id} ${JSON.stringify(ctx ?? {})}`);
          }}
        />
      </Surface>
    );
  },
};
