import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { FiltersBlock } from '@invana/blocks';

import { BLOCK_VARIANTS } from '../../../../fixtures/blocks';
import { LiveBlock, type BlockAction } from '../../../_story/live-block';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid } from '../../../_story/variant-grid';

const VARIANTS = BLOCK_VARIANTS.filters;

interface Args {
  variant: string;
  onAction: BlockAction;
}

const meta = {
  title: 'Blocks/Components/Filters',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { FiltersBlock } from '@invana/blocks';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { spec: v.spec },
              setup: '// Each action sends its id.\nconst onAction = (action, id) => { /* "apply" */ };',
              call: jsx('FiltersBlock', {
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
 * Filters an answer found for a table elsewhere — the type, each filter, where they stand — with
 * Apply and Clear, each sent as its id. The answer never holds the rows; the table does.
 */
export const Filters: Story = {
  render: ({ variant, onAction }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveBlock component={FiltersBlock} variant={v} onAction={onAction} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const c = within(within(canvasElement).getByRole('group', { name: 'Found, not applied' }));
    await step('Apply to Records', async () => {
      await expect(c.getByRole('list', { name: 'Filters' })).toHaveTextContent('country = DE');
      await userEvent.click(c.getByRole('button', { name: 'Apply to Records' }));
      await expect(args.onAction).toHaveBeenCalledWith('action', 'apply');
    });
  },
};
