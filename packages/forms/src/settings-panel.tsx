'use client';
import * as React from 'react';
import { Card, CardContent, cn } from '@invana/ui';
import type { UseFormReturn } from 'react-hook-form';
import { Form } from './components/form';
import { ObjectField } from './form-field';
import type { ObjectFieldProps } from './types';

export interface SettingsPanelProps extends Omit<ObjectFieldProps, 'control'> {
  /**
   * The react-hook-form instance (from `useForm`). The panel renders its own
   * `<Form>` provider around the fields, so it is fully self-contained — no
   * external `<Form>` wrapper is required.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  /** Title shown above the fields (uppercase, muted — the panel heading). */
  title?: React.ReactNode;
  /** Extra classes merged onto the outer `Card` (e.g. a fixed width). */
  className?: string;
  /** Extra classes merged onto the scrollable `CardContent`. */
  contentClassName?: string;
  /**
   * Extra content rendered inside the form, after the fields — e.g. a footer
   * with Apply / Reset actions. Rendered within the `<Form>` provider so a
   * submit button has form context.
   */
  children?: React.ReactNode;
}

/**
 * A self-contained, form-driven settings / inspector panel: the card chrome, an
 * uppercase heading and the sectioned {@link ObjectField} accordion in a single
 * component. Consumers own their `useForm` and pass it in; everything else — the
 * `Card`, scroll region, `<Form>` provider, grouped accordions with count
 * badges and per-field status pills — is handled here.
 *
 * ```tsx
 * const form = useForm({ defaultValues });
 * <SettingsPanel title="Canvas Settings" form={form} name="canvas" fields={fields} />
 * ```
 *
 * All {@link ObjectFieldProps} (`name`, `fields`, `rowConfig`, `labelPosition`,
 * `size`, `columns`) are forwarded to the underlying `ObjectField`.
 */
export function SettingsPanel({
  form,
  title,
  className,
  contentClassName,
  children,
  ...objectField
}: SettingsPanelProps) {
  return (
    <Card className={className}>
      <CardContent
        className={cn('max-h-[80vh] overflow-y-auto p-4', contentClassName)}
      >
        {title && (
          <h2 className="mb-3 text-base font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </h2>
        )}
        <Form {...form}>
          <ObjectField control={form.control} {...objectField} />
          {children}
        </Form>
      </CardContent>
    </Card>
  );
}
