import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { PropertyList, PropertyRow } from '@invana/ui';

import VARIANTS from '../../../../fixtures/ui-extended/property-list.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard } from '../../../_story/variant-board';

interface Args {
  variant: string;
}

const meta = {
  title: 'UI/UI Extended/PropertyList',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { PropertyList, PropertyRow } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { rows: v.rows },
              call: [
                `<PropertyList${v.labelWidth ? ` labelWidth="${v.labelWidth}"` : ''}${v.variant ? ` variant="${v.variant}"` : ''}>`,
                '  {rows.map((r) => (',
                '    <PropertyRow key={r.label} label={r.label} mono={r.mono}>{r.value}</PropertyRow>',
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
 * One label column for the whole list, so values line up down the panel — from
 * `fixtures/ui-extended/property-list.json`. `labelWidth="auto"` sizes the column to the widest
 * label; `variant="summary"` sets the rows tight, for a settled answer read at a glance.
 */
export const PropertyListStory: Story = {
  name: 'PropertyList',
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v) => (
        <PropertyList
          labelWidth={v.labelWidth}
          variant={v.variant as 'summary' | undefined}
        >
          {v.rows.map((r) => (
            <PropertyRow key={r.label} label={r.label} mono={r.mono}>
              {r.value}
            </PropertyRow>
          ))}
        </PropertyList>
      )}
    </VariantBoard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const v of VARIANTS) {
      const cell = within(canvas.getByRole('group', { name: v.caption }));
      await expect(cell.getByText(v.rows[0].value)).toBeInTheDocument();
    }
  },
};
