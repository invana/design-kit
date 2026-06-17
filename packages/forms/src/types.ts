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
}
