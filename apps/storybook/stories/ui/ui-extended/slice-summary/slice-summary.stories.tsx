import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { SliceSummary, type SliceSummaryProps } from '@invana/ui';

import VARIANTS from '../../../../fixtures/ui-extended/slice-summary.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid } from '../../../_story/variant-grid';

interface Args {
  variant: string;
}

const meta = {
  title: 'UI/UI Extended/SliceSummary',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { SliceSummary } from '@invana/ui';"],
            picked.map((v) => {
              const p = v.props as SliceSummaryProps;
              return {
                comment: v.caption,
                data: { ...(p.select ? { select: p.select } : {}), ...(p.declaredAxes ? { declaredAxes: p.declaredAxes } : {}) },
                call: jsx('SliceSummary', {
                  variant: p.variant ? { literal: p.variant } : undefined,
                  modelLabel: p.modelLabel ? { literal: p.modelLabel } : undefined,
                  select: p.select ? 'select' : undefined,
                  declaredAxes: p.declaredAxes ? 'declaredAxes' : undefined,
                }).replace('<SliceSummary  />', '<SliceSummary />'),
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
 * What a rule narrows to, stated so the axis is never in doubt, from
 * `fixtures/ui-extended/slice-summary.json`. **The axis is always named** — `time 2026-01-01 →
 * 2026-06-30 · axis signed_at`, never just the dates. **An undeclared axis is shown, not hidden**:
 * `AirRoutes` sliced by time, a model that declares no valid time, renders the illegal state on the
 * way to being refused. `variant="line"` is what a `RuleRow` renders — the same description from
 * the same function.
 */
export const SliceSummaryStory: Story = {
  name: 'SliceSummary',
  render: ({ variant }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v) => <SliceSummary {...(v.props as SliceSummaryProps)} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const v of VARIANTS) await expect(canvas.getByRole('group', { name: v.caption })).toBeInTheDocument();
    const line = within(canvas.getByRole('group', { name: VARIANTS[0].caption }));
    await expect(line.getAllByText(/signed_at/).length).toBeGreaterThan(0);
  },
};
