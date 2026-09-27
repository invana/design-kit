import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sparkline } from '@invana/charts';

const meta: Meta<typeof Sparkline> = {
  title: 'Charts/Sparkline',
  component: Sparkline,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The shape of a series, small enough to sit inside a row. No axis, no labels — it
 * answers *which way, and how steadily*; the number beside it answers *how much*.
 * SVG, not canvas, because a list carries dozens.
 */
export const Default: Story = {
  render: () => (
    <Sparkline values={[79, 81, 84, 83, 86, 88, 91]} label="accepted rate, 7 weeks" />
  ),
};
