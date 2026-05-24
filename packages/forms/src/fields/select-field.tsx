import {
  FormField,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components';
import type { FieldComponentProps, SelectFieldSchema } from '../types';
import { FieldShell, getFieldName } from './_shared';

export function SelectField({
  field,
  control,
  namePrefix,
  layout,
}: FieldComponentProps<SelectFieldSchema>) {
  const name = getFieldName(field.name, namePrefix);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: rhf, fieldState }) => (
        <FieldShell field={field} layout={layout} error={fieldState.error}>
          <Select
            onValueChange={rhf.onChange}
            value={(rhf.value as string | undefined) ?? ''}
            disabled={field.disabled}
          >
            <SelectTrigger aria-invalid={!!fieldState.error}>
              <SelectValue placeholder={field.placeholder ?? 'Select…'} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldShell>
      )}
    />
  );
}
