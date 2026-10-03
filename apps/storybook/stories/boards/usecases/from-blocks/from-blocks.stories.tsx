import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Board, type ActionContext, type BoardSpec } from '@invana/boards';

import forecastRun from '../../../../fixtures/boards/forecast-run.json';
import { jsx, snippet } from '../../../_story/source';
import { ICONS, Surface, patchPanel, useSent } from '../../_fixtures';

// JSON widens the literal unions (`"running"`, `"right"`); the shape is the board's own.
const SPEC = forecastRun as BoardSpec;

interface Args {
  onAction: (id: string, ctx?: ActionContext) => void;
}

const meta = {
  title: 'Boards/Use Cases/From Blocks',
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: {
        language: 'tsx',
        code: snippet({
          imports: [
            "import { Board } from '@invana/boards';",
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
          call: jsx('Board', { spec: 'spec', icons: 'icons', onAction: 'onAction' }),
        }),
      },
    },
  },
  args: { onAction: fn() },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

type Point = [string, number];

/**
 * The scenario, answered: the forecast after `forecastFrom` moved by price × elasticity — what
 * the API would send back, done here without one.
 */
function withScenario(spec: BoardSpec, value: { price?: number; elasticity?: number }): BoardSpec {
  const lift = 1 - ((value.price ?? 0) * (value.elasticity ?? 1)) / 100;
  return {
    ...spec,
    rows: spec.rows.map((row) => ({
      ...row,
      panels: row.panels.map((p) => {
        if (p.id !== 'demand') return p;
        const options = p.options as { forecastFrom: string; series: { name: string; points: Point[] }[] };
        const from = options.series[0].points.findIndex(([at]) => at === options.forecastFrom);
        const series = options.series.map((s) => ({
          ...s,
          points: s.points.map(([at, v], i): Point => [at, i > from ? Math.round(v * lift) : v]),
        }));
        return { ...p, aside: `scenario · price ${value.price}% · elasticity ${value.elasticity}`, options: { ...options, series } };
      }),
    })),
  } as BoardSpec;
}

function Live({ onAction }: Args) {
  const [spec, setSpec] = React.useState(SPEC);
  const [sent, record] = useSent(onAction);
  return (
    <Surface sent={sent}>
      <Board
        className="min-h-0 flex-1"
        spec={spec}
        icons={ICONS}
        onAction={(id, ctx) => {
          record(id, ctx);
          // A picked step moves the table's selection — what a consumer patches into its own spec.
          if (id === 'select' && ctx?.panelId === 'steps') setSpec((s) => patchPanel(s, 'steps', { selected: ctx.value }));
          // The scenario's inputs re-draw the forecast.
          if (id === 'reply' && ctx?.panelId === 'scenario') setSpec((s) => withScenario(s, ctx.value as { price?: number }));
        }}
      />
    </Surface>
  );
}

/**
 * A board drawn only from blocks — one `BoardSpec` in `fixtures/boards/forecast-run.json`,
 * whose panels hold the same block options a conversation turn draws. Pick a step or run the
 * scenario: each arrives as `onAction(id, { panelId, value })`, written in the footer, and is
 * answered as the consumer's own spec would be — a picked step moves the table's selection, and
 * the scenario's inputs re-draw the forecast after today.
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
      await expect(canvas.getByText('scenario · price -5% · elasticity 1.3')).toBeInTheDocument();
    });
  },
};
