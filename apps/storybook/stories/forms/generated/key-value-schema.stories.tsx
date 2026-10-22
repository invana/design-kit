import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { useForm } from 'react-hook-form';
import { Button } from '@invana/ui';
import { FieldGroup, Form, FormField, type FieldConfig, type FieldOption, type FieldValues } from '@invana/forms';

import spec from '../../../fixtures/forms/key-value-schema.json';
import { snippet } from '../../_story/source';
import { VariantGrid, type Log, type Variant } from '../../_story/variant-grid';
import { objectField } from '../form-source';

interface SchemaVariant extends Variant {
  strictKeys: boolean;
}

const VARIANTS = spec.variants as SchemaVariant[];
const KEYS = spec.keys as FieldOption[];

const fieldsFor = (strictKeys: boolean): FieldConfig[] => [
  { name: 'properties', type: 'keyvalue', label: 'Properties', options: KEYS, strictKeys, keyPlaceholder: 'Key', valuePlaceholder: 'Value', addLabel: 'Add property' },
];

interface Args {
  onSubmit: (values: FieldValues) => void;
}

/** An airport's properties, its keys from the airport type. */
function Editor({ strictKeys, log, onSubmit }: Args & { strictKeys: boolean; log: Log }) {
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
          <FormField.ObjectField control={form.control} name={spec.name} fields={fieldsFor(strictKeys)} labelPosition="top" size="xs" />
          <Button type="submit" size="sm" className="self-end">
            Apply
          </Button>
        </FieldGroup>
      </form>
    </Form>
  );
}

const meta = {
  title: 'Forms/Generated/Key Value Schema',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        code: snippet({
          imports: ["import { useForm } from 'react-hook-form';", "import { Form, FormField } from '@invana/forms';"],
          comment: 'A `keyvalue` field whose keys come from a schema: `options` are the keys, `strictKeys` allows no others',
          data: { fields: fieldsFor(true), initial: spec.initial },
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
 * **Keys from a schema** — an airport's properties, from `fixtures/forms/key-value-schema.json`.
 * `options` are the type's keys, each `description` the kind of value it takes (the value's
 * placeholder). *Add property* lists the keys not set yet.
 *
 * **Strict** picks a key from the list only; a key already used is disabled in every other row.
 * **Open** offers the list as a key is typed, ends *Add* with *A key of your own*, and tags a key
 * outside the list `new`. In both, a key appears once: a repeat is refused at its row and Apply
 * does not submit.
 */
export const KeyValueSchema: Story = {
  name: 'Key Value Schema',
  render: ({ onSubmit }) => (
    <VariantGrid variants={VARIANTS}>{(v, log) => <Editor strictKeys={v.strictKeys} log={log} onSubmit={onSubmit} />}</VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const open = within(within(canvasElement).getByRole('group', { name: 'Open' }));
    await step('A repeated key is refused, and Apply does not submit', async () => {
      const key = open.getByRole('combobox', { name: 'Key 3' });
      await userEvent.clear(key);
      await userEvent.type(key, 'city');
      await expect(open.getByRole('alert')).toHaveTextContent('city is already set above');
      await userEvent.click(open.getByRole('button', { name: 'Apply' }));
      await expect(args.onSubmit).not.toHaveBeenCalled();
    });
    await step('A key of one’s own is tagged new, and submits', async () => {
      const key = open.getByRole('combobox', { name: 'Key 3' });
      await userEvent.clear(key);
      await userEvent.type(key, 'gates');
      await expect(open.getByText('new')).toBeInTheDocument();
      await userEvent.click(open.getByRole('button', { name: 'Apply' }));
      await expect(args.onSubmit).toHaveBeenCalled();
    });
  },
};
