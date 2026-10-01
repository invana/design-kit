import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable } from "@invana/tables";
import { AGENTS, EVENTS, taskDepth, type TelemetryEvent } from "./fixtures";
import { LOG_COLUMNS } from "./log";

const meta: Meta = {
  title: "Data Tables/Telemetry/Grouped by Agent",
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Agent first, then time — `groupBy` sections a list that already arrives in order. */
const BY_AGENT = [...EVENTS].sort(
  (a, b) =>
    AGENTS.indexOf(a.agent) - AGENTS.indexOf(b.agent) ||
    a.offsetMs - b.offsetMs,
);

/** Task leads here, so `rowIndent` can push a subtask's events in under its parent's. */
const COLUMNS = [
  LOG_COLUMNS.find((c) => c.id === "task")!,
  ...LOG_COLUMNS.filter((c) => c.id !== "task" && c.id !== "agent"),
];

/**
 * The same log, read per agent: what the planner did, then every researcher
 * fetch, then the analyst and its two subtasks. A subtask's events indent
 * under the task that split it, so the planner → analyse → analyse.risk chain
 * reads down the first column. Click a row to mark it.
 */
export const GroupedByAgent: Story = {
  render: function Render() {
    const [selected, setSelected] = React.useState<number | null>(null);
    return (
      <DataTable<TelemetryEvent>
        columns={COLUMNS}
        data={BY_AGENT}
        density="compact"
        enablePagination={false}
        groupBy={(e) => e.agent}
        renderGroupHeader={(agent, rows) => `${agent} · ${rows.length} events`}
        rowIndent={(e) => taskDepth(e.taskKey)}
        isRowSelected={(e) => e.seq === selected}
        onRowClick={(e) => setSelected(e.seq === selected ? null : e.seq)}
      />
    );
  },
};
