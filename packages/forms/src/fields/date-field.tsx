import { CalendarIcon } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { Button, Popover, PopoverContent, PopoverTrigger, cn } from '@invana/ui';
import { FormField } from '../components';
import type { DateFieldSchema, FieldComponentProps } from '../types';
import { FieldShell, getFieldName } from './_shared';

function formatDate(d: Date | undefined): string {
  if (!d) return '';
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function DateField({
  field,
  control,
  namePrefix,
  layout,
}: FieldComponentProps<DateFieldSchema>) {
  const name = getFieldName(field.name, namePrefix);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: rhf, fieldState }) => {
        const value = rhf.value instanceof Date ? rhf.value : undefined;
        return (
          <FieldShell field={field} layout={layout} error={fieldState.error}>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={field.disabled}
                  aria-invalid={!!fieldState.error}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !value && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {value
                    ? formatDate(value)
                    : (field.placeholder ?? 'Pick a date')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <DayPicker
                  mode="single"
                  selected={value}
                  onSelect={(d) => rhf.onChange(d ?? null)}
                  disabled={[
                    ...(field.minDate ? [{ before: field.minDate }] : []),
                    ...(field.maxDate ? [{ after: field.maxDate }] : []),
                  ]}
                />
              </PopoverContent>
            </Popover>
          </FieldShell>
        );
      }}
    />
  );
}
