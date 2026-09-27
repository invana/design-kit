import type { Meta, StoryObj } from '@storybook/react-vite';
import { StackedBarChartV } from '@invana/charts';
import { PanelBox } from '@invana/ui';

import { RUNS, RUN_SERIES, WEEKLY } from '../fixtures';

const meta: Meta<typeof StackedBarChartV> = {
  title: 'Charts/StackedBarChartV',
  component: StackedBarChartV,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Plan page · Runs a day. `served` and `failed` are outcomes, so they wear the status
 * tokens — the one place status colour belongs on a chart. The legend sits inside the
 * chart; hover a day for its runs.
 */
export const RunsADay: Story = {
  render: () => (
    <PanelBox title="Runs a day" aside="hover a day for its runs">
      <StackedBarChartV data={RUNS} series={RUN_SERIES} ticks={WEEKLY} gridlines={[0, 20, 40, 60]} />
    </PanelBox>
  ),
};
