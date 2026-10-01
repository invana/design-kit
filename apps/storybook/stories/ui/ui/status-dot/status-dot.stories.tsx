import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { PropertyList, PropertyRow, StatusDot as StatusDotPart, type StatusDotProps } from '@invana/ui';

import data from '../../../../fixtures/ui/status-dot.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Variant } from '../../../_story/variant-board';

interface Dot {
  tone: NonNullable<StatusDotProps['tone']>;
  size?: NonNullable<StatusDotProps['size']>;
  /** The accessible name, when nothing beside the dot says the state. */
  label?: string;
  /** Written beside the dot — the row's label. */
  name?: string;
  note?: string;
}

interface DotVariant extends Variant {
  dots: Dot[];
}

const VARIANTS = data as DotVariant[];

interface Args {
  variant: string;
}

const call = (d: Dot) =>
  jsx('StatusDot', {
    tone: { literal: d.tone },
    size: d.size ? { literal: d.size } : undefined,
    label: d.label ? { literal: d.label } : undefined,
  });

const meta = {
  title: 'UI/UI/StatusDot',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { PropertyList, PropertyRow, StatusDot } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              call: v.dots.some((d) => d.name)
                ? [
                    '<PropertyList>',
                    ...v.dots.map((d) => `  <PropertyRow label="${d.name}">${call(d)} ${d.note ?? ''}</PropertyRow>`),
                    '</PropertyList>',
                  ].join('\n')
                : v.dots.map(call).join('\n'),
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
 * A state as a dot — every variant from `fixtures/ui/status-dot.json`. The state is always
 * written beside the dot, or given as its `label`: colour is never the only thing carrying it.
 * No callbacks; the play checks every cell drew.
 */
export const StatusDot: Story = {
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v) =>
        v.dots.some((d) => d.name) ? (
          <PropertyList labelWidth="auto">
            {v.dots.map((d) => (
              <PropertyRow key={`${d.tone}-${d.size}`} label={d.name}>
                <StatusDotPart tone={d.tone} size={d.size} /> {d.note}
              </PropertyRow>
            ))}
          </PropertyList>
        ) : (
          v.dots.map((d) => <StatusDotPart key={d.tone} tone={d.tone} size={d.size} label={d.label} />)
        )
      }
    </VariantBoard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const v of VARIANTS) await expect(canvas.getByRole('group', { name: v.caption })).toBeInTheDocument();
    await expect(within(canvas.getByRole('group', { name: 'Default' })).getByRole('img', { name: 'Running' })).toBeInTheDocument();
    await expect(within(canvas.getByRole('group', { name: 'Tones' })).getByText('warning')).toBeInTheDocument();
  },
};
