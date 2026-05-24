import type { Control } from 'react-hook-form';

export type LabelPosition = 'side' | 'top';

export type FieldType =
  | 'text'
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
}
