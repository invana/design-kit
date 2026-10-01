import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable, type ColumnDef, type TableStream } from "@invana/tables";
import { InlineMeter } from "@invana/charts";
import { Button, RunStatusText } from "@invana/ui";
import {
  SESSIONS,
  formatCount,
  formatRuntime,
  type Session,
} from "../usecases/fixtures";

const meta: Meta = {
  title: "Data Tables/DataTable",
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof meta>;

const STATUS = {
  running: "running",
  waiting: "held",
  failed: "failed",
  idle: "queued",
} as const;

const columns: ColumnDef<Session>[] = [
  { id: "id", accessorKey: "id", header: "Session", size: 80, meta: { mono: true } },
  { id: "title", accessorKey: "title", header: "Conversation" },
  {
    id: "context",
    accessorKey: "context",
    header: "Context",
    size: 130,
    cell: ({ getValue }) => {
      const share = getValue() as number;
      return (
        <InlineMeter
          value={share}
          tone={share >= 0.8 ? "warning" : "primary"}
          label="Context window held"
        />
      );
    },
  },
  {
    id: "tokens",
    accessorKey: "tokens",
    header: "Tokens",
    size: 80,
    meta: { mono: true, align: "right" },
    cell: ({ getValue }) => formatCount(getValue() as number),
  },
  {
    id: "runtime",
    accessorKey: "runtime",
    header: "Runtime",
    size: 80,
    meta: { mono: true, align: "right" },
    cell: ({ getValue }) => formatRuntime(getValue() as number),
  },
  {
    id: "state",
    accessorKey: "state",
    header: "State",
    size: 110,
    cell: ({ row }) => <RunStatusText status={STATUS[row.original.state]} />,
  },
];

/**
 * A stand-in for a socket: every 600ms, a running session reports its new
 * numbers — the whole row, as a server would send it.
 */
const sessionUpdates: TableStream<Session> = (emit) => {
  const current = new Map(SESSIONS.map((s) => [s.id, s]));
  const running = SESSIONS.filter((s) => s.state === "running").map((s) => s.id);
  let i = 0;
  const timer = setInterval(() => {
    const id = running[(i++ * 5) % running.length]!;
    const s = current.get(id)!;
    const next: Session = {
      ...s,
      tokens: s.tokens + 2_000 + ((i * 1_337) % 6_000),
      runtime: s.runtime + 3,
      context: Math.min(0.97, s.context + 0.01),
    };
    current.set(id, next);
    emit([next]);
  }, 600);
  return () => clearInterval(timer);
};

/**
 * `streamMode="upsert"`: a row that arrives with an id already in the table
 * replaces that row where it stands — tokens, runtime and context move, the
 * order does not — and briefly tints. `getRowId` is what matches them; an
 * unknown id would be appended.
 */
export const StreamingUpsert: Story = {
  name: "Streaming (upsert)",
  render: function Render() {
    const [live, setLive] = React.useState(true);
    return (
      <DataTable
        columns={columns}
        data={SESSIONS}
        density="compact"
        getRowId={(s) => s.id}
        streaming={live}
        stream={sessionUpdates}
        streamMode="upsert"
        toolbar={
          <Button size="xs" variant="outline" onClick={() => setLive((on) => !on)}>
            {live ? "Pause" : "Go live"}
          </Button>
        }
      />
    );
  },
};
