import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ConversationTurn, resolveRegistry, type AnswerTurn } from '@invana/assistant';

const meta: Meta<typeof ConversationTurn> = {
  title: 'Assistant/Answers/Blocks/Method',
  component: ConversationTurn,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const turn: AnswerTurn = {
  id: 't6',
  role: 'assistant',
  kind: 'answer',
  state: 'complete',
  label: 'method',
  blocks: [
    {
      preset: 'method',
      label: 'query',
      meta: '12,408 rows · 18 ms',
      code: `SELECT region, sum(op_income)/sum(net_rev)
FROM fin.pnl_monthly
WHERE period BETWEEN '2026-07' AND '2026-09'
GROUP BY region`,
    },
  ],
};

/** The query behind the figure, folded: its meta at the right, the code a click away. */
export const Default: Story = {
  args: { turn, registry: resolveRegistry(), onEvent: fn() },
};
