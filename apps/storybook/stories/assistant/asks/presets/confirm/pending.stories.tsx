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
  state: 'pending',
  ask: {
    preset: 'confirm',
    question:
      "I'll count a readmission as any **unplanned** admission within **30 days** of discharge, at any of our three hospitals.",
    yes: 'Use this',
    no: 'Change definition',
    default: true,
  },
};

/** Waiting on the analyst. The question says what yes fixes, with the cost in bold; yes is the primary button. */
export const Pending: Story = {
  args: { turn, registry: resolveRegistry(), onEvent: fn() },
};
