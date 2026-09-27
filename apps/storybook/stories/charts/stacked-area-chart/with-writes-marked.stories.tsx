import type { Meta, StoryObj } from '@storybook/react-vite';
import { StackedAreaChart } from '@invana/charts';
import { PanelBox } from '@invana/ui';

import { GROWTH, MODELS, WEEKLY, WRITES } from '../fixtures';

const meta: Meta<typeof StackedAreaChart> = {
  title: 'Charts/StackedAreaChart',
  component: StackedAreaChart,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Every import and stitch commit is marked where its step is. Marks too close to name
 * side by side keep their rule and leave the name to the hover; the legend says what a
 * dashed rule is.
 */
export const WithWritesMarked: Story = {
  render: () => (
    <PanelBox title="Records over time" aside="128,120 today">
      <StackedAreaChart
        data={GROWTH}
        series={MODELS}
        ticks={WEEKLY}
        marks={WRITES}
        markLegend="a write — an import or a stitch commit"
      />
    </PanelBox>
  ),
};
