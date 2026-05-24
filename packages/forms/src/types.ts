import type { ComponentType } from 'react';
import type {
  Control,
  FieldValues,
  UseFormReturn,
} from 'react-hook-form';
import type { ZodTypeAny } from 'zod';

export type FieldOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type ShowIfFn = (values: Record<string, unknown>) => boolean;

interface BaseField {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  validation?: ZodTypeAny;
  showIf?: ShowIfFn;
  className?: string;
  /** When this field is the child of a row, sets its column span (1–12). */
  cols?: number;
}

export interface TextFieldSchema extends BaseField {
  type: 'text' | 'email' | 'password' | 'url';
  minLength?: number;
  maxLength?: number;
}

export interface NumberFieldSchema extends BaseField {
  type: 'number';
  min?: number;
  max?: number;
  step?: number;
}

export interface TextareaFieldSchema extends BaseField {
  type: 'textarea';
  rows?: number;
  minLength?: number;
  maxLength?: number;
}

export interface SelectFieldSchema extends BaseField {
  type: 'select' | 'radio';
  options: FieldOption[];
}

export interface MultiSelectFieldSchema extends BaseField {
  type: 'multi-select';
  options: FieldOption[];
  min?: number;
  max?: number;
}

export interface CheckboxFieldSchema extends BaseField {
  type: 'checkbox' | 'switch';
}

export interface SliderFieldSchema extends BaseField {
  type: 'slider';
  min: number;
  max: number;
  step?: number;
}

export interface DateFieldSchema extends BaseField {
  type: 'date';
  minDate?: Date;
  maxDate?: Date;
}

export interface DateRangeFieldSchema extends BaseField {
  type: 'date-range';
  minDate?: Date;
  maxDate?: Date;
}

export interface FileFieldSchema extends BaseField {
  type: 'file';
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
}

export interface ColorFieldSchema extends BaseField {
  type: 'color';
  format?: 'hex' | 'rgb';
}

export interface RichTextFieldSchema extends BaseField {
  type: 'rich-text';
}

export interface CodeFieldSchema extends BaseField {
  type: 'code';
  language?: string;
}

export interface GroupFieldSchema extends BaseField {
  type: 'group';
  fields: FieldSchema[];
}

export interface ArrayFieldSchema extends BaseField {
  type: 'array';
  itemFields: FieldSchema[];
  min?: number;
  max?: number;
  addLabel?: string;
}

/**
 * Purely-structural row that lays children out in a 12-column CSS grid.
 * It has no `name` and no form value of its own — children keep the parent
 * `namePrefix`, so a row inside a group still resolves to the group's path.
 */
export interface RowFieldSchema {
  type: 'row';
  fields: FieldSchema[];
  /** Tailwind gap utility suffix (e.g. '2', '4'); defaults to '4'. */
  gap?: string;
  showIf?: ShowIfFn;
  className?: string;
}

/**
 * Custom field schema for consumer-registered field types. Not part of the
 * built-in `FieldSchema` discriminated union (an open string index would
 * break type narrowing on the known types). Consumers can cast their custom
 * schemas to `FieldSchema` via `as unknown as FieldSchema` when composing a
 * `FormSchema`, or pass the union of their own custom schemas alongside.
 */
export interface CustomFieldSchema extends BaseField {
  type: string;
  [key: string]: unknown;
}

export type FieldSchema =
  | TextFieldSchema
  | NumberFieldSchema
  | TextareaFieldSchema
  | SelectFieldSchema
  | MultiSelectFieldSchema
  | CheckboxFieldSchema
  | SliderFieldSchema
  | DateFieldSchema
  | DateRangeFieldSchema
  | FileFieldSchema
  | ColorFieldSchema
  | RichTextFieldSchema
  | CodeFieldSchema
  | GroupFieldSchema
  | ArrayFieldSchema
  | RowFieldSchema;

export type FieldType = FieldSchema['type'];

export interface FormSchema {
  fields: FieldSchema[];
  validation?: ZodTypeAny;
}

export type FormLayout = 'vertical' | 'horizontal' | 'inline';

export interface FieldComponentProps<TField extends FieldSchema = FieldSchema> {
  field: TField;
  control: Control<FieldValues>;
  namePrefix?: string;
  form: UseFormReturn<FieldValues>;
  layout: FormLayout;
}

export type FieldComponent<TField extends FieldSchema = FieldSchema> =
  ComponentType<FieldComponentProps<TField>>;

// Use `any` here so heterogeneous, narrowly-typed field components
// (e.g. FieldComponent<TextFieldSchema>) can be registered against a single
// dispatch map without tripping strictFunctionTypes variance checks.
// The discriminated union on `field.type` provides the real type safety at
// each component boundary.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FieldRegistry = Record<string, FieldComponent<any>>;
