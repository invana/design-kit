import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Item, ItemActions, ItemContent, ItemTitle, Kbd as KbdKey, KbdGroup } from '@invana/ui';

import data from '../../../../fixtures/ui/kbd.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Variant } from '../../../_story/variant-grid';

interface KbdVariant extends Variant {
  /** The action the keys perform, when they sit beside one. */
  label?: string;
  keys: string[];
}

const VARIANTS = data as KbdVariant[];

interface Args {
  variant: string;
}

const group = (keys: string[], indent = '') =>
  [`${indent}<KbdGroup>`, ...keys.map((k) => `${indent}  <Kbd>${k}</Kbd>`), `${indent}</KbdGroup>`].join('\n');

const meta = {
  title: 'UI/UI/Kbd',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [importsFor(picked)],
            picked.map((v) => ({
              comment: v.caption,
              call: v.label
                ? [
                    '<Item size="xs">',
                    '  <ItemContent>',
                    `    <ItemTitle>${v.label}</ItemTitle>`,
                    '  </ItemContent>',
                    '  <ItemActions>',
                    group(v.keys, '    '),
                    '  </ItemActions>',
                    '</Item>',
                  ].join('\n')
                : group(v.keys),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All' },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

function importsFor(picked: KbdVariant[]) {
  return picked.some((v) => v.label)
    ? "import { Item, ItemActions, ItemContent, ItemTitle, Kbd, KbdGroup } from '@invana/ui';"
    : "import { Kbd, KbdGroup } from '@invana/ui';";
}

export default meta;
type Story = StoryObj<Args>;

/**
 * A key, or keys pressed together — every variant from `fixtures/ui/kbd.json`. Beside an action
 * the keys sit in an `Item`'s actions, so the label and the shortcut align as a menu row does.
 * Nothing to click: the play checks each cell drew its keys.
 */
export const Kbd: Story = {
  render: ({ variant }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v) => {
        const keys = (
          <KbdGroup>
            {v.keys.map((k) => (
              <KbdKey key={k}>{k}</KbdKey>
            ))}
          </KbdGroup>
        );
        return v.label ? (
          <Item size="xs">
            <ItemContent>
              <ItemTitle>{v.label}</ItemTitle>
            </ItemContent>
            <ItemActions>{keys}</ItemActions>
          </Item>
        ) : (
          keys
        );
      }}
    </VariantGrid>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const v of VARIANTS) {
      const cell = within(canvas.getByRole('group', { name: v.caption }));
      for (const k of v.keys) await expect(cell.getByText(k)).toBeInTheDocument();
    }
  },
};
