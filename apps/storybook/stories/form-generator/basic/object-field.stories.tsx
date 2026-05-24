import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import { Button } from '@invana/ui';
import { Form, FormField, type FieldConfig, type RowConfig } from '@invana/forms';

const meta: Meta = {
  title: 'Form Generator/Basic/ObjectField',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

const profileFields: FieldConfig[] = [
  { name: 'firstName', type: 'text', label: 'First name' },
  { name: 'lastName', type: 'text', label: 'Last name' },
  { name: 'role', type: 'select', label: 'Role', options: [
    { label: 'Admin', value: 'admin' },
    { label: 'Editor', value: 'editor' },
    { label: 'Viewer', value: 'viewer' },
  ]},
  { name: 'notifications', type: 'boolean', label: 'Email me notifications', group: 'preferences' },
  { name: 'theme', type: 'select', label: 'Theme', group: 'preferences', options: [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'System', value: 'system' },
  ]},
  { name: 'accent', type: 'color', label: 'Accent', group: 'preferences' },
];

const profileRowConfig: RowConfig[] = [
  { id: 'name', fields: ['firstName', 'lastName'] },
  { id: 'role', fields: ['role'] },
];

export const ObjectField: Story = {
  render: () => {
    const form = useForm({
      defaultValues: {
        profile: {
          firstName: 'Ada',
          lastName: 'Lovelace',
          role: 'admin',
          notifications: true,
          theme: 'system',
          accent: 'rgb(59, 130, 246)',
        },
      },
    });
    const [submitted, setSubmitted] = React.useState<unknown>(null);

    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 max-w-4xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(setSubmitted)} className="space-y-4">
            <FormField.ObjectField
              control={form.control}
              name="profile"
              fields={profileFields}
              rowConfig={profileRowConfig}
              labelPosition="top"
            />
            <Button type="submit">Save</Button>
          </form>
        </Form>
        <div>
          <h4 className="mb-2 text-sm font-medium text-muted-foreground">Submitted payload</h4>
          <pre className="rounded-md border bg-muted/40 p-3 text-xs">
            {submitted ? JSON.stringify(submitted, null, 2) : '— submit the form —'}
          </pre>
        </div>
      </div>
    );
  },
};
