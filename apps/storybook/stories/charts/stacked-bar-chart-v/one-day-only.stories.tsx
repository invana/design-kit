import type { Meta, StoryObj } from '@storybook/react-vite';
import { StackedBarChartV } from '@invana/charts';
import { PanelBox } from '@invana/ui';

import { RUN_SERIES } from '../fixtures';

const meta: Meta<typeof StackedBarChartV> = {
  title: 'Charts/StackedBarChartV',
  component: StackedBarChartV,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A plan published today that has run once. The count axis never tops out below five,
 * so one run is a short column rather than a full-height one, and the column is no
 * wider than 24px however much room it has.
 */
export const OneDayOnly: Story = {
  render: () => (
    <PanelBox title="Runs a day" aside="1 run">
      <StackedBarChartV data={[{ label: 'today', values: { served: 1 } }]} series={RUN_SERIES} />
    </PanelBox>
  ),
};
