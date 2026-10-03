import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { RuleRow, type RuleRowProps } from '@invana/ui';

import VARIANTS from '../../../../fixtures/ui-extended/rule-row.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid } from '../../../_story/variant-grid';

interface Args {
  variant: string;
}

const meta = {
  title: 'UI/UI Extended/RuleRow',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { RuleRow } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { rules: v.rules },
              call: 'rules.map((rule) => <RuleRow key={rule.match} {...rule} />)',
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
 * One rule read as a sentence — what it matches, whether it allows, and what it narrows — the
 * `EU · H1 2026` world and the guardrail it sits inside, as the Worlds drawer prints them, from
 * `fixtures/ui-extended/rule-row.json`. **Deny is the loud one**: an allow sits muted, a deny takes
 * the destructive token. **The axis is always named** — `time … · axis signed_at`, never just the
 * dates. A row with no selectors is one line tall; the sub-lines hang under the match.
 */
export const RuleRowStory: Story = {
  name: 'RuleRow',
  render: ({ variant }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v) => v.rules.map((rule, i) => <RuleRow key={i} {...(rule as RuleRowProps)} />)}
    </VariantGrid>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const v of VARIANTS) {
      const cell = within(canvas.getByRole('group', { name: v.caption }));
      await expect(cell.getAllByTitle(v.rules[0].match).length).toBeGreaterThan(0);
    }
  },
};
