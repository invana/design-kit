import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { useForm } from 'react-hook-form';
import { Button } from '@invana/ui';
import { FieldGroup, Form, FormField, type FieldConfig, type FieldValues } from '@invana/forms';

import spec from '../../../fixtures/forms/type-suggestions.json';
import { snippet } from '../../_story/source';
import { VariantGrid, type Log } from '../../_story/variant-grid';
import { objectField } from '../form-source';

const FIELDS = spec.fields as FieldConfig[];
const VARIANTS = [{ caption: 'Type Suggestions', width: 360 }];

interface Args {
  onSubmit: (values: FieldValues) => void;
}

/** A new node's editor: the type comes first, has the caret, and must be given. */
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
            Add node
          </Button>
        </FieldGroup>
      </form>
    </Form>
  );
}

const meta = {
  title: 'Forms/Generated/Type Suggestions',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        code: snippet({
          imports: ["import { useForm } from 'react-hook-form';", "import { Form, FormField } from '@invana/forms';"],
          comment: 'A `text` field with `options` suggests them as it is typed; `autoFocus` puts the caret in it',
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
 * **A value picked from what exists, or a new one typed** — a new node's type, from
 * `fixtures/forms/type-suggestions.json`. On a `text` field `options` are suggestions: the
 * browser offers them as the value is typed, and any other value is still accepted.
 *
 * `autoFocus` puts the caret in the field on mount; `rules.required` holds the submit until
 * the field is filled, and names why under it.
 */
export const TypeSuggestions: Story = {
  name: 'Type Suggestions',
  render: ({ onSubmit }) => (
    <VariantGrid variants={VARIANTS}>{(_v, log) => <Editor log={log} onSubmit={onSubmit} />}</VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Type Suggestions' }));
    await step('A blank type is refused, and says why', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Add node' }));
      await expect(await cell.findByText('A new node needs a type')).toBeInTheDocument();
      await expect(args.onSubmit).not.toHaveBeenCalled();
    });
    await step('A type that is not suggested is still accepted', async () => {
      await userEvent.type(cell.getByRole('combobox', { name: 'Type' }), 'barricade');
      await userEvent.click(cell.getByRole('button', { name: 'Add node' }));
      await expect(args.onSubmit).toHaveBeenCalledWith({ [spec.name]: { type: 'barricade', label: '' } });
    });
  },
};
