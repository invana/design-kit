import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { useForm } from 'react-hook-form';
import { Button } from '@invana/ui';
import { FieldGroup, Form, FormField, type FieldConfig, type FieldValues } from '@invana/forms';

import spec from '../../../fixtures/forms/key-value.json';
import { snippet } from '../../_story/source';
import { VariantGrid, type Log } from '../../_story/variant-grid';
import { objectField } from '../form-source';

const FIELDS = spec.fields as FieldConfig[];
const VARIANTS = [{ caption: 'Key Value', width: 360 }];

interface Args {
  onSubmit: (values: FieldValues) => void;
}

/** An element's editor: a label, a type and its properties, applied together. */
function Editor({ log, onSubmit }: Args & { log: Log }) {
  const form = useForm<FieldValues>({ defaultValues: { [spec.name]: spec.initial } });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          onSubmit(values);
          log('onSubmit', values);
        })}
      >
        <FieldGroup>
          <FormField.ObjectField control={form.control} name={spec.name} fields={FIELDS} labelPosition="top" size="xs" />
          <Button type="submit" size="sm" className="self-end">
            Apply
          </Button>
        </FieldGroup>
      </form>
    </Form>
  );
}

const meta = {
  title: 'Forms/Generated/Key Value',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        code: snippet({
          imports: ["import { useForm } from 'react-hook-form';", "import { Form, FormField } from '@invana/forms';"],
          comment: 'A `keyvalue` field: rows of name → value, as a KeyValueEntry[] in row order',
          data: { fields: FIELDS, initial: spec.initial },
          setup: `const form = useForm({ defaultValues: { ${spec.name}: initial } });`,
          call: objectField(spec.name, 'fields'),
        }),
      },
    },
  },
  args: { onSubmit: fn() },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * **A list of name → value rows** — a node's or a relationship's properties, from
 * `fixtures/forms/key-value.json`. The field's value is a `KeyValueEntry[]` in row order; a blank
 * or repeated name stays a row until the consumer decides what it means on save.
 *
 * Each row removes itself; *Add property* appends a blank one. The label always sits above the
 * rows, since they need the width.
 */
export const KeyValue: Story = {
  name: 'Key Value',
  render: ({ onSubmit }) => (
    <VariantGrid variants={VARIANTS}>{(_v, log) => <Editor log={log} onSubmit={onSubmit} />}</VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Key Value' }));
    await step('Drop one property and add another', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Remove alias' }));
      await userEvent.click(cell.getByRole('button', { name: 'Add property' }));
      await userEvent.type(cell.getByRole('textbox', { name: 'Name 2' }), 'prisoner');
      await userEvent.type(cell.getByRole('textbox', { name: 'Value 2' }), '24601');
      await userEvent.click(cell.getByRole('button', { name: 'Apply' }));
    });
    await step('The rows are sent in order', async () => {
      await expect(args.onSubmit).toHaveBeenCalledWith({
        [spec.name]: {
          ...spec.initial,
          properties: [
            { key: 'born', value: '1769' },
            { key: 'prisoner', value: '24601' },
          ],
        },
      });
    });
  },
};
