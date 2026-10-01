import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import {
  applyCellEdit,
  PaginatedTable,
  type CellEditHandler,
  type FilterValues,
  type PaginationState,
  type SortingState,
  type TableFilter,
  type TableFilterOption,
} from '@invana/tables';

import variants from '../../../fixtures/data-tables/paginated-table.json';
import people from '../../../fixtures/data-tables/people.json';
import { inline, jsx, snippets, sourceFor, variantArg } from '../../_story/source';
import { VariantBoard, type Log, type Variant } from '../../_story/variant-board';
import { columnsSource, PEOPLE_COLUMNS, type Person } from '../columns';

/** A filter chip as JSON: `split` is a band of a number column — `high` at or over `at`. */
type FilterJson = Omit<TableFilter<Person>, 'match' | 'options'> & {
  options?: TableFilterOption[];
  split?: { column: keyof Person; at: number; high: string };
};

interface PagedVariant extends Variant {
  props: { noun?: string; pageSize?: number; pageSizeOptions?: number[] | false };
  filters?: FilterJson[];
}

const VARIANTS = variants as PagedVariant[];
const PEOPLE = people as Person[];

/** JSON cannot hold `match`; a `split` becomes one. */
const toFilter = ({ split, ...f }: FilterJson): TableFilter<Person> =>
  split
    ? { ...f, match: (row, [band]) => (band === split.high) === (Number(row[split.column]) >= split.at) }
    : f;

const resolve = <T,>(next: T | ((old: T) => T), old: T) =>
  typeof next === 'function' ? (next as (old: T) => T)(old) : next;

interface Args {
  variant: string;
  onCellEdit: (edit: { rowId: string; field?: string; previousValue: unknown; value: unknown }) => void;
  onSortingChange: (sorting: SortingState) => void;
  onSearchChange: (search: string) => void;
  onFiltersChange: (values: FilterValues) => void;
  onPaginationChange: (pagination: PaginationState) => void;
}

/** One variant, with the rows in state and every callback written to the log. */
function Live({ v, log, on }: { v: PagedVariant; log: Log; on: Omit<Args, 'variant'> }) {
  const [rows, setRows] = React.useState(PEOPLE);
  const filters = React.useMemo(() => v.filters?.map(toFilter), [v.filters]);
  const sorting = React.useRef<SortingState>([]);
  const pagination = React.useRef<PaginationState>({ pageIndex: 0, pageSize: v.props.pageSize ?? 10 });

  const onCellEdit: CellEditHandler<Person> = (edit) => {
    const payload = { rowId: edit.rowId, field: edit.field, previousValue: edit.previousValue, value: edit.value };
    on.onCellEdit(payload);
    log('onCellEdit', payload);
    setRows((all) => applyCellEdit(all, edit));
  };

  return (
    <PaginatedTable<Person>
      {...v.props}
      columns={PEOPLE_COLUMNS}
      data={rows}
      getRowId={(p) => p.id}
      filters={filters}
      onCellEdit={onCellEdit}
      onSortingChange={(next) => {
        sorting.current = resolve(next, sorting.current);
        on.onSortingChange(sorting.current);
        log('onSortingChange', sorting.current);
      }}
      onSearchChange={(search) => {
        on.onSearchChange(search);
        log('onSearchChange', search);
      }}
      onFiltersChange={(values) => {
        on.onFiltersChange(values);
        log('onFiltersChange', values);
      }}
      onPaginationChange={(next) => {
        const was = pagination.current;
        pagination.current = resolve(next, was);
        // A new search or sort resets to the page it is already on; only a move is news.
        if (inline(was) === inline(pagination.current)) return;
        on.onPaginationChange(pagination.current);
        log('onPaginationChange', pagination.current);
      }}
    />
  );
}

const meta = {
  title: 'Data Tables/PaginatedTable',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import { PaginatedTable, applyCellEdit } from '@invana/tables';",
              '// `cell: "…"` marks a column that draws its own cell — see stories/data-tables/columns.tsx.',
            ],
            picked.map((v) => ({
              comment: `${v.caption} — the first 3 of ${PEOPLE.length} rows`,
              data: {
                initial: PEOPLE.slice(0, 3),
                columns: columnsSource(PEOPLE_COLUMNS),
                ...(v.filters ? { filters: v.filters.map(({ split: _split, ...f }) => f) } : {}),
              },
              setup: [
                ...(v.filters?.some((f) => f.split)
                  ? [
                      '// A chip that is not one column\'s value says how a row passes.',
                      ...v.filters
                        .filter((f) => f.split)
                        .map(
                          (f) =>
                            `filters.find((f) => f.id === "${f.id}").match = (row, [band]) => (band === "${f.split!.high}") === (row.${f.split!.column} >= ${f.split!.at});`,
                        ),
                    ]
                  : []),
                '// An edit keeps the page you are on: { rowId, field, previousValue, value, updatedRow, … }',
                'const [rows, setRows] = React.useState(initial);',
                'const onCellEdit = (edit) => setRows((all) => applyCellEdit(all, edit));',
                '// Each hears every change; the table filters, searches, sorts and pages in memory.',
                'const onSearchChange = (search) => {};      // "grace"',
                'const onFiltersChange = (values) => {};     // { "role": ["admin"] }',
                'const onPaginationChange = (page) => {};    // { pageIndex: 1, pageSize: 10 } — or an updater',
              ].join('\n'),
              call: jsx('PaginatedTable', {
                columns: 'columns',
                data: 'rows',
                getRowId: '(p) => p.id',
                filters: v.filters ? 'filters' : undefined,
                noun: v.props.noun ? { literal: v.props.noun } : undefined,
                pageSize: v.props.pageSize ? String(v.props.pageSize) : undefined,
                pageSizeOptions: v.props.pageSizeOptions === false ? 'false' : undefined,
                onCellEdit: 'onCellEdit',
                onSearchChange: 'onSearchChange',
                onFiltersChange: v.filters ? 'onFiltersChange' : undefined,
                onPaginationChange: 'onPaginationChange',
              }),
            })),
          ),
        ),
      },
    },
  },
  args: {
    variant: VARIANTS[0]!.caption,
    onCellEdit: fn(),
    onSortingChange: fn(),
    onSearchChange: fn(),
    onFiltersChange: fn(),
    onPaginationChange: fn(),
  },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * Every row in hand, a page at a time — 87 people from `fixtures/data-tables/people.json`. The
 * search (across every column with an accessor), the column picker, sorting and the page line
 * are what a `PaginatedTable` is; a new search, filter or sort goes back to page 1, and an edit
 * keeps the page you are on. The rows-per-page picker offers 10, 25, 50 and 100 and ends in
 * `Custom…`.
 *
 * - **Filters** — `filters` declares the chips and the table does the rest in memory: within a
 *   chip any pick matches, across chips all must. A chip without `options` offers every distinct
 *   value of its column; `match` is a filter that is not one column's value (here a band of
 *   visits), and `single` picks one at a time.
 * - **Fixed Page Size** — `pageSizeOptions={false}` draws no rows-per-page picker.
 *
 * Heavy, so the `variant` select draws one at a time.
 */
export const PaginatedTableStory: Story = {
  name: 'PaginatedTable',
  render: ({ variant, ...on }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => <Live v={v} log={log} on={on} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Default' }));
    await step('Search for Grace', async () => {
      await userEvent.type(cell.getByRole('textbox', { name: 'Search' }), 'Grace');
      await expect(args.onSearchChange).toHaveBeenLastCalledWith('Grace');
    });
    await step('Only Grace Hoppers are left, and the search is logged', async () => {
      await waitFor(() => expect(cell.getAllByRole('row')[1]).toHaveTextContent('Grace Hopper'));
      await expect(cell.queryByText('Ada Lovelace 1')).toBeNull();
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"Grace"');
    });
  },
};
