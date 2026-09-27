import type { Meta, StoryObj } from '@storybook/react-vite';
import { LineChart } from '@invana/charts';
import { PanelBox } from '@invana/ui';

import { DAYS, WEEKLY, MODEL_P95, seconds } from '../fixtures';

const meta: Meta<typeof LineChart> = {
  title: 'Charts/LineChart',
  component: LineChart,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Model page · p95 a day for one model, against the Graph's p95. The reference is a
 * dashed rule labelled at the right: a line to compare against, on the same axis —
 * never a second axis.
 */
export const WithReference: Story = {
  render: () => (
    <PanelBox title="p95, a day" aside="1.9s today">
      <LineChart
        values={MODEL_P95}
        labels={DAYS}
        ticks={WEEKLY}
        format={seconds}
        gridlines={[0, 2, 4]}
        max={4}
        marks={[{ index: 17, label: 'import' }]}
        reference={{ value: 1.4, label: 'Graph p95' }}
      />
    </PanelBox>
  ),
};
