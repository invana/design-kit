import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { Controller } from 'react-hook-form';
import {
  FormRenderer,
  type FieldComponentProps,
  type FormSchema,
} from '@invana/forms';

const meta: Meta<typeof FormRenderer> = {
  title: 'Form Builder/FormRenderer',
  component: FormRenderer,
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof FormRenderer>;

function StoryShell({
  schema,
  defaultValues,
  registry,
}: {
  schema: FormSchema;
  defaultValues?: Record<string, unknown>;
  registry?: Parameters<typeof FormRenderer>[0]['registry'];
}) {
  const [submitted, setSubmitted] = React.useState<unknown>(null);
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 max-w-4xl">
      <FormRenderer
        schema={schema}
        defaultValues={defaultValues}
        registry={registry}
        onSubmit={(values) => setSubmitted(values)}
      />
      <div>
        <h4 className="mb-2 text-sm font-medium text-muted-foreground">
          Submitted payload
        </h4>
        <pre className="rounded-md border bg-muted/40 p-3 text-xs">
          {submitted
            ? JSON.stringify(
                submitted,
                (_, v) => (v instanceof Date ? v.toISOString() : v),
                2
              )
            : '— submit the form —'}
        </pre>
      </div>
    </div>
  );
}

function RatingField({ field, control }: FieldComponentProps) {
  return (
    <Controller
      control={control}
      name={field.name}
      render={({ field: rhf }) => (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">{field.label}</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => rhf.onChange(n)}
                className={
                  (((rhf.value as number | undefined) ?? 0) >= n
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted') +
                  ' h-8 w-8 rounded'
                }
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}
    />
  );
}

const customSchema = {
  fields: [
    { type: 'text', name: 'label', label: 'Label' },
    {
      type: 'rating',
      name: 'rating',
      label: 'Rating',
    },
  ],
} as unknown as FormSchema;

export const CustomField: Story = {
  render: () => (
    <StoryShell
      schema={customSchema}
      defaultValues={{ rating: 3 }}
      registry={{ rating: RatingField }}
    />
  ),
};
