import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@invana/ui';
import { Form, FormField, type FieldConfig } from '@invana/forms';

const meta: Meta = {
  title: 'Form Generator/Checkbox Group',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

/**
 * `type: 'checkbox'` with `options` binds to a `string[]` (multi-select). A
 * single on/off value is instead `type: 'boolean'` with `control: 'checkbox'`,
 * which renders a compact inline `☑ label`.
 */
const fields: FieldConfig[] = [
  {
    name: 'notifications',
    type: 'checkbox',
    label: 'Notify me about',
    options: [
      { label: 'Comments', value: 'comments' },
      { label: 'Mentions', value: 'mentions' },
      { label: 'Deploys', value: 'deploys' },
      { label: 'Weekly digest', value: 'digest' },
    ],
    colSpan: 2,
  },
  {
    name: 'scopes',
    type: 'checkbox',
    label: 'Token scopes',
    orientation: 'horizontal',
    options: [
      { label: 'read', value: 'read' },
      { label: 'write', value: 'write' },
      { label: 'delete', value: 'delete' },
    ],
    colSpan: 2,
  },
  {
    name: 'subscribe',
    type: 'boolean',
    control: 'checkbox',
    label: 'Subscribe to the product newsletter',
    colSpan: 2,
  },
];

const defaultValues = {
  prefs: {
    notifications: ['comments', 'mentions'],
    scopes: ['read'],
    subscribe: true,
  },
};

export const CheckboxGroup: Story = {
  render: () => {
    const form = useForm({ defaultValues });
    const [submitted, setSubmitted] = React.useState<Record<string, unknown> | null>(null);

    return (
      <Card className="w-[420px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(setSubmitted)}>
            <CardHeader>
              <CardTitle>Notification preferences</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <FormField.ObjectField
                control={form.control}
                name="prefs"
                fields={fields}
                labelPosition="top"
                size="md"
              />

              {submitted && (
                <pre className="overflow-auto rounded-md border bg-muted/40 p-2 text-[10px]">
                  {JSON.stringify(submitted, null, 2)}
                </pre>
              )}
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full">
                Save preferences
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    );
  },
};
