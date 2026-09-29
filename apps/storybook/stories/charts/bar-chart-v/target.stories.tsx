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
 * Against a target — a dashed rule across the plot, drawn over the columns and
 * labelled in a gutter at the right that is as wide as its label, so the label never
 * sits on a column.
 */
export const Target: Story = {
  args: {
    caption: 'accepted ÷ reviewed · Intraday Analyst',
    max: 100,
    target: { value: 85, label: 'target' },
    data: [
      { label: 'wk 33', sublabel: '11–15 Aug', value: 79, display: '79%' },
      { label: 'wk 34', sublabel: '18–22 Aug', value: 84, display: '84%' },
      { label: 'wk 35', sublabel: '25–29 Aug', value: 86, display: '86%' },
      { label: 'wk 36', sublabel: '1–5 Sep', value: 91, display: '91%' },
    ],
  },
};
