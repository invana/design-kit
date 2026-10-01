import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { DataTable } from '@invana/tables';

import { jsx, snippet } from '../../_story/source';
import { VariantBoard, type Log } from '../../_story/variant-board';
import { columnsSource } from '../columns';
import { AGENTS, EVENTS, taskDepth, type TelemetryEvent } from './fixtures';
import { LOG_COLUMNS } from './log';

/** Agent first, then time — `groupBy` sections a list that already arrives in order. */
const BY_AGENT = [...EVENTS].sort(
  (a, b) => AGENTS.indexOf(a.agent) - AGENTS.indexOf(b.agent) || a.offsetMs - b.offsetMs,
);

/** Task leads here, so `rowIndent` can push a subtask's events in under its parent's. */
const COLUMNS = [LOG_COLUMNS.find((c) => c.id === 'task')!, ...LOG_COLUMNS.filter((c) => c.id !== 'task' && c.id !== 'agent')];

const VARIANTS = [{ caption: 'Grouped by Agent', wide: true }];

interface Args {
  onRowClick: (seq: number | null) => void;
}

function Live({ log, onRowClick }: Args & { log: Log }) {
  const [selected, setSelected] = React.useState<number | null>(null);
  return (
    <DataTable<TelemetryEvent>
      columns={COLUMNS}
      data={BY_AGENT}
      density="compact"
      groupBy={(e) => e.agent}
      renderGroupHeader={(agent, rows) => `${agent} · ${rows.length} events`}
      rowIndent={(e) => taskDepth(e.taskKey)}
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
          comment: `The first 3 of ${BY_AGENT.length} events, sorted by agent then time`,
          data: { events: BY_AGENT.slice(0, 3), columns: columnsSource(COLUMNS) },
          setup: [
            '// A click marks the row; a second click on it clears the mark.',
            'const [selected, setSelected] = React.useState(null);',
          ].join('\n'),
          call: jsx('DataTable', {
            columns: 'columns',
            data: 'events',
            density: { literal: 'compact' },
            groupBy: '(e) => e.agent',
            renderGroupHeader: '(agent, rows) => `${agent} · ${rows.length} events`',
            rowIndent: '(e) => taskDepth(e.taskKey)',
            isRowSelected: '(e) => e.seq === selected',
            onRowClick: '(e) => setSelected(e.seq === selected ? null : e.seq)',
          }),
        }),
      },
    },
  },
  args: { onRowClick: fn() },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * The same log, read per agent: what the planner did, then every researcher fetch, then the
 * analyst and its two subtasks. A subtask's events indent under the task that split it, so the
 * planner → analyse → analyse.risk chain reads down the first column. Click a row to mark it.
 */
export const GroupedByAgent: Story = {
  name: 'Grouped by Agent',
  render: (args) => <VariantBoard variants={VARIANTS}>{(_v, log) => <Live {...args} log={log} />}</VariantBoard>,
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
  },
};
