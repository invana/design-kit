import type { Meta, StoryObj } from '@storybook/react-vite';
import { LineChart } from '@invana/charts';
import { PanelBox } from '@invana/ui';

import { DAYS, WEEKLY, WORK_P50, seconds } from '../fixtures';

const meta: Meta<typeof LineChart> = {
  title: 'Charts/LineChart',
  component: LineChart,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Plan page · Work p50 a day. One series on one axis, so no legend: the panel
 * title names what is plotted. Hover, or focus and use the arrow keys, to read a day.
 */
export const ThirtyDays: Story = {
  render: () => (
    <PanelBox title="Work p50, a day" aside="6.0s today">
      <LineChart values={WORK_P50} labels={DAYS} ticks={WEEKLY} format={seconds} gridlines={[0, 5, 10]} max={10} />
    </PanelBox>
  ),
};
