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
 * `enableColumnPinning`: the column picker gains a *Pin columns* section, and
 * a column pinned left or right stays put while the rest scroll under it.
 */
export const PinnedColumns: Story = {
  render: function Render() {
    const [rows, onCellEdit] = usePeople();
    return (
      <PaginatedTable
        columns={PEOPLE_COLUMNS}
        data={rows}
        onCellEdit={onCellEdit}
        enableColumnPinning
        minWidth={1200}
      />
    );
  },
};
