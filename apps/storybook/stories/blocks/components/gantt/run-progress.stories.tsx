import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { GanttBlock } from '@invana/blocks';

import { BLOCK_VARIANTS } from '../../../../fixtures/blocks';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard } from '../../../_story/variant-board';

/** The gantt read by task — every variant of its board that is not Layer access. */
const VARIANTS = BLOCK_VARIANTS.gantt.filter((v) => v.useCase !== 'layers');

interface Args {
  variant: string;
  onAction: (action: string, value?: unknown) => void;
}

const meta = {
  title: 'Blocks/Components/Gantt/Run Progress',
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
              setup: "// 'select' with the task's key when a row is picked.\nconst onAction = (action, value) => {};",
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
 * **Run progress** — the `gantt` block read by task, the JSON a dashboard panel or an answer turn
 * sends. One row per task on the run's clock: a retry's failed attempt left of the one that stuck,
 * a task that never ran as an outline. A task's `subtasks` nest under it (`open` draws it open); a
 * parent with no timing of its own draws the stretch they cover. Hover a row for its card, beside
 * the cursor; pick one and it is sent as `select` with the task's key. The same block read by
 * layer is `Blocks/Components/Gantt/Layer Access`.
 */
export const RunProgress: Story = {
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
  },
};
