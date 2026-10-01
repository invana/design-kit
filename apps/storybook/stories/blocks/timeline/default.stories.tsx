import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { TimelineBlock } from '@invana/blocks';

const meta: Meta<typeof TimelineBlock> = {
  title: 'Blocks/Timeline',
  component: TimelineBlock,
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
 * A few dated events in order, each marked by what it did to the figure.
 */
export const Default: Story = {
  args: {
    spec: {
      events: [
        {
          when: '12 Sep',
          text: 'Loaded at Rotterdam',
          tone: 'good',
        },
        {
          when: '19 Sep',
          text: 'Held at customs · 3 days',
          tone: 'warn',
        },
        {
          when: '23 Sep',
          text: 'Arrived Felixstowe',
        },
        {
          when: '26 Sep',
          text: 'Delivered, 4 days late',
        },
      ],
    },
    onAction: fn(),
  },
};
