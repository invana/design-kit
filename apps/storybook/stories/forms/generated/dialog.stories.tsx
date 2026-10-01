import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
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
import { FieldGroup, Form, FormField, type FieldConfig, type FieldValues } from '@invana/forms';

import spec from '../../../fixtures/forms/dialog.json';
import { snippet } from '../../_story/source';
import { VariantBoard, type Log } from '../../_story/variant-board';
import { indent, objectField } from '../form-source';

type NodeType = typeof spec.empty;

const EXISTING = spec.existing as NodeType[];
const EDIT = EXISTING.find((n) => n.name === spec.edit)!;
const VARIANTS = [{ caption: 'Dialog', width: 520 }];

/** Options that depend on the record — a node type cannot be its own parent — computed per open. */
function fieldsFor(editing: NodeType | null): FieldConfig[] {
  const parents = EXISTING.filter((n) => n.name !== editing?.name).map((n) => ({ label: n.name, value: n.name }));
  return (spec.fields as FieldConfig[]).map((f) =>
    f.name === 'parent' && 'options' in f ? { ...f, options: [...(f.options ?? []), ...parents] } : f,
  ) as FieldConfig[];
}

interface Args {
  onSubmit: (nodeType: NodeType) => void;
  onOpenChange: (open: boolean) => void;
}

function Live({ log, onSubmit, onOpenChange }: Args & { log: Log }) {
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<NodeType | null>(null);
  const form = useForm<FieldValues>({ defaultValues: { [spec.name]: spec.empty } });

  const openChange = (next: boolean) => {
    onOpenChange(next);
    log('onOpenChange', next);
    setOpen(next);
  };

  // Reset from the record each time it opens, so a cancelled edit never leaks into the next.
  const openFor = (record: NodeType | null) => {
    setEditing(record);
    form.reset({ [spec.name]: record ?? spec.empty });
    openChange(true);
  };

  const submit = form.handleSubmit((values) => {
    const nodeType = values[spec.name] as NodeType;
    if (!nodeType.name.trim()) {
      form.setError(`${spec.name}.name`, { message: spec.required.name });
      return;
    }
    onSubmit(nodeType);
    log('onSubmit', nodeType);
    openChange(false);
  });

  return (
    <>
      <ButtonGroup>
        <ButtonGroup>
          <Button onClick={() => openFor(null)}>New node type</Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="outline" onClick={() => openFor(EDIT)}>
            Edit {EDIT.name}
          </Button>
        </ButtonGroup>
      </ButtonGroup>

      <Dialog open={open} onOpenChange={openChange}>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={submit} noValidate>
              <FieldGroup>
                <DialogHeader>
                  <DialogTitle>{editing ? `Edit ${editing.name}` : 'New node type'}</DialogTitle>
                  <DialogDescription>{spec.description}</DialogDescription>
                </DialogHeader>
                <FormField.ObjectField
                  control={form.control}
                  name={spec.name}
                  fields={fieldsFor(editing)}
                  labelPosition="top"
                  size="md"
                />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => openChange(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{editing ? 'Save' : 'Create'}</Button>
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
  title: 'Forms/Generated/Dialog',
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
          comment: 'One form, reused for create and edit, reset from the record each time the dialog opens',
          data: { fields: spec.fields, empty: spec.empty },
          setup: [
            `const form = useForm({ defaultValues: { ${spec.name}: empty } });`,
            'const [open, setOpen] = React.useState(false);',
            `const openFor = (record) => { form.reset({ ${spec.name}: record ?? empty }); setOpen(true); };`,
            `// handleSubmit hands over { ${spec.name}: { name, description, parent, validation, abstract } }.`,
            `const onSubmit = form.handleSubmit(({ ${spec.name} }) => { save(${spec.name}); setOpen(false); });`,
          ].join('\n'),
          call: [
            '<Dialog open={open} onOpenChange={setOpen}>',
            '  <DialogContent>',
            '    <Form {...form}>',
            '      <form onSubmit={onSubmit} noValidate>',
            '        <FieldGroup>',
            '          <DialogHeader><DialogTitle>New node type</DialogTitle></DialogHeader>',
            `          ${indent(objectField(spec.name, 'fields', { size: { literal: 'md' } }), '          ')}`,
            '          <DialogFooter>',
            '            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>',
            '            <Button type="submit">Create</Button>',
            '          </DialogFooter>',
            '        </FieldGroup>',
            '      </form>',
            '    </Form>',
            '  </DialogContent>',
            '</Dialog>',
          ].join('\n'),
        }),
      },
    },
  },
  args: { onSubmit: fn(), onOpenChange: fn() },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * **Create or edit one small thing without leaving the page** — Studio's node type, edge type,
 * property key, model and board dialogs are all this shape: a handful of fields, Cancel / Save,
 * and one form reused for create and edit, from `fixtures/forms/dialog.json`.
 *
 * The form resets from the record each time the dialog opens, so an edit that was cancelled
 * never leaks into the next one. Options that depend on the record (a node type cannot be its
 * own parent) are computed per open. What was saved is written under the buttons.
 */
export const DialogStory: Story = {
  name: 'Dialog',
  render: (args) => <VariantBoard variants={VARIANTS}>{(_v, log) => <Live {...args} log={log} />}</VariantBoard>,
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Dialog' }));
    await step(`Edit ${EDIT.name}`, async () => {
      await userEvent.click(cell.getByRole('button', { name: `Edit ${EDIT.name}` }));
      await expect(args.onOpenChange).toHaveBeenCalledWith(true);
      const dialog = within(await screen.findByRole('dialog'));
      await expect(dialog.getByRole('textbox', { name: 'Name' })).toHaveValue(EDIT.name);
      await userEvent.type(dialog.getByRole('textbox', { name: 'Description' }), 'Someone who buys.');
      await userEvent.click(dialog.getByRole('button', { name: 'Save' }));
    });
    await step('The record is saved and the dialog closes', async () => {
      await expect(args.onSubmit).toHaveBeenCalledWith({ ...EDIT, description: 'Someone who buys.' });
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"description": "Someone who buys."');
    });
  },
};
