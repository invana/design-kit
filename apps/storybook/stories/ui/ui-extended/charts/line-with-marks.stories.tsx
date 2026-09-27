import type { Meta, StoryObj } from '@storybook/react-vite';
import { LineChart } from '@invana/ui';

const meta: Meta<typeof LineChart> = {
  title: 'UI/UI Extended/Charts',
  component: LineChart,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const P50 = [6.3, 6.1, 6.4, 6.0, 5.9, null, null, 6.6, 6.2, 6.0, 6.1, 5.8, 5.9, 6.0, 6.2, 6.1, 6.0, 9.4, 8.1, 6.2, 6.0, 5.9, 5.8, 6.0, 6.1, 5.9, 6.0, 5.8, 5.9, 6.0];
const day = (i: number) => new Date(Date.UTC(2026, 7, 27 + i)).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });

/**
 * A plan's work p50 a day, with the day `v5` was published marked. Two days
 * nothing ran break the line rather than dropping it to zero. One series, so
 * no legend; hover reads the nearest day.
 */
export const LineWithMarks: Story = {
  render: () => (
    <div className="w-[330px]">
      <LineChart
        values={P50}
        labels={P50.map((_, i) => day(i))}
        format={(v) => `${v.toFixed(1)}s`}
        max={10}
        gridlines={[0, 5, 10]}
        marks={[{ index: 21, label: 'v5' }]}
      />
    </div>
  ),
};
