import type * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button, ProposalCard, PropertyList, PropertyRow } from '@invana/ui';

type Args = React.ComponentProps<typeof ProposalCard> & { onAction: (id: string) => void };

const meta: Meta<Args> = {
  title: 'UI/UI Extended/ProposalCard',
  component: ProposalCard,
  parameters: { layout: 'padded' },
  args: { onAction: fn() },
};

export default meta;
type Story = StoryObj<Args>;

/**
 * `flush`, with no `title`: the draft without its muted box, for a card whose
 * frame already says what it is — a proposal under an answer.
 */
export const Flush: Story = {
  render: ({ onAction }) => (
    <ProposalCard
      flush
      consequence="Creates one alert rule. It would have fired 3 times in September."
      actions={
        <>
          <Button size="xs" onClick={() => onAction('create-alert')}>
            Create alert
          </Button>
          <Button size="xs" variant="outline" onClick={() => onAction('edit')}>
            Edit
          </Button>
        </>
      }
    >
      <PropertyList labelWidth="auto">
        <PropertyRow label="Alert" mono>
          Refunds &gt; 2σ by store
        </PropertyRow>
        <PropertyRow label="Checks" mono>
          Daily, 07:00
        </PropertyRow>
        <PropertyRow label="Notify" mono>
          Store managers
        </PropertyRow>
      </PropertyList>
    </ProposalCard>
  ),
};
