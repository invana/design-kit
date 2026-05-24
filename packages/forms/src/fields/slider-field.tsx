import * as React from 'react';
import { FormField, Slider } from '../components';
import type { FieldComponentProps, SliderFieldSchema } from '../types';
import { FieldShell, getFieldName } from './_shared';

interface InnerProps {
  field: SliderFieldSchema;
  layout: FieldComponentProps<SliderFieldSchema>['layout'];
  value: number;
  onChange: (v: number) => void;
  error?: import('react-hook-form').FieldError;
}

function SliderInner({ field, layout, value, onChange, error }: InnerProps) {
  // Memoize the array — Radix Slider treats a new array reference as a value
  // change, which would loop with React's controlled-input cycle.
  const sliderValue = React.useMemo(() => [value], [value]);
  return (
    <FieldShell field={field} layout={layout} error={error}>
      <div className="flex items-center gap-3">
        <Slider
          min={field.min}
          max={field.max}
          step={field.step ?? 1}
          value={sliderValue}
          onValueChange={(v) => onChange(v[0])}
          disabled={field.disabled}
          className="flex-1"
        />
        <span className="w-10 text-right text-sm tabular-nums text-muted-foreground">
          {value}
        </span>
      </div>
    </FieldShell>
  );
}

export function SliderField({
  field,
  control,
  namePrefix,
  layout,
}: FieldComponentProps<SliderFieldSchema>) {
  const name = getFieldName(field.name, namePrefix);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: rhf, fieldState }) => {
        const value =
          typeof rhf.value === 'number' ? rhf.value : field.min;
        return (
          <SliderInner
            field={field}
            layout={layout}
            value={value}
            onChange={rhf.onChange}
            error={fieldState.error}
          />
        );
      }}
    />
  );
}
