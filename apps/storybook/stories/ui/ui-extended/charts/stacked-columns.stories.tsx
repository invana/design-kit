import type { Meta, StoryObj } from '@storybook/react-vite';
import { StackedBarChartV } from '@invana/ui';

const meta: Meta<typeof StackedBarChartV> = {
  title: 'UI/UI Extended/Charts',
  component: StackedBarChartV,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const SERVED = [34, 38, 41, 29, 22, 40, 44, 47, 39, 42, 45, 31, 24, 43, 46, 48, 41, 44, 50, 33, 26, 45, 49, 52, 47, 44, 46, 30, 25, 45];
const FAILED = [1, 2, 1, 1, 0, 2, 1, 3, 1, 1, 2, 1, 0, 1, 2, 1, 1, 6, 4, 1, 0, 1, 1, 2, 1, 1, 1, 0, 1, 1];
const day = (i: number) => new Date(Date.UTC(2026, 7, 27 + i)).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });

/**
 * A plan's runs a day over thirty days — served and failed, stacked on one
 * count axis. Status series, so status tokens, and a legend because there are
 * two. Hover a day for its counts.
 */
export const StackedColumns: Story = {
  render: () => (
    <div className="w-[620px]">
      <StackedBarChartV
        gridlines={[20, 40, 60]}
        max={60}
        ticks={[0, 7, 14, 21, 29]}
        series={[
          { key: 'served', label: 'served', color: 'var(--color-success)' },
          { key: 'failed', label: 'failed', color: 'var(--color-destructive)' },
        ]}
        data={SERVED.map((s, i) => ({ label: day(i), values: { served: s, failed: FAILED[i] } }))}
      />
    </div>
  ),
};
