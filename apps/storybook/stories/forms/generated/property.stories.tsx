import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, within } from 'storybook/test';
import { useForm } from 'react-hook-form';
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@invana/ui';
import { FieldGroup, Form, FormField, type FieldConfig, type FieldSize, type FieldValues, type LabelPosition } from '@invana/forms';

import spec from '../../../fixtures/forms/property.json';
import { snippet } from '../../_story/source';
import { VariantGrid, type Log } from '../../_story/variant-grid';
import { FORM_ARG_TYPES, objectField } from '../form-source';

type Property = typeof spec.empty;

const choices = (values: string[]) => values.map((v) => ({ label: v, value: v }));
const VARIANTS = [{ caption: 'Property', width: 520 }];

/**
 * The field set follows the record: the enum's `values` field exists only while the range is
 * `enum`. A form watches the value it depends on and hands the generator the fields to draw.
 */
function fieldsFor(range: string): FieldConfig[] {
  return (spec.fields as FieldConfig[])
    .filter((f) => f.name !== 'values' || range === 'enum')
    .map((f) => {
      if (f.name === 'range') return { ...f, options: choices(spec.ranges) };
      if (f.name === 'index') return { ...f, options: choices(spec.indexes) };
      return f;
    }) as FieldConfig[];
}

interface Args {
  size: FieldSize;
  labelPosition: LabelPosition;
  onSubmit: (property: Property) => void;
  onOpenChange: (open: boolean) => void;
}

function Live({ size, labelPosition, log, onSubmit, onOpenChange }: Args & { log: Log }) {
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const form = useForm<FieldValues>({ defaultValues: { [spec.name]: spec.empty } });
  const range = form.watch(`${spec.name}.range`) as string;

  const openChange = (next: boolean) => {
    onOpenChange(next);
    log('onOpenChange', next);
    setOpen(next);
  };
  const openFor = (record: Property | null) => {
    setEditing(record !== null);
    form.reset({ [spec.name]: record ?? spec.empty });
    openChange(true);
  };
  const submit = form.handleSubmit((values) => {
    const property = values[spec.name] as Property;
    if (!property.name.trim()) {
      form.setError(`${spec.name}.name`, { message: spec.required.name });
      return;
    }
    onSubmit(property);
    log('onSubmit', property);
    openChange(false);
  });

  return (
    <>
      <ButtonGroup>
        <Button onClick={() => openFor(null)}>New property</Button>
        <Button variant="outline" onClick={() => openFor(spec.edit)}>
          Edit {spec.edit.name}
        </Button>
      </ButtonGroup>
      <Dialog open={open} onOpenChange={openChange}>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={submit} noValidate>
              <FieldGroup>
                <DialogHeader>
                  <DialogTitle>
                    {editing ? `Edit property · ${spec.owner}.${spec.edit.name}` : `New property on ${spec.owner}`}
                  </DialogTitle>
                  <DialogDescription>{spec.description}</DialogDescription>
                </DialogHeader>
                <FormField.ObjectField
                  control={form.control}
                  name={spec.name}
                  fields={fieldsFor(range)}
                  labelPosition={labelPosition}
                  size={size}
                />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => openChange(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{editing ? 'Save' : 'Add'}</Button>
                </DialogFooter>
              </FieldGroup>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

const meta = {
  title: 'Forms/Generated/Property',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        code: snippet({
          imports: [
            "import { useForm } from 'react-hook-form';",
            "import { FieldGroup, Form, FormField } from '@invana/forms';",
            "import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@invana/ui';",
          ],
          comment: 'A field that exists only for one value of another: watch it, and pass the generator the fields to draw',
          data: { fields: spec.fields, empty: spec.empty },
          setup: [
            `const form = useForm({ defaultValues: { ${spec.name}: empty } });`,
            `const range = form.watch('${spec.name}.range');`,
            "const shown = fields.filter((f) => f.name !== 'values' || range === 'enum');",
          ].join('\n'),
          call: objectField(spec.name, 'shown'),
        }),
      },
    },
  },
  argTypes: FORM_ARG_TYPES,
  args: { size: 'md', labelPosition: 'top', onSubmit: fn(), onOpenChange: fn() },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * **A dialog whose fields follow its answers** — Studio's property editor, from
 * `fixtures/forms/property.json`. Two selects, a name and four switches; the enum's values
 * field appears only while Range is `enum`.
 */
export const Property: Story = {
  render: (args) => <VariantGrid variants={VARIANTS}>{(_v, log) => <Live {...args} log={log} />}</VariantGrid>,
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Property' }));
    await step('Edit an enum property — its values show', async () => {
      await userEvent.click(cell.getByRole('button', { name: `Edit ${spec.edit.name}` }));
      const dialog = within(await screen.findByRole('dialog'));
      await expect(dialog.getByRole('textbox', { name: 'Values, comma separated' })).toHaveValue(spec.edit.values);
      await userEvent.click(dialog.getByRole('button', { name: 'Save' }));
      await expect(args.onSubmit).toHaveBeenCalledWith(spec.edit);
    });
    await step('A new property has no values field', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'New property' }));
      const dialog = within(await screen.findByRole('dialog'));
      await expect(dialog.queryByRole('textbox', { name: 'Values, comma separated' })).toBeNull();
      await userEvent.click(dialog.getByRole('button', { name: 'Add' }));
      await expect(await dialog.findByText(spec.required.name)).toBeVisible();
    });
  },
};
