import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Dashboard, type ActionContext, type DashboardSpec } from '@invana/dashboard';

import forecastRun from '../../../fixtures/dashboards/forecast-run.json';
import { jsx, snippet } from '../../_story/source';
import type { Logged } from '../../_story/variant-board';
import { ICONS, Surface } from '../_fixtures';

// JSON widens the literal unions (`"running"`, `"right"`); the shape is the dashboard's own.
const SPEC = forecastRun as DashboardSpec;

interface Args {
  onAction: (id: string, ctx?: ActionContext) => void;
}

const meta = {
  title: 'Dashboard/Blocks/From Blocks',
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: {
        language: 'tsx',
        code: snippet({
          imports: [
            "import { Dashboard } from '@invana/dashboard';",
            "import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'; // any icon set",
          ],
          data: { spec: SPEC },
          setup: [
            '// Every panel reports through one callback, told apart by `panelId`:',
            '//   picking a step   → onAction("select", { panelId: "steps", value: "translate" })',
            '//   running the form → onAction("reply",  { panelId: "scenario", value: { price: -5, … } })',
            'const onAction = (id, ctx) => api.send({ id, ...ctx });',
            'const icons = { more: MoreHorizontal, prev: ChevronLeft, next: ChevronRight };',
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

/** `spec` with the steps table's picked row moved — what a consumer patches into its own spec. */
function withStep(spec: DashboardSpec, step: unknown): DashboardSpec {
  return ({
    ...spec,
    rows: spec.rows.map((row) => ({
      ...row,
      panels: row.panels.map((p) => (p.id === 'steps' ? { ...p, options: { ...p.options, selected: step } } : p)),
    })),
  }) as DashboardSpec;
}

function Live({ onAction }: Args) {
  const [spec, setSpec] = React.useState(SPEC);
  const [sent, setSent] = React.useState<Logged[]>([]);
  return (
    <Surface sent={sent}>
      <Dashboard
        className="min-h-0 flex-1"
        spec={spec}
        icons={ICONS}
        onAction={(id, ctx) => {
          onAction(id, ctx);
          setSent((s) => [...s, { name: `onAction("${id}")`, payload: ctx }].slice(-3));
          if (id === 'select' && ctx?.panelId === 'steps') setSpec((s) => withStep(s, ctx.value));
        }}
      />
    </Surface>
  );
}

/**
 * A dashboard drawn only from blocks — one `DashboardSpec` in `fixtures/dashboards/forecast-run.json`,
 * whose panels hold the same block options a conversation turn draws. Pick a step or run the
 * scenario: each arrives as `onAction(id, { panelId, value })`, written in the footer, and a
 * picked step moves the table's selection, as the consumer's own spec would.
 */
export const FromBlocks: Story = {
  render: (args) => <Live {...args} />,
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('Pick a step', async () => {
      await userEvent.click(canvas.getByText('translate'));
      await expect(args.onAction).toHaveBeenCalledWith('select', { panelId: 'steps', value: 'translate' });
    });
    await step('Run the scenario', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Run scenario' }));
      await expect(args.onAction).toHaveBeenCalledWith(
        'reply',
        expect.objectContaining({ panelId: 'scenario', value: expect.objectContaining({ price: -5 }) }),
      );
      await expect(canvas.getByRole('list', { name: 'Events' })).toHaveTextContent('"panelId": "scenario"');
    });
  },
};
