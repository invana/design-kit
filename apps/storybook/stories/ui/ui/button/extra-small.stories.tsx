import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@invana/ui';
import { Plus, Search, Settings2 } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'UI/UI/Button',
  component: Button,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The dense tier — 24px. A panel toolbar, an action inside a list row, a
 * control that has to sit beside 13px text without towering over it. Both xs
 * sizes bring the icon down to 16px with the box.
 */
export const ExtraSmall: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Button size="xs" variant="soft">
          <Plus /> Declare link
        </Button>
        <Button size="xs" variant="outline">
          Introspect
        </Button>
        <Button size="icon-xs" variant="ghost" aria-label="Search">
          <Search />
        </Button>
        <Button size="icon-xs" variant="ghost" aria-label="Settings">
          <Settings2 />
        </Button>
      </div>
      <div className="flex items-end gap-2">
        <Button size="xs">xs</Button>
        <Button size="sm">sm</Button>
        <Button size="default">default</Button>
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-meta text-muted-foreground">
        <dt>xs / icon-xs</dt>
        <dd>24px — the dense tier, new</dd>
        <dt>sm</dt>
        <dd>32px</dd>
        <dt>default</dt>
        <dd>36px</dd>
      </dl>
    </div>
  ),
};
