import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ConversationTurn, resolveRegistry, type AnswerTurn } from '@invana/assistant';

const meta: Meta<typeof ConversationTurn> = {
  title: 'Assistant/Answers/Blocks/Citations',
  component: ConversationTurn,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const turn: AnswerTurn = {
  id: 't10',
  role: 'assistant',
  kind: 'answer',
  state: 'complete',
  label: 'sources',
  blocks: [
    {
      preset: 'citations',
      sources: [
        { label: 'General ledger, Q3', count: 12408 },
        { label: 'Carrier invoices', count: 3911 },
        { label: 'Store master', count: 214 },
      ],
    },
  ],
};

/** The sources an answer rests on, numbered as its markers cite them, with record counts at the right. */
export const Default: Story = {
  args: { turn, registry: resolveRegistry(), onEvent: fn() },
};
