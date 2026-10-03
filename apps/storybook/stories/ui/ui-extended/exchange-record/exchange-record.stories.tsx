import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { ExchangeRecord as Component, PanelBox, type ExchangeOption } from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/exchange-record.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Variant } from '../../../_story/variant-grid';

interface ExchangeVariant extends Variant {
  panel: { title: string; aside: string };
  props: {
    asker: string;
    question: string;
    why: string;
    options: (ExchangeOption & { label: string })[];
    answerer: string;
    answer: string;
    answerNote: string;
  };
}

const VARIANTS = VARIANTS_JSON as ExchangeVariant[];

interface Args {
  variant: string;
}

const meta = {
  title: 'UI/UI Extended/ExchangeRecord',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { ExchangeRecord, PanelBox } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { exchange: v.props },
              call: [
                `<PanelBox title="${v.panel.title}" aside="${v.panel.aside}" flush>`,
                '  <ExchangeRecord {...exchange} />',
                '</PanelBox>',
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
 * The clarification that took a run two rounds, read back as a record.
 *
 * The option nobody took is still drawn. *It chose by promise date* explains nothing; *it was
 * offered two readings of «late» and chose promise date* is what makes the second `parse_intent`
 * on the trace above it obvious.
 *
 * Nothing here is pickable. `ClarifyCard` is the live ask with its controls; this is the same
 * exchange once it has an answer, and a trace is never rewritten.
 */
export const ExchangeRecord: Story = {
  render: ({ variant }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v) => (
        <PanelBox title={v.panel.title} aside={v.panel.aside} flush>
          <Component {...v.props} />
        </PanelBox>
      )}
    </VariantGrid>
  ),
  play: async ({ canvasElement }) => {
    const v = VARIANTS[0]!;
    const cell = within(within(canvasElement).getByRole('group', { name: v.caption }));
    // Every option stays, the one not taken included.
    for (const o of v.props.options) await expect(cell.getAllByText(o.label).length).toBeGreaterThan(0);
  },
};
