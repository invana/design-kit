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
 * `enableColumnReordering`: drag a header by the grip that shows on hover to
 * move its column. A pinned column keeps its place. The same prop on
 * `PaginatedTable` and `RemotePaginatedTable`.
 */
export const ReorderableColumns: Story = {
  render: function Render() {
    const [people, onCellEdit] = usePeople();
    // A screenful — every row at once is what a DataTable draws.
    const rows = React.useMemo(() => people.slice(0, 12), [people]);
    return (
      <DataTable
        columns={PEOPLE_COLUMNS}
        data={rows}
        onCellEdit={onCellEdit}
        enableColumnReordering
      />
    );
  },
};
