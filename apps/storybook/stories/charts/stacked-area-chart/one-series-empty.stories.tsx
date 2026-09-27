import type { Meta, StoryObj } from '@storybook/react-vite';
import { StackedAreaChart } from '@invana/charts';
import { PanelBox } from '@invana/ui';

import { GROWTH, MODELS, WEEKLY } from '../fixtures';

const meta: Meta<typeof StackedAreaChart> = {
  title: 'Charts/StackedAreaChart',
  component: StackedAreaChart,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Deals is published but has no records. It keeps its slot and its legend entry — its
 * colour does not pass to anyone else — but draws no band and gets no direct label.
 */
export const OneSeriesEmpty: Story = {
  render: () => (
    <PanelBox title="Records over time" aside="128,120 today">
      <StackedAreaChart data={GROWTH} series={MODELS} ticks={WEEKLY} />
    </PanelBox>
  ),
};
