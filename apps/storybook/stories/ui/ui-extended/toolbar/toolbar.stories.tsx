import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Toolbar } from '@invana/ui';

import VARIANTS from '../../../../fixtures/ui-extended/toolbar.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard } from '../../../_story/variant-board';

interface Args {
  variant: string;
}

const meta = {
  title: 'UI/UI Extended/Toolbar',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { Toolbar } from '@invana/ui';"],
            picked.map((v) => ({
              comment: `${v.caption} — Toolbar takes no props yet: its lock button, Docs and Source are fixed.`,
              call: '<Toolbar />',
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
 * The canvas toolbar: a lock toggle, then Docs and Source, split by rules. It takes no props
 * and has no callbacks yet, so it shows as it ships.
 */
export const ToolbarStory: Story = {
  name: 'Toolbar',
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {() => <Toolbar />}
    </VariantBoard>
  ),
  play: async ({ canvasElement }) => {
    for (const v of VARIANTS) {
      const cell = within(within(canvasElement).getByRole('group', { name: v.caption }));
      await expect(cell.getByText('Docs')).toBeInTheDocument();
    }
  },
};
