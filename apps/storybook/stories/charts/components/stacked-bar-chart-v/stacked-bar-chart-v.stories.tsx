import type { Meta, StoryObj } from '@storybook/react-vite';
import { StackedBarChartV as Chart, type StackedBarChartVProps } from '@invana/charts';

import data from '../../../../fixtures/charts/stacked-bar-chart-v.json';
import { variantArg } from '../../../_story/source';
import { VariantGrid } from '../../../_story/variant-grid';
import { Framed, LiveProps, chartSnippet, chartSource, checkGrid, type ChartVariant } from '../../_chart';

// JSON widens the literal unions; the shape is the chart's own props.
const VARIANTS = data as unknown as ChartVariant<StackedBarChartVProps & Record<string, unknown>>[];

interface Args {
  variant: string;
}

const meta = {
  title: 'Charts/Components/StackedBarChartV',
  parameters: {
    layout: 'padded',
    docs: { source: chartSource(VARIANTS, ["import { StackedBarChartV } from '@invana/charts';"], (v) => chartSnippet('StackedBarChartV', v)) },
  },
  args: { variant: 'All' },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * Counts a day, stacked by category — from `fixtures/charts/stacked-bar-chart-v.json`. Hover a
 * day for its breakdown.
 *
 * - **Runs a day** — `served` and `failed` are outcomes, so they wear the status tokens — the one
 *   place status colour belongs on a chart.
 * - **Queries by caller** — callers are categories, so they take data-palette slots in a fixed
 *   order, the same as the Usage table's bars.
 * - **All zero** — thirty empty days say the window is empty instead of an axis of zeros.
 * - **One day only** — the count axis never tops out below five, and a column is no wider than 24px.
 * - **Live** — a day at a time.
 */
export const StackedBarChartV: Story = {
  render: ({ variant }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v) => (
        <LiveProps variant={v} noun="day">
          {(props) => (
            <Framed panel={v.panel}>
              <Chart {...props} />
            </Framed>
          )}
        </LiveProps>
      )}
    </VariantGrid>
  ),
  play: async ({ canvasElement }) => checkGrid(canvasElement, VARIANTS, 'day'),
};
