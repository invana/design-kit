import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { BrandMark, CatalogCard as Component, Stack } from '@invana/ui';

import DATA from '../../../../fixtures/ui-extended/catalog-card.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Variant } from '../../../_story/variant-grid';

interface Card {
  key: string;
  title: string;
  description: string;
  meta: string[];
}

interface CardVariant extends Variant {
  cards: Card[];
}

const VARIANTS = DATA as unknown as CardVariant[];

interface Args {
  variant: string;
  onClick: (key: string) => void;
}

const meta = {
  title: 'UI/UI Extended/CatalogCard',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { BrandMark, CatalogCard } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { connectors: v.cards },
              call: [
                '{connectors.map((c) => (',
                '  <CatalogCard',
                '    key={c.key}',
                '    media={<BrandMark name={c.title} src={c.icon} size="lg" />}',
                '    title={c.title}',
                '    description={c.description}',
                '    meta={c.meta}',
                '    // the picked connector, to add one of',
                '    onClick={() => onPick(c.key)}',
                '  />',
                '))}',
              ].join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onClick: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * Choices in a catalog, from `fixtures/ui-extended/catalog-card.json`. Each card is one button;
 * the + shows on hover and focus. Pick one: the story reports its key. A long description
 * clamps to two lines.
 */
export const CatalogCard: Story = {
  render: (args) => (
    <VariantGrid variants={VARIANTS} variant={args.variant}>
      {(v, log) => (
        <Stack gap="xs">
          {v.cards.map((c) => (
            <Component
              key={c.key}
              media={<BrandMark name={c.title} size="lg" />}
              title={c.title}
              description={c.description}
              meta={c.meta}
              onClick={() => {
                args.onClick(c.key);
                log('onClick', c.key);
              }}
            />
          ))}
        </Stack>
      )}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: VARIANTS[0].caption }));
    await userEvent.click(cell.getByRole('button', { name: /^Neo4j/ }));
    await expect(args.onClick).toHaveBeenCalledWith('neo4j');
  },
};
