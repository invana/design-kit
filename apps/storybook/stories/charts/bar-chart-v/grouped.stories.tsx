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
 * Two series side by side in each group, named in a legend that also carries the
 * target rule. No group is emphasised: the comparison is inside each group.
 */
export const Grouped: Story = {
  args: {
    caption: '% of accounts active on day 30',
    labelMode: 'all',
    series: [{ name: 'before 2 Jun' }, { name: 'after' }],
    target: { value: 75, label: 'target', color: 'var(--color-warning)' },
    data: [
      { label: 'paid', values: [80, 83] },
      { label: 'organic', values: [71, 75] },
      { label: 'referral', values: [70, 72] },
      { label: 'partner', values: [58, 63] },
    ],
  },
};
