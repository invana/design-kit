import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ArrowUp, Square } from 'lucide-react';
import { Conversation } from '@invana/assistant';
import { SESSIONS } from '@invana/assistant/fixtures';

const meta: Meta<typeof Conversation> = {
  title: 'Assistant/Sessions/Health Researcher',
  component: Conversation,
  parameters: { layout: 'fullscreen' },
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
  args: { spec: SESSIONS.healthResearcher, onEvent: fn(), sendIcon: <ArrowUp />, stopIcon: <Square /> },
};
