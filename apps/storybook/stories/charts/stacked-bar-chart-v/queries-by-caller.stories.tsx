import type { Meta, StoryObj } from '@storybook/react-vite';
import { StackedBarChartV } from '@invana/charts';
import { PanelBox } from '@invana/ui';

import { QUERIES, CALLERS, WEEKLY } from '../fixtures';

const meta: Meta<typeof StackedBarChartV> = {
  title: 'Charts/StackedBarChartV',
  component: StackedBarChartV,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Model page · Queries a day by caller. Callers are categories, so they take data-palette
 * slots in a fixed order — agent, plan, Explorer, API — the same order and colours as
 * the Usage table's bars.
 */
export const QueriesByCaller: Story = {
  render: () => (
    <PanelBox title="Queries a day, by caller" aside="55,200 · 30 days">
      <StackedBarChartV data={QUERIES} series={CALLERS} ticks={WEEKLY} height={140} />
    </PanelBox>
  ),
};
