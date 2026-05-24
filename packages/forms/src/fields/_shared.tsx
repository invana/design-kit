import * as React from 'react';
import type { FieldError as RhfFieldError } from 'react-hook-form';
import { cn } from '@invana/ui';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '../components';
import type { FieldSchema, FormLayout } from '../types';

export function getFieldName(name: string, namePrefix?: string) {
  return namePrefix ? `${namePrefix}.${name}` : name;
}

export function toOrientation(
  layout: FormLayout
): 'vertical' | 'horizontal' | 'responsive' {
  if (layout === 'horizontal') return 'horizontal';
  if (layout === 'inline') return 'responsive';
  return 'vertical';
}

interface FieldShellProps {
  field: FieldSchema;
  layout: FormLayout;
  error?: RhfFieldError;
  /** Override the orientation Field uses (defaults to mapping from layout). */
  orientation?: 'vertical' | 'horizontal' | 'responsive';
  /** Pass `false` to render label after content (e.g. checkbox rows). */
  labelFirst?: boolean;
  /** When true, wraps children in FieldContent. Defaults to true. */
  wrapContent?: boolean;
  children: React.ReactNode;
}

export function FieldShell({
  field,
  layout,
  error,
  orientation,
  labelFirst = true,
  wrapContent = true,
  children,
}: FieldShellProps) {
  const label =
    'label' in field && field.label ? (
      <FieldLabel>
        {field.label}
        {'required' in field && field.required && (
          <span className="ml-0.5 text-destructive">*</span>
        )}
      </FieldLabel>
    ) : null;

  const description =
    'description' in field && field.description ? (
      <FieldDescription>{field.description}</FieldDescription>
    ) : null;

  const errors = error ? [error] : undefined;

  const content = wrapContent ? (
    <FieldContent>
      {children}
      {description}
      <FieldError errors={errors} />
    </FieldContent>
  ) : (
    <>
      {children}
      {description}
      <FieldError errors={errors} />
    </>
  );

  return (
    <Field
      orientation={orientation ?? toOrientation(layout)}
      className={cn(field.className)}
      data-invalid={error ? true : undefined}
    >
      {labelFirst ? label : null}
      {content}
      {labelFirst ? null : label}
    </Field>
  );
}
