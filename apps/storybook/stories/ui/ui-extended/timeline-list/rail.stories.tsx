import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link, StatusDot, TimelineEntry, TimelineFooter, TimelineList, TypographyH6 } from '@invana/ui';

const meta: Meta<typeof TimelineList> = {
  title: 'UI/UI Extended/TimelineList',
  component: TimelineList,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const entries = [
  { when: '14 hours ago', title: 'Refreshed repository pull requests page in public preview' },
  { when: '15 hours ago', title: 'AI Scan for pull request APIs in public preview' },
  { when: '18 hours ago', title: 'Control GitHub Actions cache access with cache-mode' },
  { when: '19 hours ago', title: 'MAI-Code-1-Flash deprecated' },
];

/**
 * `when` above the title with a line threading the markers — the shape for a
 * narrow card, where a `when` column would eat a third of the width.
 */
export const Rail: Story = {
  render: () => (
    <div className="w-[340px] rounded-lg border border-border bg-card p-4">
      <TypographyH6 className="mb-3">Latest from our changelog</TypographyH6>
      <TimelineList variant="rail">
        {entries.map((entry) => (
          <TimelineEntry
            key={entry.title}
            when={entry.when}
            marker={<StatusDot tone="muted" />}
            title={
              <Link href="#" variant="quiet">
                {entry.title}
              </Link>
            }
          />
        ))}
        <TimelineFooter>
          <Link href="#" variant="quiet">
            View changelog →
          </Link>
        </TimelineFooter>
      </TimelineList>
    </div>
  ),
};
