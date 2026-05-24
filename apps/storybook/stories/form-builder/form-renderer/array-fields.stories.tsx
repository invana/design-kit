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
