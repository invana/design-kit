import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { KindChip as Component, PropertyList, PropertyRow, type RunKind } from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/kind-chip.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Variant } from '../../../_story/variant-grid';

interface KindVariant extends Variant {
  chips: { kind: RunKind; note: string }[];
}

const VARIANTS = VARIANTS_JSON as KindVariant[];

interface Args {
  variant: string;
}

const meta = {
  title: 'UI/UI Extended/KindChip',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { KindChip, PropertyList, PropertyRow } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { kinds: v.chips },
              call: [
                '<PropertyList labelWidth={92}>',
                '  {kinds.map(({ kind, note }) => (',
                '    <PropertyRow key={kind} label={<KindChip kind={kind} />}>{note}</PropertyRow>',
                '  ))}',
                '</PropertyList>',
              ].join('\n'),
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
 * What kind of run a row is. Five kinds ship, and the sixth is the point: the vocabulary belongs
 * to the product, so an unknown value renders rather than throwing the journal off.
 *
 * Neutral on purpose — a kind is not a status. Every one of these is equally ordinary, and the row
 * already carries a status dot to say how it ended.
 */
export const KindChip: Story = {
  render: ({ variant }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v) => (
        <PropertyList labelWidth={92}>
          {v.chips.map(({ kind, note }) => (
            <PropertyRow key={kind} label={<Component kind={kind} />}>
              {note}
            </PropertyRow>
          ))}
        </PropertyList>
      )}
    </VariantGrid>
  ),
  play: async ({ canvasElement }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: VARIANTS[0]!.caption }));
    // The unknown kind still draws.
    await expect(cell.getByText('simulate')).toBeInTheDocument();
  },
};
