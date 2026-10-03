import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sparkline as Chart, type SparklineProps } from '@invana/charts';

import data from '../../../../fixtures/charts/sparkline.json';
import { variantArg } from '../../../_story/source';
import { VariantGrid } from '../../../_story/variant-grid';
import { Framed, LiveProps, chartSnippet, chartSource, checkGrid, type ChartVariant } from '../../_chart';

// JSON widens the literal unions; the shape is the chart's own props.
const VARIANTS = data as unknown as ChartVariant<SparklineProps & Record<string, unknown>>[];

interface Args {
  variant: string;
}

const meta = {
  title: 'Charts/Components/Sparkline',
  parameters: {
    layout: 'padded',
    docs: { source: chartSource(VARIANTS, ["import { Sparkline } from '@invana/charts';"], (v) => chartSnippet('Sparkline', v)) },
  },
  args: { variant: 'All' },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * The shape of a series, small enough to sit inside a row — from `fixtures/charts/sparkline.json`.
 * No axis, no labels: it answers *which way, and how steadily*; the number beside it answers
 * *how much*. SVG, not canvas, because a list carries dozens. The live cell adds a week at a time.
 */
export const Sparkline: Story = {
  render: ({ variant }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v) => (
        <LiveProps variant={v} noun="week">
          {(props) => (
            <Framed panel={v.panel}>
              <Chart {...props} />
            </Framed>
          )}
        </LiveProps>
      )}
    </VariantGrid>
  ),
  play: async ({ canvasElement }) => checkGrid(canvasElement, VARIANTS, 'week'),
};
