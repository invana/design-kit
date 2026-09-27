import type { Meta, StoryObj } from '@storybook/react-vite';
import { LineChart } from '@invana/charts';
import { PanelBox } from '@invana/ui';

import { DAYS, WEEKLY, WORK_P50, seconds } from '../fixtures';

// Nothing ran on the weekends, and on the whole of one week but a Wednesday.
const GAPPY = WORK_P50.map((v, i) => (i % 7 === 5 || i % 7 === 6 || (i >= 14 && i <= 20 && i !== 16) ? null : v));

const meta: Meta<typeof LineChart> = {
  title: 'Charts/LineChart',
  component: LineChart,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Days where nothing ran break the line rather than dropping it to zero — *nothing
 * ran* is not *it took no time*. A measured day between two gaps is drawn as a point,
 * so it is not lost.
 */
export const Gaps: Story = {
  render: () => (
    <PanelBox title="Work p50, a day" aside="ran on 19 of 30 days">
      <LineChart values={GAPPY} labels={DAYS} ticks={WEEKLY} format={seconds} gridlines={[0, 5, 10]} max={10} />
    </PanelBox>
  ),
};
