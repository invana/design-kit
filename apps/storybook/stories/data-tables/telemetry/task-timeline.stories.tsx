import type { Meta, StoryObj } from "@storybook/react-vite";
import { PanelBox, TaskGantt } from "@invana/ui";
import { EVENTS, RUN_SPAN_MS, formatMs, ganttTasks } from "./fixtures";

const meta: Meta = {
  title: "Data Tables/Telemetry/Task Timeline",
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof meta>;

const TASKS = ganttTasks();
const FAILED = TASKS.filter((t) => t.status === "failed").length;

/**
 * The log folded into one row per task, in plan order, on the run's clock.
 *
 * Empty track before a bar is time the task waited — for a slot, or for the
 * tasks it depends on (`analyse` waits on all five fetches). `fetch_filings`
 * carries its rate-limited first attempt in red to the left of the retry that
 * stuck; `analyse.risk` failed and was not retried. Hover a row for its agent,
 * slots, call count, tokens and last log line.
 */
export const TaskTimeline: Story = {
  render: () => (
    <PanelBox
      title="Timeline"
      aside={`${formatMs(RUN_SPAN_MS)} · ${TASKS.length} tasks · ${FAILED} failed · ${EVENTS.length} events`}
    >
      <TaskGantt
        tasks={TASKS}
        spanMs={RUN_SPAN_MS}
        ticks={9}
        detailProps={{ width: 300 }}
      />
    </PanelBox>
  ),
};
