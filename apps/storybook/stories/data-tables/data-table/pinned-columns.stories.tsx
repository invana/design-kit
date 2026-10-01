import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataTable } from '@invana/tables';
import { PEOPLE_COLUMNS, usePeople } from '../fixtures/people';

const meta: Meta<typeof DataTable> = {
  title: 'Data Tables/DataTable',
  component: DataTable,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `enableColumnPinning`: the column picker gains a *Pin columns* section, and
 * a column pinned left or right stays put while the rest scroll under it. The
 * same prop on `PaginatedTable` and `RemotePaginatedTable`.
 */
export const PinnedColumns: Story = {
  render: function Render() {
    const [people, onCellEdit] = usePeople();
    // A screenful — every row at once is what a DataTable draws.
    const rows = React.useMemo(() => people.slice(0, 12), [people]);
    return (
      <DataTable
        columns={PEOPLE_COLUMNS}
        data={rows}
        onCellEdit={onCellEdit}
        enableColumnPinning
        minWidth={1200}
      />
    );
  },
};
