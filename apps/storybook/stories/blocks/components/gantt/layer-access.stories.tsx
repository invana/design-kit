import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { GanttBlock } from '@invana/blocks';

import { BLOCK_VARIANTS } from '../../../../fixtures/blocks';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { blockSource, Streamed, streamImports } from '../../../_story/stream';
import { VariantGrid } from '../../../_story/variant-grid';

/** The gantt read by layer — the Layer access variants of its grid. */
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
            streamImports(picked, ["import { GanttBlock } from '@invana/blocks';"]),
            picked.map((v) =>
              blockSource(v, {
                setup: "// 'select' with the bar's key when a bar is picked — \"fetch_source#1\".\nconst onAction = (action, value) => {};",
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
 * **Layer access** — the same `gantt` block read by layer: what a run reached, and what it was
 * stopped from reaching. A row per layer opens into its participants (`subtasks`); each holds the
 * `segments` of the tasks that reached it, painted by `palette`, with a `note` under the name, a
 * `chip` at the end and a hover card of its own. A bar a rule stopped is `refused` — struck through,
 * never mistaken for skipped; a plan read before it runs is `scale: "seq"`, its bars `dashed`
 * (declared). A gate is a `seam`. Pick a bar and it is sent as `select` with its key.
 *
 **Live**, a participant arrives when a task first reaches it and each bar grows from its
 * `upsert` as the clock ticks; the gate is `push`ed onto `seams` once it has held.
 */
export const LayerAccess: Story = {
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
    const live = within(canvas.getByRole('group', { name: 'Layer access · live' }));
    await step('The live run reaches every layer', async () => {
      await waitFor(() => expect(live.getByRole('status')).not.toHaveTextContent(/^0 \//), { timeout: 3000 });
      await userEvent.click(live.getByRole('button', { name: 'Skip to end' }));
      await expect(live.getByRole('status')).toHaveTextContent(/^(\d+) \/ \1 updates$/);
      await expect(live.getByRole('button', { name: 'fetch_source · attempt 1 · 503' })).toBeInTheDocument();
      await expect(live.getByText('approval')).toBeInTheDocument();
    });
  },
};
