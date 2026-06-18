import type { Control } from 'react-hook-form';

export type LabelPosition = 'side' | 'top';

/**
 * Field density. `sm` is the compact look used by dense panels (e.g. the
 * modeller property editor) and is the default for backward compatibility.
 * `md` renders full-size fields for primary, page-level forms.
 */
export type FieldSize = 'sm' | 'md';

export type FieldType =
  | 'text'
  | 'password'
  | 'textarea'
  | 'number'
  | 'boolean'
  | 'color'
  | 'select'
  | 'icon';

export type ColorPreset = {
  label: string;
  value: string;
  darkValue?: string;
};

export type FieldConfig = {
  name: string;
  type: FieldType;
  label?: string;
  description?: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
  step?: number;
  group?: string;
  row?: string;
  presetColors?: ColorPreset[];
  defaultValue?: string;
  /** Number of visible rows for `textarea` fields. */
  rows?: number;
  /**
   * How many grid columns the field spans on `md+` screens. Defaults to `1`.
   * The grid is two columns by default (see `ObjectField`'s `columns`), so
   * `colSpan: 2` makes a full-width field (textarea, long URI, …). A span
   * larger than the column count simply fills the row. Ignored below `md`,
   * where every field stacks full width.
   */
  colSpan?: number;
  /**
   * Extra classes merged onto the field's grid cell. Escape hatch for
   * per-field layout/spacing tweaks (custom width, ordering, margins, …)
   * without adding a dedicated prop for every case.
   */
  className?: string;
};

export type RowConfig = {
  id: string;
  fields: string[];
};

export interface ObjectFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  fields: FieldConfig[];
  rowConfig?: RowConfig[];
  labelPosition?: LabelPosition;
  /** Field density. Defaults to `sm` (compact) for backward compatibility. */
  size?: FieldSize;
  /**
   * Number of columns in the field grid on `md+` screens. Defaults to `2`.
   * Increase it to build wider layouts that fields can span via `colSpan`.
   * Below `md` the grid always collapses to a single column.
   */
  columns?: number;
}
