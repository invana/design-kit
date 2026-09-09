import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress } from '@invana/ui';

const meta: Meta<typeof Progress> = {
  title: 'UI/UI/Progress',
  component: Progress,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** At 4px it reads as part of the number above it, not as something you drag. */
export const Meter: Story = {
  render: () => (
    <div className="flex w-[240px] flex-col gap-4">
      <div className="flex flex-col gap-1 border border-border bg-card p-2">
        <span className="text-meta text-muted-foreground">cost this month</span>
        <span className="text-base font-medium">$38.20</span>
        <Progress size="sm" value={64} />
        <span className="text-meta text-muted-foreground">64% of $60 · 15 trading days left</span>
      </div>
      <Progress value={64} />
    </div>
  ),
};
