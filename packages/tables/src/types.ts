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
    /**
     * Extra class(es) applied to this column's body `<td>`. Use to control
     * padding, vertical alignment, or background when rendering your own
     * always-on controls (Switch/Select/Input) inside `cell()`.
     */
    cellClassName?: string;
    /** Extra class(es) applied to this column's header `<th>`. */
    headerClassName?: string;
  }
}

export type CellEditHandler<TData> = (args: {
  rowIndex: number;
  columnId: string;
  value: unknown;
  row: TData;
}) => void;
