import type { RowData } from '@tanstack/react-table';

export type EditType = 'text' | 'number' | 'select';

export type EditOption = { label: string; value: string };

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    editable?: boolean;
    editType?: EditType;
    options?: EditOption[];
    align?: 'left' | 'center' | 'right';
  }
}

export type CellEditHandler<TData> = (args: {
  rowIndex: number;
  columnId: string;
  value: unknown;
  row: TData;
}) => void;
