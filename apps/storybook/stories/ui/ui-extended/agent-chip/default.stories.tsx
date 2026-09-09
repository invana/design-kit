import type { Meta, StoryObj } from '@storybook/react-vite';
import { AgentChip } from '@invana/ui';
import { Bot, User } from 'lucide-react';

const meta: Meta<typeof AgentChip> = {
  title: 'UI/UI Extended/AgentChip',
  component: AgentChip,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Identity, not status — so it takes no tone and no colour. Agents are told
 * apart by name; the only distinction drawn here is agent vs person.
 */
export const Default: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-2">
      <div className="flex items-center gap-1.5">
        <AgentChip icon={<Bot />} name="Intraday Analyst" />
        <AgentChip icon={<Bot />} name="Market Scout" />
        <AgentChip kind="person" icon={<User />} name="ravi" />
      </div>
      <div className="flex items-center gap-1.5">
        <AgentChip icon={<Bot />} name="Risk Checker" inactive />
        <span className="text-meta text-muted-foreground">retired — still in lineage</span>
      </div>
    </div>
  ),
};
