import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusDot, TimelineEntry, TimelineList } from '@invana/ui';

const meta: Meta<typeof TimelineList> = {
  title: 'UI/UI Extended/TimelineList',
  component: TimelineList,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `when`, the marker and the text on one line with no rules, for a few dated
 * events inside an answer.
 */
export const Compact: Story = {
  render: () => (
    <TimelineList variant="compact">
      <TimelineEntry when="12 Sep" marker={<StatusDot tone="success" size="md" />}>
        Loaded at Rotterdam
      </TimelineEntry>
      <TimelineEntry when="19 Sep" marker={<StatusDot tone="warning" size="md" />}>
        Held at customs · 3 days
      </TimelineEntry>
      <TimelineEntry when="23 Sep" marker={<StatusDot size="md" />}>
        Arrived Felixstowe
      </TimelineEntry>
      <TimelineEntry when="26 Sep" marker={<StatusDot size="md" />}>
        Delivered, 4 days late
      </TimelineEntry>
    </TimelineList>
  ),
};
