export * from './components';

export { FormRenderer, type FormRendererProps } from './form-renderer';
export { FieldResolver } from './field-resolver';
export { defaultFieldRegistry, mergeRegistry } from './registry';
export { zodFromSchema } from './schema/zod-from-schema';

export type {
  FieldOption,
  ShowIfFn,
  FieldSchema,
  FieldType,
  FormSchema,
  FormLayout,
  FieldComponent,
  FieldComponentProps,
  FieldRegistry,
  TextFieldSchema,
  NumberFieldSchema,
  TextareaFieldSchema,
  SelectFieldSchema,
  MultiSelectFieldSchema,
  CheckboxFieldSchema,
  SliderFieldSchema,
  DateFieldSchema,
  DateRangeFieldSchema,
  FileFieldSchema,
  ColorFieldSchema,
  RichTextFieldSchema,
  CodeFieldSchema,
  GroupFieldSchema,
  ArrayFieldSchema,
  RowFieldSchema,
  CustomFieldSchema,
} from './types';

export type {
  Control,
  DefaultValues,
  FieldValues,
  Mode,
  SubmitHandler,
  UseFormReturn,
} from 'react-hook-form';
