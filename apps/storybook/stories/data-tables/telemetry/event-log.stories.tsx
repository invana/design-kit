import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { PaginatedTable } from "@invana/tables";
import { EVENTS, type TelemetryEvent } from "./fixtures";
import { EMPTY_FILTER, LOG_COLUMNS, LogFilterBar, applyLogFilter } from "./log";

const meta: Meta = {
  title: "Data Tables/Telemetry/Event Log",
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The raw stream, one row per event — spawns, slot grabs, tool and model
 * calls, retries, failures — in the order the engine wrote them.
 *
 * `t` is the offset from the run's start, so a gap between two rows is time
 * nobody spent. Kind reads in its level's colour, so the one failure and the
 * one retry are findable before any filter is set.
 * Narrow by kind, agent or level, or search a task or a detail.
 */
export const EventLog: Story = {
  render: function Render() {
    const [filter, setFilter] = React.useState(EMPTY_FILTER);
    const rows = React.useMemo(() => applyLogFilter(EVENTS, filter), [filter]);

    return (
      <PaginatedTable<TelemetryEvent>
        columns={LOG_COLUMNS}
        data={rows}
        density="compact"
        searchable={false}
        enableColumnPinning
        pageSize={25}
        pageSizeOptions={[25, 50, 100]}
        toolbar={
          <LogFilterBar
            filter={filter}
            onChange={setFilter}
            shown={rows.length}
            total={EVENTS.length}
          />
        }
      />
    );
  },
};
