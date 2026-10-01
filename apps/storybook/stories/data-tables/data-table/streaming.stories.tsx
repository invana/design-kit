import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable, type ColumnDef, type TableStream } from "@invana/tables";
import { Badge, Button } from "@invana/ui";
import {
  EVALUATIONS,
  type Evaluation,
  type Verdict,
} from "../usecases/fixtures";

const meta: Meta = {
  title: "Data Tables/DataTable",
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof meta>;

const TONE: Record<Verdict, "destructive" | "warning" | "success" | "info" | "muted"> = {
  denied: "destructive",
  egress: "destructive",
  warn: "warning",
  approved: "success",
  allow: "success",
  masked: "info",
};

const columns: ColumnDef<Evaluation>[] = [
  { id: "at", accessorKey: "at", header: "Time", size: 84, meta: { mono: true } },
  {
    id: "verdict",
    accessorKey: "verdict",
    header: "Verdict",
    size: 104,
    cell: ({ row }) => (
      <Badge variant="soft" tone={TONE[row.original.verdict]} size="xs">
        {row.original.verdict}
      </Badge>
    ),
  },
  { id: "policy", accessorKey: "policy", header: "Policy", size: 150, meta: { mono: true } },
  { id: "sid", accessorKey: "sid", header: "Session", size: 80, meta: { mono: true } },
  { id: "text", accessorKey: "text", header: "What happened" },
];

/** Where the stream starts — a constant, since a new `data` starts the rows over. */
const SEED = EVALUATIONS.slice(0, 6);

function clock(sec: number): string {
  const h = Math.floor(sec / 3600) % 24;
  const m = Math.floor(sec / 60) % 60;
  const s = sec % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

/**
 * A stand-in for a socket: every 700ms, one to three evaluations replayed
 * from the fixtures with a new time. A real source would open an
 * `EventSource` or a `WebSocket` here and return what closes it.
 */
let sec = 10 * 3600 + 16 * 60 + 3;
let i = 0;
const evaluations: TableStream<Evaluation> = (emit) => {
  // The clock lives outside, so going live again picks up where it paused.
  const timer = setInterval(() => {
    const batch = Array.from({ length: 1 + (i % 3) }, () => {
      const source = EVALUATIONS[i++ % EVALUATIONS.length]!;
      return { ...source, at: clock(sec++) };
    });
    emit(batch);
  }, 700);
  return () => clearInterval(timer);
};

/**
 * `streaming` subscribes: the button turns it on and off, and off closes the
 * source, so nothing arrives while paused. Each batch goes on top
 * (`streamMode="prepend"`, the default) with a tint that fades, and
 * `maxRows` keeps the newest 20 — the oldest fall off the bottom.
 */
export const Streaming: Story = {
  render: function Render() {
    const [live, setLive] = React.useState(true);
    return (
      <DataTable
        columns={columns}
        data={SEED}
        density="compact"
        enableSorting={false}
        streaming={live}
        stream={evaluations}
        streamMode="prepend"
        maxRows={20}
        toolbar={
          <Button size="xs" variant="outline" onClick={() => setLive((on) => !on)}>
            {live ? "Pause" : "Go live"}
          </Button>
        }
      />
    );
  },
};
