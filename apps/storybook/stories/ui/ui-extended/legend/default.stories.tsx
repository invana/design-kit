import type { Meta, StoryObj } from '@storybook/react-vite';
import { Legend, LegendItem } from '@invana/ui';

const meta: Meta<typeof Legend> = {
  title: 'UI/UI Extended/Legend',
  component: Legend,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const TYPES = [
  ['Stock', 'var(--color-data-1)', '512'],
  ['Article', 'var(--color-data-2)', '21,390'],
  ['Observation', 'var(--color-data-3)', '1,912'],
  ['Learning', 'var(--color-data-4)', '640'],
  ['Pattern', 'var(--color-data-5)', '9'],
] as const;

/** Node types, coloured from the data palette. The label is what identifies them. */
export const Default: Story = {
  render: () => (
    <div className="w-[420px] border border-border bg-card p-2">
      <Legend>
        {TYPES.map(([label, color, count]) => (
          <LegendItem key={label} color={color} label={label} count={count} />
        ))}
      </Legend>
    </div>
  ),
};
