import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChatSession } from '@invana/assistant';
import { SESSIONS } from '@invana/assistant/fixtures';

import { CHAT_ICONS, chatCallbacks, VARIANT_ARG_TYPES } from '../chat-kit';

const meta: Meta<typeof ChatSession> = {
  title: 'Assistant/Users/Product Data Scientist',
  component: ChatSession,
  parameters: { layout: 'fullscreen' },
  argTypes: VARIANT_ARG_TYPES,
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A product data scientist tests whether the onboarding checklist improved retention: interpretation and reading fork, a comparison, model spec and plan, effect estimates, a significance test, time to event, a model check and a retraining proposal.
 *
 * Rendered from the session fixture alone, exactly as the API would send it.
 * Every preset without a renderer yet shows as a labelled placeholder with its
 * JSON: the placeholders left in this story are the work left for its slice.
 */
export const ProductDataScientist: Story = {
  args: { ...chatCallbacks(), variant: 'web', spec: SESSIONS.productDataScientist, icons: CHAT_ICONS },
};
