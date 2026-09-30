import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChatSession } from '@invana/assistant';
import { SESSIONS } from '@invana/assistant/fixtures';

import { CHAT_ICONS, chatCallbacks, VARIANT_ARG_TYPES } from '../chat-kit';

const meta: Meta<typeof ChatSession> = {
  title: 'Assistant/Sessions/Plant Breeder',
  component: ChatSession,
  parameters: { layout: 'fullscreen' },
  argTypes: VARIANT_ARG_TYPES,
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A plant breeder plans a drought-tolerant variety: a multi-step scope ask, an attribute matrix, driver ranking, weights and crosses, a simulated shortlist, a what-if and a proposal to add crosses to the plan.
 *
 * Rendered from the session fixture alone, exactly as the API would send it.
 * Every preset without a renderer yet shows as a labelled placeholder with its
 * JSON: the placeholders left in this story are the work left for its slice.
 */
export const PlantBreeder: Story = {
  args: { ...chatCallbacks(), variant: 'web', spec: SESSIONS.plantBreeder, icons: CHAT_ICONS },
};
