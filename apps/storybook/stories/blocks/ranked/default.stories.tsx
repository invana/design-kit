import type { Meta, StoryObj } from '@storybook/react-vite';
import { RankedBlock } from '@invana/blocks';

const meta: Meta<typeof RankedBlock> = {
  title: 'Blocks/Ranked',
  component: RankedBlock,
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
 * Items in the order they matter, each with its bar and its value; a negative one in the
 * destructive colour.
 */
export const Default: Story = {
  args: {
    spec: {
      items: [
        {
          label: 'Freight',
          value: -1.2,
          display: '−1.2',
        },
        {
          label: 'Markdowns',
          value: -0.5,
          display: '−0.5',
        },
        {
          label: 'Energy',
          value: -0.3,
          display: '−0.3',
        },
        {
          label: 'Mix',
          value: 0.2,
          display: '+0.2',
        },
      ],
    },
  },
};
