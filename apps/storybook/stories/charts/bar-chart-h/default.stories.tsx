import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarChartH } from '@invana/charts';

const meta: Meta<typeof BarChartH> = {
  title: 'Charts/BarChartH',
  component: BarChartH,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Provisional. Magnitude, horizontal because the labels are words. Single series, so
 * no legend — the caption names what is plotted, and every bar is directly labelled.
 */
export const Default: Story = {
  render: () => (
    <BarChartH
      caption="5-session velocity · Defence"
      data={[
        { label: 'BEL', value: 2.4, display: '2.4×' },
        { label: 'HAL', value: 2.1, display: '2.1×' },
        { label: 'BDL', value: 1.6, display: '1.6×' },
        { label: 'MIDHANI', value: 0.9, display: '0.9×' },
      ]}
    />
  ),
};
