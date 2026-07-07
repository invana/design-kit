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
  title: 'Form Generator/Examples/Radio Group',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

/**
 * `type: 'radio'` binds to a single string picked from `options` — the same
 * value shape as `select`, rendered as a radio list. `orientation` switches
 * between a vertical list (default) and a horizontal row.
 */
const fields: FieldConfig[] = [
  {
    name: 'plan',
    type: 'radio',
    label: 'Plan',
    options: [
      { label: 'Starter — free', value: 'starter' },
      { label: 'Pro — $12 / mo', value: 'pro' },
      { label: 'Enterprise — contact us', value: 'enterprise' },
    ],
    colSpan: 2,
  },
  {
    name: 'billing',
    type: 'radio',
    label: 'Billing cycle',
    orientation: 'horizontal',
    options: [
      { label: 'Monthly', value: 'monthly' },
      { label: 'Yearly', value: 'yearly' },
    ],
    colSpan: 2,
  },
];

const defaultValues = { subscription: { plan: 'pro', billing: 'yearly' } };

export const RadioGroup: Story = {
  render: () => {
    const form = useForm({ defaultValues });
    const [submitted, setSubmitted] = React.useState<Record<string, unknown> | null>(null);

    return (
      <Card className="w-[420px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(setSubmitted)}>
            <CardHeader>
              <CardTitle>Choose a plan</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <FormField.ObjectField
                control={form.control}
                name="subscription"
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
                Continue
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    );
  },
};
