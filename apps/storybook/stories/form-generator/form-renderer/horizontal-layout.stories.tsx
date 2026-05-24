import { Meta, StoryObj } from '@storybook/react-vite';
import { FormRenderer, type FormSchema } from '@invana/forms';

const meta: Meta<typeof FormRenderer> = {
  title: 'Form Generator/FormRenderer',
  component: FormRenderer,
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof FormRenderer>;

const basicSchema: FormSchema = {
  fields: [
    {
      type: 'text',
      name: 'fullName',
      label: 'Full name',
      placeholder: 'Ada Lovelace',
      required: true,
      minLength: 2,
    },
    {
      type: 'email',
      name: 'email',
      label: 'Email',
      placeholder: 'you@invana.io',
      required: true,
    },
    {
      type: 'select',
      name: 'role',
      label: 'Role',
      required: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Viewer', value: 'viewer' },
      ],
    },
    {
      type: 'textarea',
      name: 'bio',
      label: 'Bio',
      placeholder: 'A short bio…',
      description: 'Markdown is not supported here.',
      rows: 3,
    },
    {
      type: 'checkbox',
      name: 'tos',
      label: 'I agree to the terms of service',
      required: true,
    },
  ],
};

export const HorizontalLayout: Story = {
  render: () => (
    <FormRenderer
      schema={basicSchema}
      layout="horizontal"
      onSubmit={(v) => console.log('submitted', v)}
    />
  ),
};
