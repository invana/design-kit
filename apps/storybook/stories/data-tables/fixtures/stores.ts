import type { ColumnDef } from '@invana/tables';

/** Store margins — the small, whole table a card or an answer shows. */
export type Store = {
  store: string;
  region: string;
  revenue: number;
  margin: number;
  delta: number;
};

export const STORES: Store[] = [
  { store: 'North Mall', region: 'North', revenue: 412_300, margin: 11.4, delta: -3.1 },
  { store: 'Northgate', region: 'North', revenue: 388_900, margin: 12.0, delta: -2.6 },
  { store: 'Riverside', region: 'West', revenue: 501_750, margin: 15.8, delta: 0.4 },
  { store: 'Harbour', region: 'West', revenue: 276_100, margin: 16.9, delta: 1.2 },
  { store: 'Old Town', region: 'South', revenue: 333_480, margin: 14.2, delta: -0.3 },
  { store: 'Airport', region: 'South', revenue: 615_020, margin: 18.6, delta: 2.4 },
];

export const STORE_COLUMNS: ColumnDef<Store, unknown>[] = [
  { id: 'store', accessorKey: 'store', header: 'Store', size: 160 },
  { id: 'region', accessorKey: 'region', header: 'Region', size: 110 },
  {
    id: 'revenue',
    accessorKey: 'revenue',
    header: 'Revenue',
    size: 120,
    meta: { align: 'right', mono: true },
    cell: ({ getValue }) => `$${(getValue() as number).toLocaleString()}`,
  },
  {
    id: 'margin',
    accessorKey: 'margin',
    header: 'Margin',
    size: 90,
    meta: { align: 'right', mono: true },
    cell: ({ getValue }) => `${(getValue() as number).toFixed(1)}%`,
  },
  {
    id: 'delta',
    accessorKey: 'delta',
    header: 'Δ pts',
    size: 90,
    meta: { align: 'right', mono: true },
    cell: ({ getValue }) => {
      const v = getValue() as number;
      return `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(1)}`;
    },
  },
];
