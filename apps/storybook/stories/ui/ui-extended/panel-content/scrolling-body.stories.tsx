import type { Meta, StoryObj } from '@storybook/react-vite';
import { PanelContent, Button } from '@invana/ui';
import { X } from 'lucide-react';

const meta: Meta<typeof PanelContent> = {
  title: 'UI/UI Extended/PanelContent',
  component: PanelContent,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const rows = Array.from({ length: 40 }, (_, i) => ({
  id: `evt-${String(i + 1).padStart(3, '0')}`,
  label: [
    'Fetched schema',
    'Resolved dependency',
    'Executed query',
    'Cached result',
    'Emitted metric',
  ][i % 5],
  at: `${String(9 + Math.floor(i / 6)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}`,
}));

/**
 * The body is the only scrolling region: the header stays pinned at the top of
 * the panel and the footer at the bottom, however long the content runs.
 */
export const ScrollingBody: Story = {
  render: () => (
    <div className="h-[360px] w-[380px] rounded-md border">
      <PanelContent
        titleText="Activity"
        headerActions={[{ name: 'Close panel', icon: X, onClick: () => {} }]}
        bodyClassName="p-0"
        footerContent={
          <div className="flex w-full items-center justify-between">
            <span className="text-meta text-muted-foreground">40 events</span>
            <Button variant="ghost" size="sm">Clear</Button>
          </div>
        }
      >
        <ul>
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex items-baseline justify-between gap-3 border-b px-3 py-2 last:border-b-0"
            >
              <span className="truncate">{row.label}</span>
              <span className="shrink-0 text-meta text-muted-foreground">{row.at}</span>
            </li>
          ))}
        </ul>
      </PanelContent>
    </div>
  ),
};
