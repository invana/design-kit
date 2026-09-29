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
 * Comparison — the answer-card form. Columns take two thirds of their band, so they grow
 * with the card; they stand on a baseline with square caps, against a dashed average. One
 * column carries the emphasis in primary, the rest are muted, and every value is written.
 */
export const Comparison: Story = {
  args: {
    variant: 'comparison',
    color: 'var(--color-muted-foreground)',
    highlightColor: 'var(--color-primary)',
    highlightIndex: 4,
    labelMode: 'all',
    target: { value: 6.1, label: 'avg' },
    data: [
      { label: 'M', value: 6.1 },
      { label: 'T', value: 5.8 },
      { label: 'W', value: 6.0, display: '6.0' },
      { label: 'T', value: 6.4 },
      { label: 'F', value: 8.2 },
      { label: 'S', value: 7.9 },
      { label: 'S', value: 7.1 },
    ],
  },
};
