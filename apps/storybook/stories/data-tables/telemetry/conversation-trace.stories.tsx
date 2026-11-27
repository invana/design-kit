import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  Button,
  Gantt,
  Legend,
  LegendItem,
  PanelBox,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  Stack,
  ToolCallCard,
  type ExpandedKeys,
  type GanttRow,
  type ToolCallStatus,
} from '@invana/ui';

import { snippet } from '../../_story/source';
import { VariantGrid, type Log } from '../../_story/variant-grid';

/** Thinking is blue and idle grey; a call's green, red and the approval's outline are the Gantt's own. */
const PALETTE = { thinking: 'bg-info', idle: 'bg-muted-foreground/30' };

const SPAN_MS = 74_000;

interface Call {
  key: string;
  name: string;
  summary: string;
  startMs: number;
  durationMs: number;
  status: 'succeeded' | 'refused' | 'failed';
  writes?: boolean;
}

const CALLS: Call[] = [
  { key: 't1.1', name: 'get_model', summary: 'model Air · 4 labels', startMs: 2300, durationMs: 700, status: 'succeeded' },
  { key: 't1.2', name: 'read_records', summary: 'airport where iata = LHR · 1 row', startMs: 4600, durationMs: 1800, status: 'succeeded' },
  { key: 't1.3', name: 'read_records', summary: 'route from LHR · limit 500 · refused', startMs: 8300, durationMs: 200, status: 'refused' },
  { key: 't1.4', name: 'read_records', summary: 'route from LHR without price · 312 rows', startMs: 11_000, durationMs: 2400, status: 'succeeded' },
  { key: 't2.1', name: 'find_paths', summary: 'LHR → SIN · up to 3 hops · 9 paths', startMs: 33_000, durationMs: 6200, status: 'succeeded' },
  { key: 't2.2', name: 'propose_step', summary: 'add Air.airport.hub_rank · proposal #12', startMs: 43_000, durationMs: 1100, status: 'succeeded', writes: true },
  { key: 't3.1', name: 'read_records', summary: 'count route by airline · 23 groups', startMs: 63_500, durationMs: 1600, status: 'succeeded' },
];

const callRow = (c: Call): GanttRow => ({
  key: c.key,
  label: c.name,
  summary: c.summary,
  startMs: c.startMs,
  durationMs: c.durationMs,
  status: c.status,
});

/** One converse of the LLM: the time it spent working out what to do next. */
const thinking = (key: string, startMs: number, durationMs: number, then: string): GanttRow => ({
  key,
  label: 'Thinking',
  summary: then,
  startMs,
  durationMs,
  status: 'succeeded',
  group: 'thinking',
});

/** How long the person took to decide on a proposed step: an outline, time held and not spent. */
const approval = (key: string, startMs: number, durationMs: number): GanttRow => ({
  key,
  label: 'Approval',
  summary: 'You decided on a proposed step',
  startMs,
  durationMs,
  status: 'needs_input',
  variant: 'outline',
});

/** Nothing happening between one turn and the next. */
const idle = (key: string, startMs: number, durationMs: number): GanttRow => ({
  key,
  label: 'Idle',
  summary: 'Nothing was happening',
  startMs,
  durationMs,
  status: 'succeeded',
  group: 'idle',
});

const byTurn = (prefix: string) => CALLS.filter((c) => c.key.startsWith(prefix)).map(callRow);

/**
 * Four kinds of time, one row each, never mixed. A Turn row only groups its question's rows and has no bar
 * of its own, so no stretch of the clock is drawn twice.
 */
const ROWS: GanttRow[] = [
  {
    key: 't1',
    label: 'Turn 1',
    summary: 'Which airports connect to Heathrow?',
    duration: '21 s',
    rows: [
      thinking('t1.think0', 200, 2000, 'then 2 tool calls'),
      ...byTurn('t1.').slice(0, 2),
      thinking('t1.think1', 6600, 1600, 'then 2 tool calls'),
      ...byTurn('t1.').slice(2),
      thinking('t1.think2', 13_600, 6800, 'then the answer'),
    ],
  },
  idle('t2.idle', 21_000, 7000),
  {
    key: 't2',
    label: 'Turn 2',
    summary: 'And which hub is busiest from there?',
    duration: '24 s',
    rows: [
      thinking('t2.think0', 28_200, 4600, 'then 2 tool calls'),
      ...byTurn('t2.'),
      thinking('t2.think1', 44_200, 7600, 'then the answer'),
    ],
  },
  approval('t3.approval', 52_000, 4000),
  idle('t3.idle', 56_000, 2000),
  {
    key: 't3',
    label: 'Turn 3',
    summary: 'Show me the numbers by airline',
    duration: '16 s',
    rows: [
      thinking('t3.think0', 58_200, 5200, 'then 1 tool call'),
      ...byTurn('t3.'),
      thinking('t3.think1', 65_200, 8600, 'then the answer'),
    ],
  },
];

const STATUS: Record<Call['status'], ToolCallStatus> = { succeeded: 'succeeded', refused: 'refused', failed: 'failed' };

const VARIANTS = [{ caption: 'Conversation Trace', wide: true }];

interface Args {
  onSelectRow: (key: string | null) => void;
}

function Live({ log, onSelectRow }: Args & { log: Log }) {
  const [selected, setSelected] = React.useState<string | null>(null);
  const [expanded, setExpanded] = React.useState<ExpandedKeys>(true);
  const call = CALLS.find((c) => c.key === selected);
  return (
    <Stack gap="sm">
      <PanelBox title="Trace" aside="1 m 14 s · 3 turns · 7 tool calls · 1 refused">
        <Legend className="px-3 py-2">
          <LegendItem kind="box" color="var(--color-info)" label="Thinking: the LLM working out what to do" />
          <LegendItem kind="box" color="var(--color-success)" label="Tool call: a tool running" />
          <LegendItem kind="box" color="var(--color-destructive)" label="Failed or refused" />
          <LegendItem kind="outline" color="color-mix(in srgb, var(--color-foreground) 40%, transparent)" label="Approval: you deciding on a step" />
          <LegendItem kind="box" color="color-mix(in srgb, var(--color-muted-foreground) 30%, transparent)" label="Idle: nothing happening" />
        </Legend>
        <Gantt
          rows={ROWS}
          spanMs={SPAN_MS}
          ticks={7}
          palette={PALETTE}
          labelWidth={260}
          expanded={expanded}
          onExpandedChange={(next) => {
            log('onExpandedChange', next);
            setExpanded(next);
          }}
          selectedKey={selected}
          onSelectRow={(key) => {
            if (!CALLS.some((c) => c.key === key)) return;
            onSelectRow(key);
            log('onSelectRow', key);
            setSelected(key);
          }}
        />
      </PanelBox>
      {call ? (
        <Sheet open onOpenChange={(open) => !open && setSelected(null)}>
          <SheetContent side="right" className="w-[620px] max-w-[90vw] gap-0 p-0 sm:max-w-[620px]">
            <SheetTitle className="sr-only">{call.name}</SheetTitle>
            <SheetDescription className="sr-only">{call.summary}</SheetDescription>
            <ToolCallCard
              tool={call.name}
              status={call.writes ? 'proposed' : STATUS[call.status]}
              subtitle={`Which airports connect to Heathrow? · starts +${(call.startMs / 1000).toFixed(1)} s`}
              what={{ title: call.summary, text: `Took ${(call.durationMs / 1000).toFixed(1)} s.` }}
              actions={
                <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>
                  Close
                </Button>
              }
            />
          </SheetContent>
        </Sheet>
      ) : null}
    </Stack>
  );
}

const meta = {
  title: 'Data Tables/Telemetry/Conversation Trace',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        code: snippet({
          imports: ["import { Gantt, Legend, LegendItem, PanelBox } from '@invana/ui';"],
          comment: 'Thinking, tool calls, approval and idle on the conversation’s clock, each its own row',
          data: { rows: ROWS.slice(0, 3) },
          setup: "const palette = { thinking: 'bg-info', idle: 'bg-muted-foreground/30' };",
          call: '<Gantt rows={rows} spanMs={74000} ticks={7} palette={palette} labelWidth={260} />',
        }),
      },
    },
  },
  args: { onSelectRow: fn() },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * A conversation's trace: how long each kind of work took, on the conversation's own clock. Four
 * kinds of time, each its own row and never mixed:
 *
 * - **Thinking** (blue): the LLM working out what to do next, one row for each time it was asked.
 * - **Tool call** (green; red when it failed or was refused): a tool running.
 * - **Approval** (an outline): how long the person took to decide on a proposed step. An outline
 *   is time held and not spent.
 * - **Idle** (grey): nothing happening, between one turn and the next.
 *
 * A **Turn** row only groups the thinking and calls of its question and has no bar of its own, so
 * no stretch of the clock is drawn twice; its total sits in the duration column. Hover a row for
 * its card; click a tool call to open it in the sheet, the same `ToolCallCard` a call log opens.
 */
export const ConversationTrace: Story = {
  render: (args) => <VariantGrid variants={VARIANTS}>{(_v, log) => <Live {...args} log={log} />}</VariantGrid>,
  play: async ({ canvasElement, args }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Conversation Trace' }));
    await expect(cell.getByText('Idle: nothing happening')).toBeInTheDocument();
    await userEvent.click(cell.getAllByRole('button', { pressed: false }).find((b) => b.textContent?.includes('propose_step'))!);
    await expect(args.onSelectRow).toHaveBeenCalledWith('t2.2');
  },
};
