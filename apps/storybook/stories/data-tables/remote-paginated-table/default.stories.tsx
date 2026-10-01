import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { RemotePaginatedTable } from '@invana/tables';
import type {
  CellEditHandler,
  ColumnDef,
  RemotePageQuery,
  TableFilter,
} from '@invana/tables';
import { Badge, PropertyList, PropertyRow } from '@invana/ui';

type Product = {
  id: number;
  title: string;
  brand: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
};

type ProductsResponse = { products: Product[]; total: number };

const SORTABLE_FIELDS = new Set(['title', 'brand', 'price', 'rating', 'stock']);

/** The dummyjson.com request for one page — the caller's half of the contract. */
function productsUrl({ pageIndex, pageSize, sorting, search, filters }: RemotePageQuery) {
  const params = new URLSearchParams({
    limit: String(pageSize),
    skip: String(pageIndex * pageSize),
    select: 'title,brand,category,price,rating,stock',
  });
  const sort = sorting[0];
  if (sort && SORTABLE_FIELDS.has(sort.id)) {
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

/** The server cannot be asked for every category, so the chip names them. */
const FILTERS: TableFilter<Product>[] = [
  {
    id: 'category',
    label: 'category',
    single: true,
    options: ['beauty', 'fragrances', 'furniture', 'groceries', 'laptops', 'smartphones'],
  },
];

const COLUMNS: ColumnDef<Product, unknown>[] = [
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
  {
    id: 'stock',
    accessorKey: 'stock',
    header: 'Stock',
    size: 100,
    meta: { align: 'right', mono: true, editable: true, editType: 'number' },
  },
];

const meta: Meta<typeof RemotePaginatedTable> = {
  title: 'Data Tables/RemotePaginatedTable',
  component: RemotePaginatedTable,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Rows that live on a server — https://dummyjson.com/products, one page per
 * request. The story writes only `fetchPage`: the URL, the headers, the
 * response's shape. The table owns the rest — debouncing the search, aborting
 * a request a newer one replaced, going back to page 1 on a new search or
 * sort, and keeping the last page under a spinner while the next one loads.
 *
 * Title and stock edit in place: `onCellEdit` gets the row's id, the field
 * and the new value, and sends a `PATCH`; once it succeeds the table writes
 * the value into the page it is showing, with no refetch.
 *
 * The `category` chip is declared exactly as on a `PaginatedTable`; here its
 * pick arrives in `fetchPage` as `filters.category`, with the sort and the
 * search, and the story turns them into the URL.
 *
 * The footer shows the last request.
 */
export const Default: Story = {
  render: function Render() {
    const [last, setLast] = React.useState({ method: 'GET', url: '' });
    const fetchPage = async (query: RemotePageQuery) => {
      const url = productsUrl(query);
      setLast({ method: 'GET', url });
      const res = await fetch(url, {
        signal: query.signal,
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as ProductsResponse;
      return { rows: json.products, total: json.total };
    };
    // Everything the request needs is on the edit: which row, which field,
    // the new value. A rejection puts the old value back in the cell.
    const onCellEdit: CellEditHandler<Product> = async ({ rowId, field, value }) => {
      if (!field) return;
      const url = `https://dummyjson.com/products/${rowId}`;
      const body = JSON.stringify({ [field]: value });
      setLast({ method: 'PATCH', url: `${url}  ${body}` });
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    };
    return (
      <RemotePaginatedTable<Product>
        columns={COLUMNS}
        fetchPage={fetchPage}
        getRowId={(p) => String(p.id)}
        onCellEdit={onCellEdit}
        searchPlaceholder="Search products"
        filters={FILTERS}
        noun="products"
        emptyState="No products found."
        footer={
          <PropertyList labelWidth={48}>
            <PropertyRow label={last.method} mono>
              {last.url}
            </PropertyRow>
          </PropertyList>
        }
      />
    );
  },
};
