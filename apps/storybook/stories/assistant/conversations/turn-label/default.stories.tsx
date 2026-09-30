import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ChatSession } from '@invana/assistant';
import { CONVERSATIONS } from '@invana/assistant/fixtures';

import { CHAT_ICONS, inPanel } from '../../chat-kit';

const meta: Meta<typeof ChatSession> = {
  title: 'Assistant/Conversations/TurnLabel',
  component: ChatSession,
  parameters: { layout: 'centered' },
  decorators: [inPanel(420, 560)],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Who is speaking, over each turn: the spec's `analyst` over the prompts (`PLANNER`) and its
 * `assistant` over the replies. The web variant draws them; the console needs none.
 */
export const Default: Story = {
  args: {
    spec: CONVERSATIONS.turnLabels,
    variant: 'web',
    icons: CHAT_ICONS,
    onEvent: fn(),
  },
};
