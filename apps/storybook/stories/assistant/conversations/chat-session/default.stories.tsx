import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChatSession } from '@invana/assistant';
import { CONVERSATIONS } from '@invana/assistant/fixtures';
import { Pin } from 'lucide-react';

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

/**
 * Three graph expansions, each answered with what it added and a Load to canvas outcome — the
 * Studio's Sessions rail. The whole thread is the `spec` arg: JSON, as the API sends it.
 *
 * Beside each answer's time sit its actions, chosen by the `actions` prop: the built-ins by name and
 * one of your own, `Pin to report`, sent as an `action` event. Every interaction lands in the
 * Actions panel through its own callback — `onRetry`, `onCopy`, `onToggleSteps`, `onRate`,
 * `onAction`, `onOpenRun` — and then `onEvent`.
 */
export const Default: Story = {
  args: {
    ...chatCallbacks(),
    spec: CONVERSATIONS.graphExpansions,
    variant: 'web',
    icons: CHAT_ICONS,
    actions: ['retry', 'copy', 'steps', { id: 'pin', label: 'Pin to report', icon: <Pin className="size-3" /> }, 'rate'],
  },
};
