import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Page as PageBlock } from '@invana/blocks';
import { answerToPage } from '@invana/assistant';

import { PAGE_VARIANTS, type PageVariant } from '../../../../fixtures/blocks';
import type { BlockAction } from '../../../_story/live-block';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid } from '../../../_story/variant-grid';

const VARIANTS = PAGE_VARIANTS;

/** The page a variant draws: its own spec, or the answer it opens in full. */
const pageOf = (v: PageVariant) => v.spec ?? answerToPage(v.answer!);

interface Args {
  variant: string;
  onAction: BlockAction;
}

const meta = {
  title: 'Blocks/Components/Page',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import { Page } from '@invana/blocks';",
              ...(picked.some((v) => v.answer) ? ["import { answerToPage } from '@invana/assistant';"] : []),
            ],
            picked.map((v) =>
              v.answer
                ? {
                    comment: v.caption,
                    data: { answer: v.answer },
                    setup:
                      '// Keeps the blocks a page draws, in order, under the answer\'s title.\nconst spec = answerToPage(answer);\n// A block\'s action, with the section and block it came from.\nconst onAction = (action, value) => { /* "open", { section: 2, block: 0 } */ };',
                    call: jsx('Page', { spec: 'spec', onAction: 'onAction' }),
                  }
                : {
                    comment: v.caption,
                    data: { spec: v.spec },
                    setup: '// A block\'s action, with the section and block it came from.\nconst onAction = (action, value) => { /* "open", { section: 2, block: 0 } */ };',
                    call: jsx('Page', { spec: 'spec', onAction: 'onAction' }),
                  },
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
 * Blocks laid out as a document: no cards and no borders, a section's title as its rule. Every
 * block is the same JSON a conversation turn or a board panel draws. A long answer opens in
 * full through `answerToPage`, which keeps the blocks a page draws — the citations stay in the
 * conversation.
 */
export const Page: Story = {
  render: ({ variant, onAction }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => (
        <PageBlock
          spec={pageOf(v)}
          onAction={(action, value) => {
            onAction(action, value);
            log('onAction', value === undefined ? [action] : [action, value]);
          }}
        />
      )}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const report = within(within(canvasElement).getByRole('group', { name: 'Report' }));
    await step('Both pages draw, the answer under its title', async () => {
      await expect(report.getByText('Top accounts that raised a round')).toBeVisible();
      await expect(
        within(within(canvasElement).getByRole('group', { name: 'From an answer' })).getByText('Margin by plant, Q3'),
      ).toBeVisible();
    });
    await step("A block's action reaches the page's onAction", async () => {
      await userEvent.click(report.getByRole('button', { name: /open all/i }));
      await expect(args.onAction).toHaveBeenCalledWith('open', { section: 2, block: 0 });
      await expect(report.getByRole('list', { name: 'Events' })).toHaveTextContent('["open", { "section": 2, "block": 0 }]');
    });
  },
};
