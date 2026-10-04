import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { GanttBlock } from '@invana/blocks';

import { BLOCK_VARIANTS } from '../../../../fixtures/blocks';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { blockSource, Streamed, streamImports } from '../../../_story/stream';
import { VariantGrid } from '../../../_story/variant-grid';

/** The gantt read by task — every variant of its grid that is not Layer access. */
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
            streamImports(picked, ["import { GanttBlock } from '@invana/blocks';"]),
            picked.map((v) =>
              blockSource(v, {
                setup: "// 'select' with the task's key when a row is picked.\nconst onAction = (action, value) => {};",
                call: (spec) => jsx('GanttBlock', { spec, onAction: 'onAction' }),
              }),
            ),
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
 * **Run progress** — the `gantt` block read by task, the JSON a board panel or an answer turn
 * sends. One row per task on the run's clock: a retry's failed attempt left of the one that stuck,
 * a task that never ran as an outline. A task's `subtasks` nest under it (`open` draws it open); a
 * parent with no timing of its own draws the stretch they cover. Hover a row for its card, beside
 * the cursor; pick one and it is sent as `select` with the task's key. The same block read by
 * layer is `Blocks/Components/Gantt/Layer Access`.
 *
 **Live**, the same block streams: the API sends block patches — a task `upsert`ed as it
 * starts and settles, the clock `set` as it ticks, `null` dropping the *now* line at the end — and
 * the block redraws from each spec. A task that arrives marked `open` opens (`analyse`, split
 * mid-run). The same script reaches a conversation as `patch-block` and a board as `patch-panel`.
 */
export const RunProgress: Story = {
  render: ({ variant, onAction }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => (
        <Streamed spec={v.spec} stream={v.stream}>
          {(spec) => (
            <GanttBlock
              spec={spec}
              onAction={(action, value) => {
                onAction(action, value);
                log('onAction', { action, value });
              }}
            />
          )}
        </Streamed>
      )}
    </VariantGrid>
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
    const live = within(canvas.getByRole('group', { name: 'Live · a run streaming' }));
    await step('The live run streams to its end', async () => {
      await waitFor(() => expect(live.getByRole('status')).not.toHaveTextContent(/^0 \//), { timeout: 3000 });
      await userEvent.click(live.getByRole('button', { name: 'Skip to end' }));
      await expect(live.getByRole('status')).toHaveTextContent(/^(\d+) \/ \1 updates$/);
      await expect(live.getByText('compose')).toBeInTheDocument();
    });
    await step('A task that arrives open opens', async () => {
      await expect(live.getByText('analyse.risk')).toBeInTheDocument();
    });
  },
};
