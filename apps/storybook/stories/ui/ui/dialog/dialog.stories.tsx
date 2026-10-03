import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import {
  Button,
  Dialog as DialogRoot,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@invana/ui';
import { Input } from '@invana/forms';
// The layout `Field` is shadowed at the package root by the generator's `Field` namespace.
import { Field, FieldGroup, FieldLabel } from '@invana/forms';

import data from '../../../../fixtures/ui/dialog.json';
import { json, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log, type Variant } from '../../../_story/variant-grid';
import { ButtonFromSpec, buttonSource, type ButtonSpec, type FieldSpec } from '../_content';

interface DialogVariant extends Variant {
  trigger: ButtonSpec;
  title: string;
  description: string;
  fields: FieldSpec[];
  cancel: string;
  submit: string;
}

const VARIANTS = data as DialogVariant[];

interface Args {
  variant: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: Record<string, string>) => void;
}

const initial = (v: DialogVariant) => Object.fromEntries(v.fields.map((f) => [f.id, f.value ?? '']));

const meta = {
  title: 'UI/UI/Dialog',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import {\n  Button, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,\n} from '@invana/ui';",
              "import { Input } from '@invana/forms';",
              "import { Field, FieldGroup, FieldLabel } from '@invana/forms';",
            ],
            picked.map((v) => ({
              comment: v.caption,
              data: { initial: initial(v) },
              setup: [
                '// onOpenChange receives true when the trigger opens it, false when it closes.',
                'const [open, setOpen] = React.useState(false);',
                'const [values, setValues] = React.useState(initial);',
                '// Save the values, then close.',
                'const onSubmit = () => { save(values); setOpen(false); };',
              ].join('\n'),
              call: [
                '<Dialog open={open} onOpenChange={setOpen}>',
                '  <DialogTrigger asChild>',
                `    ${buttonSource(v.trigger, '')}`,
                '  </DialogTrigger>',
                '  <DialogContent>',
                '    <DialogHeader>',
                `      <DialogTitle>${v.title}</DialogTitle>`,
                `      <DialogDescription>${v.description}</DialogDescription>`,
                '    </DialogHeader>',
                '    <FieldGroup>',
                ...v.fields.map(
                  (f) =>
                    `      <Field><FieldLabel htmlFor="${f.id}">${f.label}</FieldLabel><Input id="${f.id}" value={values[${json(f.id)}]} onChange={(e) => setValues({ ...values, ${json(f.id)}: e.target.value })} /></Field>`,
                ),
                '    </FieldGroup>',
                '    <DialogFooter>',
                `      <DialogClose asChild><Button variant="outline">${v.cancel}</Button></DialogClose>`,
                `      <Button onClick={onSubmit}>${v.submit}</Button>`,
                '    </DialogFooter>',
                '  </DialogContent>',
                '</Dialog>',
              ].join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onOpenChange: fn(), onSubmit: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Holds `open` and the form's values, as a consumer would; saving reports them and closes. */
function Live({ v, args, log }: { v: DialogVariant; args: Args; log: Log }) {
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState(() => initial(v));
  const change = (next: boolean) => {
    setOpen(next);
    args.onOpenChange(next);
    log('onOpenChange', next);
  };
  return (
    <DialogRoot open={open} onOpenChange={change}>
      <DialogTrigger asChild>
        <ButtonFromSpec spec={v.trigger} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{v.title}</DialogTitle>
          <DialogDescription>{v.description}</DialogDescription>
        </DialogHeader>
        <FieldGroup>
          {v.fields.map((f) => (
            <Field key={f.id}>
              <FieldLabel htmlFor={f.id}>{f.label}</FieldLabel>
              <Input
                id={f.id}
                value={values[f.id]}
                onChange={(e) => setValues((all) => ({ ...all, [f.id]: e.target.value }))}
              />
            </Field>
          ))}
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{v.cancel}</Button>
          </DialogClose>
          <Button
            onClick={() => {
              args.onSubmit(values);
              log('onSubmit', values);
              change(false);
            }}
          >
            {v.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}

/**
 * A form over the page, from `fixtures/ui/dialog.json`. Open it from its trigger:
 * `onOpenChange` sends `true`. Edit a field and save: the story reports the values and closes
 * the dialog, as a consumer would; Cancel or Escape closes it with `false`.
 */
export const Dialog: Story = {
  render: (args) => (
    <VariantGrid variants={VARIANTS} variant={args.variant}>
      {(v, log) => <Live v={v} args={args} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const v = VARIANTS[0];
    const cell = within(within(canvasElement).getByRole('group', { name: v.caption }));
    const page = within(canvasElement.ownerDocument.body);
    await step('Open the dialog', async () => {
      await userEvent.click(cell.getByRole('button', { name: v.trigger.label }));
      await expect(args.onOpenChange).toHaveBeenCalledWith(true);
      await expect(await page.findByRole('dialog')).toHaveTextContent(v.title);
    });
    await step('Edit and save: the values are sent and the dialog closes', async () => {
      const name = page.getByLabelText('Name');
      await userEvent.clear(name);
      await userEvent.type(name, 'Grace Hopper');
      await userEvent.click(page.getByRole('button', { name: v.submit }));
      await expect(args.onSubmit).toHaveBeenCalledWith({ 'dialog-name': 'Grace Hopper', 'dialog-username': '@ada' });
      await waitFor(() => expect(page.queryByRole('dialog')).toBeNull());
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"dialog-name": "Grace Hopper"');
    });
  },
};
