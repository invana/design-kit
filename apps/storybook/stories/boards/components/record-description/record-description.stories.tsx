import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { RecordDescription as Part, type RecordDescriptionProps } from '@invana/boards';
import { RecordHeader } from '@invana/ui';

import data from '../../../../fixtures/board/record-description.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Variant } from '../../../_story/variant-grid';

interface DescriptionVariant extends Variant {
  /** The header it sits under. */
  crumbs: string[];
  props: { description: string; details?: NonNullable<RecordDescriptionProps['details']> };
}

const VARIANTS = data as unknown as DescriptionVariant[];

interface Args {
  variant: string;
}

const meta = {
  title: 'Boards/Components/RecordDescription',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { RecordDescription } from '@invana/boards';", "import { RecordHeader } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { crumbs: v.crumbs, description: v.props.description, details: v.props.details },
              call: `<>\n  <RecordHeader crumbs={crumbs} />\n  ${jsx('RecordDescription', {
                description: 'description',
                details: v.props.details ? 'details' : undefined,
              })}\n</>`,
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
 * A record's description, one line under its header — from
 * `fixtures/board/record-description.json`. `More` shows the whole description and the
 * record's facts; a short description with no facts has nothing more to show, so no `More`.
 * The toggle is the part's own state: it sends nothing.
 */
export const RecordDescription: Story = {
  render: ({ variant }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v) => (
        <div>
          <RecordHeader crumbs={v.crumbs} />
          <Part description={v.props.description} details={v.props.details} />
        </div>
      )}
    </VariantGrid>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const cell = within(canvas.getByRole('group', { name: 'Default' }));
    await step('More shows the facts', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'More' }));
      await expect(cell.getByRole('button', { name: 'Less' })).toHaveAttribute('aria-expanded', 'true');
      await expect(cell.getByText('27 Sep 2026, 11:40')).toBeInTheDocument();
    });
    await step('Less folds them away', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Less' }));
      await expect(cell.queryByText('27 Sep 2026, 11:40')).toBeNull();
    });
    await step('A short description has no More', async () => {
      const short = within(canvas.getByRole('group', { name: 'Short, no details' }));
      await expect(short.queryByRole('button', { name: 'More' })).toBeNull();
    });
  },
};
