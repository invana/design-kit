import type { Meta, StoryObj } from '@storybook/react-vite';
import { TurnLabel } from '@invana/assistant';

const meta: Meta<typeof TurnLabel> = {
  title: 'Assistant/Conversations/TurnLabel',
  component: TurnLabel,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Who is speaking, over a prompt or an ask. `ChatSession` draws it over every prompt and reply in its web variant. */
export const Default: Story = {
  args: { children: 'Assistant' },
};
