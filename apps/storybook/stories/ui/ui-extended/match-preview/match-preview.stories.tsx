import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { MatchPreview as Component, type MatchPreviewProps } from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/match-preview.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Variant } from '../../../_story/variant-grid';

interface MatchVariant extends Variant {
  props: MatchPreviewProps;
}

const VARIANTS = VARIANTS_JSON as MatchVariant[];

interface Args {
  variant: string;
}

const meta = {
  title: 'UI/UI Extended/MatchPreview',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { MatchPreview } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: v.props.matches?.length ? { matches: v.props.matches } : undefined,
              call: jsx('MatchPreview', {
                pattern: { literal: v.props.pattern },
                matches: v.props.matches ? (v.props.matches.length ? 'matches' : '[]') : undefined,
                loading: v.props.loading ? 'true' : undefined,
              }),
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
 * What an address pattern matches **right now**, resolved against the live catalogue as the
 * pattern is typed.
 *
 * **Narrowing is picking, not writing.** Every control in the rule builder offers what the
 * catalogue holds, so nothing can name something that is not there — and this is the surface that
 * makes that true for the one control which *is* free text.
 *
 * **The near-misses are greyed, not filtered out.** A preview listing only hits cannot tell *this
 * pattern is precise* from *this pattern is wrong*. `Deals@1.0.0` matches today and silently stops
 * applying the next time somebody publishes; seeing the models it passed over is what tells the
 * author to write `Deals@*` instead.
 *
 * **Nothing matched is its own state**, and distinct from a layer with nothing in it: one means
 * the pattern is wrong, the other that the Graph has nothing of that kind configured yet.
 */
export const MatchPreview: Story = {
  render: ({ variant }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v) => <Component {...v.props} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Hits and near-misses are both listed', async () => {
      const v = VARIANTS[1]!;
      const cell = within(canvas.getByRole('group', { name: v.caption }));
      for (const m of v.props.matches!) await expect(cell.getByTitle(m.address)).toBeInTheDocument();
    });
    await step('Nothing matched says so, naming the pattern', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Nothing matched' }));
      await expect(cell.getByText('graph_data/model/Deal')).toBeInTheDocument();
    });
  },
};
