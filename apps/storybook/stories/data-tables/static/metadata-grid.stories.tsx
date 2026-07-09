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
import { BarChart3, Box, Clock, Star } from 'lucide-react';

/**
 * Always-on inline-editing grid built purely from per-column `cell()` render
 * functions — no built-in editors. The table only supplies plumbing:
 * `meta.cellClassName` / `meta.headerClassName` to control padding + alignment,
 * and the `footer` slot for the summary bar. Every control (Checkbox, Select,
 * Input) is wired by the consumer against their own `useState` data.
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

const SEMANTIC: Record<
  SemanticType,
  { label: string; icon: React.ComponentType<{ className?: string }>; tone: string }
> = {
  fact: { label: 'Fact', icon: Star, tone: 'text-cyan-500' },
  dimension: { label: 'Dimension', icon: Box, tone: 'text-blue-500' },
  time: { label: 'Time dimension', icon: Clock, tone: 'text-orange-500' },
  metric: { label: 'Metric', icon: BarChart3, tone: 'text-green-500' },
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

function SemanticIcon({ type }: { type: SemanticType }) {
  const { icon: Icon, tone } = SEMANTIC[type];
  return (
    <span className={`inline-flex h-5 w-5 items-center justify-center rounded ${tone}`}>
      <Icon className="h-4 w-4" />
    </span>
  );
}

function MetadataGrid(
  args: Partial<React.ComponentProps<typeof DataTable<Field>>>,
) {
  const [data, setData] = React.useState<Field[]>(seed);

  const patch = React.useCallback(
    (id: string, changes: Partial<Field>) =>
      setData((prev) => prev.map((r) => (r.id === id ? { ...r, ...changes } : r))),
    [],
  );

  // Cell padding is owned by the consumer via meta.cellClassName so the
  // always-on controls sit flush; the default `p-2` is replaced with `px-3 py-2`.
  const cellCls = 'px-3 py-2 align-middle';

  const columns: ColumnDef<Field, any>[] = React.useMemo(
    () => [
      {
        id: 'name',
        accessorKey: 'name',
        header: '',
        size: 240,
        meta: { cellClassName: cellCls, headerClassName: 'px-3' },
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <SemanticIcon type={row.original.semanticType} />
            <span className="font-medium">{row.original.name}</span>
          </div>
        ),
      },
      {
        id: 'include',
        header: 'Include in semantic model',
        size: 200,
        meta: { cellClassName: cellCls, headerClassName: 'px-3' },
        cell: ({ row }) => (
          <label className="flex items-center gap-2">
            <Checkbox
              checked={row.original.include}
              onCheckedChange={(v) => patch(row.original.id, { include: v === true })}
            />
            <span>Include</span>
          </label>
        ),
      },
      {
        id: 'dataType',
        header: 'Data type',
        size: 160,
        meta: { cellClassName: cellCls, headerClassName: 'px-3' },
        cell: ({ row }) =>
          row.original.dataType === '' ? (
            <span className="pl-1 text-muted-foreground">—</span>
          ) : (
            <Select
              value={row.original.dataType}
              onValueChange={(v) =>
                patch(row.original.id, { dataType: v as Field['dataType'] })
              }
            >
              <SelectTrigger className="h-8 font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DATA_TYPES.map((t) => (
                  <SelectItem key={t} value={t} className="font-mono">
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
        meta: { cellClassName: cellCls, headerClassName: 'px-3' },
        cell: ({ row }) => (
          <Input
            value={row.original.logicalName}
            onChange={(e) => patch(row.original.id, { logicalName: e.target.value })}
            className="h-8"
          />
        ),
      },
      {
        id: 'semanticType',
        header: 'Semantic type',
        size: 220,
        meta: { cellClassName: cellCls, headerClassName: 'px-3' },
        cell: ({ row }) => (
          <Select
            value={row.original.semanticType}
            onValueChange={(v) =>
              patch(row.original.id, { semanticType: v as SemanticType })
            }
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(SEMANTIC) as SemanticType[]).map((t) => (
                <SelectItem key={t} value={t}>
                  <span className="flex items-center gap-2">
                    <SemanticIcon type={t} />
                    {SEMANTIC[t].label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ),
      },
      {
        id: 'synonyms',
        header: 'Synonyms',
        size: 220,
        meta: { cellClassName: cellCls, headerClassName: 'px-3' },
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.synonyms}</span>
        ),
      },
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
      enablePagination={false}
      enableColumnVisibility={false}
      footer={
        <span>
          {data.length} fields · {metrics} metric · 1 filter
        </span>
      }
    />
  );
}

const meta: Meta<typeof DataTable<Field>> = {
  title: 'Data Tables/Static/Metadata Grid',
  component: DataTable<Field>,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const MetadataGridStory: Story = {
  name: 'Metadata Grid',
  render: () => <MetadataGrid />,
};
