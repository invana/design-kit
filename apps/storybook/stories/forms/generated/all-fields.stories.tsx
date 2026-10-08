import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { useForm } from 'react-hook-form';
import { Button } from '@invana/ui';
import { FieldGroup, Form, FormField, type FieldConfig, type FieldValues } from '@invana/forms';

import spec from '../../../fixtures/forms/all-fields.json';
import { snippet } from '../../_story/source';
import { VariantGrid, type Log } from '../../_story/variant-grid';
import { USE_FORM, indent, objectField } from '../form-source';

const FIELDS = spec.fields as FieldConfig[];
const VARIANTS = [{ caption: 'All Fields', width: 672 }];

interface Args {
  onSubmit: (values: FieldValues) => void;
}

function Live({ log, onSubmit }: Args & { log: Log }) {
  const form = useForm<FieldValues>({ defaultValues: spec.defaultValues });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          onSubmit(values);
          log('onSubmit', values);
        })}
      >
        <FieldGroup>
          <FormField.ObjectField control={form.control} name={spec.name} fields={FIELDS} labelPosition="top" size="md" />
          <Button type="submit">Submit</Button>
        </FieldGroup>
      </form>
    </Form>
  );
}

const meta = {
  title: 'Forms/Generated/All Fields',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        code: snippet({
          imports: [
            "import { useForm } from 'react-hook-form';",
            "import { FieldGroup, Form, FormField } from '@invana/forms';",
            "import { Button } from '@invana/ui';",
          ],
          comment: 'Every FieldType in one ObjectField — the value each binds to is in its description',
          data: { fields: spec.fields, defaultValues: spec.defaultValues },
          setup: USE_FORM,
          call: [
            '<Form {...form}>',
            '  <form onSubmit={onSubmit}>',
            '    <FieldGroup>',
            `      ${indent(objectField(spec.name, 'fields', { size: { literal: 'md' } }), '      ')}`,
            '      <Button type="submit">Submit</Button>',
            '    </FieldGroup>',
            '  </form>',
            '</Form>',
          ].join('\n'),
        }),
      },
    },
  },
  args: { onSubmit: fn() },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * Every `FieldType` the generator renders, in one `ObjectField`, from
 * `fixtures/forms/all-fields.json`. The value shape each binds to is in its description; submit
 * to see them side by side — the payload is written under the form.
 */
export const AllFields: Story = {
  name: 'All Fields',
  render: (args) => <VariantGrid variants={VARIANTS}>{(_v, log) => <Live {...args} log={log} />}</VariantGrid>,
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'All Fields' }));
    await step('Name the analysis and submit', async () => {
      await userEvent.type(cell.getByRole('textbox', { name: 'Text' }), 'Margins');
      await userEvent.click(cell.getByRole('button', { name: 'Submit' }));
    });
    await step('A disabled field and a disabled choice show but cannot be changed', async () => {
      await expect(cell.getByRole('textbox', { name: 'Disabled' })).toBeDisabled();
      await expect(cell.getByRole('radio', { name: /^Merge fields/ })).toBeDisabled();
    });
    await step('The whole object is handed over', async () => {
      const values = { all: { ...spec.defaultValues.all, name: 'Margins' } };
      await expect(args.onSubmit).toHaveBeenCalledWith(values);
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"name": "Margins"');
    });
  },
};
