import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionHeader, Button } from '@invana/ui';
import { Boxes, Plus } from 'lucide-react';

const meta: Meta<typeof SectionHeader> = {
  title: 'UI/UI Extended/SectionHeader',
  component: SectionHeader,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** A count is a fact about the section; an action is something you do to it. */
export const Default: Story = {
  render: () => (
    <div className="w-[320px] border border-border bg-card">
      <SectionHeader icon={<Boxes />} title="Node types" count="4" actions={
        <Button size="icon-xs" variant="ghost" aria-label="Add node type"><Plus /></Button>
      } />
      <SectionHeader icon={<Boxes />} title="Edge types" count="6 shown · 1 hidden" />
      <SectionHeader title="Selected" count="Observation" bare />
    </div>
  ),
};
