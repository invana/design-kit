import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarChartH as Chart, type BarChartHProps } from '@invana/charts';

import data from '../../../../fixtures/charts/bar-chart-h.json';
import { variantArg } from '../../../_story/source';
import { VariantGrid } from '../../../_story/variant-grid';
import { Framed, LiveProps, chartSnippet, chartSource, checkGrid, type ChartVariant } from '../../_chart';

// JSON widens the literal unions; the shape is the chart's own props.
const VARIANTS = data as unknown as ChartVariant<BarChartHProps & Record<string, unknown>>[];

interface Args {
  variant: string;
}

const meta = {
  title: 'Charts/Components/BarChartH',
  parameters: {
    layout: 'padded',
    docs: { source: chartSource(VARIANTS, ["import { BarChartH } from '@invana/charts';"], (v) => chartSnippet('BarChartH', v)) },
  },
  args: { variant: 'All' },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * Magnitude, horizontal because the labels are words — from `fixtures/charts/bar-chart-h.json`.
 *
 * - **Default** — provisional. Single series, so no legend: the caption names what is plotted,
 *   and every bar is directly labelled.
 * - **Ranked** — a list read top to bottom: labels in the text colour, values in a column at the
 *   right, a negative contribution in the destructive colour with its length its size.
 * - **Live** — the same bars handed new values each session; play, pause or skip to the end.
 *
 * The chart takes no callbacks: it is read, not picked.
 */
export const BarChartH: Story = {
  render: ({ variant }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v) => (
        <LiveProps variant={v} noun="update">
          {(props) => (
            <Framed panel={v.panel}>
              <Chart {...props} />
            </Framed>
          )}
        </LiveProps>
      )}
    </VariantGrid>
  ),
  play: async ({ canvasElement }) => checkGrid(canvasElement, VARIANTS, 'update'),
};
