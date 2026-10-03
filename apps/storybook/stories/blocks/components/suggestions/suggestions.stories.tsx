import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { SuggestionsAsk } from '@invana/blocks';

import { BLOCK_VARIANTS } from '../../../../fixtures/blocks';
import { LiveBlock, type BlockAction } from '../../../_story/live-block';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid } from '../../../_story/variant-grid';

const VARIANTS = BLOCK_VARIANTS.suggestions;

interface Args {
  variant: string;
  onAction: BlockAction;
}

const meta = {
  title: 'Blocks/Components/Suggestions',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { SuggestionsAsk } from '@invana/blocks';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { spec: v.spec },
              setup: v.state === 'answered' ? undefined : '// Picking one is the `reply` with its words.\nconst onAction = (action, value) => { /* "reply", "Compare with Q3 last year" */ };',
              call: jsx('SuggestionsAsk', {
                spec: 'spec',
                state: v.state ? { literal: v.state } : undefined,
                value: v.value === undefined ? undefined : JSON.stringify(v.value),
                onAction: v.state === 'answered' ? undefined : 'onAction',
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
 * Follow-ups, each a whole next question; picking one is the `reply` with its words.
 */
export const Suggestions: Story = {
  render: ({ variant, onAction }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveBlock component={SuggestionsAsk} variant={v} onAction={onAction} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = (caption: string) => within(within(canvasElement).getByRole('group', { name: caption }));
    const c = cell('Chips');
    await step('Pick a follow-up', async () => {
      await userEvent.click(c.getByRole('button', { name: 'Compare with Q3 last year' }));
      await expect(args.onAction).toHaveBeenCalledWith('reply', 'Compare with Q3 last year');
      await expect(c.getByRole('list', { name: 'Events' })).toHaveTextContent('["reply", "Compare with Q3 last year"]');
    });
  },
};
