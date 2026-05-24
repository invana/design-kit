import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { FormRenderer, type FormSchema } from '@invana/forms';

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

const allFieldsSchema: FormSchema = {
  fields: [
    { type: 'text', name: 'name', label: 'Text', required: true },
    { type: 'email', name: 'email', label: 'Email' },
    { type: 'password', name: 'pw', label: 'Password' },
    { type: 'url', name: 'site', label: 'URL' },
    { type: 'number', name: 'age', label: 'Number', min: 0, max: 120 },
    { type: 'textarea', name: 'about', label: 'Textarea', rows: 3 },
    {
      type: 'select',
      name: 'fav',
      label: 'Select',
      options: [
        { label: 'Red', value: 'r' },
        { label: 'Green', value: 'g' },
        { label: 'Blue', value: 'b' },
      ],
    },
    {
      type: 'multi-select',
      name: 'tags',
      label: 'Multi-select',
      options: [
        { label: 'Engineering', value: 'eng' },
        { label: 'Design', value: 'des' },
        { label: 'Product', value: 'prod' },
        { label: 'Sales', value: 'sales' },
      ],
    },
    {
      type: 'radio',
      name: 'plan',
      label: 'Radio',
      options: [
        { label: 'Free', value: 'free' },
        { label: 'Pro', value: 'pro' },
      ],
    },
    { type: 'checkbox', name: 'newsletter', label: 'Subscribe to newsletter' },
    { type: 'switch', name: 'beta', label: 'Enable beta features' },
    { type: 'slider', name: 'volume', label: 'Volume', min: 0, max: 100 },
    { type: 'date', name: 'dob', label: 'Date' },
    { type: 'date-range', name: 'stay', label: 'Date range' },
    { type: 'color', name: 'brand', label: 'Color' },
    { type: 'file', name: 'avatar', label: 'File upload', accept: 'image/*' },
    { type: 'rich-text', name: 'notes', label: 'Rich text' },
    { type: 'code', name: 'snippet', label: 'Code', language: 'js' },
  ],
};

export const AllFields: Story = {
  render: () => (
    <StoryShell
      schema={allFieldsSchema}
      defaultValues={{ volume: 50, brand: '#5b8def' }}
    />
  ),
};
