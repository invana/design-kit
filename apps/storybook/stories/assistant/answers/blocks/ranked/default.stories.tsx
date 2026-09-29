import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ConversationTurn, resolveRegistry, type AnswerTurn } from '@invana/assistant';

const meta: Meta<typeof ConversationTurn> = {
  title: 'Assistant/Answers/Blocks/Ranked',
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
  label: 'themes',
  title: '87 Friday readmissions',
  blocks: [
    {
      preset: 'ranked',
      items: [
        { label: 'No physio visit', value: 36 },
        { label: 'Pain relief ran out', value: 25 },
        { label: 'Wound queries', value: 17 },
        { label: 'Fall at home', value: 9 },
      ],
    },
  ],
};

/** Themes in the order they matter, each with its bar and its count in a column at the right. */
export const Default: Story = {
  args: { turn, registry: resolveRegistry(), onEvent: fn() },
};
