import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { HeaderTrail as Component, type HeaderTrailCrumb } from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/header-trail.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Variant } from '../../../_story/variant-grid';

interface TrailVariant extends Variant {
  brand: string;
  crumbs: HeaderTrailCrumb[];
}

const VARIANTS = VARIANTS_JSON as TrailVariant[];

interface Args {
  variant: string;
}

const meta = {
  title: 'UI/UI Extended/HeaderTrail',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { HeaderTrail } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { crumbs: v.crumbs },
              call: jsx('HeaderTrail', { brand: `"${v.brand}"`, crumbs: 'crumbs' }),
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
 * The left of an app header — the brand, then the account and the project — from
 * `fixtures/ui-extended/header-trail.json`. In the narrow cell the trail truncates and the brand
 * keeps its width, so the header never grows wider for it.
 */
export const HeaderTrail: Story = {
  render: ({ variant }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v) => <Component brand={v.brand} crumbs={v.crumbs} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Account and project' }));
    await expect(cell.getByText('Invana')).toBeInTheDocument();
    await expect(cell.getByRole('link', { name: 'chickpea-breeding' })).toHaveAttribute('aria-current', 'page');
  },
};
