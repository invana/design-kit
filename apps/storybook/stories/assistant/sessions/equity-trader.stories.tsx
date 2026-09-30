import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChatSession } from '@invana/assistant';
import { SESSIONS } from '@invana/assistant/fixtures';

import { CHAT_ICONS, chatCallbacks, VARIANT_ARG_TYPES } from '../chat-kit';

const meta: Meta<typeof ChatSession> = {
  title: 'Assistant/Sessions/Equity Trader',
  component: ChatSession,
  parameters: { layout: 'fullscreen' },
  argTypes: VARIANT_ARG_TYPES,
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
  args: { ...chatCallbacks(), variant: 'web', spec: SESSIONS.equityTrader, icons: CHAT_ICONS },
};
