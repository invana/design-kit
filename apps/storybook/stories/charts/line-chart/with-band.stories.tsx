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
 * The normal range is shaded under the line and named under its right end, so the weeks
 * that leave it read without a legend. The axis drops its zero: a lead time never nears it.
 */
export const WithBand: Story = {
  render: () => (
    <PanelBox title="Lead time, a week" aside="Apex Components">
      <LineChart
        values={LEAD_TIME}
        labels={WEEKS}
        format={leadDays}
        zero={false}
        band={{ lower: 16.3, upper: 21.5, label: 'normal range' }}
      />
    </PanelBox>
  ),
};
