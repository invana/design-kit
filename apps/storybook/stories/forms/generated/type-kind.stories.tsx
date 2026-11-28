import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Form, FormField, type FieldConfig, type FieldSize, type FieldValues, type LabelPosition, useForm } from '@invana/forms';
import { PanelBox } from '@invana/ui';

import spec from '../../../fixtures/forms/type-kind.json';
import { snippet } from '../../_story/source';
import { VariantGrid, type Log } from '../../_story/variant-grid';
import { FORM_ARG_TYPES, USE_FORM, objectField } from '../form-source';

const FIELDS = spec.fields as FieldConfig[];
const VARIANTS = [{ caption: 'Type Kind', width: 640 }];

interface Args {
  size: FieldSize;
  labelPosition: LabelPosition;
  onFieldChange: (name: string, value: unknown) => void;
}

/** A form with no Save: each change is applied the moment a person makes it. */
function Live({ size, labelPosition, log, onFieldChange }: Args & { log: Log }) {
  const form = useForm<FieldValues>({ defaultValues: spec.defaultValues });
  return (
    <Form {...form}>
      <PanelBox title="Kind of type" aside="applies as you change it">
        <FormField.ObjectField
          control={form.control}
          name={spec.name}
          fields={FIELDS}
          labelPosition={labelPosition}
          size={size}
          columns={2}
          onFieldChange={(name, value) => {
            onFieldChange(name, value);
            log('onFieldChange', { name, value });
          }}
        />
      </PanelBox>
    </Form>
  );
}

const meta = {
  title: 'Forms/Generated/Type Kind',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        code: snippet({
          imports: ["import { useForm } from '@invana/forms';", "import { Form, FormField } from '@invana/forms';"],
          comment: 'No Save: onFieldChange hands over each change as a person makes it, and never when the form is reset in code',
          data: { fields: FIELDS, defaultValues: spec.defaultValues },
          setup: USE_FORM,
          call: objectField(spec.name, 'fields', { onFieldChange: '(name, value) => apply({ [name]: value })' }),
        }),
      },
    },
  },
  argTypes: FORM_ARG_TYPES,
  args: { size: 'md', labelPosition: 'top', onFieldChange: fn() },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * **A form that applies as you change it** — the Kind panel of a node type in Studio, from
 * `fixtures/forms/type-kind.json`: what it extends, whether it is abstract, and where its
 * coordinates are read from. There is no Save. `onFieldChange` is called with the field's name and
 * its new value each time a person changes one; resetting the form in code does not call it.
 */
export const TypeKind: Story = {
  name: 'Type Kind',
  render: (args) => <VariantGrid variants={VARIANTS}>{(_v, log) => <Live {...args} log={log} />}</VariantGrid>,
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Type Kind' }));
    await step('Flip Abstract: the change is handed over at once', async () => {
      await userEvent.click(cell.getByRole('switch', { name: 'Abstract' }));
      await expect(args.onFieldChange).toHaveBeenCalledWith('abstract', true);
    });
  },
};
