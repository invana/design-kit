import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ChatSession } from '@invana/assistant';
import { SESSIONS } from '@invana/assistant/fixtures';

import { CHAT_ICONS, VARIANT_ARG_TYPES } from '../chat-kit';

const meta: Meta<typeof ChatSession> = {
  title: 'Assistant/Sessions/Supply Chain Planner',
  component: ChatSession,
  parameters: { layout: 'fullscreen' },
  argTypes: VARIANT_ARG_TYPES,
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A supply-chain planner weighs moving volume to a second supplier: disambiguation, an anomaly report, a scenario form, a recommendation with a proposal, and a monitoring schedule with its files.
 *
 * Rendered from the session fixture alone, exactly as the API would send it.
 * Every preset without a renderer yet shows as a labelled placeholder with its
 * JSON: the placeholders left in this story are the work left for its slice.
 */
export const SupplyChainPlanner: Story = {
  args: { variant: 'web', spec: SESSIONS.supplyChainPlanner, onEvent: fn(), icons: CHAT_ICONS },
};
