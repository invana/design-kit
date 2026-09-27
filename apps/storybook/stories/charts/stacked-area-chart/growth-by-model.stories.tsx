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
 * Model page · Growth, all scope. Records over time by model, stepped because a count
 * only moves where a write happened. Each band is named at the right edge and in the
 * legend.
 */
export const GrowthByModel: Story = {
  render: () => (
    <PanelBox title="Records over time" aside="128,120 today">
      <StackedAreaChart data={GROWTH} series={MODELS.slice(0, 3)} ticks={WEEKLY} />
    </PanelBox>
  ),
};
