import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Spinner as SpinnerPart, TypographyMuted } from '@invana/ui';

import data from '../../../../fixtures/ui/spinner.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Variant } from '../../../_story/variant-board';

interface SpinnerVariant extends Variant {
  /** px. Kit gap: `Spinner` has no `size` prop, so the story sets it with `style`. */
  size: number;
  label?: string;
}

const VARIANTS = data as SpinnerVariant[];

interface Args {
  variant: string;
}

const meta = {
  title: 'UI/UI/Spinner',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { Spinner, TypographyMuted } from '@invana/ui';"],
            picked.map((v) => {
              const spinner = v.size === 16 ? '<Spinner />' : `<Spinner style={{ width: ${v.size}, height: ${v.size} }} />`;
              return {
                comment: v.caption,
                call: v.label ? `<TypographyMuted>\n  ${spinner} ${v.label}\n</TypographyMuted>` : spinner,
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
 * Work in progress with no measure of how far — every variant from `fixtures/ui/spinner.json`:
 * three sizes, and beside a muted label. It announces itself as `status` "Loading". No callbacks.
 */
export const Spinner: Story = {
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v) => {
        const spinner = <SpinnerPart style={v.size === 16 ? undefined : { width: v.size, height: v.size }} />;
        return v.label ? (
          <TypographyMuted>
            {spinner} {v.label}
          </TypographyMuted>
        ) : (
          spinner
        );
      }}
    </VariantBoard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const v of VARIANTS) {
      const cell = within(canvas.getByRole('group', { name: v.caption }));
      await expect(cell.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
    }
  },
};
