import { FormField, Input } from '../components';
import type { FieldComponentProps, NumberFieldSchema } from '../types';
import { FieldShell, getFieldName } from './_shared';

export function NumberField({
  field,
  control,
  namePrefix,
  layout,
}: FieldComponentProps<NumberFieldSchema>) {
  const name = getFieldName(field.name, namePrefix);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: rhf, fieldState }) => (
        <FieldShell field={field} layout={layout} error={fieldState.error}>
          <Input
            type="number"
            placeholder={field.placeholder}
            disabled={field.disabled}
            min={field.min}
            max={field.max}
            step={field.step}
            aria-invalid={!!fieldState.error}
            {...rhf}
            value={(rhf.value as number | undefined) ?? ''}
            onChange={(e) => {
              const v = e.target.value;
              rhf.onChange(v === '' ? undefined : Number(v));
            }}
          />
        </FieldShell>
      )}
    />
  );
}
