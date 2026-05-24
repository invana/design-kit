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
