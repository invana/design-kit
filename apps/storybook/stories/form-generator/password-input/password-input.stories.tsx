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
  title: 'Form Generator/PasswordInput',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

/* A single `password` field — the generator renders the reveal-toggle input. */
const passwordFields: FieldConfig[] = [
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    description: 'Click the eye icon to reveal the value.',
    placeholder: 'Enter a password',
  },
];

const defaultValues = {
  account: { password: '' },
};

export const PasswordInputField: Story = {
  render: () => {
    const form = useForm({ defaultValues, mode: 'onTouched' });
    const [submitted, setSubmitted] = React.useState<Record<string, unknown> | null>(null);

    return (
      <Card className="w-[380px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(setSubmitted)}>
            <CardHeader>
              <CardTitle>Set a password</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <FormField.ObjectField
                control={form.control}
                name="account"
                fields={passwordFields}
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
                Save
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    );
  },
};
