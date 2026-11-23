import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { OverflowMenu as Component } from '@invana/ui';

import DATA from '../../../../fixtures/ui-extended/overflow-menu.json';
import { json, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Variant } from '../../../_story/variant-grid';

interface Item {
  key: string;
  label: string;
  destructive?: boolean;
  disabled?: boolean;
  separatorBefore?: boolean;
}

interface MenuVariant extends Variant {
  label: string;
  items: Item[];
}

const VARIANTS = DATA as unknown as MenuVariant[];

interface Args {
  variant: string;
  onSelect: (key: string) => void;
}

const meta = {
  title: 'UI/UI Extended/OverflowMenu',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { OverflowMenu } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              setup: [
                '// Each item does its own thing when picked.',
                `const items = [\n${v.items
                  .map(
                    (i) =>
                      `  { key: ${json(i.key)}, label: ${json(i.label)}, onSelect: () => ${i.key}()${i.destructive ? ', destructive: true' : ''}${i.separatorBefore ? ', separatorBefore: true' : ''}${i.disabled ? ', disabled: true' : ''} },`,
                  )
                  .join('\n')}\n];`,
              ].join('\n'),
              call: `<OverflowMenu label=${json(v.label)} items={items} />`,
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onSelect: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * The ⋯ at the end of a row, from `fixtures/ui-extended/overflow-menu.json`. Its accessible name
 * says what it acts on. Pick an item: the story reports its key.
 */
export const OverflowMenu: Story = {
  render: (args) => (
    <VariantGrid variants={VARIANTS} variant={args.variant}>
      {(v, log) => (
        <Component
          label={v.label}
          items={v.items.map((i) => ({
            ...i,
            onSelect: () => {
              args.onSelect(i.key);
              log('onSelect', i.key);
            },
          }))}
        />
      )}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: VARIANTS[0].caption }));
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(cell.getByRole('button', { name: 'More for airways' }));
    await userEvent.click(await page.findByRole('menuitem', { name: 'Check' }));
    await expect(args.onSelect).toHaveBeenCalledWith('check');
  },
};
