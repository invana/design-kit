import type { Meta, StoryObj } from '@storybook/react-vite';
import { GridBlock } from '@invana/blocks';

const meta: Meta<typeof GridBlock> = {
  title: 'Blocks/Grid',
  component: GridBlock,
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
 * A band of figures that belong together, joined and seamless: the shell is the frame.
 */
export const Default: Story = {
  args: {
    spec: {
      tiles: [
        {
          label: 'Revenue',
          value: '£4.1M',
          delta: '▲ 4%',
          tone: 'good',
        },
        {
          label: 'Orders',
          value: '61.2k',
          delta: '▲ 7%',
          tone: 'good',
        },
        {
          label: 'AOV',
          value: '£67',
          delta: '▼ 3%',
          tone: 'bad',
        },
      ],
    },
  },
};
