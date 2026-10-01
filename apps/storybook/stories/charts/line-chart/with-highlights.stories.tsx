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
 * The weeks above the normal range are ringed in the warning colour. A ring carries no
 * label: what sits beside the chart says why those weeks stand out.
 */
export const WithHighlights: Story = {
  render: () => (
    <PanelBox title="Lead time, a week" aside="flagged weeks ringed">
      <LineChart
        values={LEAD_TIME}
        labels={WEEKS}
        format={leadDays}
        zero={false}
        color="var(--color-foreground)"
        band={{ lower: 16.3, upper: 21.5, label: 'normal range', color: 'var(--color-primary)' }}
        highlights={[7, 8, 9, 10, 11].map((index) => ({ index, color: 'var(--color-warning)' }))}
      />
    </PanelBox>
  ),
};
