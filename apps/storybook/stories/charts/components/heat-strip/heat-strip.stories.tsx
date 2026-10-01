import type { Meta, StoryObj } from '@storybook/react-vite';
import { HeatStrip as Chart, type HeatStripProps } from '@invana/charts';

import data from '../../../../fixtures/charts/heat-strip.json';
import { variantArg } from '../../../_story/source';
import { VariantBoard } from '../../../_story/variant-board';
import { Framed, LiveProps, chartSnippet, chartSource, checkBoard, type ChartVariant } from '../../_chart';

// JSON widens the literal unions; the shape is the chart's own props.
const VARIANTS = data as unknown as ChartVariant<HeatStripProps & Record<string, unknown>>[];

interface Args {
  variant: string;
}

const meta = {
  title: 'Charts/Components/HeatStrip',
  parameters: {
    layout: 'padded',
    docs: { source: chartSource(VARIANTS, ["import { HeatStrip } from '@invana/charts';"], (v) => chartSnippet('HeatStrip', v)) },
  },
  args: { variant: 'All' },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * The shape of a schedule's day, one square per firing — from `fixtures/charts/heat-strip.json`.
 * These are status colours, so the legend is mandatory: a square carries no label of its own.
 * Provisional. The live cell lands each firing as it happens.
 */
export const HeatStrip: Story = {
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v) => (
        <LiveProps variant={v} noun="firing">
          {(props) => (
            <Framed panel={v.panel}>
              <Chart {...props} />
            </Framed>
          )}
        </LiveProps>
      )}
    </VariantBoard>
  ),
  play: async ({ canvasElement }) => checkBoard(canvasElement, VARIANTS, 'firing'),
};
