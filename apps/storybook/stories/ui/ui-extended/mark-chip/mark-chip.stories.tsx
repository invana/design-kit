import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { MarkChip as Component, PropertyList, PropertyRow, type MarkTone } from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/mark-chip.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Variant } from '../../../_story/variant-board';

interface MarkVariant extends Variant {
  marks: { mark: string; tone?: MarkTone; note: string }[];
}

const VARIANTS = VARIANTS_JSON as MarkVariant[];

interface Args {
  variant: string;
}

const meta = {
  title: 'UI/UI Extended/MarkChip',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { MarkChip, PropertyList, PropertyRow } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { marks: v.marks },
              call: [
                '<PropertyList labelWidth={112}>',
                '  {marks.map(({ mark, tone, note }) => (',
                '    <PropertyRow key={mark} label={<MarkChip tone={tone}>{mark}</MarkChip>}>{note}</PropertyRow>',
                '  ))}',
                '</PropertyList>',
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
 * What happened to a row that its own columns cannot say — and these are the rows a reader opened
 * the trace for.
 *
 * The tone is the severity of the exception, not of the step: a step that took two attempts and
 * succeeded is a warning mark on a successful row, because the retry is the thing worth finding.
 */
export const MarkChip: Story = {
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v) => (
        <PropertyList labelWidth={112}>
          {v.marks.map(({ mark, tone, note }) => (
            <PropertyRow key={mark} label={<Component tone={tone}>{mark}</Component>}>
              {note}
            </PropertyRow>
          ))}
        </PropertyList>
      )}
    </VariantBoard>
  ),
  play: async ({ canvasElement }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: VARIANTS[0]!.caption }));
    for (const { mark } of VARIANTS[0]!.marks) await expect(cell.getByText(mark)).toBeInTheDocument();
  },
};
