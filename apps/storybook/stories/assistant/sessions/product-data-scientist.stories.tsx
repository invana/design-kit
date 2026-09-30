import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ArrowUp, Copy, List, RotateCw, Square, ThumbsDown, ThumbsUp } from 'lucide-react';
import { ChatSession } from '@invana/assistant';
import { SESSIONS } from '@invana/assistant/fixtures';

const meta: Meta<typeof ChatSession> = {
  title: 'Assistant/Sessions/Product Data Scientist',
  component: ChatSession,
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
  args: { spec: SESSIONS.productDataScientist, onEvent: fn(), icons: {
      send: <ArrowUp className="size-4" />,
      stop: <Square className="size-3 fill-current" />,
      retry: <RotateCw className="size-3" />,
      copy: <Copy className="size-3" />,
      steps: <List className="size-3" />,
      rateUp: <ThumbsUp className="size-3" />,
      rateDown: <ThumbsDown className="size-3" />,
    } },
};
