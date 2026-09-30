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
 * The console with work in flight: a rename parked on a question since last month, a summary
 * answered with its steps, its query and a caveat, and a query agent still running — pinned above
 * the composer, with the status bar counting what runs and what waits. Switch the status bar to
 * Tasks for every step of the session.
 */
export const AgentConsole: Story = {
  args: {
    spec: CONVERSATIONS.agentConsole,
    variant: 'cli',
    icons: CHAT_ICONS,
    onEvent: fn(),
    onStop: fn(),
  },
};
