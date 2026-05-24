import { CalendarIcon } from 'lucide-react';
import { DayPicker, type DateRange } from 'react-day-picker';
import 'react-day-picker/style.css';
import { Button, Popover, PopoverContent, PopoverTrigger, cn } from '@invana/ui';
import { FormField } from '../components';
import type { DateRangeFieldSchema, FieldComponentProps } from '../types';
import { FieldShell, getFieldName } from './_shared';

function fmt(d: Date | undefined): string {
  if (!d) return '';
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function DateRangeField({
  field,
  control,
  namePrefix,
  layout,
}: FieldComponentProps<DateRangeFieldSchema>) {
  const name = getFieldName(field.name, namePrefix);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: rhf, fieldState }) => {
        const value = (rhf.value ?? {}) as DateRange;
        const label = value.from
          ? value.to
            ? `${fmt(value.from)} – ${fmt(value.to)}`
            : fmt(value.from)
          : (field.placeholder ?? 'Pick a date range');

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
                    !value.from && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {label}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <DayPicker
                  mode="range"
                  numberOfMonths={2}
                  selected={value}
                  onSelect={(r) => rhf.onChange(r ?? null)}
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
