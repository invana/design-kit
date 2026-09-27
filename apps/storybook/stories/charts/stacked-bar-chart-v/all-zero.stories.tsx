import type { Meta, StoryObj } from '@storybook/react-vite';
import { StackedBarChartV } from '@invana/charts';
import { PanelBox } from '@invana/ui';

import { DAYS, RUN_SERIES, WEEKLY } from '../fixtures';

const ZERO = DAYS.map((label) => ({ label, values: { served: 0, failed: 0 } }));

const meta: Meta<typeof StackedBarChartV> = {
  title: 'Charts/StackedBarChartV',
  component: StackedBarChartV,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Thirty days with nothing in them. The chart says the window is empty instead of
 * drawing an axis of zeros that would read as a plan that failed every day.
 */
export const AllZero: Story = {
  render: () => (
    <PanelBox title="Runs a day" aside="none in 30 days">
      <StackedBarChartV data={ZERO} series={RUN_SERIES} ticks={WEEKLY} />
    </PanelBox>
  ),
};
