import * as React from 'react';
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Mode,
  type SubmitHandler,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, cn } from '@invana/ui';
import { Form } from './components';
import type {
  FieldRegistry,
  FormLayout,
  FormSchema,
} from './types';
import { mergeRegistry } from './registry';
import { FieldResolver, RegistryProvider } from './field-resolver';
import { zodFromSchema } from './schema/zod-from-schema';

export interface FormRendererProps<TValues extends FieldValues = FieldValues> {
  schema: FormSchema;
  defaultValues?: DefaultValues<TValues>;
  onSubmit: SubmitHandler<TValues>;
  onChange?: (values: TValues) => void;
  mode?: Mode;
  layout?: FormLayout;
  submitLabel?: string;
  showSubmit?: boolean;
  resetOnSubmit?: boolean;
  registry?: Partial<FieldRegistry>;
  className?: string;
  children?: React.ReactNode;
}

export function FormRenderer<TValues extends FieldValues = FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  onChange,
  mode = 'onSubmit',
  layout = 'vertical',
  submitLabel = 'Submit',
  showSubmit = true,
  resetOnSubmit = false,
  registry: registryOverride,
  className,
  children,
}: FormRendererProps<TValues>) {
  const resolverSchema = React.useMemo(
    () => schema.validation ?? zodFromSchema(schema),
    [schema]
  );

  const form = useForm<TValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(resolverSchema as any) as any,
    defaultValues,
    mode,
  });

  const registry = React.useMemo(
    () => mergeRegistry(registryOverride),
    [registryOverride]
  );

  React.useEffect(() => {
    if (!onChange) return;
    const sub = form.watch((values) => onChange(values as TValues));
    return () => sub.unsubscribe();
  }, [form, onChange]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
    if (resetOnSubmit) form.reset();
  });

  return (
    <Form {...form}>
      <RegistryProvider value={registry}>
        <form
          onSubmit={handleSubmit}
          noValidate
          className={cn(
            layout === 'inline'
              ? 'flex flex-wrap items-end gap-3'
              : 'space-y-4',
            className
          )}
        >
          {schema.fields.map((field, index) => (
            <FieldResolver
              key={'name' in field ? field.name : `row-${index}`}
              field={field}
              layout={layout}
            />
          ))}

          {children}

          {showSubmit && (
            <div className={layout === 'inline' ? '' : 'pt-2'}>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {submitLabel}
              </Button>
            </div>
          )}
        </form>
      </RegistryProvider>
    </Form>
  );
}
