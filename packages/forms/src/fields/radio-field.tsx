import { FormField, Label, RadioGroup, RadioGroupItem } from '../components';
import type { FieldComponentProps, SelectFieldSchema } from '../types';
import { FieldShell, getFieldName } from './_shared';

export function RadioField({
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
          <RadioGroup
            value={(rhf.value as string | undefined) ?? ''}
            onValueChange={rhf.onChange}
            disabled={field.disabled}
            className="flex flex-col gap-2"
          >
            {field.options.map((opt) => {
              const id = `${name}-${opt.value}`;
              return (
                <div key={opt.value} className="flex items-center gap-2">
                  <RadioGroupItem
                    value={opt.value}
                    id={id}
                    disabled={opt.disabled}
                  />
                  <Label htmlFor={id} className="font-normal">
                    {opt.label}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </FieldShell>
      )}
    />
  );
}
