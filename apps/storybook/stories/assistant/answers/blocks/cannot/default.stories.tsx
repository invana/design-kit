import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ConversationTurn, resolveRegistry, type AnswerTurn } from '@invana/assistant';

const meta: Meta<typeof ConversationTurn> = {
  title: 'Assistant/Answers/Blocks/Cannot',
  component: ConversationTurn,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const turn: AnswerTurn = {
  id: 't11',
  role: 'assistant',
  kind: 'answer',
  state: 'cannot',
  label: 'outcome',
  blocks: [
    {
      preset: 'cannot',
      reason: "Shipments are held from January 2023, so 2021 can't be compared.",
      remedy: 'Import the 2021 archive to answer this.',
    },
  ],
};

/** What the data does not hold, in a dashed card, with what would change the answer. */
export const Default: Story = {
  args: { turn, registry: resolveRegistry(), onEvent: fn() },
};
