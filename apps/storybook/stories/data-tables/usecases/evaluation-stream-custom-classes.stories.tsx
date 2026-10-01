import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable, type ColumnDef } from "@invana/tables";
import { PanelBox, cn } from "@invana/ui";
import { EVALUATIONS, type Evaluation, type Verdict } from "./fixtures";

const meta: Meta = {
  title: "Data Tables/Usecases/Evaluation Stream (custom classes)",
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Each verdict's ground and its word's colour — what was stopped reads first. */
const VERDICT: Record<Verdict, { row?: string; text: string }> = {
  denied: { row: "bg-destructive/10 hover:bg-destructive/15", text: "text-destructive" },
  egress: { row: "bg-destructive/5 hover:bg-destructive/10", text: "text-destructive" },
  warn: { row: "bg-warning/10 hover:bg-warning/15", text: "text-warning" },
  approved: { row: "bg-success/10 hover:bg-success/15", text: "text-success" },
  masked: { text: "text-data-7" },
  allow: { text: "text-success" },
};

const columns: ColumnDef<Evaluation>[] = [
  {
    id: "at",
    accessorKey: "at",
    header: "Time",
    size: 72,
    meta: { mono: true, cellClassName: "text-muted-foreground" },
  },
  {
    id: "verdict",
    accessorKey: "verdict",
    header: "Verdict",
    size: 80,
    meta: {
      cellClassName: (e: Evaluation) => cn("font-semibold", VERDICT[e.verdict].text),
    },
  },
  {
    id: "policy",
    accessorKey: "policy",
    header: "Policy",
    size: 140,
    meta: { mono: true, cellClassName: "truncate" },
  },
  {
    id: "sid",
    accessorKey: "sid",
    header: "Session",
    size: 52,
    meta: { mono: true, cellClassName: "text-muted-foreground" },
  },
  {
    id: "text",
    accessorKey: "text",
    header: "What happened",
    meta: { cellClassName: "max-w-0 truncate text-base" },
  },
];

/**
 * Board 5 · Governance's evaluation stream, drawn entirely by the caller:
 * denials, egress and warnings travel one by one, newest first. `rowClassName`
 * tints each row by its verdict and rounds it into a pill with no rules
 * between; `meta.cellClassName` colours the verdict word by row and sets the
 * mono time, policy and session; `headerRowClassName` sets the caps header,
 * in line with the rows' padded first cell.
 */
export const EvaluationStreamCustomClasses: Story = {
  name: "Evaluation Stream (custom classes)",
  render: () => (
    <PanelBox
      title="Evaluation stream"
      aside="denials, egress and warnings travel one by one; routine allows are summed above"
    >
      <DataTable
        columns={columns}
        data={EVALUATIONS}
        seamless
        density="compact"
        enableSorting={false}
        minWidth={560}
        headerRowClassName="text-xs uppercase tracking-wider text-muted-foreground [&>th:first-child]:ps-1.5"
        rowClassName={(e) =>
          cn(
            "border-b-0 text-sm [&>td:first-child]:rounded-l [&>td:first-child]:ps-1.5 [&>td:last-child]:rounded-r [&>td:last-child]:pe-1.5",
            VERDICT[e.verdict].row,
          )
        }
      />
    </PanelBox>
  ),
};
