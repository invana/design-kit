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
import { Form, FormField, type FieldConfig } from '@invana/forms';

const meta: Meta = {
  title: 'Form Generator/Create Project',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

/* The whole project form is described as JSON and rendered by ObjectField. */
const projectFields: FieldConfig[] = [
  {
    name: 'name',
    type: 'text',
    label: 'Project name',
    placeholder: 'my-awesome-project',
    description: 'Lowercase letters, numbers and hyphens.',
    colSpan: 2,
  },
  {
    name: 'description',
    type: 'textarea',
    label: 'Description',
    rows: 3,
    placeholder: 'What is this project about?',
    colSpan: 2,
  },
  {
    name: 'visibility',
    type: 'select',
    label: 'Visibility',
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
    colSpan: 2,
  },
];

const defaultValues = {
  project: {
    name: '',
    description: '',
    visibility: 'private',
    template: 'react-vite',
    initReadme: true,
  },
};

export const CreateProject: Story = {
  render: () => {
    const form = useForm({ defaultValues, mode: 'onTouched' });
    const [submitted, setSubmitted] = React.useState<Record<string, unknown> | null>(null);

    return (
      <Card className="w-[480px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(setSubmitted)}>
            <CardHeader>
              <CardTitle>Create a new project</CardTitle>
              <CardDescription>Set up a workspace for your team to build in.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <FormField.ObjectField
                control={form.control}
                name="project"
                fields={projectFields}
                labelPosition="top"
                size="md"
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
