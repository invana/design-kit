import { cn } from '@invana/ui';
import { FieldSet, FieldLegend, FieldGroup } from '../components';
import type { FieldComponentProps, GroupFieldSchema } from '../types';
import { FieldResolver } from '../field-resolver';
import { getFieldName } from './_shared';

export function GroupField({
  field,
  namePrefix,
  layout,
}: FieldComponentProps<GroupFieldSchema>) {
  const groupName = getFieldName(field.name, namePrefix);

  return (
    <FieldSet className={cn(field.className)}>
      {field.label && <FieldLegend>{field.label}</FieldLegend>}
      <FieldGroup className="space-y-4">
        {field.fields.map((child) => (
          <FieldResolver
            key={child.name}
            field={child}
            namePrefix={groupName}
            layout={layout}
          />
        ))}
      </FieldGroup>
    </FieldSet>
  );
}
