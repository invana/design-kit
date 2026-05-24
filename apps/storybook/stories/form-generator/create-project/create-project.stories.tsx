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
  Textarea,
  type FieldConfig,
  type RowConfig,
} from '@invana/forms';

const meta: Meta = {
  title: 'Form Generator/Create Project',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

/* Structured "settings" object rendered by FormField.ObjectField. */
const settingsFields: FieldConfig[] = [
  {
    name: 'visibility',
    type: 'select',
    label: 'Visibility',
    row: 'meta',
    options: [
      { label: 'Private', value: 'private' },
      { label: 'Internal', value: 'internal' },
      { label: 'Public', value: 'public' },
    ],
  },
  {
    name: 'template',
    type: 'select',
    label: 'Template',
    row: 'meta',
    options: [
      { label: 'Empty', value: 'empty' },
      { label: 'React + Vite', value: 'react-vite' },
      { label: 'Next.js', value: 'nextjs' },
      { label: 'Node Service', value: 'node' },
    ],
  },
  {
    name: 'initReadme',
    type: 'boolean',
    label: 'Initialize with a README',
  },
];

const settingsRowConfig: RowConfig[] = [{ id: 'meta', fields: ['visibility', 'template'] }];

type CreateProjectValues = {
  name: string;
  description: string;
  settings: {
    visibility: string;
    template: string;
    initReadme: boolean;
  };
};

const defaultValues: CreateProjectValues = {
  name: '',
  description: '',
  settings: {
    visibility: 'private',
    template: 'react-vite',
    initReadme: true,
  },
};

export const CreateProject: Story = {
  render: () => {
    const form = useForm<CreateProjectValues>({ defaultValues, mode: 'onTouched' });
    const [submitted, setSubmitted] = React.useState<CreateProjectValues | null>(null);

    return (
      <Card className="w-[480px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(setSubmitted)}>
            <CardHeader>
              <CardTitle>Create a new project</CardTitle>
              <CardDescription>Set up a workspace for your team to build in.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                rules={{
                  required: 'Project name is required',
                  pattern: {
                    value: /^[a-z0-9-]+$/,
                    message: 'Use lowercase letters, numbers and hyphens only',
                  },
                }}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Project name</FormLabel>
                    <FormControl>
                      <Input placeholder="my-awesome-project" {...field} />
                    </FormControl>
                    <FormDescription>Lowercase letters, numbers and hyphens.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="What is this project about?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Headline feature: a structured object rendered from a field config */}
              <FormField.ObjectField
                control={form.control}
                name="settings"
                fields={settingsFields}
                rowConfig={settingsRowConfig}
                labelPosition="top"
              />

              {submitted && (
                <pre className="overflow-auto rounded-md border bg-muted/40 p-2 text-[10px]">
                  {JSON.stringify(submitted, null, 2)}
                </pre>
              )}
            </CardContent>

            <CardFooter className="justify-end gap-2 border-t">
              <Button type="button" variant="outline" onClick={() => form.reset(defaultValues)}>
                Reset
              </Button>
              <Button type="submit">Create project</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    );
  },
};
