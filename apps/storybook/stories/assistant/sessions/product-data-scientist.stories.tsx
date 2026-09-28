import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ArrowUp, Square } from 'lucide-react';
import { Conversation } from '@invana/assistant';
import { SESSIONS } from '@invana/assistant/fixtures';

const meta: Meta<typeof Conversation> = {
  title: 'Assistant/Sessions/Product Data Scientist',
  component: Conversation,
  parameters: { layout: 'fullscreen' },
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
  args: { spec: SESSIONS.productDataScientist, onEvent: fn(), sendIcon: <ArrowUp />, stopIcon: <Square /> },
};
