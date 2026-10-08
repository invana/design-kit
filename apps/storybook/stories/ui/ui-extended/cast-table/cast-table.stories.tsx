import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Card, CardContent, CastTable as Component, type CastTableProps } from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/cast-table.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Variant } from '../../../_story/variant-grid';

interface CastVariant extends Variant {
  /** Inside a card, where `bordered={false}` lets the card be the frame. */
  card?: boolean;
  props: Pick<CastTableProps, 'cast' | 'resolved' | 'readOnly' | 'seamless' | 'bordered'>;
}

const VARIANTS = VARIANTS_JSON as CastVariant[];

interface Args {
  variant: string;
}

const meta = {
  title: 'UI/UI Extended/CastTable',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { Card, CardContent, CastTable } from '@invana/ui';"],
            picked.map((v) => {
              const { cast, resolved, readOnly, seamless, bordered } = v.props;
              const table = jsx('CastTable', {
                cast: cast ? 'cast' : undefined,
                resolved: resolved ? 'resolved' : undefined,
                readOnly: readOnly ? 'true' : undefined,
                seamless: seamless ? 'true' : undefined,
                bordered: bordered === false ? 'false' : undefined,
              });
              return {
                comment: v.caption,
                data: cast ? { cast } : { resolved },
                call: v.card
                  ? ['<Card>', '  <CardContent>', table.replace(/^/gm, '    '), '  </CardContent>', '</Card>'].join('\n')
                  : table,
              };
            }),
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
 * `role → resolves to → why this one`, four fixed rows.
 *
 * A plan names a **role**, not a model: `decide` says *how much this matters*, which stays true
 * when the line-up moves, in a way `tier` and a hard-coded model id do not.
 *
 * **All four rows, always — including the ones nothing casts.** A table showing only what was set
 * would make *nothing casts `judge`* invisible, and that is precisely the state worth seeing
 * before a run opens: it falls to a shipped default, which may name a model this Graph is not
 * credentialed for.
 *
 * **The cast is not a bound.** It picks *within* the rules and never widens them: innermost wins,
 * then the resolved address is checked against the effective rules and refused by name if
 * denied. The resolved `decide` row is that refusal — under `Nothing leaves` only a local model
 * may be reached, so a plan asking for a hosted one is refused **before the run opens**, naming
 * the rule. Inside a card, `bordered={false}` draws no box of its own and keeps the cell padding;
 * `seamless` also sets the outer columns flush, for a cast in an assistant's answer.
 */
export const CastTable: Story = {
  render: ({ variant }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v) =>
        v.card ? (
          <Card>
            <CardContent>
              <Component {...v.props} />
            </CardContent>
          </Card>
        ) : (
          <Component {...v.props} />
        )
      }
    </VariantGrid>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const v of VARIANTS) {
      // Four rows, always — the roles nothing casts included.
      await expect(within(canvas.getByRole('group', { name: v.caption })).getByText('judge')).toBeInTheDocument();
    }
  },
};
