import type { FieldRegistry } from './types';
import { TextField } from './fields/text-field';
import { NumberField } from './fields/number-field';
import { TextareaField } from './fields/textarea-field';
import { SelectField } from './fields/select-field';
import { MultiSelectField } from './fields/multi-select-field';
import { RadioField } from './fields/radio-field';
import { CheckboxField } from './fields/checkbox-field';
import { SwitchField } from './fields/switch-field';
import { SliderField } from './fields/slider-field';
import { DateField } from './fields/date-field';
import { DateRangeField } from './fields/date-range-field';
import { FileField } from './fields/file-field';
import { ColorField } from './fields/color-field';
import { RichTextField } from './fields/rich/rich-text-field';
import { CodeField } from './fields/rich/code-field';
import { GroupField } from './fields/group-field';
import { ArrayField } from './fields/array-field';
import { RowField } from './fields/row-field';

export const defaultFieldRegistry: FieldRegistry = {
  text: TextField,
  email: TextField,
  password: TextField,
  url: TextField,
  number: NumberField,
  textarea: TextareaField,
  select: SelectField,
  'multi-select': MultiSelectField,
  radio: RadioField,
  checkbox: CheckboxField,
  switch: SwitchField,
  slider: SliderField,
  date: DateField,
  'date-range': DateRangeField,
  file: FileField,
  color: ColorField,
  'rich-text': RichTextField,
  code: CodeField,
  group: GroupField,
  array: ArrayField,
  row: RowField,
};

export function mergeRegistry(
  override?: Partial<FieldRegistry>
): FieldRegistry {
  if (!override) return defaultFieldRegistry;
  const merged: FieldRegistry = { ...defaultFieldRegistry };
  for (const [type, component] of Object.entries(override)) {
    if (component) merged[type] = component;
  }
  return merged;
}
