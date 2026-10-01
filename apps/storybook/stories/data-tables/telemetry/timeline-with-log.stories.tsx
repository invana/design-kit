import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { PaginatedTable, type FilterValues, type TableFilter } from "@invana/tables";
import { PanelBox, TaskGantt } from "@invana/ui";
import {
  EVENTS,
  RUN_SPAN_MS,
  formatOffset,
  ganttTasks,
  type TelemetryEvent,
} from "./fixtures";
import { LOG_COLUMNS, LOG_FILTERS, LOG_SEARCH_COLUMNS } from "./log";

const meta: Meta = {
  title: "Data Tables/Telemetry/Timeline with Log",
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof meta>;

const TASKS = ganttTasks();

/** The log's own chips, and a `task` chip the timeline sets — its choices are the tasks in the log. */
const FILTERS: TableFilter<TelemetryEvent>[] = [
  ...LOG_FILTERS,
  { id: "task", label: "task", single: true },
];

/**
 * The timeline over the log, each one steering the other.
 *
 * - **Pick a task** on the timeline and the log narrows to its events: the
 *   timeline sets the table's `task` filter (`filterValues`), and the chip's ×
 *   lets the whole log back in. The table does the filtering.
 * - **Pick an event** in the log and the timeline marks its task and drops a
 *   line at the event's moment, so a `retry_scheduled` or a `429` lands on
 *   the bar it happened inside.
 *
 * The line reuses `TaskGantt`'s `nowMs`, which exists for a run in flight — a
 * cursor that is not *now* is a gap in the component, borrowed here.
 */
export const TimelineWithLog: Story = {
  render: function Render() {
    const [filters, setFilters] = React.useState<FilterValues>({});
    const [event, setEvent] = React.useState<TelemetryEvent | null>(null);
    const taskFilter = filters.task?.[0] ?? null;

    return (
      <div className="flex flex-col gap-3">
        <PanelBox
          title="Timeline"
          aside={
            event
              ? `${formatOffset(event.offsetMs)} · ${event.kind}`
              : "pick a task to filter the log"
          }
        >
          <TaskGantt
            tasks={TASKS}
            spanMs={RUN_SPAN_MS}
            ticks={9}
            nowMs={event?.offsetMs}
            selectedKey={taskFilter ?? event?.taskKey ?? null}
            onSelectTask={(key) => {
              setFilters((f) => ({ ...f, task: key === taskFilter ? [] : [key] }));
              setEvent(null);
            }}
            detailProps={{ width: 300 }}
          />
        </PanelBox>
        <PanelBox title="Log">
          <PaginatedTable<TelemetryEvent>
            columns={LOG_COLUMNS}
            data={EVENTS}
            density="compact"
            seamless
            filters={FILTERS}
            filterValues={filters}
            onFiltersChange={setFilters}
            searchColumns={LOG_SEARCH_COLUMNS}
            searchPlaceholder="Search task or detail…"
            noun="events"
            pageSize={15}
            pageSizeOptions={[15, 30, 60]}
            isRowSelected={(e) => e.seq === event?.seq}
            onRowClick={(e) => setEvent(e.seq === event?.seq ? null : e)}
          />
        </PanelBox>
      </div>
    );
  },
};
