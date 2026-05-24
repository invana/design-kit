import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray } from 'react-hook-form';
import { Button, cn } from '@invana/ui';
import { FieldSet, FieldLegend } from '../components';
import type { ArrayFieldSchema, FieldComponentProps } from '../types';
import { FieldResolver } from '../field-resolver';
import { getFieldName } from './_shared';

export function ArrayField({
  field,
  control,
  namePrefix,
  layout,
}: FieldComponentProps<ArrayFieldSchema>) {
  const name = getFieldName(field.name, namePrefix);
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const emptyItem = () =>
    field.itemFields.reduce<Record<string, unknown>>((acc, f) => {
      acc[f.name] =
        f.type === 'checkbox' || f.type === 'switch'
          ? false
          : f.type === 'multi-select'
            ? []
            : f.type === 'group'
              ? {}
              : f.type === 'array'
                ? []
                : '';
      return acc;
    }, {});

  const atMax = field.max != null && fields.length >= field.max;
  const atMin = field.min != null && fields.length <= field.min;

  return (
    <FieldSet className={cn(field.className)}>
      {field.label && <FieldLegend>{field.label}</FieldLegend>}
      <div className="space-y-3">
        {fields.map((row, index) => (
          <div
            key={row.id}
            className="space-y-3 rounded-md border p-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                #{index + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                disabled={atMin}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            {field.itemFields.map((child) => (
              <FieldResolver
                key={child.name}
                field={child}
                namePrefix={`${name}.${index}`}
                layout={layout}
              />
            ))}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append(emptyItem())}
          disabled={atMax}
        >
          <Plus className="mr-1 h-4 w-4" />
          {field.addLabel ?? 'Add item'}
        </Button>
      </div>
    </FieldSet>
  );
}
