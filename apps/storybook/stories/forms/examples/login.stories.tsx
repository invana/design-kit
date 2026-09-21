import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Link } from '@invana/ui';
import { Form, FormField, type FieldConfig } from '@invana/forms';

const meta: Meta = {
  title: 'Form Generator/Examples/Login',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

/* The whole form is described as JSON and rendered by FormField.ObjectField. */
const loginFields: FieldConfig[] = [
  { name: 'email', type: 'text', label: 'Email', placeholder: 'you@example.com' },
  { name: 'password', type: 'password', label: 'Password', placeholder: '••••••••' },
  { name: 'remember', type: 'boolean', control: 'checkbox', label: 'Remember me' },
];

const defaultValues = {
  login: { email: '', password: '', remember: true },
};

export const Login: Story = {
  render: () => {
    const form = useForm({ defaultValues, mode: 'onTouched' });
    const [submitted, setSubmitted] = React.useState<Record<string, unknown> | null>(null);

    return (
      <Card className="w-[380px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(setSubmitted)}>
            <CardHeader>
              <CardTitle>Sign in</CardTitle>
              <CardDescription>Welcome back. Enter your credentials to continue.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <FormField.ObjectField
                control={form.control}
                name="login"
                fields={loginFields}
                labelPosition="top"
                size="md"
              />

              <Link
                href="#"
                variant="quiet"
                className="block text-right"
                onClick={(e) => e.preventDefault()}
              >
                Forgot password?
              </Link>

              {submitted && (
                <pre className="overflow-auto rounded-md border bg-muted/40 p-2 text-[10px]">
                  {JSON.stringify(submitted, null, 2)}
                </pre>
              )}
            </CardContent>

            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full">
                Sign in
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="#" variant="underlined" onClick={(e) => e.preventDefault()}>
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    );
  },
};
