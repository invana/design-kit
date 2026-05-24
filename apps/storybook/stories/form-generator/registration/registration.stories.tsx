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
import {
  Form,
  FormField,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@invana/forms';

const meta: Meta = {
  title: 'Form Generator/Registration',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

type RegistrationValues = {
  fullName: string;
  email: string;
  role: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

const defaultValues: RegistrationValues = {
  fullName: '',
  email: '',
  role: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
};

const roleOptions = [
  { label: 'Developer', value: 'developer' },
  { label: 'Designer', value: 'designer' },
  { label: 'Product Manager', value: 'pm' },
  { label: 'Other', value: 'other' },
];

const emailPattern = {
  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  message: 'Enter a valid email address',
};

export const Registration: Story = {
  render: () => {
    const form = useForm<RegistrationValues>({ defaultValues, mode: 'onTouched' });
    const [submitted, setSubmitted] = React.useState<RegistrationValues | null>(null);

    return (
      <Card className="w-[440px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(setSubmitted)}>
            <CardHeader>
              <CardTitle>Create your account</CardTitle>
              <CardDescription>Join your team on Invana in a few seconds.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                rules={{ required: 'Full name is required' }}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input placeholder="Ada Lovelace" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  rules={{ required: 'Email is required', pattern: emailPattern }}
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  rules={{ required: 'Select a role' }}
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Role</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roleOptions.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormDescription>At least 8 characters.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                rules={{
                  required: 'Confirm your password',
                  validate: (value) =>
                    value === form.getValues('password') || 'Passwords do not match',
                }}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="acceptTerms"
                rules={{ validate: (value) => value === true || 'You must accept the terms' }}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <div className="flex items-start gap-2 rounded-md border p-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-0.5"
                        />
                      </FormControl>
                      <FormLabel className="text-xs font-normal leading-snug">
                        I agree to the Terms of Service and Privacy Policy.
                      </FormLabel>
                    </div>
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
                Create account
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    );
  },
};
