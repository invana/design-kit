import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import { Button, PanelBox } from '@invana/ui';
import { Form, FormField, type FieldConfig } from '@invana/forms';

const meta: Meta = {
  title: 'Forms/Generated/All Fields',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

/**
 * Every `FieldType` the generator renders, in one `ObjectField`. The value
 * shape each binds to is in its description; submit to see them side by side.
 */
const fields: FieldConfig[] = [
  { name: 'name', type: 'text', label: 'Text', description: 'string', placeholder: 'Customer analysis' },
  { name: 'password', type: 'password', label: 'Password', description: 'string · reveal toggle' },
  {
    name: 'summary',
    type: 'textarea',
    label: 'Textarea',
    description: 'string · `rows` sets the height',
    rows: 3,
    colSpan: 2,
  },
  {
    name: 'connector',
    type: 'select',
    label: 'Select',
    description: 'one string from `options`',
    placeholder: 'Select a connector',
    options: [
      { label: 'Neo4j', value: 'neo4j' },
      { label: 'JanusGraph', value: 'janusgraph' },
      { label: 'Amazon Neptune', value: 'neptune' },
    ],
  },
  {
    name: 'maxRuns',
    type: 'number',
    label: 'Number',
    description: 'number · `min` / `max` / `step`',
    min: 1,
    max: 32,
    step: 1,
  },
  {
    name: 'validation',
    type: 'radio',
    label: 'Radio',
    description: 'one string, as a list · `orientation`',
    orientation: 'horizontal',
    options: [
      { label: 'Inherit', value: 'inherit' },
      { label: 'Strict', value: 'strict' },
      { label: 'Permissive', value: 'permissive' },
    ],
    colSpan: 2,
  },
  {
    name: 'scopes',
    type: 'checkbox',
    label: 'Checkbox group',
    description: 'string[] from `options`',
    orientation: 'horizontal',
    options: [
      { label: 'read', value: 'read' },
      { label: 'write', value: 'write' },
      { label: 'admin', value: 'admin' },
    ],
    colSpan: 2,
  },
  { name: 'readOnly', type: 'boolean', label: 'Boolean · switch', description: 'boolean · the default control' },
  { name: 'abstract', type: 'boolean', control: 'checkbox', label: 'Boolean · checkbox' },
  {
    name: 'accent',
    type: 'color',
    label: 'Color',
    description: 'string · `presetColors` for swatches',
    presetColors: [
      { label: 'Blue', value: '#3b82f6' },
      { label: 'Emerald', value: '#10b981' },
      { label: 'Amber', value: '#f59e0b' },
    ],
  },
  { name: 'icon', type: 'icon', label: 'Icon', description: 'string · an icon name' },
];

const defaultValues = {
  all: {
    name: '',
    password: '',
    summary: '',
    connector: 'neo4j',
    maxRuns: 4,
    validation: 'inherit',
    scopes: ['read'],
    readOnly: false,
    abstract: false,
    accent: '#3b82f6',
    icon: '',
  },
};

export const AllFields: Story = {
  name: 'All Fields',
  render: function Render() {
    const form = useForm({ defaultValues });
    const [submitted, setSubmitted] = React.useState<unknown>(null);

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(setSubmitted)} className="max-w-2xl space-y-4">
          <FormField.ObjectField
            control={form.control}
            name="all"
            fields={fields}
            labelPosition="top"
            size="md"
          />

          <Button type="submit">Submit</Button>

          <PanelBox title="Submitted payload">
            <pre>{submitted ? JSON.stringify(submitted, null, 2) : '— submit the form —'}</pre>
          </PanelBox>
        </form>
      </Form>
    );
  },
};
