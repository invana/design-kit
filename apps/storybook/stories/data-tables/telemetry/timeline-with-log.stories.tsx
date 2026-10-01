import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { PaginatedTable } from "@invana/tables";
import { FilterChip, PanelBox, TaskGantt } from "@invana/ui";
import {
  EVENTS,
  RUN_SPAN_MS,
  formatOffset,
  ganttTasks,
  type TelemetryEvent,
} from "./fixtures";
import { EMPTY_FILTER, LOG_COLUMNS, LogFilterBar, applyLogFilter } from "./log";

const meta: Meta = {
  title: "Data Tables/Telemetry/Timeline with Log",
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof meta>;

const TASKS = ganttTasks();

/**
 * The timeline over the log, each one steering the other.
 *
 * - **Pick a task** on the timeline and the log narrows to its events — a
 *   `task` chip joins the filters, and its × lets the whole log back in.
 * - **Pick an event** in the log and the timeline marks its task and drops a
 *   line at the event's moment, so a `retry_scheduled` or a `429` lands on
 *   the bar it happened inside.
 *
 * The line reuses `TaskGantt`'s `nowMs`, which exists for a run in flight — a
 * cursor that is not *now* is a gap in the component, borrowed here.
 */
export const TimelineWithLog: Story = {
  render: function Render() {
    const [taskFilter, setTaskFilter] = React.useState<string | null>(null);
    const [event, setEvent] = React.useState<TelemetryEvent | null>(null);
    const [filter, setFilter] = React.useState(EMPTY_FILTER);

    const rows = React.useMemo(
      () =>
        applyLogFilter(EVENTS, filter).filter(
          (e) => !taskFilter || e.taskKey === taskFilter,
        ),
      [filter, taskFilter],
    );

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
              setTaskFilter(key === taskFilter ? null : key);
              setEvent(null);
            }}
            detailProps={{ width: 300 }}
          />
        </PanelBox>
        <PanelBox title="Log">
          <PaginatedTable<TelemetryEvent>
            columns={LOG_COLUMNS}
            data={rows}
            density="compact"
            seamless
            searchable={false}
            pageSize={15}
            pageSizeOptions={[15, 30, 60]}
            isRowSelected={(e) => e.seq === event?.seq}
            onRowClick={(e) => setEvent(e.seq === event?.seq ? null : e)}
            toolbar={
              <LogFilterBar
                filter={filter}
                onChange={setFilter}
                shown={rows.length}
                total={EVENTS.length}
              >
                {taskFilter ? (
                  <FilterChip
                    label="task"
                    value={taskFilter}
                    active
                    onRemove={() => setTaskFilter(null)}
                  />
                ) : null}
              </LogFilterBar>
            }
          />
        </PanelBox>
      </div>
    );
  },
};
