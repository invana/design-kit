import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Dashboard, type ActionContext, type DashboardSpec } from '@invana/dashboard';

import plan from '../../../../fixtures/dashboards/plan.json';
import { jsx, snippet } from '../../../_story/source';
import { ICONS, Surface, mapPanels, panelsOf, patchPanel, useSent } from '../../_fixtures';

// JSON widens the literal unions (`"right"`, `"outline"`); the shape is the dashboard's own.
const SPEC = plan as unknown as DashboardSpec;

interface Args {
  onAction: (id: string, ctx?: ActionContext) => void;
}

const meta = {
  title: 'Dashboard/Examples/Plan',
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: {
        language: 'tsx',
        code: snippet({
          imports: ["import { Dashboard } from '@invana/dashboard';", "import { MoreHorizontal } from 'lucide-react'; // any icon set"],
          data: { spec: SPEC },
          setup: [
            '// Every control reports through one callback, and the page answers by patching its spec:',
            '//   a tab             → onAction("tab",     { option: "activity" })    → spec.tab',
            '//   the window switch → onAction("window",  { option: "7 days" })      → tabActions[0].value, and refetch',
            '//   a step row        → onAction("select",  { panelId: "steps", value: "translate" }) → its `selected`',
            '//   the ⋯ menu        → onAction("more",    { option: "export" })      → open that reading',
            'const onAction = (id, ctx) => setSpec((s) => answer(s, id, ctx));',
            'const icons = { more: MoreHorizontal };',
          ].join('\n'),
          call: jsx('Dashboard', { spec: 'spec', icons: 'icons', onAction: 'onAction' }),
        }),
      },
    },
  },
  args: { onAction: fn() },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** The window the numbers are read over, written into the spec where it shows. */
function withWindow(spec: DashboardSpec, window: string): DashboardSpec {
  const next = mapPanels(spec, (p) =>
    p.id === 'figures'
      ? { ...p, options: { ...p.options, tiles: p.options.tiles.map((t: { label: string }, i: number) => (i === 0 ? { ...t, delta: `over ${window}` } : t)) } }
      : p,
  );
  return {
    ...patchPanel(next, 'activity', { text: `Runs over ${window}.` }),
    tabActions: spec.tabActions?.map((a) => (a.id === 'window' ? { ...a, value: window } : a)),
  };
}

/** What the page does with each action — the consumer's half of the contract. */
function answer(spec: DashboardSpec, id: string, ctx: ActionContext = {}): DashboardSpec {
  if (id === 'tab' && ctx.option) return { ...spec, tab: ctx.option };
  if (id === 'window' && ctx.option) return withWindow(spec, ctx.option);
  if (id === 'version' && ctx.option)
    return { ...spec, header: { ...spec.header!, actions: spec.header!.actions?.map((a) => (a.id === 'version' ? { ...a, value: ctx.option } : a)) } };
  if (id === 'select' && ctx.panelId === 'steps') {
    const selected = panelsOf(spec).find((p) => p.id === 'steps')?.options.selected;
    return patchPanel(spec, 'steps', { selected: selected === ctx.value ? null : ctx.value });
  }
  return spec;
}

function Live({ onAction }: Args) {
  const [spec, setSpec] = React.useState(SPEC);
  const [sent, record] = useSent(onAction);
  return (
    <Surface sent={sent}>
      <Dashboard
        className="min-h-0 flex-1"
        spec={spec}
        icons={ICONS}
        onAction={(id, ctx) => {
          record(id, ctx);
          setSpec((s) => answer(s, id, ctx));
        }}
      />
    </Surface>
  );
}

/**
 * **A plan, read as a report** over a window — one `DashboardSpec` in `fixtures/dashboards/plan.json`.
 * `tabActions` puts the `7 · 30 · 90 days` switch on the right of the tab strip, where it applies
 * to every tab; the step table names its rows by `rowKey` and reports a pick through `select`. The
 * header's `⋯` is a `menu` — readings that are not tabs: acts, not a choice, so nothing stays
 * selected. Every action is written in the footer and answered: the tab moves, the window
 * rewrites the figures, a picked step is selected (pick it again to clear it).
 */
export const Plan: Story = {
  render: (args) => <Live {...args} />,
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('Pick a step', async () => {
      await userEvent.click(canvas.getByText('translate'));
      await expect(args.onAction).toHaveBeenCalledWith('select', { panelId: 'steps', value: 'translate' });
    });
    await step('Read the plan over 7 days', async () => {
      await userEvent.click(canvas.getByRole('radio', { name: '7 days' }));
      await expect(args.onAction).toHaveBeenCalledWith('window', { option: '7 days' });
      await expect(canvas.getByText('over 7 days')).toBeInTheDocument();
      await expect(canvas.getByRole('list', { name: 'Events' })).toHaveTextContent('{ "option": "7 days" }');
    });
  },
};
