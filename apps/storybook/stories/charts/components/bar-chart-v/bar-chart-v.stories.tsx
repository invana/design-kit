import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarChartV as Chart, type BarChartVProps } from '@invana/charts';

import data from '../../../../fixtures/charts/bar-chart-v.json';
import { variantArg } from '../../../_story/source';
import { VariantBoard } from '../../../_story/variant-board';
import { Framed, LiveProps, chartSnippet, chartSource, checkBoard, type ChartVariant } from '../../_chart';

// JSON widens the literal unions; the shape is the chart's own props.
const VARIANTS = data as unknown as ChartVariant<BarChartVProps & Record<string, unknown>>[];

interface Args {
  variant: string;
}

const meta = {
  title: 'Charts/Components/BarChartV',
  parameters: {
    layout: 'padded',
    docs: { source: chartSource(VARIANTS, ["import { BarChartV } from '@invana/charts';"], (v) => chartSnippet('BarChartV', v)) },
  },
  args: { variant: 'All' },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * One measure over a few periods, vertical because the axis is time — from
 * `fixtures/charts/bar-chart-v.json`.
 *
 * - **Default** — provisional; gridlines and a fixed max.
 * - **Comparison** — the answer-card form: columns take two thirds of their band and stand on a
 *   baseline with square caps against a dashed average; one column carries the emphasis.
 * - **Grouped** — two series side by side in each group, named in a legend that also carries the
 *   target rule. No group is emphasised.
 * - **Target** — a dashed rule across the plot, labelled in a gutter as wide as its label.
 * - **Live** — a week lands at a time.
 */
export const BarChartV: Story = {
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v) => (
        <LiveProps variant={v} noun="week">
          {(props) => (
            <Framed panel={v.panel}>
              <Chart {...props} />
            </Framed>
          )}
        </LiveProps>
      )}
    </VariantBoard>
  ),
  play: async ({ canvasElement }) => checkBoard(canvasElement, VARIANTS, 'week'),
};
