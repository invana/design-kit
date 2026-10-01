import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ClampedText as Component, Eyebrow } from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/clamped-text.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Variant } from '../../../_story/variant-board';

interface ClampedVariant extends Variant {
  /** The label over the prose. */
  label: string;
  text: string;
}

const VARIANTS = VARIANTS_JSON as ClampedVariant[];

interface Args {
  variant: string;
}

const meta = {
  title: 'UI/UI Extended/ClampedText',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { ClampedText, Eyebrow } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              call: [`<Eyebrow>${v.label}</Eyebrow>`, '<ClampedText>', `  ${v.text}`, '</ClampedText>'].join('\n'),
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
 * Prose that shows its first few lines and offers the rest in place.
 *
 * The toggle is measured, not guessed: the short paragraph gets no `Show more`, because there is
 * nothing behind it. That is the whole point — a control that reveals nothing teaches the reader
 * to stop pressing it.
 */
export const ClampedText: Story = {
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v) => (
        <>
          <Eyebrow>{v.label}</Eyebrow>
          <Component>{v.text}</Component>
        </>
      )}
    </VariantBoard>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Both paragraphs are in the DOM whole', async () => {
      for (const v of VARIANTS) {
        await expect(within(canvas.getByRole('group', { name: v.caption })).getByText(v.text)).toBeInTheDocument();
      }
    });
    await step('The long one clamps, and opens and closes', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Long — clamps to three lines' }));
      const more = await cell.findByRole('button', { name: 'Show more' });
      await expect(more).toHaveAttribute('aria-expanded', 'false');
      await userEvent.click(more);
      await expect(cell.getByRole('button', { name: 'Show less' })).toHaveAttribute('aria-expanded', 'true');
      await userEvent.click(cell.getByRole('button', { name: 'Show less' }));
      await expect(cell.getByRole('button', { name: 'Show more' })).toBeInTheDocument();
    });
    await step('The short one offers nothing', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Short — no toggle' }));
      await expect(cell.queryByRole('button')).toBeNull();
    });
  },
};
