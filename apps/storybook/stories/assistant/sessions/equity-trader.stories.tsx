import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ArrowUp, Square } from 'lucide-react';
import { Conversation } from '@invana/assistant';
import { SESSIONS } from '@invana/assistant/fixtures';

const meta: Meta<typeof Conversation> = {
  title: 'Assistant/Sessions/Equity Trader',
  component: Conversation,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * An equity trader explains a bad week and positions into the CPI print: a P&L bridge with its trace, a driver ranking, a scenario form and a cost confirm, a cannot-answer turn, and a draft order to approve.
 *
 * Rendered from the session fixture alone, exactly as the API would send it.
 * Every preset without a renderer yet shows as a labelled placeholder with its
 * JSON: the placeholders left in this story are the work left for its slice.
 */
export const EquityTrader: Story = {
  args: { spec: SESSIONS.equityTrader, onEvent: fn(), sendIcon: <ArrowUp />, stopIcon: <Square /> },
};
