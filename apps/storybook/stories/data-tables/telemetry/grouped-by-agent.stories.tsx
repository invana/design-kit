import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { DataTable, type ExpandedState } from '@invana/tables';

import { jsx, snippet } from '../../_story/source';
import { VariantGrid, type Log } from '../../_story/variant-grid';
import { columnsSource } from '../columns';
import { AGENTS, EVENTS, type TelemetryEvent } from './fixtures';
import { LOG_COLUMNS } from './log';

/** Where each task starts in the log: the event that spawned it. */
const SPAWN = new Map(EVENTS.filter((e) => e.kind === 'task_spawned').map((e) => [e.taskKey!, e]));

/**
 * Under a task's spawn: the rest of its own events, then the spawns of the subtasks it split
 * into on the same agent — so `analyse` opens into its calls, then `analyse.margins` and
 * `analyse.risk`, each of which opens into theirs.
 */
function subRows(e: TelemetryEvent): TelemetryEvent[] | undefined {
  if (e.kind !== 'task_spawned') return undefined;
  const own = EVENTS.filter((o) => o.taskKey === e.taskKey && o !== e);
  const kids = [...SPAWN.values()].filter((s) => s.parentKey === e.taskKey && s.agent === e.agent);
  return [...own, ...kids];
}

/**
 * The top of each agent's section: its tasks' spawns (unless the task sits under one of the
 * same agent's), and the run's own events, which belong to no task. Agent first, then time —
 * `groupBy` sections a list that already arrives in order.
 */
const BY_AGENT = EVENTS.filter((e) =>
  e.taskKey == null ? true : e.kind === 'task_spawned' && SPAWN.get(e.parentKey ?? '')?.agent !== e.agent,
).sort((a, b) => AGENTS.indexOf(a.agent) - AGENTS.indexOf(b.agent) || a.offsetMs - b.offsetMs);

/** Task leads here: it is the column the chevrons sit in, so the tree reads down it. */
const COLUMNS = [LOG_COLUMNS.find((c) => c.id === 'task')!, ...LOG_COLUMNS.filter((c) => c.id !== 'task' && c.id !== 'agent')];

const count = (agent: string) => EVENTS.filter((e) => e.agent === agent).length;

const VARIANTS = [{ caption: 'Grouped by Agent', wide: true }];

interface Args {
  onRowClick: (seq: number | null) => void;
  onExpandedChange: (expanded: ExpandedState) => void;
}

function Live({ log, onRowClick, onExpandedChange }: Args & { log: Log }) {
  const [selected, setSelected] = React.useState<number | null>(null);
  const [expanded, setExpanded] = React.useState<ExpandedState>({});
  return (
    <DataTable<TelemetryEvent>
      columns={COLUMNS}
      data={BY_AGENT}
      density="compact"
      groupBy={(e) => e.agent}
      renderGroupHeader={(agent) => `${agent} · ${count(agent)} events`}
      getSubRows={subRows}
      getRowId={(e) => String(e.seq)}
      expanded={expanded}
      onExpandedChange={(next) => {
        const value = typeof next === 'function' ? next(expanded) : next;
        onExpandedChange(value);
        log('onExpandedChange', value);
        setExpanded(value);
      }}
      enableSorting={false}
      isRowSelected={(e) => e.seq === selected}
      onRowClick={(e) => {
        const next = e.seq === selected ? null : e.seq;
        onRowClick(next);
        log('onRowClick', next);
        setSelected(next);
      }}
    />
  );
}

const meta = {
  title: 'Data Tables/Telemetry/Grouped by Agent',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        code: snippet({
          imports: ["import { DataTable } from '@invana/tables';"],
          comment: `The first 3 of ${BY_AGENT.length} top rows — task spawns and run events — sorted by agent then time`,
          data: { events: BY_AGENT.slice(0, 3), columns: columnsSource(COLUMNS) },
          setup: [
            '// Under a spawn: the task\'s other events, then its subtasks\' spawns on the same agent.',
            'const subRows = (e) => e.kind === "task_spawned" ? [...eventsOf(e.taskKey), ...spawnsUnder(e)] : undefined;',
            '// Which rows are open, by row id (the event\'s seq): { "12": true }',
            'const [expanded, setExpanded] = React.useState({});',
            '// A click marks the row; a second click on it clears the mark.',
            'const [selected, setSelected] = React.useState(null);',
          ].join('\n'),
          call: jsx('DataTable', {
            columns: 'columns',
            data: 'events',
            density: { literal: 'compact' },
            groupBy: '(e) => e.agent',
            renderGroupHeader: '(agent) => `${agent} · ${countOf(agent)} events`',
            getSubRows: 'subRows',
            getRowId: '(e) => String(e.seq)',
            expanded: 'expanded',
            onExpandedChange: 'setExpanded',
            enableSorting: 'false',
            isRowSelected: '(e) => e.seq === selected',
            onRowClick: '(e) => setSelected(e.seq === selected ? null : e.seq)',
          }),
        }),
      },
    },
  },
  args: { onRowClick: fn(), onExpandedChange: fn() },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * The same log, read per agent and nested by task: each agent's section lists the tasks it ran,
 * each closed on the event that spawned it. Open one for its calls, slots and outcome; the
 * analyst's `analyse` opens into its own events and then `analyse.margins` and `analyse.risk`,
 * which open again — so the planner → analyse → analyse.risk chain is a path you open, not a
 * column you scan. Click a row to mark it.
 */
export const GroupedByAgent: Story = {
  name: 'Grouped by Agent',
  render: (args) => <VariantGrid variants={VARIANTS}>{(_v, log) => <Live {...args} log={log} />}</VariantGrid>,
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Grouped by Agent' }));
    const first = BY_AGENT[0]!;
    await step('Mark the first event', async () => {
      await userEvent.click(cell.getAllByText(first.detail)[0]!);
      await expect(args.onRowClick).toHaveBeenCalledWith(first.seq);
    });
    await step('The row is marked, and the click is logged', async () => {
      await expect(cell.getByRole('row', { selected: true })).toHaveTextContent(first.detail);
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent(`onRowClick${first.seq}`);
    });
    await step('Open analyse, then analyse.risk, down to its failure', async () => {
      const failed = EVENTS.find((e) => e.taskKey === 'analyse.risk' && e.kind === 'task_failed')!;
      await expect(cell.queryByText(failed.detail)).toBeNull();
      // A task's spawn is the first row naming it — the rest are its own events, under it.
      const open = (task: string) =>
        userEvent.click(within(cell.getAllByText(task, { exact: true })[0]!.closest('tr')!).getByRole('button', { name: 'Expand row' }));
      const analyse = SPAWN.get('analyse')!;
      const risk = SPAWN.get('analyse.risk')!;
      await open('analyse');
      await open('analyse.risk');
      await expect(cell.getByText(failed.detail)).toBeInTheDocument();
      await expect(args.onExpandedChange).toHaveBeenLastCalledWith({ [analyse.seq]: true, [risk.seq]: true });
    });
  },
};
