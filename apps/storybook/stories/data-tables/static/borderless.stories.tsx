import { Meta, StoryObj } from '@storybook/react-vite';
import { DataTable } from '@invana/tables';
import type { ColumnDef } from '@invana/tables';
import { Card, SectionHeader } from '@invana/ui';

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
  title: 'Data Tables/Static/Borderless',
  component: DataTable<Ceiling>,
  parameters: { layout: 'padded' },
};

export default meta;

/** Inside a card the card is the frame, so the table drops its own box and keeps its row rules. */
export const InACard: StoryObj<typeof meta> = {
  render: () => (
    <Card>
      <SectionHeader title="Reach" />
      <DataTable
        columns={columns}
        data={rows}
        bordered={false}
        enableSorting={false}
        enablePagination={false}
        enableColumnVisibility={false}
      />
    </Card>
  ),
};
