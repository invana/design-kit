import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { EgressList as Component, type EgressListProps } from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/egress-list.json';
import { inline, jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Variant } from '../../../_story/variant-grid';

interface EgressVariant extends Variant {
  props: EgressListProps;
}

const VARIANTS = VARIANTS_JSON as EgressVariant[];

const attrs = (props: object) =>
  Object.fromEntries(Object.entries(props).map(([k, v]) => [k, typeof v === 'string' ? { literal: v } : inline(v)]));

interface Args {
  variant: string;
}

const meta = {
  title: 'UI/UI Extended/EgressList',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { EgressList } from '@invana/ui';"],
            picked.map((v) => ({ comment: v.caption, call: jsx('EgressList', attrs(v.props)) })),
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
 * Per destination: what may be sent, and what was cut.
 *
 * **Egress is declared per destination, on the rule that matched it.** A run-wide setting would
 * have to be the strictest of its destinations, which is the least useful one — so this is always
 * about *one* address, and a surface showing several renders several.
 *
 * **Reading a thing and sending it are different permissions.** A query may filter on
 * `Deal.revenue` while the value never enters a prompt — used to **compute**, not to **reason**.
 * That is why `property_values` being *absent* is worth as much screen as the classes present.
 *
 * **`cut` is what makes it evidence rather than configuration**: what the bound actually withheld
 * during a run. An empty `classes` is drawn in words, because the lens default is `[]`: a blank
 * row would read as *not configured* rather than *nothing may leave*.
 */
export const EgressList: Story = {
  render: ({ variant }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v) => <Component {...v.props} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const v of VARIANTS) {
      const cell = within(canvas.getByRole('group', { name: v.caption }));
      await expect(cell.getByTitle(v.props.to)).toBeInTheDocument();
    }
  },
};
