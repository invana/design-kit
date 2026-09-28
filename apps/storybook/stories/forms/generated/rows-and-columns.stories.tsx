import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import { Button, PanelBox } from '@invana/ui';
import { Form, FormField, type FieldConfig, type RowConfig } from '@invana/forms';

const meta: Meta = {
  title: 'Forms/Generated/Rows and Columns',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

/**
 * Where each field sits. Three `ObjectField`s write into one `useForm`, each
 * under its own name (`profile.*`, `connection.*`, `address.*`), so one Submit
 * hands back a single object.
 */

// `rowConfig` — rows by name. A row of one keeps the next field off its line
// (it still takes one column; `colSpan` widens it). Unlisted fields follow in
// the plain grid.
const profileFields: FieldConfig[] = [
  { name: 'firstName', type: 'text', label: 'First name' },
  { name: 'lastName', type: 'text', label: 'Last name' },
  {
    name: 'role',
    type: 'select',
    label: 'Role',
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'Editor', value: 'editor' },
      { label: 'Viewer', value: 'viewer' },
    ],
  },
];

const profileRows: RowConfig[] = [
  { id: 'name', fields: ['firstName', 'lastName'] },
  { id: 'role', fields: ['role'] },
];

// `colSpan: 2` — a full-width field in the default two-column grid.
const connectionFields: FieldConfig[] = [
  { name: 'uri', type: 'text', label: 'URI', placeholder: 'bolt://localhost:7687', colSpan: 2 },
  { name: 'username', type: 'text', label: 'Username' },
  { name: 'password', type: 'password', label: 'Password' },
];

// `columns={3}` — a wider grid; `street` takes two of three, `notes` all three.
const addressFields: FieldConfig[] = [
  { name: 'city', type: 'text', label: 'City' },
  { name: 'state', type: 'text', label: 'State' },
  { name: 'zip', type: 'text', label: 'ZIP' },
  { name: 'street', type: 'text', label: 'Street', colSpan: 2 },
  { name: 'unit', type: 'text', label: 'Unit' },
  { name: 'notes', type: 'textarea', label: 'Delivery notes', rows: 3, colSpan: 3 },
];

const defaultValues = {
  profile: { firstName: 'Ada', lastName: 'Lovelace', role: 'admin' },
  connection: { uri: '', username: 'neo4j', password: '' },
  address: { city: '', state: '', zip: '', street: '', unit: '', notes: '' },
};

export const RowsAndColumns: Story = {
  name: 'Rows and Columns',
  render: function Render() {
    const form = useForm({ defaultValues });
    const [submitted, setSubmitted] = React.useState<unknown>(null);

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(setSubmitted)} className="max-w-3xl space-y-4">
          <PanelBox title="rowConfig" aside="rows by name">
            <FormField.ObjectField
              control={form.control}
              name="profile"
              fields={profileFields}
              rowConfig={profileRows}
              labelPosition="top"
              size="md"
            />
          </PanelBox>

          <PanelBox title="colSpan" aside="URI fills the row">
            <FormField.ObjectField
              control={form.control}
              name="connection"
              fields={connectionFields}
              labelPosition="top"
              size="md"
            />
          </PanelBox>

          <PanelBox title="columns={3}" aside="with mixed colSpan">
            <FormField.ObjectField
              control={form.control}
              name="address"
              fields={addressFields}
              columns={3}
              labelPosition="top"
              size="md"
            />
          </PanelBox>

          <Button type="submit">Save</Button>

          <PanelBox title="Submitted payload">
            <pre>{submitted ? JSON.stringify(submitted, null, 2) : '— submit the form —'}</pre>
          </PanelBox>
        </form>
      </Form>
    );
  },
};
