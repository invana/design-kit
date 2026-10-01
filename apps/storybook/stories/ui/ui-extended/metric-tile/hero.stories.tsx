import type { Meta, StoryObj } from '@storybook/react-vite';
import { MetricTile } from '@invana/ui';

const meta: Meta<typeof MetricTile> = {
  title: 'UI/UI Extended/MetricTile',
  component: MetricTile,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The one figure an answer turns on, set large on the surface it sits in: no box, the
 * label in sentence case over it, the comparison in mono under it.
 */
export const Hero: Story = {
  args: {
    variant: 'hero',
    label: 'Net revenue retention',
    value: '108%',
    caption: '▲ 3 pts vs Q2 · target 110%',
    captionTone: 'success',
  },
};
