import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  DataTable,
  applyCellEdit,
  type CellEdit,
  type CellEditHandler,
  type ColumnDef,
} from "@invana/tables";
import {
  PropertyList,
  PropertyRow,
  SegmentedControl,
  type TableDensity,
} from "@invana/ui";

type Schedule = {
  id: string;
  name: string;
  owner: string;
  everyMinutes: number | null;
  lastRun: string;
};

const SEED: Schedule[] = [
  {
    id: "s1",
    name: "Refresh orders_daily",
    owner: "finance",
    everyMinutes: 15,
    lastRun: "12:04",
  },
  {
    id: "s2",
    name: "Rebuild supplier graph",
    owner: "ops",
    everyMinutes: 60,
    lastRun: "11:00",
  },
  {
    id: "s3",
    name: "Pull fx_rates",
    owner: "finance",
    everyMinutes: 5,
    lastRun: "12:10",
  },
  {
    id: "s4",
    name: "Scan new filings",
    owner: "research",
    everyMinutes: null,
    lastRun: "—",
  },
  {
    id: "s5",
    name: "Score news mentions",
    owner: "research",
    everyMinutes: 30,
    lastRun: "11:45",
  },
];

const OWNERS = [
  { label: "Finance", value: "finance" },
  { label: "Ops", value: "ops" },
  { label: "Research", value: "research" },
];

const COLUMNS: ColumnDef<Schedule, unknown>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Schedule",
    size: 240,
    meta: { editable: true },
  },
  {
    id: "owner",
    accessorKey: "owner",
    header: "Owner",
    size: 140,
    meta: { editable: true, editType: "select", options: OWNERS },
  },
  {
    id: "everyMinutes",
    accessorKey: "everyMinutes",
    header: "Every (min)",
    size: 110,
    meta: { editable: true, editType: "number", align: "right", mono: true },
  },
  {
    id: "lastRun",
    accessorKey: "lastRun",
    header: "Last run",
    size: 90,
    meta: { mono: true, align: "right" },
  },
];

const DENSITIES = [
  { value: "compact", label: "Compact" },
  { value: "default", label: "Default" },
  { value: "comfortable", label: "Comfortable" },
];

/** A save that takes a moment, and refuses a schedule tighter than five minutes. */
const save = (value: unknown) =>
  new Promise<void>((resolve, reject) =>
    setTimeout(() => {
      if (typeof value === "number" && value < 5)
        reject(new Error("Runs at most every 5 minutes"));
      else resolve();
    }, 700),
  );

const meta: Meta = {
  title: "Data Tables/DataTable",
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Cells that edit in place — text, a number, a choice. Click a value (or
 * `Enter` on it), change it, and `Enter` or leaving the field saves; `Escape`
 * puts it back. Focus comes back to the cell, so `Tab` walks on.
 *
 * The editor is drawn in the same box as the value, so nothing shifts when it
 * opens — switch to `Compact` and the 26px rows hold. An emptied number saves
 * as none (`—`), not `0`.
 *
 * `onCellEdit` here returns a promise: the new value shows as saving for a
 * moment, and a schedule under five minutes is refused — the old value comes
 * back, the cell is marked, and hovering it says why.
 *
 * The footer shows what `onCellEdit` received — the row's id, the field the
 * column reads, the old and new values — which is what a `PATCH` to a server
 * needs; `applyCellEdit(rows, edit)` writes it into the story's own state.
 */
export const InlineEdit: Story = {
  render: function Render() {
    const [rows, setRows] = React.useState(SEED);
    const [density, setDensity] = React.useState<TableDensity>("default");

    const [last, setLast] = React.useState<{
      edit: CellEdit<Schedule>;
      outcome: string;
    } | null>(null);

    const onCellEdit: CellEditHandler<Schedule> = async (edit) => {
      setLast({ edit, outcome: "saving…" });
      try {
        await save(edit.value);
      } catch (error) {
        setLast({ edit, outcome: `refused — ${(error as Error).message}` });
        throw error;
      }
      setLast({ edit, outcome: "saved" });
      setRows((all) => applyCellEdit(all, edit));
    };

    return (
      <DataTable<Schedule>
        columns={COLUMNS}
        data={rows}
        getRowId={(r) => r.id}
        density={density}
        enableSorting={false}
        onCellEdit={onCellEdit}
        toolbar={
          <SegmentedControl
            options={DENSITIES}
            value={density}
            onValueChange={(v) => setDensity(v as TableDensity)}
          />
        }
        footer={
          last ? (
            <PropertyList labelWidth={96}>
              <PropertyRow label="rowId" mono>
                {last.edit.rowId}
              </PropertyRow>
              <PropertyRow label="field" mono>
                {last.edit.field}
              </PropertyRow>
              <PropertyRow label="previousValue" mono>
                {JSON.stringify(last.edit.previousValue)}
              </PropertyRow>
              <PropertyRow label="value" mono>
                {JSON.stringify(last.edit.value)}
              </PropertyRow>
              <PropertyRow label="outcome">{last.outcome}</PropertyRow>
            </PropertyList>
          ) : (
            "Edit a cell — what onCellEdit receives shows here."
          )
        }
      />
    );
  },
};
