import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { DataTable } from '@invana/tables';
import type { ColumnDef, PaginationState, SortingState } from '@invana/tables';
import { Badge } from '@invana/ui';
import { Input } from '@invana/forms';
import { Search } from 'lucide-react';

type Product = {
  id: number;
  title: string;
  brand: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
};

type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

const SORTABLE_FIELDS = new Set(['title', 'brand', 'price', 'rating', 'stock']);

function buildUrl({
  pageIndex,
  pageSize,
  sorting,
  query,
}: {
  pageIndex: number;
  pageSize: number;
  sorting: SortingState;
  query: string;
}): string {
  const skip = pageIndex * pageSize;
  const params = new URLSearchParams({
    limit: String(pageSize),
    skip: String(skip),
    select: 'title,brand,category,price,rating,stock',
  });

  const sort = sorting[0];
  if (sort && SORTABLE_FIELDS.has(sort.id)) {
    params.set('sortBy', sort.id);
    params.set('order', sort.desc ? 'desc' : 'asc');
  }

  const q = query.trim();
  if (q) {
    params.set('q', q);
    return `https://dummyjson.com/products/search?${params.toString()}`;
  }
  return `https://dummyjson.com/products?${params.toString()}`;
}

function useDebounced<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

function ServerSideDemo() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [query, setQuery] = React.useState('');
  const debouncedQuery = useDebounced(query, 350);

  const [data, setData] = React.useState<Product[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [lastUrl, setLastUrl] = React.useState('');

  // Reset to page 0 when search query changes.
  React.useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [debouncedQuery]);

  React.useEffect(() => {
    const url = buildUrl({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sorting,
      query: debouncedQuery,
    });
    setLastUrl(url);

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(url, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<ProductsResponse>;
      })
      .then((json) => {
        setData(json.products);
        setTotal(json.total);
      })
      .catch((e) => {
        if (e.name === 'AbortError') return;
        setError(String(e.message ?? e));
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [pagination.pageIndex, pagination.pageSize, sorting, debouncedQuery]);

  const columns = React.useMemo<ColumnDef<Product, any>[]>(
    () => [
      { id: 'title', accessorKey: 'title', header: 'Title', size: 280 },
      { id: 'brand', accessorKey: 'brand', header: 'Brand', size: 140 },
      {
        id: 'category',
        accessorKey: 'category',
        header: 'Category',
        size: 140,
        enableSorting: false,
        cell: ({ getValue }) => (
          <Badge variant="secondary" className="capitalize">
            {String(getValue() ?? '')}
          </Badge>
        ),
      },
      {
        id: 'price',
        accessorKey: 'price',
        header: 'Price',
        size: 100,
        meta: { align: 'right' },
        cell: ({ getValue }) => `$${Number(getValue() ?? 0).toFixed(2)}`,
      },
      {
        id: 'rating',
        accessorKey: 'rating',
        header: 'Rating',
        size: 100,
        meta: { align: 'right' },
        cell: ({ getValue }) => Number(getValue() ?? 0).toFixed(2),
      },
      {
        id: 'stock',
        accessorKey: 'stock',
        header: 'Stock',
        size: 100,
        meta: { align: 'right' },
      },
    ],
    [],
  );

  const pageCount = Math.max(1, Math.ceil(total / pagination.pageSize));

  return (
    <div className="flex flex-col gap-2">
      <DataTable<Product>
        columns={columns}
        data={data}
        manualPagination
        manualSorting
        pageCount={pageCount}
        rowCount={total}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        enableSorting
        enablePagination
        enableColumnVisibility
        loading={loading}
        emptyState={
          error ? (
            <span className="text-destructive">Error: {error}</span>
          ) : loading ? (
            'Loading…'
          ) : (
            'No products found.'
          )
        }
        toolbar={
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products (server-side)…"
              className="h-8 w-[280px] pl-8"
            />
          </div>
        }
      />
      <div className="rounded-md border bg-muted/30 px-3 py-2 font-mono text-xs text-muted-foreground break-all">
        <span className="font-semibold text-foreground">GET</span> {lastUrl}
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'UI Extended/DataTable / Server-side (dummyjson)',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Server-side sorting, pagination, and search powered by https://dummyjson.com/products. Each sort / page change / debounced search triggers a fresh GET; the URL emitted by the table is shown below it.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const DummyJsonProducts: Story = {
  render: () => <ServerSideDemo />,
};
