import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { DataTable, type ColumnDef, type ExpandedState } from "@invana/tables";
import {
  AgentChip,
  Badge,
  Button,
  ButtonGroup,
  PropertyList,
  PropertyRow,
} from "@invana/ui";

import { jsx, snippet } from "../../_story/source";
import { VariantBoard, type Log } from "../../_story/variant-board";
import { columnsSource } from "../columns";
import {
  EVENTS,
  TASK_KEYS,
  formatMs,
  formatOffset,
  ganttTasks,
  type TelemetryEvent,
} from "./fixtures";
import { KindBadge } from "./log";

/** A task, or one of its events — the two kinds of row in the tree. */
type TreeRow = {
  id: string;
  name: string;
  agent: string;
  offsetMs: number;
  tookMs?: number;
  summary: string;
  task?: { status: string; events: number };
  event?: TelemetryEvent;
  children?: TreeRow[];
};

const TASKS = new Map(ganttTasks().map((t) => [t.key, t]));
const PARENT = new Map(
  EVENTS.filter((e) => e.taskKey).map((e) => [e.taskKey!, e.parentKey]),
);

/** A task's own events first, in time order, then the tasks it split into. */
function taskRow(key: string): TreeRow {
  const own = EVENTS.filter((e) => e.taskKey === key);
  const g = TASKS.get(key)!;
  const attempts = [...(g.attempts ?? []), g];
  const first = attempts[0]?.startMs ?? own[0].offsetMs;
  const last = attempts[attempts.length - 1];
  return {
    id: key,
    name: key,
    agent: own[0].agent,
    offsetMs: first,
    tookMs:
      last?.startMs != null
        ? last.startMs + (last.durationMs ?? 0) - first
        : undefined,
    summary: String(g.summary ?? ""),
    task: { status: g.status ?? "queued", events: own.length },
    children: [
      ...own.map((e) => ({
        id: `e${e.seq}`,
        name: e.kind,
        agent: e.agent,
        offsetMs: e.offsetMs,
        tookMs: e.durationMs,
        summary: e.detail,
        event: e,
      })),
      ...TASK_KEYS.filter((k) => PARENT.get(k) === key).map(taskRow),
    ],
  };
}

const TREE: TreeRow[] = [taskRow("plan")];

const STATUS: Record<string, React.ReactNode> = {
  succeeded: (
    <Badge variant="soft" tone="success" size="xs">
      succeeded
    </Badge>
  ),
  failed: (
    <Badge variant="destructive" size="xs">
      failed
    </Badge>
  ),
};

const COLUMNS: ColumnDef<TreeRow, unknown>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Task / event",
    size: 250,
    cell: ({ row }) =>
      row.original.event ? (
        <KindBadge
          kind={row.original.event.kind}
          level={row.original.event.level}
        />
      ) : (
        row.original.name
      ),
  },
  {
    id: "status",
    header: "Status",
    size: 100,
    cell: ({ row }) =>
      row.original.task
        ? STATUS[row.original.task.status]
        : row.original.event?.slot
          ? `${row.original.event.slot}${row.original.event.attempt! > 1 ? ` #${row.original.event.attempt}` : ""}`
          : "—",
  },
  {
    id: "agent",
    accessorKey: "agent",
    header: "Agent",
    size: 110,
    cell: ({ getValue }) => <AgentChip name={getValue() as string} />,
  },
  {
    id: "offset",
    accessorKey: "offsetMs",
    header: "t",
    size: 84,
    meta: { mono: true, align: "right" },
    cell: ({ getValue }) => formatOffset(getValue() as number),
  },
  {
    id: "took",
    accessorKey: "tookMs",
    header: "Took",
    size: 72,
    meta: { mono: true, align: "right" },
    cell: ({ getValue }) => formatMs(getValue() as number | undefined),
  },
  {
    id: "summary",
    accessorKey: "summary",
    header: "Detail",
    size: 340,
    enableSorting: false,
  },
];

const VARIANTS = [{ caption: "Task Tree", wide: true }];

/** Every task on the path to a failed one, plus its failure event. */
function failurePaths(): Record<string, boolean> {
  const open: Record<string, boolean> = {};
  for (const e of EVENTS.filter((ev) => ev.kind === "task_failed")) {
    open[`e${e.seq}`] = true;
    for (let k: string | undefined = e.taskKey; k; k = PARENT.get(k)) open[k] = true;
  }
  return open;
}

const resolve = <T,>(next: T | ((old: T) => T), old: T) =>
  typeof next === "function" ? (next as (old: T) => T)(old) : next;

interface Args {
  onExpandedChange: (expanded: ExpandedState) => void;
}

function Live({ log, onExpandedChange }: Args & { log: Log }) {
  const [expanded, setExpanded] = React.useState<ExpandedState>({ plan: true });
  const change = (next: ExpandedState, by: string) => {
    onExpandedChange(next);
    log(by, next);
    setExpanded(next);
  };

  return (
    <DataTable<TreeRow>
      columns={COLUMNS}
      data={TREE}
      density="compact"
      getSubRows={(r) => r.children}
      getRowId={(r) => r.id}
      expanded={expanded}
      onExpandedChange={(next) => change(resolve(next, expanded), "onExpandedChange")}
      canExpand={(r) => r.event != null}
      expandOnRowClick
      enableSorting={false}
      toolbar={
        <ButtonGroup>
          <Button size="xs" variant="outline" onClick={() => change(failurePaths(), "Open failures")}>
            Open failures
          </Button>
          <Button size="xs" variant="outline" onClick={() => change({}, "Collapse all")}>
            Collapse all
          </Button>
        </ButtonGroup>
      }
      renderExpanded={(r) =>
        r.event ? (
          <PropertyList labelWidth={72}>
            <PropertyRow label="seq" mono>
              {r.event.seq}
            </PropertyRow>
            <PropertyRow label="ts" mono>
              {r.event.ts}
            </PropertyRow>
            <PropertyRow label="level" mono>
              {r.event.level}
            </PropertyRow>
            <PropertyRow label="parent" mono>
              {r.event.parentKey ?? "—"}
            </PropertyRow>
            <PropertyRow label="detail" mono>
              {r.event.detail}
            </PropertyRow>
          </PropertyList>
        ) : null
      }
    />
  );
}

const meta = {
  title: "Data Tables/Telemetry/Task Tree",
  parameters: {
    layout: "padded",
    docs: {
      source: {
        language: "tsx",
        code: snippet({
          imports: [
            "import { DataTable } from '@invana/tables';",
            "import { Button, ButtonGroup, PropertyList, PropertyRow } from '@invana/ui';",
          ],
          comment: "The plan, its tasks and their events as one tree — derived from fixtures/data-tables/telemetry-run.json",
          data: {
            tree: [{ ...TREE[0]!, children: TREE[0]!.children!.slice(0, 2).map(({ event: _e, ...r }) => r) }],
            columns: columnsSource(COLUMNS),
          },
          setup: [
            "// Which rows are open, by row id: { \"plan\": true, \"e14\": true }",
            "const [expanded, setExpanded] = React.useState({ plan: true });",
          ].join("\n"),
          call: jsx("DataTable", {
            columns: "columns",
            data: "tree",
            density: { literal: "compact" },
            getSubRows: "(r) => r.children",
            getRowId: "(r) => r.id",
            expanded: "expanded",
            onExpandedChange: "setExpanded",
            canExpand: "(r) => r.event != null",
            expandOnRowClick: "true",
            enableSorting: "false",
            toolbar:
              "(\n    <ButtonGroup>\n      <Button size=\"xs\" variant=\"outline\" onClick={() => setExpanded(failurePaths())}>Open failures</Button>\n      <Button size=\"xs\" variant=\"outline\" onClick={() => setExpanded({})}>Collapse all</Button>\n    </ButtonGroup>\n  )",
            renderExpanded:
              "(r) => (\n    <PropertyList labelWidth={72}>\n      <PropertyRow label=\"seq\" mono>{r.event.seq}</PropertyRow>\n      <PropertyRow label=\"detail\" mono>{r.event.detail}</PropertyRow>\n    </PropertyList>\n  )",
          }),
        }),
      },
    },
  },
  args: { onExpandedChange: fn() },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * The run as a tree: the plan, the tasks it split into, the subtasks those
 * split into — each task's own events listed under it before its children.
 * Open a task to see what it did; open an event for everything the engine
 * wrote about it.
 *
 * Both kinds of nesting in one table: `getSubRows` gives the child rows,
 * `renderExpanded` the payload under an event, and `canExpand` keeps the
 * payload to events. `expanded` is controlled so the plan starts open and
 * **Open failures** can reveal every task on the way to one.
 */
export const TaskTree: Story = {
  render: (args) => <VariantBoard variants={VARIANTS}>{(_v, log) => <Live {...args} log={log} />}</VariantBoard>,
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole("group", { name: "Task Tree" }));
    await step("Open every failure", async () => {
      await userEvent.click(cell.getByRole("button", { name: "Open failures" }));
      await expect(args.onExpandedChange).toHaveBeenCalledWith(failurePaths());
    });
    await step("The failed task's event is open, and the change is logged", async () => {
      // The event's row, and its detail open under it.
      await expect(cell.getAllByText(/schema_mismatch · ratings\.consensus/)).toHaveLength(2);
      await expect(cell.getByRole("list", { name: "Events" })).toHaveTextContent("Open failures");
    });
  },
};
