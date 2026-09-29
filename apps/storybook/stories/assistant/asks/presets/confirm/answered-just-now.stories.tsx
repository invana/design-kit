import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ConversationTurn, resolveRegistry, type AskTurn } from '@invana/assistant';

const meta: Meta<typeof ConversationTurn> = {
  title: 'Assistant/Asks/Presets/Confirm',
  component: ConversationTurn,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const turn: AskTurn = {
  id: 't2',
  role: 'assistant',
  kind: 'ask',
  stage: 'frame',
  state: 'answered',
  ask: {
    preset: 'confirm',
    question:
      "I'll count a readmission as any **unplanned** admission within **30 days** of discharge, at any of our three hospitals.",
    yes: 'Use this',
    no: 'Change definition',
    default: true,
  },
  value: true,
  answeredAt: '2026-09-29T10:00:20Z',
};

/** `answeredAt` reads as `just now` against the clock passed as `now`, at the right of the header. */
export const AnsweredJustNow: Story = {
  args: { turn, registry: resolveRegistry(), onEvent: fn(), now: Date.parse('2026-09-29T10:00:45Z') },
};
