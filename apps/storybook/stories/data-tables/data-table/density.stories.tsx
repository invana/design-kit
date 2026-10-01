import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable, type ColumnDef } from "@invana/tables";
import { Badge, SegmentedControl, type TableDensity } from "@invana/ui";

type Dataset = {
  name: string;
  owner: string;
  rows: number;
  freshness: string;
  status: "fresh" | "stale" | "failing";
};

const DATA: Dataset[] = [
  {
    name: "orders_daily",
    owner: "Finance",
    rows: 1_204_311,
    freshness: "12 min ago",
    status: "fresh",
  },
  {
    name: "supplier_routes",
    owner: "Ops",
    rows: 48_220,
    freshness: "3 h ago",
    status: "stale",
  },
  {
    name: "fx_rates",
    owner: "Finance",
    rows: 9_870,
    freshness: "1 min ago",
    status: "fresh",
  },
  {
    name: "filings_10q",
    owner: "Research",
    rows: 3_812,
    freshness: "2 d ago",
    status: "failing",
  },
  {
    name: "news_mentions",
    owner: "Research",
    rows: 211_004,
    freshness: "40 min ago",
    status: "fresh",
  },
  {
    name: "store_footfall",
    owner: "Retail",
    rows: 88_512,
    freshness: "6 h ago",
    status: "stale",
  },
];

const TONE = { fresh: "success", stale: "warning", failing: "muted" } as const;

const COLUMNS: ColumnDef<Dataset, unknown>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Dataset",
    size: 200,
    meta: { mono: true },
  },
  { id: "owner", accessorKey: "owner", header: "Owner", size: 120 },
  {
    id: "rows",
    accessorKey: "rows",
    header: "Rows",
    size: 110,
    meta: { mono: true, align: "right" },
    cell: ({ getValue }) => (getValue() as number).toLocaleString(),
  },
  { id: "freshness", accessorKey: "freshness", header: "Updated", size: 120 },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    size: 100,
    cell: ({ getValue }) => {
      const v = getValue() as Dataset["status"];
      return (
        <Badge variant="soft" tone={TONE[v]} size="xs">
          {v}
        </Badge>
      );
    },
  },
];

const DENSITIES = [
  { value: "compact", label: "Compact" },
  { value: "default", label: "Default" },
  { value: "comfortable", label: "Comfortable" },
];

const meta: Meta = {
  title: "Data Tables/DataTable",
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Three sizes, one prop. `compact` (26px rows) is a log, a trace, a step's
 * output; `default` (34px at a 13px root) is a list in an application;
 * `comfortable` (44px) is a table standing alone on a page.
 *
 * Only the row height and the cell padding move. The type does not — every
 * density reads at the root size, so switching one never changes what a
 * number looks like, only how much air is around it.
 */
export const Density: Story = {
  render: function Render() {
    const [density, setDensity] = React.useState<TableDensity>("default");
    return (
      <DataTable<Dataset>
        columns={COLUMNS}
        data={DATA}
        density={density}
        toolbar={
          <SegmentedControl
            size="sm"
            options={DENSITIES}
            value={density}
            onValueChange={(v) => setDensity(v as TableDensity)}
          />
        }
      />
    );
  },
};
