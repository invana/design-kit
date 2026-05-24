import { cn } from '@invana/ui';
import {
  Checkbox,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FormField,
} from '../components';
import type { CheckboxFieldSchema, FieldComponentProps } from '../types';
import { getFieldName } from './_shared';

export function CheckboxField({
  field,
  control,
  namePrefix,
}: FieldComponentProps<CheckboxFieldSchema>) {
  const name = getFieldName(field.name, namePrefix);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: rhf, fieldState }) => (
        <Field
          orientation="horizontal"
          className={cn(field.className)}
          data-invalid={fieldState.error ? true : undefined}
        >
          <Checkbox
            checked={!!rhf.value}
            onCheckedChange={rhf.onChange}
            disabled={field.disabled}
            aria-invalid={!!fieldState.error}
          />
          <FieldContent>
            {field.label && (
              <FieldLabel className="font-normal">
                {field.label}
                {field.required && (
                  <span className="ml-0.5 text-destructive">*</span>
                )}
              </FieldLabel>
            )}
            {field.description && (
              <FieldDescription>{field.description}</FieldDescription>
            )}
            <FieldError
              errors={fieldState.error ? [fieldState.error] : undefined}
            />
          </FieldContent>
        </Field>
      )}
    />
  );
}
