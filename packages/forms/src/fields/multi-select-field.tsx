import * as React from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import {
  Badge,
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  cn,
} from '@invana/ui';
import { FormField } from '../components';
import type { FieldComponentProps, MultiSelectFieldSchema } from '../types';
import { FieldShell, getFieldName } from './_shared';

export function MultiSelectField({
  field,
  control,
  namePrefix,
  layout,
}: FieldComponentProps<MultiSelectFieldSchema>) {
  const name = getFieldName(field.name, namePrefix);
  const [open, setOpen] = React.useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: rhf, fieldState }) => {
        const selected = (rhf.value as string[] | undefined) ?? [];
        const toggle = (value: string) => {
          if (selected.includes(value)) {
            rhf.onChange(selected.filter((v) => v !== value));
          } else {
            rhf.onChange([...selected, value]);
          }
        };
        const remove = (value: string) =>
          rhf.onChange(selected.filter((v) => v !== value));

        const selectedOptions = field.options.filter((o) =>
          selected.includes(o.value)
        );

        return (
          <FieldShell field={field} layout={layout} error={fieldState.error}>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  aria-invalid={!!fieldState.error}
                  disabled={field.disabled}
                  className={cn(
                    'w-full justify-between font-normal',
                    selected.length === 0 && 'text-muted-foreground'
                  )}
                >
                  <span className="flex flex-wrap gap-1">
                    {selected.length === 0 ? (
                      (field.placeholder ?? 'Select…')
                    ) : (
                      selectedOptions.map((o) => (
                        <Badge
                          key={o.value}
                          variant="secondary"
                          className="gap-1"
                        >
                          {o.label}
                          <span
                            role="button"
                            tabIndex={-1}
                            onClick={(e) => {
                              e.stopPropagation();
                              remove(o.value);
                            }}
                            className="hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </span>
                        </Badge>
                      ))
                    )}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search…" />
                  <CommandList>
                    <CommandEmpty>No results.</CommandEmpty>
                    <CommandGroup>
                      {field.options.map((opt) => {
                        const isSelected = selected.includes(opt.value);
                        return (
                          <CommandItem
                            key={opt.value}
                            value={opt.label}
                            disabled={opt.disabled}
                            onSelect={() => toggle(opt.value)}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                isSelected ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                            {opt.label}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FieldShell>
        );
      }}
    />
  );
}
