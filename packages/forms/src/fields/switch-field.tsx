import { cn } from '@invana/ui';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FormField,
  Switch,
} from '../components';
import type { CheckboxFieldSchema, FieldComponentProps } from '../types';
import { getFieldName } from './_shared';

export function SwitchField({
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
          className={cn(
            'items-center justify-between rounded-md border p-3',
            field.className
          )}
          data-invalid={fieldState.error ? true : undefined}
        >
          <FieldContent>
            {field.label && (
              <FieldLabel>
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
          <Switch
            checked={!!rhf.value}
            onCheckedChange={rhf.onChange}
            disabled={field.disabled}
            aria-invalid={!!fieldState.error}
          />
        </Field>
      )}
    />
  );
}
