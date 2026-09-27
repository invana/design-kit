import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarChartV } from '@invana/charts';

const meta: Meta<typeof BarChartV> = {
  title: 'Charts/BarChartV',
  component: BarChartV,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Provisional. One measure over a few periods, vertical because the axis is time.
 */
export const Default: Story = {
  render: () => (
    <BarChartV
      caption="accepted ÷ reviewed · Intraday Analyst"
      gridlines={[50, 75, 100]}
      max={100}
      data={[
        { label: 'wk 33', sublabel: '11–15 Aug', value: 79, display: '79%' },
        { label: 'wk 34', sublabel: '18–22 Aug', value: 84, display: '84%' },
        { label: 'wk 35', sublabel: '25–29 Aug', value: 86, display: '86%' },
        { label: 'wk 36', sublabel: '1–5 Sep', value: 91, display: '91%' },
      ]}
    />
  ),
};
