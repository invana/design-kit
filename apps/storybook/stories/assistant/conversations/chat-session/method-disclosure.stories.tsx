import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChatSession } from '@invana/assistant';
import { CONVERSATIONS } from '@invana/assistant/fixtures';

import { CHAT_ICONS, chatCallbacks, inPanel, VARIANT_ARG_TYPES } from '../../chat-kit';

const meta: Meta<typeof ChatSession> = {
  title: 'Assistant/Conversations/ChatSession',
  component: ChatSession,
  parameters: { layout: 'centered' },
  argTypes: VARIANT_ARG_TYPES,
  decorators: [inPanel(440, 480)],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The inline disclosure, where it lives: an answer's `envelope.method` drawn as a bare `▸ method`
 * line under the evidence, opening onto the query that computed the figure.
 */
export const MethodDisclosure: Story = {
  args: {
    ...chatCallbacks(),
    spec: CONVERSATIONS.methodDisclosure,
    variant: 'web',
    icons: CHAT_ICONS,
  },
};
