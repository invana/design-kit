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
import {
  Form,
  FormField,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  PasswordInput,
} from '@invana/forms';

const meta: Meta = {
  title: 'Form Generator/PasswordInput',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

type Values = { password: string };

export const PasswordInputField: Story = {
  render: () => {
    const form = useForm<Values>({ defaultValues: { password: '' }, mode: 'onTouched' });
    const [submitted, setSubmitted] = React.useState<Values | null>(null);

    return (
      <Card className="w-[380px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(setSubmitted)}>
            <CardHeader>
              <CardTitle>Set a password</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                rules={{
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Use at least 8 characters' },
                }}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="Enter a password" {...field} />
                    </FormControl>
                    <FormDescription>
                      Click the eye icon to reveal the value.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
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
