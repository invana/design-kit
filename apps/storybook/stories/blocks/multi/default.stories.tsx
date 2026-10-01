import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { MultiAsk } from '@invana/blocks';

const meta: Meta<typeof MultiAsk> = {
  title: 'Blocks/Multi',
  component: MultiAsk,
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
 * Several choices; the ticked values are sent as one `reply`, in the spec's order.
 */
export const Default: Story = {
  args: {
    spec: {
      question: 'Which channels should I include?',
      options: [
        {
          value: 'stores',
          label: 'Stores',
        },
        {
          value: 'online',
          label: 'Online',
        },
        {
          value: 'wholesale',
          label: 'Wholesale',
        },
        {
          value: 'marketplace',
          label: 'Marketplace',
        },
      ],
      default: ['stores', 'online'],
    },
    onAction: fn(),
  },
};
