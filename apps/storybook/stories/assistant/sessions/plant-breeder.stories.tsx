import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ArrowUp, Square } from 'lucide-react';
import { Conversation } from '@invana/assistant';
import { SESSIONS } from '@invana/assistant/fixtures';

const meta: Meta<typeof Conversation> = {
  title: 'Assistant/Sessions/Plant Breeder',
  component: Conversation,
  parameters: { layout: 'fullscreen' },
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
  args: { spec: SESSIONS.plantBreeder, onEvent: fn(), sendIcon: <ArrowUp />, stopIcon: <Square /> },
};
