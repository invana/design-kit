import type * as React from "react";
import type {
  ColumnDef,
  ExpandedState,
  OnChangeFn,
  RowData,
  SortingState,
} from "@tanstack/react-table";
import type { TableDensity } from "@invana/ui";
import type { CellEditHandler } from "../types";

/**
 * Everything a table reads the same way whether it shows every row, pages
 * them itself or asks a server for each page. `DataTable`, `PaginatedTable`
 * and `RemotePaginatedTable` each take all of this, and add only their own
 * chrome on top.
 */
export interface TableBaseProps<TData extends RowData> {
  // TanStack's own idiom: a column's value type varies by column, and a
  // `ColumnDef<T, string>` is not assignable to `ColumnDef<T, unknown>`.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[];
  /** Sort by a header click. On by default; a column opts out with `enableSorting: false`. */
  enableSorting?: boolean;
  /** Controlled sorting state. */
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  /** Offer the column picker — the icon at the end of the toolbar. */
  enableColumnVisibility?: boolean;
  /** Drag a header by its grip to move the column. */
  enableColumnReordering?: boolean;
  /** Drag a header's right edge to resize the column. */
  enableColumnResizing?: boolean;
  /** Pin columns to either edge, from the column picker. */
  enableColumnPinning?: boolean;
  /**
   * Saves a cell edited in place. A column opts in with `meta.editable` (and
   * `meta.editType` / `meta.options`); return a promise to save asynchronously.
   */
  onCellEdit?: CellEditHandler<TData>;
  /** Anything beside the table's own controls, at the start of the toolbar. */
  toolbar?: React.ReactNode;
  /** Content rendered as a sticky summary bar inside the table's bordered container, below the rows. */
  footer?: React.ReactNode;
  className?: string;
  /** What an empty table says. Defaults to `No results.` */
  emptyState?: React.ReactNode;
  /**
   * Presentational row grouping — returns the group a row belongs to, or
   * `null` for none. A full-width header row is emitted whenever the key
   * changes from the previous row.
   *
   * Deliberately *not* TanStack's aggregating grouping model. This is for a
   * list that already arrives in the right order and wants section headings in
   * it — a story index, a queue split into questions/proposals/results. It
   * sorts nothing and aggregates nothing, so it cannot disagree with the order
   * the caller chose.
   */
  groupBy?: (row: TData) => string | null | undefined;
  /** What a group header row contains. Defaults to the key. */
  renderGroupHeader?: (key: string, rows: TData[]) => React.ReactNode;
  /**
   * `compact` is the dense reading — 26px rows at `text-sm`, which is what a
   * journal, a trace or a step's output table is drawn at.
   */
  density?: TableDensity;
  /**
   * No box, and nothing wasted on its outside: only the rules between rows are
   * drawn, and the first and last columns sit flush with the text around the
   * table. For a table inside a card, a panel or an answer, whose edge already
   * frames it — a second border a few pixels in reads as a box inside a box.
   */
  seamless?: boolean;
  /**
   * How deep this row sits under another — a child run under the run that
   * spawned it. Indents the **first** cell only, so the shape of the list is
   * carried by the column a reader is scanning and not by the whole row.
   *
   * Presentational, like `groupBy`: it nests nothing and sorts nothing, because
   * the caller already has the rows in the order it wants them.
   */
  rowIndent?: (row: TData) => number | undefined;
  /**
   * Which row is the one being read elsewhere — the run open in the panel, the
   * step open on its page. Drawn as an accent ground with a rule down its
   * leading edge, so it is still findable after a scroll.
   */
  isRowSelected?: (row: TData) => boolean;
  /**
   * Rows called out for what they say — the worst store, the outlier — on a
   * tinted ground. Unlike `isRowSelected` nothing is open elsewhere, so there
   * is no leading rule.
   */
  isRowHighlighted?: (row: TData) => boolean;
  /**
   * Single cells called out — the figure that breaches a limit, the value
   * that changed. The same tint as `isRowHighlighted`, on that cell only.
   */
  isCellHighlighted?: (row: TData, columnId: string) => boolean;
  /**
   * The total row: set bold under a rule, and not counted among the rows a
   * preview says it shows. Pass it last in the rows.
   */
  isTotalRow?: (row: TData) => boolean;
  /**
   * The narrowest the table may draw, in px. A wide table keeps its columns
   * legible and scrolls sideways instead of squeezing them.
   */
  minWidth?: number;
  /** Makes rows activate — click, `Enter` or `Space`. */
  onRowClick?: (row: TData) => void;
  /**
   * Rows under a row, with the same columns — a plan's subtasks, a folder's
   * files, a dataset's tables. A row with children gets a chevron in its first
   * cell; each level indents that cell, as `rowIndent` does for a flat list
   * (and wins over it). Sorting orders siblings, so children stay under their
   * parent; pagination counts top-level rows, so opening one never pushes
   * another onto the next page.
   */
  getSubRows?: (row: TData) => TData[] | undefined;
  /**
   * Anything under a row, the full width of the table — a payload, a small
   * table, a trace. Drawn with no box of its own, aligned with the row's
   * content. Every row can open one unless `canExpand` says otherwise.
   */
  renderExpanded?: (row: TData) => React.ReactNode;
  /** Which rows `renderExpanded` has something for. Defaults to all of them. */
  canExpand?: (row: TData) => boolean;
  /**
   * Which rows start open: `true` for all, or `{ [rowId]: true }` for some.
   * Ignored when `expanded` is controlled.
   */
  defaultExpanded?: ExpandedState;
  /** Which rows are open, by row id — `true` for all. Controlled. */
  expanded?: ExpandedState;
  onExpandedChange?: OnChangeFn<ExpandedState>;
  /** Also open and close a row by clicking it, not only its chevron. */
  expandOnRowClick?: boolean;
  /**
   * A row's id — what `expanded` is keyed by. Defaults to its position
   * (`0`, `0.1`, …), which moves when the data does; pass one to keep a row
   * open across a refetch or a sort.
   */
  getRowId?: (row: TData, index: number, parent?: { id: string }) => string;
}

/** The props the grid itself draws from; the rest shape the model. */
export type TableViewProps<TData extends RowData> = Pick<
  TableBaseProps<TData>,
  | "footer"
  | "emptyState"
  | "groupBy"
  | "renderGroupHeader"
  | "density"
  | "seamless"
  | "rowIndent"
  | "isRowSelected"
  | "isRowHighlighted"
  | "isCellHighlighted"
  | "isTotalRow"
  | "minWidth"
  | "onRowClick"
  | "getSubRows"
  | "renderExpanded"
  | "expandOnRowClick"
  | "enableColumnReordering"
  | "enableColumnResizing"
  | "enableSorting"
>;

/** Picks the view props out of a component's props, so each passes them on whole. */
export function pickViewProps<TData extends RowData>(
  props: TableBaseProps<TData>,
): TableViewProps<TData> {
  return {
    footer: props.footer,
    emptyState: props.emptyState,
    groupBy: props.groupBy,
    renderGroupHeader: props.renderGroupHeader,
    density: props.density,
    seamless: props.seamless,
    rowIndent: props.rowIndent,
    isRowSelected: props.isRowSelected,
    isRowHighlighted: props.isRowHighlighted,
    isCellHighlighted: props.isCellHighlighted,
    isTotalRow: props.isTotalRow,
    minWidth: props.minWidth,
    onRowClick: props.onRowClick,
    getSubRows: props.getSubRows,
    renderExpanded: props.renderExpanded,
    expandOnRowClick: props.expandOnRowClick,
    enableColumnReordering: props.enableColumnReordering,
    enableColumnResizing: props.enableColumnResizing,
    enableSorting: props.enableSorting,
  };
}
