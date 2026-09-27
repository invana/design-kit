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
 * Each version's publish is marked: a dashed rule with its label at the top, because
 * a publish is an event, not a value. The spike after v5 is the thing the mark explains.
 */
export const WithMarks: Story = {
  render: () => (
    <PanelBox title="Work p50, a day" aside="versions marked">
      <LineChart
        values={WORK_P50}
        labels={DAYS}
        ticks={WEEKLY}
        format={seconds}
        gridlines={[0, 5, 10]}
        max={10}
        marks={[
          { index: 6, label: 'v4' },
          { index: 17, label: 'v5' },
        ]}
      />
    </PanelBox>
  ),
};
