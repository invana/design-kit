import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { RefusalCard, TypographyInlineCode } from '@invana/ui';

import VARIANTS from '../../../../fixtures/ui-extended/refusal-card.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid } from '../../../_story/variant-grid';

interface Args {
  variant: string;
}

/** The body is a sentence with emphasis in it: JSON holds it as runs of text, strong and code. */
type Run = { text?: string; strong?: string; code?: string };

function Body({ runs }: { runs: Run[] }) {
  return (
    <>
      {runs.map((r, i) =>
        r.strong ? (
          <strong key={i}>{r.strong}</strong>
        ) : r.code ? (
          <TypographyInlineCode key={i}>{r.code}</TypographyInlineCode>
        ) : (
          r.text
        ),
      )}
    </>
  );
}

const asJsx = (runs: Run[]) =>
  runs.map((r) => (r.strong ? `<b>${r.strong}</b>` : r.code ? `<code>${r.code}</code>` : r.text)).join('');

const meta = {
  title: 'UI/UI Extended/RefusalCard',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { RefusalCard } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              call: jsx('RefusalCard', {
                label: { literal: v.label },
                remedy: v.remedy ? { literal: v.remedy } : undefined,
              }).replace(' />', '>').replace(/\n\/>$/, '\n>') + `\n  ${asJsx(v.body)}\n</RefusalCard>`,
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
 * A bound refused the ask **before it ran** — the card names whose rule said no, so the reader
 * knows whose rule to change, from `fixtures/ui-extended/refusal-card.json`. No retry: running it
 * again under the same bounds would be refused again.
 */
export const RefusalCardStory: Story = {
  name: 'RefusalCard',
  render: ({ variant }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v) => (
        <RefusalCard label={v.label} remedy={v.remedy}>
          <Body runs={v.body} />
        </RefusalCard>
      )}
    </VariantGrid>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const v of VARIANTS) {
      const cell = within(canvas.getByRole('group', { name: v.caption }));
      await expect(cell.getByRole('note')).toHaveTextContent(v.label);
    }
  },
};
