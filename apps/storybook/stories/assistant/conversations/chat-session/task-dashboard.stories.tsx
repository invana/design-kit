import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ChatSession } from '@invana/assistant';
import { CONVERSATIONS } from '@invana/assistant/fixtures';

import { CHAT_ICONS, inPanel, VARIANT_ARG_TYPES } from '../../chat-kit';

const meta: Meta<typeof ChatSession> = {
  title: 'Assistant/Conversations/ChatSession',
  component: ChatSession,
  parameters: { layout: 'centered' },
  argTypes: VARIANT_ARG_TYPES,
  decorators: [inPanel(440)],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Between sessions: every background task, opened on the Tasks view. What waits on you floats to
 * the top, the rest newest first; a row jumps to its reply in Chat.
 */
export const TaskDashboard: Story = {
  args: {
    spec: CONVERSATIONS.taskDashboard,
    variant: 'cli',
    defaultView: 'tasks',
    icons: CHAT_ICONS,
    onEvent: fn(),
    onViewChange: fn(),
  },
};
