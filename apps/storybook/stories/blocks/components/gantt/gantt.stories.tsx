import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { GanttBlock } from '@invana/blocks';

import { BLOCK_VARIANTS } from '../../../../fixtures/blocks';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard } from '../../../_story/variant-board';

const VARIANTS = BLOCK_VARIANTS.gantt;

interface Args {
  variant: string;
  onAction: (action: string, value?: unknown) => void;
}

const meta = {
  title: 'Blocks/Components/Gantt',
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
              setup: "// 'select' with the task's key when a row is picked, or the bar's key when a keyed segment is.\nconst onAction = (action, value) => {};",
              call: jsx('GanttBlock', {
                spec: 'spec',
                onAction: 'onAction',
              }),
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
 * Where a run's time went — `TaskGantt` drawn from a JSON spec. One row per task on the run's
 * clock: a retry's failed attempt left of the one that stuck, a task that never ran as an outline.
 * A task's `subtasks` nest under it (`open` draws it open); a parent with no timing of its own
 * draws the stretch they cover. Hover a row for its card, beside the cursor; pick one and it is
 * sent as `select` with the task's key. A row's `segments` are many bars on one row — a layer's
 * participants and the tasks that reached them, painted by `palette`, with a gate as a `seam`; a
 * keyed bar is picked on its own and sent as `select` with its key.
 */
export const Gantt: Story = {
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
    const nested = within(canvas.getByRole('group', { name: 'Nested · the plan opened' }));
    await step('analyse opens into its two subtasks', async () => {
      await expect(nested.queryByText('analyse.risk')).toBeNull();
      await userEvent.click(nested.getByRole('button', { name: 'Open analyse' }));
      await expect(nested.getByText('analyse.risk')).toBeInTheDocument();
    });
    await step('Picking a task sends its key', async () => {
      await userEvent.click(nested.getByRole('button', { name: /analyse\.risk/, pressed: false }));
      await expect(args.onAction).toHaveBeenCalledWith('select', 'analyse.risk');
    });
    const layers = within(canvas.getByRole('group', { name: 'Layer access · many bars on a row' }));
    await step('Picking a bar sends the bar\'s key, not its row\'s', async () => {
      await userEvent.click(layers.getByRole('button', { name: 'fetch_source · attempt 1 · 503' }));
      await expect(args.onAction).toHaveBeenLastCalledWith('select', 'fetch_source#1');
      await expect(layers.getByRole('button', { name: 'fetch_source · attempt 1 · 503' })).toHaveAttribute('aria-pressed', 'true');
    });
  },
};
