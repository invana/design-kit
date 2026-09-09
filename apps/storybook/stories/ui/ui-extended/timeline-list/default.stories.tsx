import type { Meta, StoryObj } from '@storybook/react-vite';
import { TimelineList, TimelineEntry, StatusDot, Badge } from '@invana/ui';

const meta: Meta<typeof TimelineList> = {
  title: 'UI/UI Extended/TimelineList',
  component: TimelineList,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** `when` is a column, so "what changed on Friday" reads down one edge. */
export const Default: Story = {
  render: () => (
    <div className="w-[480px] border border-border bg-card p-2">
      <TimelineList>
        <TimelineEntry when="today 08:00" marker={<StatusDot tone="running" />} title="Trade day 8 Sep">
          <span className="text-meta text-muted-foreground">3 sub-tasks · <Badge variant="outline" size="xs" tone="info">in progress</Badge></span>
        </TimelineEntry>
        <TimelineEntry when="Fri 08:00" marker={<StatusDot tone="success" />} title="Trade day 5 Sep">
          <span className="text-meta text-muted-foreground">accepted 15:52</span>
        </TimelineEntry>
        <TimelineEntry when="Wed 08:00" marker={<StatusDot tone="muted" />} title="Trade day 3 Sep">
          <span className="text-meta text-muted-foreground">skipped — previous instance still open</span>
        </TimelineEntry>
      </TimelineList>
    </div>
  ),
};
