import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilterBar, FilterChip } from '@invana/ui';

const meta: Meta<typeof FilterBar> = {
  title: 'UI/UI Extended/FilterBar',
  component: FilterBar,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A chip that is **set** can be cleared without opening its menu.
 *
 * Only a set chip gets the ×: an unset one has nothing to clear, and an × on it
 * would offer to undo something nobody did. The pair is two controls, so both
 * reach the keyboard and the × carries its own name — *Clear since* — rather
 * than being an unlabelled glyph inside somebody else's button.
 */
export const Closable: Story = {
  render: () => {
    const [filters, setFilters] = React.useState<Record<string, string | undefined>>({
      kind: 'import · bulk',
      since: 'today',
      agent: undefined,
      status: undefined,
    });
    const clear = (key: string) =>
      setFilters((current) => ({ ...current, [key]: undefined }));

    return (
      <div className="w-[520px] border border-border bg-card">
        <FilterBar
          summary={`${Object.values(filters).filter(Boolean).length} narrowing`}
        >
          {Object.entries(filters).map(([key, value]) => (
            <FilterChip
              key={key}
              label={key}
              value={value}
              active={value != null}
              onRemove={value != null ? () => clear(key) : undefined}
            />
          ))}
        </FilterBar>
      </div>
    );
  },
};
