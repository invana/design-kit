import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarsBlock } from '@invana/blocks';

const meta: Meta<typeof BarsBlock> = {
  title: 'Blocks/Bars',
  component: BarsBlock,
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
 * Groups compared as columns: two series side by side, the muted one the comparison, against a
 * dashed target.
 */
export const Default: Story = {
  args: {
    spec: {
      unit: '%',
      groups: ['A', 'B', 'C', 'D'],
      series: [
        {
          name: 'Q3',
          values: [17.7, 12.6, 15.4, 9.7],
        },
        {
          name: 'Q2',
          values: [16.0, 13.7, 14.9, 12.0],
          muted: true,
        },
      ],
      target: {
        value: 16.6,
        label: 'target 16%',
      },
    },
  },
};
