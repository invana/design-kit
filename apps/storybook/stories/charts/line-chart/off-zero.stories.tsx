import type { Meta, StoryObj } from '@storybook/react-vite';
import { LineChart } from '@invana/charts';
import { PanelBox } from '@invana/ui';

import { LEAD_TIME, WEEKS, leadDays } from '../fixtures';

const meta: Meta<typeof LineChart> = {
  title: 'Charts/LineChart',
  component: LineChart,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The same lead times on an axis that starts at 0 would flatten a 50% rise. `zero={false}`
 * sets a clean floor one step under the lowest value instead.
 */
export const OffZero: Story = {
  render: () => (
    <PanelBox title="Lead time, a week" aside="axis from 15 d">
      <LineChart values={LEAD_TIME} labels={WEEKS} format={leadDays} zero={false} />
    </PanelBox>
  ),
};
