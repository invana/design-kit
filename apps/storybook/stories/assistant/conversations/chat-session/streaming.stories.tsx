import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChatSession, playScript } from '@invana/assistant';
import { CONVERSATIONS, STREAMING_SCRIPT } from '@invana/assistant/fixtures';

import { CHAT_ICONS, chatCallbacks, inPanel, VARIANT_ARG_TYPES } from '../../chat-kit';

const meta: Meta<typeof ChatSession> = {
  title: 'Assistant/Conversations/ChatSession',
  component: ChatSession,
  parameters: { layout: 'centered' },
  argTypes: VARIANT_ARG_TYPES,
  decorators: [inPanel(440)],
};

export default meta;
type Story = StoryObj<typeof meta>;

/** The recorded run, opened afresh each time the story mounts. */
const replay = (signal: AbortSignal) => playScript(STREAMING_SCRIPT, { signal });

/**
 * A reply that writes itself in. The `spec` arrives with the answer running and its text empty;
 * `stream` then delivers the words as `append-text` patches — here a recorded script, in a product a
 * streaming fetch (`fromNdjson`) or an EventSource (`fromEventSource`). The caret ends the text
 * while it runs, the view stays pinned to the bottom, and the answer settles with its time.
 */
export const Streaming: Story = {
  args: {
    ...chatCallbacks(),
    spec: CONVERSATIONS.streaming,
    stream: replay,
    variant: 'web',
    icons: CHAT_ICONS,
  },
};
