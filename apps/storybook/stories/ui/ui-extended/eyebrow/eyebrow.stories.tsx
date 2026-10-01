import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Eyebrow as Component, TypographyMuted, type EyebrowProps } from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/eyebrow.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Variant } from '../../../_story/variant-board';

interface EyebrowVariant extends Variant {
  props: Pick<EyebrowProps, 'tone'> & { aside?: string };
  text: string;
  /** What the eyebrow names. */
  body: string;
  mutedBody?: boolean;
}

const VARIANTS = VARIANTS_JSON as EyebrowVariant[];

interface Args {
  variant: string;
}

const meta = {
  title: 'UI/UI Extended/Eyebrow',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { Eyebrow, TypographyMuted } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              call: [
                `${jsx('Eyebrow', {
                  tone: v.props.tone ? { literal: v.props.tone } : undefined,
                  aside: v.props.aside ? { literal: v.props.aside } : undefined,
                }).replace(/ \/>$/, '>')}${v.text}</Eyebrow>`,
                v.mutedBody ? `<TypographyMuted>${v.body}</TypographyMuted>` : v.body,
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
 * The smallest heading in the system — a label over the thing it names, at a weight that stays
 * subordinate to the panel's own title.
 *
 * Three tones and an `aside`: muted for a label being scanned past, foreground when it titles a
 * card with no other heading, accent when it names something the reader is being taught. The
 * `aside` keeps a count or a position on the right without the call site building its own row.
 */
export const Eyebrow: Story = {
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v) => (
        <>
          <Component {...v.props}>{v.text}</Component>
          {v.mutedBody ? <TypographyMuted>{v.body}</TypographyMuted> : v.body}
        </>
      )}
    </VariantBoard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const v of VARIANTS) {
      await expect(within(canvas.getByRole('group', { name: v.caption })).getByText(v.text)).toBeInTheDocument();
    }
  },
};
