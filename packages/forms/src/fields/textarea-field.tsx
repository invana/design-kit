import { FormField, Textarea } from '../components';
import type { FieldComponentProps, TextareaFieldSchema } from '../types';
import { FieldShell, getFieldName } from './_shared';

export function TextareaField({
  field,
  control,
  namePrefix,
  layout,
}: FieldComponentProps<TextareaFieldSchema>) {
  const name = getFieldName(field.name, namePrefix);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: rhf, fieldState }) => (
        <FieldShell field={field} layout={layout} error={fieldState.error}>
          <Textarea
            rows={field.rows ?? 4}
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
