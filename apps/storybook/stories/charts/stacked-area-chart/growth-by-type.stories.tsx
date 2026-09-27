import type { Meta, StoryObj } from '@storybook/react-vite';
import { StackedAreaChart } from '@invana/charts';
import { PanelBox } from '@invana/ui';

import { GROWTH_BY_TYPE, TYPES, WEEKLY } from '../fixtures';

const meta: Meta<typeof StackedAreaChart> = {
  title: 'Charts/StackedAreaChart',
  component: StackedAreaChart,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Model page · Growth, one model. The same chart by node type. A band too thin to
 * carry its name beside it without colliding leaves the name to the legend rather
 * than stacking labels.
 */
export const GrowthByType: Story = {
  render: () => (
    <PanelBox title="Records over time · AirRoutes" aside="54,120 today">
      <StackedAreaChart data={GROWTH_BY_TYPE} series={TYPES} ticks={WEEKLY} marks={[{ index: 24, label: 'stitch commit' }]} />
    </PanelBox>
  ),
};
