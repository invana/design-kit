import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilterBar, FilterChip } from '@invana/ui';

const meta: Meta<typeof FilterBar> = {
  title: 'UI/UI Extended/FilterBar',
  component: FilterBar,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Controls that hide rows — never actions that change data. */
export const Default: Story = {
  render: () => (
    <div className="w-[420px] border border-border bg-card">
      <FilterBar summary="8 datasets">
        <FilterChip label="status" />
        <FilterChip label="origin" value="folder" active />
      </FilterBar>
    </div>
  ),
};
