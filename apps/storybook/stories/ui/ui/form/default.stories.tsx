import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Input,
} from '@invana/forms';
import { Button } from '@invana/ui';

const meta: Meta<typeof Form> = {
  title: 'UI/UI/Form',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const form = useForm({ defaultValues: { username: '' } });

    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => {
            // eslint-disable-next-line no-console
            console.log('submitted', values);
          })}
          className="w-80 space-y-6"
        >
          <FormField
            control={form.control}
            name="username"
            rules={{ required: 'Username is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="ada.lovelace" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    );
  },
};
