import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { DataTable } from '@invana/tables';
import type { ColumnDef } from '@invana/tables';
import {
  Checkbox,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@invana/forms';

/**
 * A grid of controls that are always on — each column's `cell()` renders a
 * `Checkbox`, a `Select` or an `Input` at its `sm` size, wired to the story's
 * own state, rather than the click-to-edit `meta.editable`.
 *
 * `meta.control` is what makes it read as a table: the cell gives up the
 * vertical padding the control's own border already provides, so a row of
 * controls is the height of a row of text. The summary is the `footer`.
 */

type SemanticType = 'fact' | 'dimension' | 'time' | 'metric';

type Field = {
  id: string;
  name: string;
  include: boolean;
  dataType: '' | 'int' | 'string' | 'datetime';
  logicalName: string;
  semanticType: SemanticType;
  synonyms: string;
};

const SEMANTIC: Record<SemanticType, string> = {
  fact: 'Fact',
  dimension: 'Dimension',
  time: 'Time dimension',
  metric: 'Metric',
};

const DATA_TYPES: Field['dataType'][] = ['int', 'string', 'datetime'];

const seed: Field[] = [
  {
    id: 'f1',
    name: 'CustomerId',
    include: true,
    dataType: 'int',
    logicalName: 'CustomerId',
    semanticType: 'fact',
    synonyms: 'User number, User ID',
  },
  {
    id: 'f2',
    name: 'CustomerName',
    include: true,
    dataType: 'string',
    logicalName: 'CustomerName',
    semanticType: 'dimension',
    synonyms: 'Name',
  },
  {
    id: 'f3',
    name: 'Phone',
    include: true,
    dataType: 'string',
    logicalName: 'CustomerPhone',
    semanticType: 'dimension',
    synonyms: 'Telephone, number',
  },
  {
    id: 'f4',
    name: 'RegistrationDate',
    include: true,
    dataType: 'datetime',
    logicalName: 'RegistrationDate',
    semanticType: 'time',
    synonyms: 'Sign-up date',
  },
  {
    id: 'f5',
    name: 'TotalCustomers',
    include: true,
    dataType: '',
    logicalName: 'TotalCustomers',
    semanticType: 'metric',
    synonyms: 'Synonym 1, synonym 2',
  },
];

function MetadataGridDemo(
  args: Partial<React.ComponentProps<typeof DataTable<Field>>>,
) {
  const [data, setData] = React.useState<Field[]>(seed);

  const patch = React.useCallback(
    (id: string, changes: Partial<Field>) =>
      setData((prev) => prev.map((r) => (r.id === id ? { ...r, ...changes } : r))),
    [],
  );

  const columns: ColumnDef<Field, unknown>[] = React.useMemo(
    () => [
      { id: 'name', accessorKey: 'name', header: 'Field', size: 200, meta: { mono: true } },
      {
        id: 'include',
        header: 'Include',
        size: 90,
        meta: { control: true, align: 'center' },
        cell: ({ row }) => (
          <Checkbox
            aria-label={`Include ${row.original.name}`}
            checked={row.original.include}
            onCheckedChange={(v) => patch(row.original.id, { include: v === true })}
          />
        ),
      },
      {
        id: 'dataType',
        header: 'Data type',
        size: 140,
        meta: { control: true },
        cell: ({ row }) =>
          row.original.dataType === '' ? (
            '—'
          ) : (
            <Select
              value={row.original.dataType}
              onValueChange={(v) =>
                patch(row.original.id, { dataType: v as Field['dataType'] })
              }
            >
              <SelectTrigger triggerSize="sm" aria-label="Data type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DATA_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ),
      },
      {
        id: 'logicalName',
        header: 'Logical name',
        size: 200,
        meta: { control: true },
        cell: ({ row }) => (
          <Input
            inputSize="sm"
            aria-label="Logical name"
            value={row.original.logicalName}
            onChange={(e) => patch(row.original.id, { logicalName: e.target.value })}
          />
        ),
      },
      {
        id: 'semanticType',
        header: 'Semantic type',
        size: 180,
        meta: { control: true },
        cell: ({ row }) => (
          <Select
            value={row.original.semanticType}
            onValueChange={(v) =>
              patch(row.original.id, { semanticType: v as SemanticType })
            }
          >
            <SelectTrigger triggerSize="sm" aria-label="Semantic type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(SEMANTIC) as SemanticType[]).map((t) => (
                <SelectItem key={t} value={t}>
                  {SEMANTIC[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ),
      },
      { id: 'synonyms', accessorKey: 'synonyms', header: 'Synonyms', size: 220 },
    ],
    [patch],
  );

  const metrics = data.filter((r) => r.semanticType === 'metric').length;

  return (
    <DataTable<Field>
      {...args}
      columns={columns}
      data={data}
      enableSorting={false}
      footer={
        <span>
          {data.length} fields · {metrics} metric · 1 filter
        </span>
      }
    />
  );
}

const meta: Meta<typeof DataTable<Field>> = {
  title: 'Data Tables/DataTable',
  component: DataTable<Field>,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const MetadataGrid: Story = {
  render: () => <MetadataGridDemo />,
};
