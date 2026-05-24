import * as React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import type { FieldRegistry, FieldSchema, FormLayout } from './types';

// Empty default — FormRenderer always supplies the real registry via the
// provider. Referencing `defaultFieldRegistry` here would create a circular
// import (registry.ts imports the field components, and group/array field
// components import this module).
const RegistryContext = React.createContext<FieldRegistry>({});

export const RegistryProvider = RegistryContext.Provider;

export function useFieldRegistry() {
  return React.useContext(RegistryContext);
}

interface FieldResolverProps {
  field: FieldSchema;
  registry?: FieldRegistry;
  namePrefix?: string;
  layout: FormLayout;
}

export function FieldResolver({
  field,
  registry: registryProp,
  namePrefix,
  layout,
}: FieldResolverProps) {
  const ctxRegistry = useFieldRegistry();
  const registry = registryProp ?? ctxRegistry;
  const form = useFormContext();
  const fieldName = 'name' in field ? field.name : undefined;
  const fullName = fieldName
    ? namePrefix
      ? `${namePrefix}.${fieldName}`
      : fieldName
    : undefined;

  const watchedValues = useWatch({ control: form.control });
  const visible = field.showIf
    ? field.showIf(
        ((watchedValues as unknown) ?? {}) as Record<string, unknown>
      )
    : true;

  const prevVisibleRef = React.useRef(visible);
  React.useEffect(() => {
    // Structural fields (rows) have no name and nothing to unregister.
    if (!fullName) {
      prevVisibleRef.current = visible;
      return;
    }
    if (prevVisibleRef.current && !visible) {
      form.unregister(fullName, { keepDefaultValue: false });
    }
    prevVisibleRef.current = visible;
  }, [visible, fullName, form]);

  if (!visible) return null;

  const Component = registry[field.type];
  if (!Component) {
    if (typeof console !== 'undefined') {
      console.warn(
        `[@invana/forms] No renderer registered for field type "${field.type}" (field: "${fieldName ?? '(unnamed)'}")`
      );
    }
    return null;
  }

  return (
    <Component
      field={field}
      control={form.control}
      form={form}
      namePrefix={namePrefix}
      layout={layout}
    />
  );
}
