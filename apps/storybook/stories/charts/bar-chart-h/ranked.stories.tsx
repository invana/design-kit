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
 * A list read top to bottom — contributions to a change in margin. Labels in the text
 * colour, values in a column at the right, a negative contribution in the destructive
 * colour with its length its size.
 */
export const Ranked: Story = {
  args: {
    variant: 'ranked',
    color: 'var(--color-primary)',
    caption: 'Contribution to Δ margin, pts',
    data: [
      { label: 'Freight', value: -1.2, display: '−1.2' },
      { label: 'Markdowns', value: -0.5, display: '−0.5' },
      { label: 'Energy', value: -0.3, display: '−0.3' },
      { label: 'Mix', value: 0.2, display: '+0.2' },
    ],
  },
};
