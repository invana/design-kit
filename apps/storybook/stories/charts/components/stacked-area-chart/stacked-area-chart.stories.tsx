import type { Meta, StoryObj } from '@storybook/react-vite';
import { StackedAreaChart as Chart, type StackedAreaChartProps } from '@invana/charts';

import data from '../../../../fixtures/charts/stacked-area-chart.json';
import { variantArg } from '../../../_story/source';
import { VariantBoard } from '../../../_story/variant-board';
import { Framed, LiveProps, chartSnippet, chartSource, checkBoard, type ChartVariant } from '../../_chart';

// JSON widens the literal unions; the shape is the chart's own props.
const VARIANTS = data as unknown as ChartVariant<StackedAreaChartProps & Record<string, unknown>>[];

interface Args {
  variant: string;
}

const meta = {
  title: 'Charts/Components/StackedAreaChart',
  parameters: {
    layout: 'padded',
    docs: { source: chartSource(VARIANTS, ["import { StackedAreaChart } from '@invana/charts';"], (v) => chartSnippet('StackedAreaChart', v)) },
  },
  args: { variant: 'All' },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * Records over time, stacked and stepped because a count only moves where a write happened —
 * from `fixtures/charts/stacked-area-chart.json`.
 *
 * - **Growth by model** — Model page, all scope. Each band is named at the right edge and in the legend.
 * - **Growth by type** — one model by node type. A band too thin to carry its name leaves it to
 *   the legend rather than stacking labels.
 * - **One series empty** — Deals keeps its slot and legend entry (its colour passes to no one)
 *   but draws no band and gets no direct label.
 * - **With writes marked** — every import and stitch commit marked where its step is; marks too
 *   close to name side by side keep their rule and leave the name to the hover.
 * - **Live** — a day at a time.
 */
export const StackedAreaChart: Story = {
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v) => (
        <LiveProps variant={v} noun="day">
          {(props) => (
            <Framed panel={v.panel}>
              <Chart {...props} />
            </Framed>
          )}
        </LiveProps>
      )}
    </VariantBoard>
  ),
  play: async ({ canvasElement }) => checkBoard(canvasElement, VARIANTS, 'day'),
};
