import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ConversationTurn, resolveRegistry, type AnswerTurn } from '@invana/assistant';

const meta: Meta<typeof ConversationTurn> = {
  title: 'Assistant/Answers/Blocks/Trace',
  component: ConversationTurn,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const turn: AnswerTurn = {
  id: 't3',
  role: 'assistant',
  kind: 'answer',
  state: 'running',
  trace: [
    { id: 'gl', label: 'Read general ledger', detail: '12,408 rows', state: 'done' },
    { id: 'inv', label: 'Joined carrier invoices', detail: '3,911 rows', state: 'done' },
    { id: 'dec', label: 'Decomposing the change', detail: '2.1 s', state: 'running' },
    { id: 'sum', label: 'Write summary', state: 'pending' },
  ],
  blocks: [],
};

/** A running answer's trace: done steps filled, the running one pulsing, the pending one hollow. */
export const Default: Story = {
  args: { turn, registry: resolveRegistry(), onEvent: fn() },
};
