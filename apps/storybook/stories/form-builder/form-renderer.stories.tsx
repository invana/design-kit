import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { Controller } from 'react-hook-form';
import {
  FormRenderer,
  type FieldComponentProps,
  type FormSchema,
} from '@invana/forms';

const meta: Meta<typeof FormRenderer> = {
  title: 'UI Extended/FormRenderer',
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

const basicSchema: FormSchema = {
  fields: [
    {
      type: 'text',
      name: 'fullName',
      label: 'Full name',
      placeholder: 'Ada Lovelace',
      required: true,
      minLength: 2,
    },
    {
      type: 'email',
      name: 'email',
      label: 'Email',
      placeholder: 'you@invana.io',
      required: true,
    },
    {
      type: 'select',
      name: 'role',
      label: 'Role',
      required: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Viewer', value: 'viewer' },
      ],
    },
    {
      type: 'textarea',
      name: 'bio',
      label: 'Bio',
      placeholder: 'A short bio…',
      description: 'Markdown is not supported here.',
      rows: 3,
    },
    {
      type: 'checkbox',
      name: 'tos',
      label: 'I agree to the terms of service',
      required: true,
    },
  ],
};

export const Basic: Story = {
  render: () => <StoryShell schema={basicSchema} />,
};

export const HorizontalLayout: Story = {
  render: () => (
    <FormRenderer
      schema={basicSchema}
      layout="horizontal"
      onSubmit={(v) => console.log('submitted', v)}
    />
  ),
};

const conditionalSchema: FormSchema = {
  fields: [
    {
      type: 'select',
      name: 'country',
      label: 'Country',
      required: true,
      options: [
        { label: 'United States', value: 'us' },
        { label: 'India', value: 'in' },
        { label: 'Germany', value: 'de' },
      ],
    },
    {
      type: 'select',
      name: 'state',
      label: 'State (US only)',
      placeholder: 'Pick a state',
      required: true,
      options: [
        { label: 'California', value: 'ca' },
        { label: 'New York', value: 'ny' },
        { label: 'Texas', value: 'tx' },
      ],
      showIf: (v) => v.country === 'us',
    },
  ],
};

export const Conditional: Story = {
  render: () => <StoryShell schema={conditionalSchema} />,
};

const arraySchema: FormSchema = {
  fields: [
    {
      type: 'text',
      name: 'projectName',
      label: 'Project name',
      required: true,
    },
    {
      type: 'array',
      name: 'members',
      label: 'Team members',
      addLabel: 'Add member',
      min: 1,
      itemFields: [
        { type: 'text', name: 'name', label: 'Name', required: true },
        { type: 'email', name: 'email', label: 'Email', required: true },
        {
          type: 'select',
          name: 'role',
          label: 'Role',
          options: [
            { label: 'Owner', value: 'owner' },
            { label: 'Member', value: 'member' },
          ],
        },
      ],
    },
  ],
};

export const ArrayFields: Story = {
  render: () => (
    <StoryShell
      schema={arraySchema}
      defaultValues={{
        projectName: 'Atlas',
        members: [{ name: '', email: '', role: 'owner' }],
      }}
    />
  ),
};

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

const rowsSchema: FormSchema = {
  fields: [
    {
      type: 'row',
      fields: [
        { type: 'text', name: 'firstName', label: 'First name', required: true },
        { type: 'text', name: 'lastName', label: 'Last name', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { type: 'email', name: 'email', label: 'Email', cols: 8, required: true },
        {
          type: 'select',
          name: 'role',
          label: 'Role',
          cols: 4,
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Editor', value: 'editor' },
            { label: 'Viewer', value: 'viewer' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { type: 'text', name: 'city', label: 'City', cols: 5 },
        { type: 'text', name: 'state', label: 'State', cols: 4 },
        { type: 'text', name: 'zip', label: 'Zip', cols: 3 },
      ],
    },
    {
      type: 'textarea',
      name: 'notes',
      label: 'Notes',
      rows: 3,
    },
  ],
};

export const Rows: Story = {
  render: () => <StoryShell schema={rowsSchema} />,
};

export const AllFields: Story = {
  render: () => (
    <StoryShell
      schema={allFieldsSchema}
      defaultValues={{ volume: 50, brand: '#5b8def' }}
    />
  ),
};

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
