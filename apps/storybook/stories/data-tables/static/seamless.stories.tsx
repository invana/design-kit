import { Meta, StoryObj } from '@storybook/react-vite';
import { DataTable } from '@invana/tables';
import type { ColumnDef } from '@invana/tables';
import { Card, CardContent } from '@invana/ui';

type Ceiling = { key: string; value: string; bounds: string };

const rows: Ceiling[] = [
  { key: 'max_concurrent_runs', value: '3', bounds: 'runs at once' },
  { key: 'max_fanout', value: '200', bounds: 'lanes in one map' },
  { key: 'max_children', value: '0', bounds: 'agents spawned per run' },
  { key: 'max_depth', value: '0', bounds: 'levels of delegation' },
];

const columns: ColumnDef<Ceiling>[] = [
  { id: 'key', accessorKey: 'key', header: 'Ceiling' },
  { id: 'value', accessorKey: 'value', header: 'Value' },
  { id: 'bounds', accessorKey: 'bounds', header: 'What it bounds' },
];

const meta: Meta<typeof DataTable<Ceiling>> = {
  title: 'Data Tables/Static/Seamless',
  component: DataTable<Ceiling>,
  parameters: { layout: 'padded' },
};

export default meta;

/**
 * `seamless` inside a card: the card is the frame, so the table draws no box
 * of its own — only the rules between rows — and its first and last columns
 * sit flush with the card's content edge.
 */
export const Seamless: StoryObj<typeof meta> = {
  render: () => (
    <Card>
      <CardContent>
        <DataTable
          columns={columns}
          data={rows}
          seamless
          enableSorting={false}
          enablePagination={false}
          enableColumnVisibility={false}
        />
      </CardContent>
    </Card>
  ),
};
