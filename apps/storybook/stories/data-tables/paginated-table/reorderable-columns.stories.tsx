import type { Meta, StoryObj } from '@storybook/react-vite';
import { PaginatedTable } from '@invana/tables';
import { PEOPLE_COLUMNS, usePeople } from '../fixtures/people';

const meta: Meta<typeof PaginatedTable> = {
  title: 'Data Tables/PaginatedTable',
  component: PaginatedTable,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `enableColumnReordering`: drag a header by the grip that shows on hover to
 * move its column. A pinned column keeps its place.
 */
export const ReorderableColumns: Story = {
  render: function Render() {
    const [rows, onCellEdit] = usePeople();
    return (
      <PaginatedTable
        columns={PEOPLE_COLUMNS}
        data={rows}
        onCellEdit={onCellEdit}
        enableColumnReordering
      />
    );
  },
};
