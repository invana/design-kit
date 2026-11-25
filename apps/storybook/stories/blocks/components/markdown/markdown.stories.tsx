import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { MarkdownBlock } from '@invana/blocks';

import { BLOCK_VARIANTS } from '../../../../fixtures/blocks';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid } from '../../../_story/variant-grid';

const VARIANTS = BLOCK_VARIANTS.markdown;

interface Args {
  variant: string;
}

const meta = {
  title: 'Blocks/Components/Markdown',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { MarkdownBlock } from '@invana/blocks';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { spec: v.spec },
              call: jsx('MarkdownBlock', {
                spec: 'spec',
              }),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All' },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * An answer a model wrote in Markdown — lists, code, tables, links — in the kit's type. Raw HTML
 * is dropped, never run. For an answer that leads with a figure and cites sources, use Narrative.
 */
export const Markdown: Story = {
  render: ({ variant }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v) => <MarkdownBlock spec={v.spec} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, step }) => {
    const cell = (caption: string) => within(within(canvasElement).getByRole('group', { name: caption }));
    await step('Lists and code draw as lists and code', async () => {
      const c = cell('Lists and code');
      await expect(c.getByRole('list')).toBeVisible();
      await expect(c.getByText(/MATCH \(a:airport\)/)).toBeVisible();
    });
    await step('Raw HTML is dropped', async () => {
      const c = cell('Raw HTML is dropped');
      await expect(c.queryByText('the tag')).toBeNull();
      await expect(canvasElement.querySelector('script')).toBeNull();
    });
  },
};
