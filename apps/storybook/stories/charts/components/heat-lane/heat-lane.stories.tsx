import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { HeatLane as Chart, type HeatLaneProps } from '@invana/charts';

import data from '../../../../fixtures/charts/heat-lane.json';
import { variantArg } from '../../../_story/source';
import { VariantGrid } from '../../../_story/variant-grid';
import { LiveProps, chartSnippet, chartSource, checkGrid, type ChartVariant } from '../../_chart';

// JSON widens the literal unions; the shape is the chart's own props.
const VARIANTS = data as unknown as ChartVariant<HeatLaneProps & Record<string, unknown>>[];

interface Args {
  variant: string;
}

const meta = {
  title: 'Charts/Components/HeatLane',
  parameters: {
    layout: 'padded',
    docs: { source: chartSource(VARIANTS, ["import { HeatLane } from '@invana/charts';"], (v) => chartSnippet('HeatLane', v)) },
  },
  args: { variant: 'All' },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * One lane of busyness over time, a cell per slice, brighter where busier — the lane the Layer
 * activity block draws per layer. Hollow is not touched, faint is touched and idle; a refusal and
 * a crossing of the boundary take a status colour in their cell, never a brighter one. From
 * `fixtures/charts/heat-lane.json`; the live cell lands each slice as it arrives.
 */
export const HeatLane: Story = {
  render: ({ variant }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v) => <LiveProps variant={v} noun="cell">{(props) => <Chart {...props} />}</LiveProps>}
    </VariantGrid>
  ),
  play: async ({ canvasElement }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Refused and left the boundary' }));
    await expect(cell.getAllByTitle(/refused$/).length).toBe(2);
    await checkGrid(canvasElement, VARIANTS, 'cell');
  },
};
