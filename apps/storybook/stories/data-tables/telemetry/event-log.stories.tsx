import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { PaginatedTable, type FilterValues } from '@invana/tables';

import { jsx, snippet } from '../../_story/source';
import { VariantGrid } from '../../_story/variant-grid';
import { columnsSource } from '../columns';
import { EVENTS, type TelemetryEvent } from './fixtures';
import { LOG_COLUMNS, LOG_FILTERS, LOG_SEARCH_COLUMNS } from './log';

const VARIANTS = [{ caption: 'Event Log', wide: true }];

interface Args {
  onSearchChange: (search: string) => void;
  onFiltersChange: (values: FilterValues) => void;
}

const meta = {
  title: 'Data Tables/Telemetry/Event Log',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        code: snippet({
          imports: ["import { PaginatedTable } from '@invana/tables';"],
          comment: `The first 3 of ${EVENTS.length} events — derived from fixtures/data-tables/telemetry-run.json`,
          data: {
            events: EVENTS.slice(0, 3),
            columns: columnsSource(LOG_COLUMNS),
            filters: LOG_FILTERS,
          },
          setup: [
            '// Each hears every change; the table narrows the rows in memory.',
            'const onSearchChange = (search) => {};   // "429"',
            'const onFiltersChange = (values) => {};  // { "level": ["error"] }',
          ].join('\n'),
          call: jsx('PaginatedTable', {
            columns: 'columns',
            data: 'events',
            density: { literal: 'compact' },
            filters: 'filters',
            searchColumns: JSON.stringify(LOG_SEARCH_COLUMNS),
            searchPlaceholder: { literal: 'Search task or detail…' },
            noun: { literal: 'events' },
            enableColumnPinning: 'true',
            pageSize: '25',
            pageSizeOptions: '[25, 50, 100]',
            onSearchChange: 'onSearchChange',
            onFiltersChange: 'onFiltersChange',
          }),
        }),
      },
    },
  },
  args: { onSearchChange: fn(), onFiltersChange: fn() },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * The raw stream, one row per event — spawns, slot grabs, tool and model calls, retries,
 * failures — in the order the engine wrote them.
 *
 * `t` is the offset from the run's start, so a gap between two rows is time nobody spent. Kind
 * reads in its level's colour, so the one failure and the one retry are findable before any
 * filter is set. Narrow by kind, agent or level, or search a task or a detail; each change is
 * written under the table.
 */
export const EventLog: Story = {
  render: ({ onSearchChange, onFiltersChange }) => (
    <VariantGrid variants={VARIANTS}>
      {(_v, log) => (
        <PaginatedTable<TelemetryEvent>
          columns={LOG_COLUMNS}
          data={EVENTS}
          density="compact"
          filters={LOG_FILTERS}
          searchColumns={LOG_SEARCH_COLUMNS}
          searchPlaceholder="Search task or detail…"
          noun="events"
          enableColumnPinning
          pageSize={25}
          pageSizeOptions={[25, 50, 100]}
          onSearchChange={(search) => {
            onSearchChange(search);
            log('onSearchChange', search);
          }}
          onFiltersChange={(values) => {
            onFiltersChange(values);
            log('onFiltersChange', values);
          }}
        />
      )}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Event Log' }));
    await step('Search for the rate limit', async () => {
      await userEvent.type(cell.getByRole('textbox', { name: 'Search task or detail…' }), '429');
      await expect(args.onSearchChange).toHaveBeenLastCalledWith('429');
    });
    await step('Only the rate-limited events are left, and the search is logged', async () => {
      await waitFor(() => expect(cell.queryByText(/catalog\.search/)).toBeNull());
      await expect(cell.getByText(/retry-after/)).toBeInTheDocument();
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"429"');
    });
  },
};
