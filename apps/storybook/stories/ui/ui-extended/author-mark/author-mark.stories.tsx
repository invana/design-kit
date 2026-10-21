import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { AuthorMark as Component, Stack, type AuthorKind, type AuthorTone } from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/author-mark.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Variant } from '../../../_story/variant-grid';

interface AuthorMarkVariant extends Variant {
  size?: 'sm' | 'md';
  marks: { name: string; kind?: AuthorKind; initials?: string; tone?: AuthorTone }[];
}

const VARIANTS = VARIANTS_JSON as AuthorMarkVariant[];

const meta = {
  title: 'UI/UI Extended/AuthorMark',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { AuthorMark } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              call: v.marks
                .map((m) =>
                  jsx('AuthorMark', {
                    name: m.name,
                    kind: m.kind,
                    initials: m.initials,
                    tone: m.tone,
                    size: v.size,
                  }),
                )
                .join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All' },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<{ variant: string }>;

/**
 * Who wrote it, at the size of a line of text: a person's initials on a soft tint, the
 * assistant's star. The name is the label a screen reader reads and the tooltip shows.
 */
export const AuthorMark: Story = {
  render: ({ variant }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v) => (
        <Stack direction="row" gap="sm" align="center">
          {v.marks.map((m) => (
            <Component key={m.name} {...m} {...(v.size ? { size: v.size } : {})} />
          ))}
        </Stack>
      )}
    </VariantGrid>
  ),
  play: async ({ canvasElement }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'People and the assistant' }));
    await expect(cell.getByRole('img', { name: 'Priya Nair' })).toHaveTextContent('PN');
    await expect(cell.getByRole('img', { name: 'Assistant' })).toHaveTextContent('');
  },
};
