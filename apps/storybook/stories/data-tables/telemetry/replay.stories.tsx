import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable } from "@invana/tables";
import {
  Button,
  ButtonGroup,
  PanelBox,
  SegmentedControl,
  TaskGantt,
} from "@invana/ui";
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import {
  EVENTS,
  RUN_SPAN_MS,
  eventsUntil,
  formatOffset,
  ganttTasks,
  slotLaneTasks,
  type TelemetryEvent,
} from "./fixtures";
import { LOG_COLUMNS } from "./log";

const meta: Meta = {
  title: "Data Tables/Telemetry/Replay",
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof meta>;

const SPEEDS = [
  { value: "0.25", label: "¼×" },
  { value: "0.5", label: "½×" },
  { value: "1", label: "1×" },
  { value: "2", label: "2×" },
];

const TAIL = 12;

/** Advances `now` on animation frames while playing; stops itself at the end. */
function useClock(
  playing: boolean,
  speed: number,
  setNow: React.Dispatch<React.SetStateAction<number>>,
  onEnd: () => void,
) {
  React.useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    let frame = requestAnimationFrame(function tick(t) {
      const dt = (t - last) * speed;
      last = t;
      setNow((n) => {
        const next = Math.min(n + dt, RUN_SPAN_MS);
        if (next >= RUN_SPAN_MS) onEnd();
        return next;
      });
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [playing, speed, setNow, onEnd]);
}

/**
 * The run replayed from its log, so you can watch it happen rather than read
 * it afterwards. Tasks appear as outlines when spawned and fill as they run;
 * the slot lanes show three fetches start at once and the rest queue; the red
 * attempt and the failure land when they happened; the log tails the newest
 * events.
 *
 * Every view is the same function of the log cut at *now* — nothing is
 * animated on its own. **Step** jumps to the next event; **click a log row**
 * to jump back to its moment. There is no scrubber: the kit has no slider
 * outside `@invana/forms`, which is a gap this story surfaces.
 */
export const Replay: Story = {
  render: function Render() {
    const [now, setNow] = React.useState(0);
    const [playing, setPlaying] = React.useState(false);
    const [speed, setSpeed] = React.useState("1");
    const stop = React.useCallback(() => setPlaying(false), []);
    useClock(playing, Number(speed), setNow, stop);

    const seen = eventsUntil(now);
    const tasks = React.useMemo(() => ganttTasks(now), [now]);
    const lanes = React.useMemo(() => slotLaneTasks(now), [now]);
    const tail = seen.slice(-TAIL).reverse();
    const ended = now >= RUN_SPAN_MS;
    const next = EVENTS.find((e) => e.offsetMs > now);

    const play = () => {
      if (ended) setNow(0);
      setPlaying(!playing);
    };

    return (
      <div className="flex flex-col gap-3">
        <ButtonGroup>
          <Button size="sm" variant="outline" onClick={play}>
            {playing ? <Pause /> : <Play />}
            {playing ? "Pause" : ended ? "Replay" : "Play"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={!next}
            onClick={() => {
              setPlaying(false);
              if (next) setNow(next.offsetMs);
            }}
          >
            <SkipForward />
            Step
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setPlaying(false);
              setNow(0);
            }}
          >
            <RotateCcw />
            Reset
          </Button>
        </ButtonGroup>
        <SegmentedControl
          size="sm"
          options={SPEEDS}
          value={speed}
          onValueChange={setSpeed}
        />

        <PanelBox
          title="Timeline"
          aside={`${formatOffset(now)} · ${tasks.length} tasks · ${seen.length} of ${EVENTS.length} events`}
        >
          <TaskGantt
            tasks={tasks}
            spanMs={RUN_SPAN_MS}
            ticks={9}
            nowMs={ended ? undefined : now}
            openEnded={!ended}
            showDetail={!playing}
            labelWidth={132}
          />
        </PanelBox>
        <PanelBox title="Worker slots">
          <TaskGantt
            tasks={lanes}
            spanMs={RUN_SPAN_MS}
            ticks={9}
            nowMs={ended ? undefined : now}
            showDetail={false}
            labelWidth={132}
          />
        </PanelBox>
        <PanelBox
          title="Log"
          aside={`newest first · last ${tail.length} of ${seen.length}`}
        >
          <DataTable<TelemetryEvent>
            columns={LOG_COLUMNS}
            data={tail}
            density="compact"
            seamless
            enablePagination={false}
            enableColumnVisibility={false}
            onRowClick={(e) => {
              setPlaying(false);
              setNow(e.offsetMs);
            }}
            emptyState="Press play — the run has not started."
          />
        </PanelBox>
      </div>
    );
  },
};
