import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { DataTable, type ColumnDef } from "@invana/tables";
import { InlineMeter, Sparkline } from "@invana/charts";
import { PanelBox, StatusDot, cn } from "@invana/ui";

import { jsx, snippet } from "../../_story/source";
import { VariantBoard, type Log } from "../../_story/variant-board";
import {
  LAYERS,
  SESSIONS,
  formatCount,
  formatRate,
  formatRuntime,
  type Session,
  type SessionState,
} from "./fixtures";

/** The cell's subject is className passthrough, and its caption says so. */
const VARIANTS = [{ caption: "With custom classes", wide: true }];

const HEADER_ROW = "text-xs uppercase tracking-wider text-muted-foreground [&_button]:uppercase";

const STATE: Record<
  SessionState,
  { label: string; tone: "running" | "warning" | "error" | "muted"; text: string }
> = {
  running: { label: "running", tone: "running", text: "text-primary" },
  waiting: { label: "needs input", tone: "warning", text: "text-warning" },
  failed: { label: "failed", tone: "error", text: "text-destructive" },
  idle: { label: "idle", tone: "muted", text: "text-muted-foreground" },
};

const STEP_TEXT: Record<SessionState, string> = {
  running: "text-muted-foreground",
  waiting: "text-warning",
  failed: "text-destructive",
  idle: "text-muted-foreground",
};

const HOT = 0.8;

const columns: ColumnDef<Session>[] = [
  {
    id: "session",
    accessorKey: "id",
    header: "Session",
    size: 120,
    cell: ({ row }) => (
      <span className="flex min-w-0 flex-col">
        <span className="font-mono">{row.original.id}</span>
        <span className="truncate text-xs text-muted-foreground">
          {row.original.user}
        </span>
      </span>
    ),
  },
  {
    id: "conversation",
    accessorKey: "title",
    header: "Conversation · step",
    cell: ({ row }) => (
      <span className="flex min-w-0 flex-col">
        <span className="truncate">{row.original.title}</span>
        <span className={cn("truncate text-xs", STEP_TEXT[row.original.state])}>
          {row.original.step}
        </span>
      </span>
    ),
  },
  {
    id: "layers",
    header: "Layers",
    size: 92,
    enableSorting: false,
    cell: ({ row }) => (
      <span className="flex gap-1">
        {LAYERS.map((layer, i) => {
          const heat = row.original.heat[i] ?? 0;
          const lit = heat > 0.02;
          return (
            <span
              key={layer.id}
              title={layer.label}
              className={cn(
                "size-2.5 rounded-[3px] transition-opacity motion-reduce:transition-none",
                lit ? layer.swatch : "bg-muted",
              )}
              style={{ opacity: lit ? 0.25 + 0.75 * heat : 1 }}
            />
          );
        })}
      </span>
    ),
  },
  {
    id: "ops",
    accessorFn: (s) => s.ops[s.ops.length - 1] ?? 0,
    header: "ops/s · 15s",
    size: 150,
    cell: ({ row, getValue }) => {
      const rate = getValue() as number;
      const live = row.original.state === "running";
      return (
        <span className="flex items-center gap-2">
          <Sparkline
            values={row.original.ops}
            width={80}
            height={16}
            strokeWidth={1.5}
            endMarker={false}
            color={live ? "var(--color-primary)" : "var(--color-muted-foreground)"}
            className={cn(!live && "opacity-40")}
          />
          <span className={cn("font-mono", !live && "text-muted-foreground")}>
            {formatRate(rate)}
          </span>
        </span>
      );
    },
  },
  {
    id: "context",
    accessorKey: "context",
    header: "Context",
    size: 120,
    cell: ({ getValue }) => {
      const share = getValue() as number;
      const hot = share >= HOT;
      return (
        <InlineMeter
          value={share}
          tone={hot ? "warning" : "primary"}
          label="Context window held"
          className={cn(
            "[&>span:last-child]:font-mono",
            hot && "[&>span:last-child]:text-warning",
          )}
        />
      );
    },
  },
  {
    id: "tokens",
    accessorKey: "tokens",
    header: "Tokens",
    size: 64,
    meta: { align: "right", mono: true },
    cell: ({ getValue }) => formatCount(getValue() as number),
  },
  {
    id: "runtime",
    accessorKey: "runtime",
    header: "Runtime",
    size: 60,
    meta: {
      align: "right",
      mono: true,
      cellClassName: "text-muted-foreground",
    },
    cell: ({ getValue }) => formatRuntime(getValue() as number),
  },
  {
    id: "state",
    accessorKey: "state",
    header: "State",
    size: 104,
    meta: {
      cellClassName: (s: Session) => cn("whitespace-nowrap", STATE[s.state].text),
    },
    cell: ({ row }) => {
      const state = STATE[row.original.state];
      return (
        <span className="inline-flex items-center gap-1.5">
          <StatusDot tone={state.tone} size="md" />
          {state.label}
        </span>
      );
    },
  },
];

const running = SESSIONS.filter((s) => s.state === "running").length;
const waiting = SESSIONS.filter((s) => s.state === "waiting").length;
const ASIDE = `${running} running · ${waiting} waiting · click a row to scope`;

interface Args {
  onRowClick: (id: string | null) => void;
}

function Live({ log, onRowClick }: Args & { log: Log }) {
  const [picked, setPicked] = React.useState<string | null>(null);
  return (
    <PanelBox title="Sessions · live" aside={ASIDE}>
      <DataTable
        columns={columns}
        data={SESSIONS}
        seamless
        density="compact"
        minWidth={880}
        getRowId={(s) => s.id}
        isRowSelected={(s) => s.id === picked}
        onRowClick={(s) => {
          const next = picked === s.id ? null : s.id;
          onRowClick(next);
          log("onRowClick", next);
          setPicked(next);
        }}
        headerRowClassName={HEADER_ROW}
        rowClassName={(s) =>
          cn("transition-opacity motion-reduce:transition-none", picked != null && s.id !== picked && "opacity-55")
        }
      />
    </PanelBox>
  );
}

const meta = {
  title: "Data Tables/Usecases/Sessions (custom classes)",
  parameters: {
    layout: "padded",
    docs: {
      source: {
        language: "tsx",
        code: snippet({
          imports: ['import { DataTable } from "@invana/tables";', 'import { PanelBox, cn } from "@invana/ui";'],
          comment: "Every class arrives through a prop — rows from fixtures/data-tables/sessions.json",
          data: { sessions: SESSIONS.slice(0, 2) },
          setup: [
            "// A click scopes to the session; a second click on it clears the scope.",
            "const [picked, setPicked] = React.useState(null);",
          ].join("\n"),
          call: [
            `<PanelBox title="Sessions · live" aside="${ASIDE}">`,
            "  " +
              jsx("DataTable", {
                columns: "columns",
                data: "sessions",
                seamless: "true",
                density: { literal: "compact" },
                minWidth: "880",
                getRowId: "(s) => s.id",
                isRowSelected: "(s) => s.id === picked",
                onRowClick: "(s) => setPicked(picked === s.id ? null : s.id)",
                headerRowClassName: { literal: HEADER_ROW },
                rowClassName: '(s) => cn("transition-opacity", picked != null && s.id !== picked && "opacity-55")',
              }).replace(/\n/g, "\n  "),
            "</PanelBox>",
          ].join("\n"),
        }),
      },
    },
  },
  args: { onRowClick: fn() },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * Board 1 · Monitoring's sessions table, drawn entirely by the caller — this story's subject is
 * className passthrough, so it keeps its classes: every class arrives through a prop.
 * `headerRowClassName` sets the caps header, each column's `cell` builds its own content
 * (two-line cells, the six layer lights, sparkline beside its rate, the context meter) and
 * `meta.cellClassName` colours the state by row. Click a row to scope to it — `isRowSelected`
 * marks it, and `rowClassName` dims the other sessions.
 */
export const SessionsCustomClasses: Story = {
  name: "Sessions (custom classes)",
  render: (args) => <VariantBoard variants={VARIANTS}>{(_v, log) => <Live {...args} log={log} />}</VariantBoard>,
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole("group", { name: "With custom classes" }));
    const first = SESSIONS[0]!;
    await step("Scope to the first session", async () => {
      await userEvent.click(cell.getByText(first.title));
      await expect(args.onRowClick).toHaveBeenCalledWith(first.id);
    });
    await step("It is marked, the others dim, and the click is logged", async () => {
      await expect(cell.getByRole("row", { selected: true })).toHaveTextContent(first.title);
      await expect(cell.getAllByRole("row")[2]).toHaveClass("opacity-55");
      await expect(cell.getByRole("list", { name: "Events" })).toHaveTextContent(`"${first.id}"`);
    });
  },
};
