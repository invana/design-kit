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
}: {
  schema: FormSchema;
  defaultValues?: Record<string, unknown>;
}) {
  const [submitted, setSubmitted] = React.useState<unknown>(null);
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 max-w-5xl">
      <FormRenderer
        schema={schema}
        defaultValues={defaultValues}
        onSubmit={(values) => setSubmitted(values)}
      />
      <div>
        <h4 className="mb-2 text-sm font-medium text-muted-foreground">
          Submitted payload
        </h4>
        <pre className="rounded-md border bg-muted/40 p-3 text-xs">
          {submitted
            ? JSON.stringify(submitted, null, 2)
            : '— submit the form —'}
        </pre>
      </div>
    </div>
  );
}

const rowLayoutsSchema: FormSchema = {
  fields: [
    // 1. Even split — no explicit cols, children share the row equally
    {
      type: 'row',
      fields: [
        { type: 'text', name: 'firstName', label: 'First name', required: true },
        { type: 'text', name: 'lastName', label: 'Last name', required: true },
      ],
    },

    // 2. 8/4 asymmetric split
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

    // 3. 5/4/3 three-column address row
    {
      type: 'row',
      fields: [
        { type: 'text', name: 'city', label: 'City', cols: 5 },
        { type: 'text', name: 'state', label: 'State', cols: 4 },
        { type: 'text', name: 'zip', label: 'Zip', cols: 3 },
      ],
    },

    // 4. Full-width field followed by a 3-col row (mixing rows with non-row fields)
    { type: 'text', name: 'company', label: 'Company' },
    {
      type: 'row',
      fields: [
        { type: 'text', name: 'department', label: 'Department', cols: 6 },
        { type: 'text', name: 'team', label: 'Team', cols: 3 },
        { type: 'number', name: 'headcount', label: 'Headcount', cols: 3, min: 0 },
      ],
    },

    // 5. Custom tighter gap
    {
      type: 'row',
      gap: '2',
      fields: [
        { type: 'text', name: 'cardNumber', label: 'Card number', cols: 7 },
        { type: 'text', name: 'expiry', label: 'MM / YY', cols: 3 },
        { type: 'text', name: 'cvc', label: 'CVC', cols: 2 },
      ],
    },

    // 6. Conditional row — only shows when shipDifferent is on
    {
      type: 'switch',
      name: 'shipDifferent',
      label: 'Ship to a different address',
    },
    {
      type: 'row',
      showIf: (v) => v.shipDifferent === true,
      fields: [
        { type: 'text', name: 'shipStreet', label: 'Shipping street', cols: 8 },
        { type: 'text', name: 'shipUnit', label: 'Unit', cols: 4 },
      ],
    },
  ],
};

export const RowLayouts: Story = {
  render: () => <StoryShell schema={rowLayoutsSchema} />,
};
