import type { Meta, StoryObj } from "@storybook/react-vite";
import { PaginatedTable } from "@invana/tables";
import { EVENTS, type TelemetryEvent } from "./fixtures";
import { LOG_COLUMNS, LOG_FILTERS, LOG_SEARCH_COLUMNS } from "./log";

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
  render: () => (
    <PaginatedTable<TelemetryEvent>
      columns={LOG_COLUMNS}
      data={EVENTS}
      density="compact"
      filters={LOG_FILTERS}
      searchColumns={LOG_SEARCH_COLUMNS}
      searchPlaceholder="Search task or detail…"
      noun="events"
      enableColumnPinning
      pageSize={25}
      pageSizeOptions={[25, 50, 100]}
    />
  ),
};
