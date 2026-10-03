import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { TurnLabel as TurnLabelPart, type TurnLabelProps } from '@invana/assistant';

import data from '../../../../fixtures/assistant/turn-label.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid } from '../../../_story/variant-grid';

interface LabelVariant {
  caption: string;
  props: Omit<TurnLabelProps, 'children'>;
  /** Who is speaking. */
  text: string;
}

const VARIANTS = data as unknown as LabelVariant[];

interface Args {
  variant: string;
}

const meta = {
  title: 'Assistant/Components/TurnLabel',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { TurnLabel } from '@invana/assistant';"],
            picked.map((v) => ({
              comment: v.caption,
              call: `<TurnLabel align="${v.props.align}">${v.text}</TurnLabel>`,
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
 * Who is speaking, over the turn they spoke: the spec's `analyst` over the prompts, at the
 * right, and its `assistant` over the asks. The web variant draws them; the console needs none —
 * see the "Turn labels" conversation in `Assistant/Conversations/ChatSession`.
 */
export const TurnLabel: Story = {
  render: ({ variant }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v) => <TurnLabelPart {...v.props}>{v.text}</TurnLabelPart>}
    </VariantGrid>
  ),
  play: async ({ canvasElement, step }) => {
    await step('Each label names who is speaking', async () => {
      for (const v of VARIANTS) {
        await expect(within(within(canvasElement).getByRole('group', { name: v.caption })).getByText(v.text)).toBeVisible();
      }
    });
  },
};
