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
 * A table with one right page size: `pageSizeOptions={false}` draws no
 * rows-per-page picker, and the page line keeps only the count and the pager.
 * `allowCustomPageSize={false}` would keep the picker but drop `Custom…`.
 */
export const FixedPageSize: Story = {
  render: function Render() {
    const [rows, onCellEdit] = usePeople();
    return (
      <PaginatedTable
        columns={PEOPLE_COLUMNS}
        data={rows}
        onCellEdit={onCellEdit}
        pageSize={20}
        pageSizeOptions={false}
      />
    );
  },
};
