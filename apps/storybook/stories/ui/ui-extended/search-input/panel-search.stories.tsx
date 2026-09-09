import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SearchInput } from '@invana/ui';

const meta: Meta<typeof SearchInput> = {
  title: 'UI/UI Extended/SearchInput',
  component: SearchInput,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `inputSize="sm"` — the 26px application field, for a search box docked in a
 * panel header beside a 30px tab strip. The 40px `default` beside it is the
 * page size; at panel density it reads as a form dropped into a sidebar.
 *
 * `placeholder` says what *this* box searches. A panel that lists node types
 * and one that lists sessions both saying "Search..." is a box that has stopped
 * telling you anything.
 */
export const PanelSearch: Story = {
  render: () => {
    const [types, setTypes] = useState('');
    const [page, setPage] = useState('');

    return (
      <div className="w-[320px] space-y-6">
        <div className="space-y-1.5">
          <p className="text-meta text-muted-foreground">inputSize="sm" · 26px</p>
          <div className="border border-border bg-card p-1.5">
            <SearchInput
              inputSize="sm"
              value={types}
              onChange={setTypes}
              placeholder="Search types"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <p className="text-meta text-muted-foreground">inputSize="default" · 40px</p>
          <SearchInput value={page} onChange={setPage} placeholder="Search graphs" />
        </div>
      </div>
    );
  },
};
