import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChatSession } from '@invana/assistant';

import { ScenarioPlayer } from './player';

const meta: Meta<typeof ChatSession> = {
  title: 'Assistant/Conversations/ChatSession',
  component: ChatSession,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `<ChatSession variant="cli">`: the console. Your prompt is a caret row; every reply is a
 * status-dotted row with the tasks that produced it under it — Understand, Validate, Execute,
 * Project — each with its status, time and record. The running step is pinned above the composer,
 * and the status bar switches to every step of the session.
 *
 * Everything on the left is drawn from JSON: the session's spec, then recorded patches played on
 * their own timing (`useChatSession().play`). Press Play on a moment, or send a prompt of your own.
 * Clicking an elapsed time opens the run (`onOpenRun`); every action lands in the event log.
 */
export const CliVariant: Story = {
  render: () => <ScenarioPlayer variant="cli" widths={[440, 720, 320]} />,
};
