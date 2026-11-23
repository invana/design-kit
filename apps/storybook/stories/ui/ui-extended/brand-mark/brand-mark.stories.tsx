import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { BrandMark as Component, Stack } from '@invana/ui';

import DATA from '../../../../fixtures/ui-extended/brand-mark.json';
import { json, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Variant } from '../../../_story/variant-grid';

interface Mark {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
}

interface MarkVariant extends Variant {
  marks: Mark[];
  size?: 'sm' | 'md' | 'lg';
}

const VARIANTS = DATA as unknown as MarkVariant[];

interface Args {
  variant: string;
}

const call = (m: Mark, size?: string) =>
  `<BrandMark name=${json(m.name)}${m.src ? ' src={logo}' : ''}${m.size ?? size ? ` size="${m.size ?? size}"` : ''} />`;

const meta = {
  title: 'UI/UI Extended/BrandMark',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { BrandMark } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              setup: v.marks.some((m) => m.src) ? '// A URL or a data: URI; drawn through <img>, never inlined.\nconst logo = connector.icon;' : undefined,
              call: v.marks.map((m) => call(m, v.size)).join('\n'),
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
 * A logo in a tile, from `fixtures/ui-extended/brand-mark.json`. Without a logo, or when it fails
 * to load, the name's monogram is drawn on a colour the name always picks.
 */
export const BrandMark: Story = {
  render: ({ variant }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v) => (
        <Stack direction="row" gap="md" align="center">
          {v.marks.map((m, i) => (
            <Component key={i} name={m.name} src={m.src} size={m.size ?? v.size} />
          ))}
        </Stack>
      )}
    </VariantGrid>
  ),
  play: async ({ canvasElement }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Monograms' }));
    await expect(cell.getByText('N4')).toBeInTheDocument();
    await expect(cell.getByText('TG')).toBeInTheDocument();
  },
};
