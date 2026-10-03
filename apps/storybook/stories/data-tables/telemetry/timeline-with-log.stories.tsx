import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { PaginatedTable, type FilterValues, type TableFilter } from '@invana/tables';
import { PanelBox, TaskGantt } from '@invana/ui';

import { jsx, snippet } from '../../_story/source';
import { VariantBoard, type Log } from '../../_story/variant-board';
import { EVENTS, RUN_SPAN_MS, formatOffset, ganttTasks, type TelemetryEvent } from './fixtures';
import { LOG_COLUMNS, LOG_FILTERS, LOG_SEARCH_COLUMNS } from './log';

const TASKS = ganttTasks();

/** The log's own chips, and a `task` chip the timeline sets — its choices are the tasks in the log. */
const FILTERS: TableFilter<TelemetryEvent>[] = [...LOG_FILTERS, { id: 'task', label: 'task', single: true }];

const VARIANTS = [{ caption: 'Timeline with Log', wide: true }];

interface Args {
  onSelectTask: (key: string) => void;
  onFiltersChange: (values: FilterValues) => void;
  onRowClick: (seq: number | null) => void;
}

function Live({ log, onSelectTask, onFiltersChange, onRowClick }: Args & { log: Log }) {
  const [filters, setFilters] = React.useState<FilterValues>({});
  const [event, setEvent] = React.useState<TelemetryEvent | null>(null);
  const taskFilter = filters.task?.[0] ?? null;

  // Two panels, one over the other: the cell stacks what it is given.
  return (
    <>
      <PanelBox
        title="Timeline"
        aside={event ? `${formatOffset(event.offsetMs)} · ${event.kind}` : 'pick a task to filter the log'}
      >
        <TaskGantt
          tasks={TASKS}
          defaultExpanded
          spanMs={RUN_SPAN_MS}
          ticks={9}
          nowMs={event?.offsetMs}
          selectedKey={taskFilter ?? event?.taskKey ?? null}
          onSelectTask={(key) => {
            onSelectTask(key);
            log('onSelectTask', key);
            setFilters((f) => ({ ...f, task: key === taskFilter ? [] : [key] }));
            setEvent(null);
          }}
          detailProps={{ width: 300 }}
        />
      </PanelBox>
      <PanelBox title="Log">
        <PaginatedTable<TelemetryEvent>
          columns={LOG_COLUMNS}
          data={EVENTS}
          density="compact"
          seamless
          filters={FILTERS}
          filterValues={filters}
          onFiltersChange={(values) => {
            onFiltersChange(values);
            log('onFiltersChange', values);
            setFilters(values);
          }}
          searchColumns={LOG_SEARCH_COLUMNS}
          searchPlaceholder="Search task or detail…"
          noun="events"
          pageSize={15}
          pageSizeOptions={[15, 30, 60]}
          isRowSelected={(e) => e.seq === event?.seq}
          onRowClick={(e) => {
            const next = e.seq === event?.seq ? null : e;
            onRowClick(next?.seq ?? null);
            log('onRowClick', next?.seq ?? null);
            setEvent(next);
          }}
        />
      </PanelBox>
    </>
  );
}

const meta = {
  title: 'Data Tables/Telemetry/Timeline with Log',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        code: snippet({
          imports: ["import { PaginatedTable } from '@invana/tables';", "import { PanelBox, TaskGantt } from '@invana/ui';"],
          comment: 'Each one steers the other: the timeline sets the log\'s `task` filter, a log row drops a line on the timeline',
          data: { filters: FILTERS },
          setup: [
            'const [filters, setFilters] = React.useState({});   // { "task": ["fetch_filings"] }',
            'const [event, setEvent] = React.useState(null);',
            'const task = filters.task?.[0] ?? null;',
            '// A task key: pick it to narrow the log, pick it again to let the whole log back in.',
            'const onSelectTask = (key) => { setFilters((f) => ({ ...f, task: key === task ? [] : [key] })); setEvent(null); };',
          ].join('\n'),
          call: [
            '<>',
            '  <PanelBox title="Timeline">',
            `    ${jsx('TaskGantt', {
              tasks: 'tasks',
              defaultExpanded: 'true',
              spanMs: String(RUN_SPAN_MS),
              ticks: '9',
              nowMs: 'event?.offsetMs',
              selectedKey: 'task ?? event?.taskKey ?? null',
              onSelectTask: 'onSelectTask',
            }).replace(/\n/g, '\n    ')}`,
            '  </PanelBox>',
            '  <PanelBox title="Log">',
            `    ${jsx('PaginatedTable', {
              columns: 'columns',
              data: 'events',
              density: { literal: 'compact' },
              seamless: 'true',
              filters: 'filters',
              filterValues: 'filters',
              onFiltersChange: 'setFilters',
              isRowSelected: '(e) => e.seq === event?.seq',
              onRowClick: '(e) => setEvent(e.seq === event?.seq ? null : e)',
            }).replace(/\n/g, '\n    ')}`,
            '  </PanelBox>',
            '</>',
          ].join('\n'),
        }),
      },
    },
  },
  args: { onSelectTask: fn(), onFiltersChange: fn(), onRowClick: fn() },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * The timeline over the log, each one steering the other.
 *
 * - **Pick a task** on the timeline and the log narrows to its events: the timeline sets the
 *   table's `task` filter (`filterValues`), and the chip's × lets the whole log back in. The
 *   table does the filtering.
 * - **Pick an event** in the log and the timeline marks its task and drops a line at the
 *   event's moment, so a `retry_scheduled` or a `429` lands on the bar it happened inside.
 *
 * The line reuses `TaskGantt`'s `nowMs`, which exists for a run in flight — a cursor that is not
 * *now* is a gap in the component, borrowed here.
 */
export const TimelineWithLog: Story = {
  name: 'Timeline with Log',
  render: (args) => <VariantBoard variants={VARIANTS}>{(_v, log) => <Live {...args} log={log} />}</VariantBoard>,
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Timeline with Log' }));
    await step('Pick fetch_filings on the timeline', async () => {
      const row = cell.getAllByRole('button', { pressed: false }).find((b) => b.textContent?.includes('fetch_filings'))!;
      await userEvent.click(row);
      await expect(args.onSelectTask).toHaveBeenCalledWith('fetch_filings');
    });
    await step('The log narrows to its events', async () => {
      await waitFor(() => expect(cell.queryByText(/catalog\.search/)).toBeNull());
      await expect(cell.getByText(/retry-after/)).toBeInTheDocument();
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"fetch_filings"');
    });
  },
};
