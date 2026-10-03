import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { PropertyList, PropertyRow, StatusIcon as StatusIconPart, type StatusIconProps } from '@invana/ui';

import data from '../../../../fixtures/ui/status-icon.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Variant } from '../../../_story/variant-grid';

interface Icon {
  state: StatusIconProps['state'];
  size?: NonNullable<StatusIconProps['size']>;
  label: string;
}

interface IconVariant extends Variant {
  icons: Icon[];
}

const VARIANTS = data as IconVariant[];

interface Args {
  variant: string;
}

const meta = {
  title: 'UI/UI/StatusIcon',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { StatusIcon } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              call: v.icons
                .map((i) =>
                  jsx('StatusIcon', {
                    state: { literal: i.state },
                    size: i.size ? { literal: i.size } : undefined,
                    label: { literal: i.label },
                  }),
                )
                .join('\n'),
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
 * One glyph standing in for the word — every variant from `fixtures/ui/status-icon.json`.
 * `label` is the accessible name and the tooltip: a check for succeeded, a cross for failed, a
 * spinning loader while running, a pause while it waits on approval. No callbacks.
 */
export const StatusIcon: Story = {
  render: ({ variant }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v) =>
        v.icons.length === 1 ? (
          <StatusIconPart state={v.icons[0].state} size={v.icons[0].size} label={v.icons[0].label} />
        ) : (
          <PropertyList labelWidth="auto">
            {v.icons.map((i) => (
              <PropertyRow key={i.label} label={i.size ?? i.state}>
                <StatusIconPart state={i.state} size={i.size} label={i.label} /> {i.label}
              </PropertyRow>
            ))}
          </PropertyList>
        )
      }
    </VariantGrid>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const v of VARIANTS) await expect(canvas.getByRole('group', { name: v.caption })).toBeInTheDocument();
    await expect(
      within(canvas.getByRole('group', { name: 'Default' })).getByRole('img', { name: 'awaiting_approval' }),
    ).toBeInTheDocument();
    await expect(within(canvas.getByRole('group', { name: 'Every state' })).getAllByRole('img')).toHaveLength(8);
  },
};
