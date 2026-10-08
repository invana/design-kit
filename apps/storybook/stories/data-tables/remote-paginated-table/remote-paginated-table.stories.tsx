import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import {
  RemotePaginatedTable,
  type CellEditHandler,
  type ColumnDef,
  type FilterValues,
  type RemotePage,
  type RemotePageQuery,
  type SortingState,
  type TableFilter,
} from '@invana/tables';
import { Badge } from '@invana/ui';

import variants from '../../../fixtures/data-tables/remote-paginated-table.json';
import warehouse from '../../../fixtures/data-tables/warehouse-datasets.json';
import { ALL, jsx, snippets, sourceFor, variantArg } from '../../_story/source';
import { VariantGrid, type Log, type Variant } from '../../_story/variant-grid';
import { columnsSource } from '../columns';
import { PickedCell } from '../picked-cell';

type Dataset = { name: string; rows: number; owner: string };
type Product = { id: number; title: string; brand: string; category: string; price: number; rating: number; stock: number };
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- the two sources' rows differ
type Row = any;

interface RemoteVariant extends Variant {
  /** Where pages come from: a stand-in server over JSON, or dummyjson.com over the network. */
  server: { rows: 'warehouse' | 'dummyjson'; delayMs: number; failFirst?: string };
  props: {
    searchable?: boolean;
    searchPlaceholder?: string;
    noun?: string;
    emptyState?: string;
    editTrigger?: 'click' | 'dblclick';
  };
  filters?: TableFilter<Row>[];
  /** `onCellClick` picks a cell — this one to start — `isCellHighlighted` draws it, and the footer shows it. */
  cellClick?: { row: string; column: string };
}

const VARIANTS = variants as RemoteVariant[];
/** The variant the play clicks and double-clicks. */
const CELL_CLICK = 'Cell Click and Double-Click Edit';
const WAREHOUSE = warehouse as Dataset[];

const WAREHOUSE_COLUMNS: ColumnDef<Dataset, unknown>[] = [
  { id: 'name', accessorKey: 'name', header: 'Dataset', size: 220, meta: { mono: true } },
  {
    id: 'rows',
    accessorKey: 'rows',
    header: 'Rows',
    size: 120,
    meta: { align: 'right', mono: true, editable: true, editType: 'number' },
  },
  { id: 'owner', accessorKey: 'owner', header: 'Owner', size: 140 },
];

const PRODUCT_COLUMNS: ColumnDef<Product, unknown>[] = [
  { id: 'title', accessorKey: 'title', header: 'Title', size: 280, meta: { editable: true } },
  { id: 'brand', accessorKey: 'brand', header: 'Brand', size: 140 },
  {
    id: 'category',
    accessorKey: 'category',
    header: 'Category',
    size: 140,
    enableSorting: false,
    cell: ({ getValue }) => <Badge variant="secondary">{String(getValue() ?? '')}</Badge>,
  },
  {
    id: 'price',
    accessorKey: 'price',
    header: 'Price',
    size: 100,
    meta: { align: 'right', mono: true },
    cell: ({ getValue }) => `$${Number(getValue() ?? 0).toFixed(2)}`,
  },
  {
    id: 'rating',
    accessorKey: 'rating',
    header: 'Rating',
    size: 100,
    meta: { align: 'right', mono: true },
    cell: ({ getValue }) => Number(getValue() ?? 0).toFixed(2),
  },
  { id: 'stock', accessorKey: 'stock', header: 'Stock', size: 100, meta: { align: 'right', mono: true, editable: true, editType: 'number' } },
];

/** What a page request carries, minus the abort signal — what the log and the Actions panel show. */
const queryOf = ({ signal: _signal, ...q }: RemotePageQuery) => q;

const wait = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('aborted', 'AbortError'));
    });
  });

/** A stand-in for a warehouse API over `warehouse-datasets.json`: filter, search, sort, then one page. */
async function warehousePage(
  { pageIndex, pageSize, sorting, search, filters, signal }: RemotePageQuery,
  delayMs: number,
): Promise<RemotePage<Dataset>> {
  await wait(delayMs, signal);
  let rows = WAREHOUSE.filter((d) => !filters.owner?.length || filters.owner.includes(d.owner));
  if (search) rows = rows.filter((d) => d.name.includes(search.toLowerCase()));
  const sort = sorting[0];
  if (sort) {
    const key = sort.id as keyof Dataset;
    rows = [...rows].sort((a, b) => (a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0) * (sort.desc ? -1 : 1));
  }
  return { rows: rows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize), total: rows.length };
}

const SORTABLE = new Set(['title', 'brand', 'price', 'rating', 'stock']);

/** The dummyjson.com request for one page — the caller's half of the contract. */
function productsUrl({ pageIndex, pageSize, sorting, search, filters }: RemotePageQuery) {
  const params = new URLSearchParams({
    limit: String(pageSize),
    skip: String(pageIndex * pageSize),
    select: 'title,brand,category,price,rating,stock',
  });
  const sort = sorting[0];
  if (sort && SORTABLE.has(sort.id)) {
    params.set('sortBy', sort.id);
    params.set('order', sort.desc ? 'desc' : 'asc');
  }
  // dummyjson searches or narrows to one category, not both: the search wins.
  if (search) {
    params.set('q', search);
    return `https://dummyjson.com/products/search?${params}`;
  }
  const category = filters.category?.[0];
  if (category) return `https://dummyjson.com/products/category/${category}?${params}`;
  return `https://dummyjson.com/products?${params}`;
}

interface Args {
  variant: string;
  fetchPage: (query: Omit<RemotePageQuery, 'signal'>) => void;
  onCellEdit: (edit: { rowId: string; field?: string; value: unknown }) => void;
  onCellClick: (cell: { rowId: string; columnId: string }) => void;
  onSortingChange: (sorting: SortingState) => void;
  onSearchChange: (search: string) => void;
  onFiltersChange: (values: FilterValues) => void;
}

const resolve = <T,>(next: T | ((old: T) => T), old: T) =>
  typeof next === 'function' ? (next as (old: T) => T)(old) : next;

/** One variant: the story writes only `fetchPage` and `onCellEdit`, and logs every request. */
function Live({ v, log, on }: { v: RemoteVariant; log: Log; on: Omit<Args, 'variant'> }) {
  const attempts = React.useRef(0);
  const sorting = React.useRef<SortingState>([]);
  const products = v.server.rows === 'dummyjson';
  const idOf = (r: Row) => String(products ? r.id : r.name);
  const [picked, setPicked] = React.useState(v.cellClick);
  // The page on screen, so the footer can show the picked cell's value.
  const [pageRows, setPageRows] = React.useState<Row[]>([]);

  const fetchPage = async (query: RemotePageQuery): Promise<RemotePage<Row>> => {
    on.fetchPage(queryOf(query));
    log('fetchPage', queryOf(query));
    try {
      let page: RemotePage<Row>;
      if (products) {
        const res = await fetch(productsUrl(query), { signal: query.signal, headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as { products: Product[]; total: number };
        page = { rows: json.products, total: json.total };
      } else {
        await wait(v.server.delayMs, query.signal);
        // A request the table already gave up on is not an attempt.
        attempts.current += 1;
        if (v.server.failFirst && attempts.current === 1) throw new Error(v.server.failFirst);
        page = await warehousePage(query, 0);
      }
      log('page', { rows: page.rows.length, total: page.total });
      setPageRows(page.rows);
      return page;
    } catch (error) {
      if (!query.signal.aborted) log('rejected', (error as Error).message);
      throw error;
    }
  };

  // Everything a PATCH needs is on the edit: which row, which field, the new value. Once it
  // settles, the table writes the value into the page it shows — no refetch.
  const onCellEdit: CellEditHandler<Row> = async ({ rowId, field, value }) => {
    on.onCellEdit({ rowId, field, value });
    log('onCellEdit', { rowId, field, value });
    if (field) setPageRows((all) => all.map((r) => (idOf(r) === rowId ? { ...r, [field]: value } : r)));
    if (!products || !field) return;
    const res = await fetch(`https://dummyjson.com/products/${rowId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  };

  return (
    <RemotePaginatedTable<Row>
      {...v.props}
      columns={products ? PRODUCT_COLUMNS : WAREHOUSE_COLUMNS}
      fetchPage={fetchPage}
      getRowId={idOf}
      onCellEdit={onCellEdit}
      onCellClick={
        v.cellClick
          ? (r, column) => {
              const cell = { rowId: idOf(r), columnId: column };
              on.onCellClick(cell);
              log('onCellClick', cell);
              setPicked({ row: idOf(r), column });
            }
          : undefined
      }
      isCellHighlighted={v.cellClick ? (r, column) => idOf(r) === picked?.row && column === picked?.column : undefined}
      footer={
        v.cellClick ? (
          <PickedCell rowId={picked?.row} row={pageRows.find((r) => idOf(r) === picked?.row)} column={picked?.column} />
        ) : undefined
      }
      filters={v.filters}
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
    />
  );
}

const FETCH = {
  warehouse: [
    '// Called on the first draw and on every page, size, sort, filter or (debounced) search change:',
    '// { pageIndex: 1, pageSize: 10, sorting: [], search: "", filters: { "owner": ["ops"] }, signal }.',
    '// Abort when `signal` does; a rejection is shown in the table with a Retry.',
    'const fetchPage = async ({ signal, ...query }) => {',
    '  const res = await fetch(`/api/datasets?${new URLSearchParams({ q: JSON.stringify(query) })}`, { signal });',
    '  if (!res.ok) throw new Error(`HTTP ${res.status}`);',
    '  return res.json(); // { rows: [...], total: 42 }',
    '};',
    '// { rowId, field, value } — once it settles, the value stays in the page with no refetch.',
    'const onCellEdit = ({ rowId, field, value }) => api.patch(`/datasets/${rowId}`, { [field]: value });',
  ],
  dummyjson: [
    '// The caller writes only the request: the URL, the headers, the response\'s shape.',
    'const fetchPage = async (query) => {',
    '  const res = await fetch(productsUrl(query), { signal: query.signal, headers: { Accept: "application/json" } });',
    '  if (!res.ok) throw new Error(`HTTP ${res.status}`);',
    '  const json = await res.json();',
    '  return { rows: json.products, total: json.total };',
    '};',
    'const onCellEdit = ({ rowId, field, value }) =>',
    '  fetch(`https://dummyjson.com/products/${rowId}`, { method: "PATCH", body: JSON.stringify({ [field]: value }) });',
  ],
};

const meta = {
  title: 'Data Tables/RemotePaginatedTable',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { RemotePaginatedTable } from '@invana/tables';"],
            picked.map((v) => ({
              comment: v.caption,
              data: {
                columns: columnsSource(v.server.rows === 'dummyjson' ? PRODUCT_COLUMNS : WAREHOUSE_COLUMNS),
                ...(v.filters ? { filters: v.filters } : {}),
              },
              setup: [
                ...FETCH[v.server.rows],
                ...(v.cellClick
                  ? [
                      '// A single click picks a cell (the row, and the column id); a double-click edits it.',
                      `const [picked, setPicked] = React.useState(${JSON.stringify(v.cellClick)});`,
                    ]
                  : []),
              ].join('\n'),
              call: jsx('RemotePaginatedTable', {
                columns: 'columns',
                fetchPage: 'fetchPage',
                getRowId: v.server.rows === 'dummyjson' ? '(p) => String(p.id)' : '(d) => d.name',
                onCellEdit: 'onCellEdit',
                editTrigger: v.props.editTrigger ? { literal: v.props.editTrigger } : undefined,
                onCellClick: v.cellClick ? '(row, columnId) => setPicked({ row: row.name, column: columnId })' : undefined,
                isCellHighlighted: v.cellClick
                  ? '(row, columnId) => row.name === picked.row && columnId === picked.column'
                  : undefined,
                filters: v.filters ? 'filters' : undefined,
                searchable: v.props.searchable === false ? 'false' : undefined,
                searchPlaceholder: v.props.searchPlaceholder ? { literal: v.props.searchPlaceholder } : undefined,
                noun: v.props.noun ? { literal: v.props.noun } : undefined,
                emptyState: v.props.emptyState ? { literal: v.props.emptyState } : undefined,
              }),
            })),
          ),
        ),
      },
    },
  },
  args: {
    variant: VARIANTS[0]!.caption,
    fetchPage: fn(),
    onCellEdit: fn(),
    onCellClick: fn(),
    onSortingChange: fn(),
    onSearchChange: fn(),
    onFiltersChange: fn(),
  },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * Rows that live on a server, one page per request. The caller writes only `fetchPage`; the
 * table owns the rest — debouncing the search, aborting a request a newer one replaced, going
 * back to page 1 on a new search, filter or sort, and keeping the last page under a spinner
 * while the next one loads. Every request is written under the table, with what came back.
 *
 * - **Default** — a stand-in server over `fixtures/data-tables/warehouse-datasets.json`, with an
 *   `owner` chip whose pick arrives in `fetchPage` as `filters.owner`. Rows edit in place.
 * - **From dummyjson.com** — the same contract against https://dummyjson.com/products, over the
 *   network: the story turns the query into the URL, and an edit sends a `PATCH`.
 * - **Failure** — the first request fails: its message is said in the table with a `Retry`,
 *   which asks for the same page again and succeeds.
 * - **Cell Click and Double-Click Edit** — `editTrigger="dblclick"`: a click is `onCellClick`
 *   (the picked cell drawn with `isCellHighlighted`, its details in the footer), a double-click
 *   or `F2` opens the editor.
 */
export const RemotePaginatedTableStory: Story = {
  name: 'RemotePaginatedTable',
  render: ({ variant, ...on }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <Live v={v} log={log} on={on} />}
    </VariantGrid>
  ),
  play: async ({ mount, canvasElement, args, step }) => {
    // The select draws one variant, so the play also draws the one whose clicks it checks.
    const { variant, ...on } = args;
    await mount(
      <VariantGrid variants={VARIANTS.filter((v) => v.caption === variant || v.caption === CELL_CLICK)} variant={ALL}>
        {(v, log) => <Live v={v} log={log} on={on} />}
      </VariantGrid>,
    );
    const picks = within(within(canvasElement).getByRole('group', { name: CELL_CLICK }));
    const rowsOf = async (name: string) =>
      within((await picks.findByRole('cell', { name }, { timeout: 3000 })).closest('tr')!).getByRole('button');
    await step('A click picks the cell and does not edit it', async () => {
      await userEvent.click(await rowsOf('dataset_02'));
      await expect(args.onCellClick).toHaveBeenLastCalledWith({ rowId: 'dataset_02', columnId: 'rows' });
      await expect(picks.queryByDisplayValue('24960')).toBeNull();
      await expect((await rowsOf('dataset_02')).closest('td')).toHaveAttribute('data-highlighted');
      await expect(picks.getByRole('list', { name: 'Events' })).toHaveTextContent('"rowId": "dataset_02"');
    });
    await step('A double-click opens the editor; Escape puts it back', async () => {
      await userEvent.dblClick(await rowsOf('dataset_02'));
      await expect(picks.getByDisplayValue('24960')).toBeInTheDocument();
      await userEvent.keyboard('{Escape}');
      await expect(picks.queryByDisplayValue('24960')).toBeNull();
      await expect(args.onCellEdit).not.toHaveBeenCalled();
    });
    if (variant !== 'Default') return;
    const cell = within(within(canvasElement).getByRole('group', { name: 'Default' }));
    await step('The first page is asked for and arrives', async () => {
      await expect(args.fetchPage).toHaveBeenCalledWith({ pageIndex: 0, pageSize: 10, sorting: [], search: '', filters: {} });
      await waitFor(() => expect(cell.getByText('dataset_01')).toBeInTheDocument(), { timeout: 3000 });
    });
    await step('Ask for the next page', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Next page' }));
      await expect(args.fetchPage).toHaveBeenLastCalledWith({ pageIndex: 1, pageSize: 10, sorting: [], search: '', filters: {} });
      await waitFor(() => expect(cell.getByText('dataset_11')).toBeInTheDocument(), { timeout: 3000 });
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('{ "rows": 10, "total": 42 }');
    });
  },
};
