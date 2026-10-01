import type { Meta, StoryObj } from '@storybook/react-vite';
import { DivergingBar as Chart, type DivergingBarProps } from '@invana/charts';

import data from '../../../../fixtures/charts/diverging-bar.json';
import { variantArg } from '../../../_story/source';
import { VariantBoard } from '../../../_story/variant-board';
import { Framed, LiveProps, chartSnippet, chartSource, checkBoard, type ChartVariant } from '../../_chart';

// JSON widens the literal unions; the shape is the chart's own props.
const VARIANTS = data as unknown as ChartVariant<DivergingBarProps & Record<string, unknown>>[];

interface Args {
  variant: string;
}

const meta = {
  title: 'Charts/Components/DivergingBar',
  parameters: {
    layout: 'padded',
    docs: { source: chartSource(VARIANTS, ["import { DivergingBar } from '@invana/charts';"], (v) => chartSnippet('DivergingBar', v)) },
  },
  args: { variant: 'All' },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * Polarity around a real zero — from `fixtures/charts/diverging-bar.json`. The status colours are
 * right here because the two directions are good and bad, not two categories. Provisional. The
 * live cell grows every weight towards its 90-day value.
 */
export const DivergingBar: Story = {
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v) => (
        <LiveProps variant={v} noun="update">
          {(props) => (
            <Framed panel={v.panel}>
              <Chart {...props} />
            </Framed>
          )}
        </LiveProps>
      )}
    </VariantBoard>
  ),
  play: async ({ canvasElement }) => checkBoard(canvasElement, VARIANTS, 'update'),
};
