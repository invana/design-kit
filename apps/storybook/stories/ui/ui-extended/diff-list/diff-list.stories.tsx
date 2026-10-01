import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { DiffList as Component, DiffRow, type DiffOp } from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/diff-list.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Variant } from '../../../_story/variant-board';

interface DiffVariant extends Variant {
  rows: { op: DiffOp; kind: string; text: string }[];
}

const VARIANTS = VARIANTS_JSON as DiffVariant[];

interface Args {
  variant: string;
}

const meta = {
  title: 'UI/UI Extended/DiffList',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { DiffList, DiffRow } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { rows: v.rows },
              call: [
                '<DiffList>',
                '  {rows.map(({ op, kind, text }) => (',
                '    <DiffRow key={text} op={op} kind={kind}>{text}</DiffRow>',
                '  ))}',
                '</DiffList>',
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

/** What a change adds, alters and removes. The sign is spelled out per row — colour alone must not decide an approval. */
export const DiffList: Story = {
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v) => (
        <Component>
          {v.rows.map(({ op, kind, text }) => (
            <DiffRow key={text} op={op} kind={kind}>
              {text}
            </DiffRow>
          ))}
        </Component>
      )}
    </VariantBoard>
  ),
  play: async ({ canvasElement }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: VARIANTS[0]!.caption }));
    for (const { text } of VARIANTS[0]!.rows) await expect(cell.getByText(text)).toBeInTheDocument();
  },
};
