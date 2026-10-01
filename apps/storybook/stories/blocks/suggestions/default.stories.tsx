import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SuggestionsAsk } from '@invana/blocks';

const meta: Meta<typeof SuggestionsAsk> = {
  title: 'Blocks/Suggestions',
  component: SuggestionsAsk,
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
 * Follow-ups, each a whole next question; picking one is the `reply` with its words.
 */
export const Default: Story = {
  args: {
    spec: {
      items: [
        'Break freight down by carrier',
        'Which stores drove it?',
        'Alert me if it gets worse',
      ],
    },
    onAction: fn(),
  },
};
