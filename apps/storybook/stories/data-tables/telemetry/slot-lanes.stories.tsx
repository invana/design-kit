import type { Meta, StoryObj } from "@storybook/react-vite";
import { PanelBox, PropertyList, PropertyRow, TaskGantt } from "@invana/ui";
import {
  RUN_SPAN_MS,
  SLOTS,
  formatMs,
  slotLaneTasks,
  slotRuns,
} from "./fixtures";

const meta: Meta = {
  title: "Data Tables/Telemetry/Slot Lanes",
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof meta>;

const LANES = slotRuns();
const TASKS = slotLaneTasks();

/**
 * The same run from the workers' side: what each of the three slots held, and
 * when it sat idle. Three fetches start together and the other two queue for a
 * slot; the filings retry lands on `w3` because `w2` was taken by then; after
 * the fetches the run narrows to one or two lanes. Hover a bar for its task,
 * a row for the lane's whole schedule.
 */
export const SlotLanes: Story = {
  render: () => (
    <PanelBox
      title="Worker slots"
      aside={`${SLOTS.length} slots · ${formatMs(RUN_SPAN_MS)}`}
    >
      <TaskGantt
        tasks={TASKS}
        spanMs={RUN_SPAN_MS}
        ticks={9}
        renderDetail={(lane) => (
          <PropertyList labelWidth={120}>
            {LANES[lane.key].map((r) => (
              <PropertyRow
                key={`${r.taskKey}-${r.attempt}`}
                label={r.taskKey}
                mono
              >
                {`${r.status} · ${formatMs(r.durationMs)}`}
              </PropertyRow>
            ))}
          </PropertyList>
        )}
      />
    </PanelBox>
  ),
};
