import type { Meta, StoryObj } from '@storybook/react-vite';
import { RefusalCard } from '@invana/ui';

const meta: Meta<typeof RefusalCard> = {
  title: 'UI/UI Extended/RefusalCard',
  component: RefusalCard,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** A bound refused the ask before it ran — the card names whose rule said no. */
export const Default: Story = {
  render: () => (
    <RefusalCard
      label="refused · the agent's own guardrail"
      remedy="Ask in a world whose models this guardrail allows, or ask an agent without it."
    >
      <b>This ask was not run.</b> In <b>Everything</b>, <code>decide</code> is cast to{' '}
      <code>llm/anthropic-prod/claude-opus-5</code>, and the agent's own guardrail <b>Nothing leaves</b>{' '}
      does not allow it.
    </RefusalCard>
  ),
};
