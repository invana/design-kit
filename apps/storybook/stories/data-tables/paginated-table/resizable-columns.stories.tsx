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
 * `enableColumnResizing`: drag a header’s right edge. The table takes the sum
 * of its columns’ widths, so widening one scrolls the table rather than
 * squeezing the rest.
 */
export const ResizableColumns: Story = {
  render: function Render() {
    const [rows, onCellEdit] = usePeople();
    return (
      <PaginatedTable
        columns={PEOPLE_COLUMNS}
        data={rows}
        onCellEdit={onCellEdit}
        enableColumnResizing
      />
    );
  },
};
