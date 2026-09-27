import type { Meta, StoryObj } from '@storybook/react-vite';
import { HeatStrip } from '@invana/charts';

const STATES = [
  { key: 'served', label: 'served', color: 'var(--color-success)' },
  { key: 'skipped', label: 'skipped · overlap', color: 'var(--color-muted-foreground)' },
  { key: 'cannot', label: 'cannot answer', color: 'var(--color-warning)', hollow: true },
  { key: 'failed', label: 'failed', color: 'var(--color-destructive)' },
];

const DAY = Array.from({ length: 21 }, (_, i) => ({
  at: `${9 + Math.floor(i / 4)}:${['00', '15', '30', '45'][i % 4]}`,
  state: i === 5 ? 'skipped' : i === 13 ? 'cannot' : i === 18 ? 'failed' : 'served',
}));

const meta: Meta<typeof HeatStrip> = {
  title: 'Charts/HeatStrip',
  component: HeatStrip,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Provisional. The shape of a schedule's day, one square per firing. These are status
 * colours, so the legend is mandatory — a square carries no label of its own.
 */
export const Default: Story = {
  render: () => (
    <HeatStrip
      cells={DAY}
      states={STATES}
      ticks={[
        { at: 0, label: '09' },
        { at: 4, label: '10' },
        { at: 8, label: '11' },
        { at: 12, label: '12' },
        { at: 16, label: '13' },
        { at: 20, label: '14' },
      ]}
    />
  ),
};
