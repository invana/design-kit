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
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Switch,
} from '@invana/forms';

const meta: Meta = {
  title: 'Form Generator/Login',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

type LoginValues = {
  email: string;
  password: string;
  remember: boolean;
};

const defaultValues: LoginValues = {
  email: '',
  password: '',
  remember: true,
};

const emailPattern = {
  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  message: 'Enter a valid email address',
};

export const Login: Story = {
  render: () => {
    const form = useForm<LoginValues>({ defaultValues, mode: 'onTouched' });
    const [submitted, setSubmitted] = React.useState<LoginValues | null>(null);

    return (
      <Card className="w-[380px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(setSubmitted)}>
            <CardHeader>
              <CardTitle>Sign in</CardTitle>
              <CardDescription>Welcome back. Enter your credentials to continue.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
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
                name="password"
                rules={{ required: 'Password is required' }}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <a
                        href="#"
                        className="text-xs text-muted-foreground hover:text-foreground"
                        onClick={(e) => e.preventDefault()}
                      >
                        Forgot password?
                      </a>
                    </div>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="remember"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-md border p-2">
                    <FormLabel className="text-xs">Remember me</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

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
              <p className="text-center text-xs text-muted-foreground">
                Don&apos;t have an account?{' '}
                <a href="#" className="text-foreground underline" onClick={(e) => e.preventDefault()}>
                  Sign up
                </a>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    );
  },
};
