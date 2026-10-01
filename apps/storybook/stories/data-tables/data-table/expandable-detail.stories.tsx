import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable, type ColumnDef } from "@invana/tables";
import { Badge, PropertyList, PropertyRow } from "@invana/ui";

type Run = {
  id: string;
  workflow: string;
  status: "succeeded" | "failed" | "running" | "queued";
  started: string;
  duration: string;
  trigger: string;
  input: string;
  output?: string;
  cost?: string;
  error?: string;
};

const RUNS: Run[] = [
  {
    id: "run_7f3c",
    workflow: "market-brief",
    status: "failed",
    started: "14:02:00",
    duration: "9.2s",
    trigger: "schedule · hourly",
    input: "semis q3 · 12 tickers",
    output: "brief.md (risk section missing)",
    cost: "$0.041 · 31k tokens",
    error:
      'analyse.risk · schema_mismatch — ratings.consensus expected number, got "n/a" on 3 rows',
  },
  {
    id: "run_7f3b",
    workflow: "market-brief",
    status: "succeeded",
    started: "13:02:00",
    duration: "8.7s",
    trigger: "schedule · hourly",
    input: "semis q3 · 12 tickers",
    output: "brief.md · 17 figures grounded",
    cost: "$0.044 · 33k tokens",
  },
  {
    id: "run_7f3a",
    workflow: "supplier-graph",
    status: "running",
    started: "13:58:12",
    duration: "4m 10s",
    trigger: "manual · ravi",
    input: "suppliers_eu · 4,812 rows",
    cost: "$0.012 so far",
  },
  {
    id: "run_7f39",
    workflow: "fx-refresh",
    status: "succeeded",
    started: "13:55:00",
    duration: "1.1s",
    trigger: "schedule · 5 min",
    input: "USD, EUR, JPY, TWD",
    output: "4 rates written",
    cost: "$0.000",
  },
  {
    id: "run_7f38",
    workflow: "news-score",
    status: "queued",
    started: "—",
    duration: "—",
    trigger: "after fx-refresh",
    input: "news_mentions · since 13:30",
  },
];

const TONE = {
  succeeded: "success",
  failed: "muted",
  running: "info",
  queued: "muted",
} as const;

const COLUMNS: ColumnDef<Run, unknown>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "Run",
    size: 130,
    meta: { mono: true },
  },
  { id: "workflow", accessorKey: "workflow", header: "Workflow", size: 160 },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    size: 110,
    cell: ({ getValue }) => {
      const v = getValue() as Run["status"];
      return v === "failed" ? (
        <Badge variant="destructive" size="xs">
          failed
        </Badge>
      ) : (
        <Badge variant="soft" tone={TONE[v]} size="xs">
          {v}
        </Badge>
      );
    },
  },
  {
    id: "started",
    accessorKey: "started",
    header: "Started",
    size: 100,
    meta: { mono: true },
  },
  {
    id: "duration",
    accessorKey: "duration",
    header: "Took",
    size: 90,
    meta: { mono: true, align: "right" },
  },
];

const meta: Meta = {
  title: "Data Tables/DataTable",
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Anything under a row, the width of the table: `renderExpanded` draws it,
 * with no box of its own, in line with the row's content — here what a run
 * was given, what it made, what it cost, and why it failed.
 *
 * `canExpand` says which rows have something to show: a queued run has not
 * started, so it has no chevron, only the room one would take. The failed
 * run starts open.
 */
export const ExpandableDetail: Story = {
  render: () => (
    <DataTable<Run>
      columns={COLUMNS}
      data={RUNS}
      getRowId={(r) => r.id}
      canExpand={(r) => r.status !== "queued"}
      defaultExpanded={{ run_7f3c: true }}
      expandOnRowClick
      renderExpanded={(r) => (
        <PropertyList labelWidth={72}>
          <PropertyRow label="trigger">{r.trigger}</PropertyRow>
          <PropertyRow label="input" mono>
            {r.input}
          </PropertyRow>
          <PropertyRow label="output" mono>
            {r.output ?? "—"}
          </PropertyRow>
          <PropertyRow label="cost" mono>
            {r.cost ?? "—"}
          </PropertyRow>
          {r.error ? (
            <PropertyRow label="error" mono>
              {r.error}
            </PropertyRow>
          ) : null}
        </PropertyList>
      )}
    />
  ),
};
