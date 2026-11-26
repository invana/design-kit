import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import {
  ChatSession,
  ConversationList,
  type ConversationEvent,
  type ConversationSummary,
} from '@invana/assistant';
import { CONVERSATIONS } from '@invana/assistant/fixtures';

import { CHAT_ICONS, RailPanel } from '../../chat-kit';

const NOW = Date.parse('2026-11-26T16:30:00Z');

/** What the host's history endpoint sends: JSON, newest first. */
const ITEMS: ConversationSummary[] = [
  { id: 'graphExpansions', title: 'Expand the airport graph', at: '2026-11-26T16:25:00Z', meta: 'claude-sonnet-5-5 · 3 questions' },
  { id: 'ontologyAssistant', title: 'Add an iata property to airport', at: '2026-11-26T14:02:00Z', meta: 'qwen3.6-35b · 2 questions' },
  { id: 'streaming', title: 'Delays out of Dublin, Q3', at: '2026-11-24T09:14:00Z', meta: 'claude-opus-5-5 · 1 question' },
];

const meta = {
  title: 'Assistant/Conversations/ConversationList',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * History is one step back, not a menu: the header's History shows the list,
 * and New or a row goes in again. The list and the session are two parts the
 * host swaps; each only reports an event, so the pair holds no state of its own.
 */
export const HistoryFlow: Story = {
  render: () => {
    const [view, setView] = React.useState<'chat' | 'list'>('chat');
    const [id, setId] = React.useState<string>('graphExpansions');
    const onEvent = (event: ConversationEvent) => {
      if (event.type === 'history') setView('list');
      if (event.type === 'new-conversation') {
        setId('new');
        setView('chat');
      }
      if (event.type === 'open-conversation') {
        setId(event.id);
        setView('chat');
      }
    };
    const spec = id === 'new' ? { id: 'new', title: 'New conversation', turns: [] } : CONVERSATIONS[id as keyof typeof CONVERSATIONS];
    return (
      <div className="w-[380px]">
        <RailPanel height={640}>
          {view === 'list' ? (
            <ConversationList items={ITEMS} activeId={id} now={NOW} onEvent={onEvent} onClose={() => undefined} note="Only you see your conversations." icons={{ newChat: CHAT_ICONS.newChat, close: CHAT_ICONS.close }} />
          ) : (
            <ChatSession spec={spec} variant="web" icons={CHAT_ICONS} header onEvent={onEvent} onHistory={() => undefined} onNewConversation={() => undefined} onClose={() => undefined} now={NOW} />
          )}
        </RailPanel>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole('button', { name: 'History' }));
    await expect(await canvas.findByText('Delays out of Dublin, Q3')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: /Delays out of Dublin/ }));
    await expect(await canvas.findByRole('button', { name: 'History' })).toBeInTheDocument();
  },
};

/** The list alone, with nothing in it yet. */
export const Empty: Story = {
  render: () => (
    <div className="w-[380px]">
      <RailPanel height={320}>
        <ConversationList items={[]} now={NOW} onEvent={() => undefined} />
      </RailPanel>
    </div>
  ),
};
