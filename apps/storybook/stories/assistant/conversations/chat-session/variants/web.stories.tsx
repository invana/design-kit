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
 * `<ChatSession variant="web">`: the chat, as the Assistant Presets canvas draws the whole thread at
 * 420 px. Who is speaking sits over each turn; your prompt is a bubble with its time; the assistant's
 * asks and answer cards follow, the live steps in a card of their own while the run goes, and under
 * each answer `09:02 · Answered in 1.4 s` — which opens the run (`onOpenRun`).
 *
 * The same spec and the same recorded patches as the CLI story, drawn by the other variant; the
 * composer is the same in both. Press Play on a moment, or send a prompt of your own.
 */
export const WebVariant: Story = {
  render: () => <ScenarioPlayer variant="web" widths={[420, 720, 280]} />,
};
