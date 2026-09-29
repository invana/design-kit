import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ChatSessionDisclosure } from '@invana/assistant';

const meta: Meta<typeof ChatSessionDisclosure> = {
  title: 'Assistant/Conversations/ChatSession',
  component: ChatSessionDisclosure,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Inline — a bare line inside an answer: the label at the left, its meta at the right
 * in mono. It opens onto the query as a preformatted block.
 */
export const DisclosureInline: Story = {
  args: {
    variant: 'inline',
    label: 'query',
    meta: '12,408 rows · 18 ms',
    defaultOpen: true,
    onOpenChange: fn(),
    children: `SELECT region, sum(op_income)/sum(net_rev)
FROM fin.pnl_monthly
WHERE period BETWEEN '2026-07' AND '2026-09'
GROUP BY region`,
  },
};
