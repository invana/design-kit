import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { GanttBlock } from '@invana/blocks';

import { BLOCK_VARIANTS } from '../../../../fixtures/blocks';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard } from '../../../_story/variant-board';

/** The gantt read by layer — the Layer access variants of its board. */
const VARIANTS = BLOCK_VARIANTS.gantt.filter((v) => v.useCase === 'layers');

interface Args {
  variant: string;
  onAction: (action: string, value?: unknown) => void;
}

const meta = {
  title: 'Blocks/Components/Gantt/Layer Access',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { GanttBlock } from '@invana/blocks';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { spec: v.spec },
              setup: "// 'select' with the bar's key when a bar is picked — \"fetch_source#1\".\nconst onAction = (action, value) => {};",
              call: jsx('GanttBlock', { spec: 'spec', onAction: 'onAction' }),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onAction: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * **Layer access** — the same `gantt` block read by layer: what a run reached, and what it was
 * stopped from reaching. A row per layer opens into its participants (`subtasks`); each holds the
 * `segments` of the tasks that reached it, painted by `palette`, with a `note` under the name, a
 * `chip` at the end and a hover card of its own. A bar a rule stopped is `refused` — struck through,
 * never mistaken for skipped; a plan read before it runs is `scale: "seq"`, its bars `dashed`
 * (declared). A gate is a `seam`. Pick a bar and it is sent as `select` with its key.
 */
export const LayerAccess: Story = {
  render: ({ variant, onAction }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => (
        <GanttBlock
          spec={v.spec}
          onAction={(action, value) => {
            onAction(action, value);
            log('onAction', { action, value });
          }}
        />
      )}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('Every variant draws', async () => {
      for (const v of VARIANTS) await expect(canvas.getByRole('group', { name: v.caption })).toBeVisible();
    });
    const reached = within(canvas.getByRole('group', { name: 'Layer access · what a run reached' }));
    await step('Picking a bar sends the bar\'s key, not its row\'s', async () => {
      await userEvent.click(reached.getByRole('button', { name: 'fetch_source · attempt 1 · 503' }));
      await expect(args.onAction).toHaveBeenLastCalledWith('select', 'fetch_source#1');
      await expect(reached.getByRole('button', { name: 'fetch_source · attempt 1 · 503' })).toHaveAttribute('aria-pressed', 'true');
    });
    const plan = within(canvas.getByRole('group', { name: 'Layer access · a plan, in step order' }));
    await step('A plan counts steps, not seconds', async () => {
      await expect(plan.getByText('step 3')).toBeInTheDocument();
    });
  },
};
