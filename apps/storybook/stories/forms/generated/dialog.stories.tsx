import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  PanelBox,
} from '@invana/ui';
import { Form, FormField, type FieldConfig } from '@invana/forms';

const meta: Meta = {
  title: 'Forms/Generated/Dialog',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

/**
 * **Create or edit one small thing without leaving the page** — Studio's
 * node type, edge type, property key, model and board dialogs are all this
 * shape: a handful of fields, Cancel / Save, and one form reused for create
 * and edit.
 *
 * The form resets from the record each time the dialog opens, so an edit that
 * was cancelled never leaks into the next one. Options that depend on the
 * record (a node type cannot be its own parent) are computed per open.
 */
type NodeType = {
  name: string;
  description: string;
  parent: string;
  validation: string;
  abstract: boolean;
};

const EMPTY: NodeType = { name: '', description: '', parent: 'none', validation: 'inherit', abstract: false };

const EXISTING: NodeType[] = [
  { name: 'Person', description: 'Someone with an account.', parent: 'none', validation: 'strict', abstract: false },
  { name: 'Customer', description: '', parent: 'Person', validation: 'inherit', abstract: false },
];

function nodeTypeFields(editing: NodeType | null): FieldConfig[] {
  const parents = EXISTING.filter((n) => n.name !== editing?.name);
  return [
    { name: 'name', type: 'text', label: 'Name', placeholder: 'Account', colSpan: 2 },
    { name: 'description', type: 'textarea', label: 'Description', rows: 3, colSpan: 2 },
    {
      name: 'parent',
      type: 'select',
      label: 'Parent type',
      options: [{ label: 'None', value: 'none' }, ...parents.map((n) => ({ label: n.name, value: n.name }))],
    },
    {
      name: 'validation',
      type: 'select',
      label: 'Validation mode',
      options: [
        { label: 'Inherit from model', value: 'inherit' },
        { label: 'Strict', value: 'strict' },
        { label: 'Permissive', value: 'permissive' },
      ],
    },
    {
      name: 'abstract',
      type: 'boolean',
      control: 'checkbox',
      label: 'Abstract — only subtypes have instances',
      colSpan: 2,
    },
  ];
}

export const DialogForm: Story = {
  name: 'Dialog',
  render: function Render() {
    const [open, setOpen] = React.useState(false);
    const [editing, setEditing] = React.useState<NodeType | null>(null);
    const [saved, setSaved] = React.useState<unknown>(null);
    const form = useForm({ defaultValues: { nodeType: EMPTY } });

    const openFor = (record: NodeType | null) => {
      setEditing(record);
      form.reset({ nodeType: record ?? EMPTY });
      setOpen(true);
    };

    const onSubmit = form.handleSubmit((values) => {
      if (!values.nodeType.name.trim()) {
        form.setError('nodeType.name', { message: 'Name is required.' });
        return;
      }
      setSaved(values.nodeType);
      setOpen(false);
    });

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2">
          <Button onClick={() => openFor(null)}>New node type</Button>
          <Button variant="outline" onClick={() => openFor(EXISTING[1])}>
            Edit Customer
          </Button>
        </div>

        {saved ? (
          <PanelBox title="Saved">
            <pre>{JSON.stringify(saved, null, 2)}</pre>
          </PanelBox>
        ) : null}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <Form {...form}>
              <form onSubmit={onSubmit} noValidate className="space-y-4">
                <DialogHeader>
                  <DialogTitle>{editing ? `Edit ${editing.name}` : 'New node type'}</DialogTitle>
                  <DialogDescription>Edits stage in the draft until you publish the model.</DialogDescription>
                </DialogHeader>

                <FormField.ObjectField
                  control={form.control}
                  name="nodeType"
                  fields={nodeTypeFields(editing)}
                  labelPosition="top"
                  size="md"
                />

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{editing ? 'Save' : 'Create'}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    );
  },
};
