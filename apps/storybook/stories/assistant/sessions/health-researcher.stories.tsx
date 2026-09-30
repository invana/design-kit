import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChatSession } from '@invana/assistant';
import { SESSIONS } from '@invana/assistant/fixtures';

import { CHAT_ICONS, chatCallbacks, VARIANT_ARG_TYPES } from '../chat-kit';

const meta: Meta<typeof ChatSession> = {
  title: 'Assistant/Sessions/Health Researcher',
  component: ChatSession,
  parameters: { layout: 'fullscreen' },
  argTypes: VARIANT_ARG_TYPES,
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A health-services researcher asks whether Friday discharges are readmitted more: a definition confirm and a data-issue ask, a comparison, adjustment asks, an adjusted readout, a findings memo from notes, and a pilot to register.
 *
 * Rendered from the session fixture alone, exactly as the API would send it.
 * Every preset without a renderer yet shows as a labelled placeholder with its
 * JSON: the placeholders left in this story are the work left for its slice.
 */
export const HealthResearcher: Story = {
  args: { ...chatCallbacks(), variant: 'web', spec: SESSIONS.healthResearcher, icons: CHAT_ICONS },
};
