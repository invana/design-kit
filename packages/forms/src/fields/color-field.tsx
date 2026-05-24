import { HexColorPicker } from 'react-colorful';
import { Button, Popover, PopoverContent, PopoverTrigger } from '@invana/ui';
import { FormField, Input } from '../components';
import type { ColorFieldSchema, FieldComponentProps } from '../types';
import { FieldShell, getFieldName } from './_shared';

export function ColorField({
  field,
  control,
  namePrefix,
  layout,
}: FieldComponentProps<ColorFieldSchema>) {
  const name = getFieldName(field.name, namePrefix);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: rhf, fieldState }) => {
        const value = (rhf.value as string | undefined) ?? '#000000';
        return (
          <FieldShell field={field} layout={layout} error={fieldState.error}>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={field.disabled}
                    className="h-9 w-9 p-0"
                    style={{ backgroundColor: value }}
                    aria-label="Pick color"
                  />
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3" align="start">
                  <HexColorPicker color={value} onChange={rhf.onChange} />
                </PopoverContent>
              </Popover>
              <Input
                value={value}
                onChange={(e) => rhf.onChange(e.target.value)}
                placeholder="#000000"
                disabled={field.disabled}
                aria-invalid={!!fieldState.error}
                className="font-mono"
              />
            </div>
          </FieldShell>
        );
      }}
    />
  );
}
