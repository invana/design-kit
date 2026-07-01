import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@invana/ui';
import { Form, FormField, type FieldConfig, type RowConfig } from '@invana/forms';

const meta: Meta = {
  title: 'Form Generator/Registration',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

/* The form is described as JSON and rendered by FormField.ObjectField. */
const registrationFields: FieldConfig[] = [
  { name: 'fullName', type: 'text', label: 'Full name', placeholder: 'Ada Lovelace' },
  { name: 'email', type: 'text', label: 'Email', placeholder: 'you@example.com' },
  {
    name: 'role',
    type: 'select',
    label: 'Role',
    placeholder: 'Select a role',
    options: [
      { label: 'Developer', value: 'developer' },
      { label: 'Designer', value: 'designer' },
      { label: 'Product Manager', value: 'pm' },
      { label: 'Other', value: 'other' },
    ],
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    description: 'At least 8 characters.',
    placeholder: '••••••••',
  },
  {
    name: 'confirmPassword',
    type: 'password',
    label: 'Confirm password',
    placeholder: '••••••••',
  },
  {
    name: 'acceptTerms',
    type: 'boolean',
    label: 'I agree to the Terms of Service and Privacy Policy.',
    colSpan: 2,
  },
];

const registrationRowConfig: RowConfig[] = [{ id: 'contact', fields: ['email', 'role'] }];

const defaultValues = {
  registration: {
    fullName: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  },
};

export const Registration: Story = {
  render: () => {
    const form = useForm({ defaultValues, mode: 'onTouched' });
    const [submitted, setSubmitted] = React.useState<Record<string, unknown> | null>(null);

    return (
      <Card className="w-[440px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(setSubmitted)}>
            <CardHeader>
              <CardTitle>Create your account</CardTitle>
              <CardDescription>Join your team on Invana in a few seconds.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <FormField.ObjectField
                control={form.control}
                name="registration"
                fields={registrationFields}
                rowConfig={registrationRowConfig}
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
                Create account
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    );
  },
};
