import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable, type ColumnDef } from "@invana/tables";
import { Badge } from "@invana/ui";

type Node = {
  id: string;
  name: string;
  kind: "dataset" | "table" | "column";
  type?: string;
  rows?: number;
  updated?: string;
  children?: Node[];
};

const col = (table: string, name: string, type: string): Node => ({
  id: `${table}.${name}`,
  name,
  kind: "column",
  type,
});

const DATA: Node[] = [
  {
    id: "finance",
    name: "finance",
    kind: "dataset",
    rows: 1_214_181,
    updated: "1 min ago",
    children: [
      {
        id: "orders_daily",
        name: "orders_daily",
        kind: "table",
        rows: 1_204_311,
        updated: "12 min ago",
        children: [
          col("orders_daily", "order_id", "string"),
          col("orders_daily", "store_id", "string"),
          col("orders_daily", "amount", "decimal"),
          col("orders_daily", "placed_at", "timestamp"),
        ],
      },
      {
        id: "fx_rates",
        name: "fx_rates",
        kind: "table",
        rows: 9_870,
        updated: "1 min ago",
        children: [
          col("fx_rates", "pair", "string"),
          col("fx_rates", "rate", "decimal"),
          col("fx_rates", "as_of", "date"),
        ],
      },
    ],
  },
  {
    id: "research",
    name: "research",
    kind: "dataset",
    rows: 214_816,
    updated: "40 min ago",
    children: [
      {
        id: "filings_10q",
        name: "filings_10q",
        kind: "table",
        rows: 3_812,
        updated: "2 d ago",
      },
      {
        id: "news_mentions",
        name: "news_mentions",
        kind: "table",
        rows: 211_004,
        updated: "40 min ago",
        children: [
          col("news_mentions", "ticker", "string"),
          col("news_mentions", "sentiment", "float"),
          col("news_mentions", "published_at", "timestamp"),
        ],
      },
    ],
  },
  {
    id: "ops",
    name: "ops",
    kind: "dataset",
    rows: 48_220,
    updated: "3 h ago",
    children: [
      {
        id: "supplier_routes",
        name: "supplier_routes",
        kind: "table",
        rows: 48_220,
        updated: "3 h ago",
      },
    ],
  },
  {
    id: "retail",
    name: "retail",
    kind: "dataset",
    rows: 88_512,
    updated: "6 h ago",
    children: [
      {
        id: "store_footfall",
        name: "store_footfall",
        kind: "table",
        rows: 88_512,
        updated: "6 h ago",
      },
    ],
  },
];

const COLUMNS: ColumnDef<Node, unknown>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
    size: 260,
    meta: { mono: true },
  },
  {
    id: "kind",
    accessorKey: "kind",
    header: "Kind",
    size: 100,
    cell: ({ getValue }) => (
      <Badge variant="outline" tone="muted" size="xs">
        {getValue() as string}
      </Badge>
    ),
  },
  {
    id: "type",
    accessorKey: "type",
    header: "Type",
    size: 110,
    meta: { mono: true },
    cell: ({ getValue }) => (getValue() as string | undefined) ?? "—",
  },
  {
    id: "rows",
    accessorKey: "rows",
    header: "Rows",
    size: 110,
    meta: { mono: true, align: "right" },
    cell: ({ getValue }) =>
      (getValue() as number | undefined)?.toLocaleString() ?? "—",
  },
  {
    id: "updated",
    accessorKey: "updated",
    header: "Updated",
    size: 110,
    cell: ({ getValue }) => (getValue() as string | undefined) ?? "—",
  },
];

const meta: Meta = {
  title: "Data Tables/Static/DataTable",
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Rows under rows, with the same columns — datasets, their tables, a table's
 * columns. `getSubRows` is the whole API: a row with children gets a chevron,
 * each level steps in, and a leaf keeps the chevron's room so names line up.
 *
 * Click a row (or its chevron) to open it. Sort by Rows and each level sorts
 * among its siblings, so a table never leaves its dataset. The table pages by
 * datasets — three to a page — so opening one grows this page rather than
 * pushing a dataset onto the next.
 */
export const NestedRows: Story = {
  render: () => (
    <DataTable<Node>
      columns={COLUMNS}
      data={DATA}
      getSubRows={(n) => n.children}
      getRowId={(n) => n.id}
      expandOnRowClick
      enableColumnVisibility={false}
      pageSize={3}
    />
  ),
};
