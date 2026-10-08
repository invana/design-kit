import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { TableBlock } from '@invana/blocks';

import { BLOCK_VARIANTS, type BlockVariant } from '../../../../fixtures/blocks';
import type { BlockAction } from '../../../_story/live-block';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log } from '../../../_story/variant-grid';

const VARIANTS = BLOCK_VARIANTS.table;

interface Args {
  variant: string;
  onAction: BlockAction;
}

/**
 * A table as its shell holds it: the story owns `selected`, the way a consumer does, and moves
 * it to the row a reader picks.
 */
function LiveTable({ variant, onAction, log }: { variant: BlockVariant<'table'>; onAction: BlockAction; log: Log }) {
  const [selected, setSelected] = React.useState(variant.spec.selected);
  const act: BlockAction = (action, value) => {
    onAction(action, value);
    log('onAction', value === undefined ? [action] : [action, value]);
    if (action === 'select') setSelected(String(value));
  };
  return <TableBlock spec={{ ...variant.spec, selected }} onAction={act} seamless={variant.seamless} />;
}

const meta = {
  title: 'Blocks/Components/Table',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { TableBlock } from '@invana/blocks';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { spec: v.spec },
              setup: '// `select` carries the picked row\'s key — move `selected` to it; `open` asks for every row.\nconst onAction = (action, value) => { /* "select", "translate" */ };',
              call: jsx('TableBlock', {
                spec: 'spec',
                onAction: 'onAction',
                // The assistant sets it; a board panel or a page section does not.
                seamless: v.seamless ? 'true' : undefined,
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
 * The first rows of a longer table and how many there are — the Table preview page of the Design
 * Kit Spec. `Open all` sends `open`; with `rowKey` a click sends `select` with the row's key, and
 * the story moves `selected` to it as a consumer would.
 */
export const Table: Story = {
  render: ({ variant, onAction }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveTable variant={v} onAction={onAction} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = (caption: string) => within(within(canvasElement).getByRole('group', { name: caption }));
    const c = cell('Selectable');
    await step('Pick a row: the selection moves to it', async () => {
      await userEvent.click(c.getByRole('cell', { name: 'translate' }));
      await expect(args.onAction).toHaveBeenCalledWith('select', 'translate');
      await expect(c.getByRole('cell', { name: 'translate' }).closest('tr')).toHaveAttribute('aria-selected', 'true');
      await expect(c.getByRole('cell', { name: 'execute' }).closest('tr')).toHaveAttribute('aria-selected', 'false');
    });
    await step('Open every row', async () => {
      await userEvent.click(cell('First rows + open all').getByRole('button', { name: /open all/i }));
      await expect(args.onAction).toHaveBeenCalledWith('open', undefined);
    });
  },
};
