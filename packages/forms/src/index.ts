// The generators are `FormField.Input`, `FormField.Select`, … (and each by its
// own name below); `Field` is the layout's — `Field`, `FieldLabel`, `FieldGroup`
// from `./components` — so a hand-built row and a generated one share a root.
export {
  FormField,
  ObjectField,
  InputField,
  PasswordField,
  TextareaField,
  SelectField,
  BooleanField,
  RadioField,
  CheckboxGroupField,
  ColorField,
  NumberField,
  IconField,
} from './form-field';

export type {
  BooleanControl,
  FieldBadge,
  FieldOption,
  FieldConfig,
  FieldOrientation,
  FieldSize,
  GroupConfig,
  RowConfig,
  LabelPosition,
  ObjectFieldProps,
  ColorPreset,
  FieldType,
} from './types';

export { SettingsPanel } from './settings-panel';
export type { SettingsPanelProps } from './settings-panel';

export { ColorSwatches } from './fields/color-swatches';
export { SliderNumber } from './fields/slider-number';
export { IconInput } from './fields/icon-input';

export * from './components';

export type {
  Control,
  DefaultValues,
  FieldValues,
  Mode,
  SubmitHandler,
  UseFormReturn,
} from 'react-hook-form';
