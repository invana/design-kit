import type { Meta, StoryObj } from '@storybook/react-vite';
import { MetricBlock } from '@invana/blocks';

const meta: Meta<typeof MetricBlock> = {
  title: 'Blocks/Metric',
  component: MetricBlock,
  parameters: { layout: 'padded' },
  // The chat's middle width; a block fills whatever its shell gives it.
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The one figure an answer turns on, its comparison worded under it, and a bar against its target.
 */
export const Default: Story = {
  args: {
    spec: {
      label: 'Net revenue retention',
      value: '108%',
      delta: '▲ 3 pts vs Q2',
      tone: 'good',
      gauge: {
        value: 108,
        target: 110,
        min: 0,
        max: 120,
        unit: '%',
      },
    },
  },
};
