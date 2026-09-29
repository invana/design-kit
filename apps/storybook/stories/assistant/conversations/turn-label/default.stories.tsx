import type { Meta, StoryObj } from '@storybook/react-vite';
import { TurnLabel } from '@invana/assistant';

const meta: Meta<typeof TurnLabel> = {
  title: 'Assistant/Conversations/TurnLabel',
  component: TurnLabel,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Who is speaking, over a prompt or an ask. `Conversation` draws it when the spec names the analyst. */
export const Default: Story = {
  args: { children: 'Assistant' },
};
