import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ScopeBlock } from '@invana/blocks';

import { BLOCK_VARIANTS } from '../../../../fixtures/blocks';
import { LiveBlock, type BlockAction } from '../../../_story/live-block';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard } from '../../../_story/variant-board';

const VARIANTS = BLOCK_VARIANTS.scope;

interface Args {
  variant: string;
  onAction: BlockAction;
}

const meta = {
  title: 'Blocks/Components/Scope',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { ScopeBlock } from '@invana/blocks';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { spec: v.spec },
              setup: '// A part changed in place is sent as `scope` with `{ part, value }`.\nconst onAction = (action, value) => { /* "scope", { part: 0, value: "Q4 2026" } */ };',
              call: jsx('ScopeBlock', {
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
 * Period, filters, population and freshness, each edited in place and sent as the `scope` action
 * with `{ part, value }`.
 */
export const Scope: Story = {
  render: ({ variant, onAction }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveBlock component={ScopeBlock} variant={v} onAction={onAction} log={log} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = (caption: string) => within(within(canvasElement).getByRole('group', { name: caption }));
    const c = cell('Editable in place');
    await step('Change the period in place', async () => {
      await userEvent.click(c.getByRole('button', { name: 'Q3 2026' }));
      const input = c.getByRole('textbox', { name: 'Change Q3 2026' });
      await userEvent.clear(input);
      await userEvent.type(input, 'Q4 2026{Enter}');
      await expect(args.onAction).toHaveBeenCalledWith('scope', { part: 0, value: 'Q4 2026' });
      await expect(c.getByRole('list', { name: 'Events' })).toHaveTextContent('["scope", { "part": 0, "value": "Q4 2026" }]');
    });
  },
};
