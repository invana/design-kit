import { FormField, Input } from '../components';
import type { FieldComponentProps, TextFieldSchema } from '../types';
import { FieldShell, getFieldName } from './_shared';

export function TextField({
  field,
  control,
  namePrefix,
  layout,
}: FieldComponentProps<TextFieldSchema>) {
  const name = getFieldName(field.name, namePrefix);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: rhf, fieldState }) => (
        <FieldShell field={field} layout={layout} error={fieldState.error}>
          <Input
            type={field.type}
            placeholder={field.placeholder}
            disabled={field.disabled}
            minLength={field.minLength}
            maxLength={field.maxLength}
            aria-invalid={!!fieldState.error}
            {...rhf}
            value={(rhf.value as string | undefined) ?? ''}
          />
        </FieldShell>
      )}
    />
  );
}
