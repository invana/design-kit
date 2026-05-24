import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { FormRenderer, type FormSchema } from '@invana/forms';

const meta: Meta<typeof FormRenderer> = {
  title: 'Form Generator/FormRenderer',
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
