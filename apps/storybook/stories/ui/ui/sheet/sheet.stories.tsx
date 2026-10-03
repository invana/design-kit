import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import {
  Button,
  Sheet as SheetRoot,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@invana/ui';
import { FieldContent, FieldGroup, FieldLabel, Input } from '@invana/forms';
import { Settings } from 'lucide-react';

import data from '../../../../fixtures/ui/sheet.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log, type Variant } from '../../../_story/variant-grid';

const ICONS = { settings: Settings };

interface SheetVariant extends Variant {
  side: 'top' | 'right' | 'bottom' | 'left';
  trigger: { label: string; icon?: keyof typeof ICONS };
  title: string;
  description: string;
  fields: { id: string; label: string; value: string }[];
  cancel: string;
  submit: string;
}

const VARIANTS = data as SheetVariant[];

interface Args {
  variant: string;
  onOpenChange: (open: boolean) => void;
}

const meta = {
  title: 'UI/UI/Sheet',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import * as React from 'react';",
              "import { Button, Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@invana/ui';",
              "import { FieldContent, FieldGroup, FieldLabel, Input } from '@invana/forms';",
              "import { Settings } from 'lucide-react';",
            ],
            picked.map((v) => ({
              comment: v.caption,
              data: { fields: v.fields },
              setup: [
                'const [open, setOpen] = React.useState(false);',
                '// Called with true when the trigger opens it, false on Cancel, Escape or the overlay.',
                'const onOpenChange = (next: boolean) => setOpen(next);',
              ].join('\n'),
              call: [
                '<Sheet open={open} onOpenChange={onOpenChange}>',
                '  <SheetTrigger asChild>',
                `    <Button variant="outline">${v.trigger.icon ? '<Settings /> ' : ''}${v.trigger.label}</Button>`,
                '  </SheetTrigger>',
                `  <SheetContent side="${v.side}">`,
                '    <SheetHeader>',
                `      <SheetTitle>${v.title}</SheetTitle>`,
                `      <SheetDescription>${v.description}</SheetDescription>`,
                '    </SheetHeader>',
                '    <FieldGroup>',
                '      {fields.map((f) => (',
                '        <FieldContent key={f.id}>',
                '          <FieldLabel htmlFor={f.id}>{f.label}</FieldLabel>',
                '          <Input id={f.id} defaultValue={f.value} />',
                '        </FieldContent>',
                '      ))}',
                '    </FieldGroup>',
                '    <SheetFooter>',
                `      <SheetClose asChild><Button variant="outline">${v.cancel}</Button></SheetClose>`,
                `      <Button type="submit">${v.submit}</Button>`,
                '    </SheetFooter>',
                '  </SheetContent>',
                '</Sheet>',
              ].join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onOpenChange: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** One sheet, controlled: open is the story's state, and Save closes it as a form would. */
function Live({ v, onOpenChange, log }: { v: SheetVariant; onOpenChange: Args['onOpenChange']; log: Log }) {
  const [open, setOpen] = React.useState(false);
  const change = (next: boolean) => {
    setOpen(next);
    onOpenChange(next);
    log('onOpenChange', next);
  };
  const Icon = v.trigger.icon ? ICONS[v.trigger.icon] : null;
  return (
    <SheetRoot open={open} onOpenChange={change}>
      <SheetTrigger asChild>
        <Button variant="outline">
          {Icon ? <Icon /> : null}
          {v.trigger.label}
        </Button>
      </SheetTrigger>
      <SheetContent side={v.side}>
        <SheetHeader>
          <SheetTitle>{v.title}</SheetTitle>
          <SheetDescription>{v.description}</SheetDescription>
        </SheetHeader>
        <FieldGroup>
          {v.fields.map((f) => (
            <FieldContent key={f.id}>
              <FieldLabel htmlFor={f.id}>{f.label}</FieldLabel>
              <Input id={f.id} defaultValue={f.value} />
            </FieldContent>
          ))}
        </FieldGroup>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">{v.cancel}</Button>
          </SheetClose>
          <Button type="submit" onClick={() => change(false)}>
            {v.submit}
          </Button>
        </SheetFooter>
      </SheetContent>
    </SheetRoot>
  );
}

/**
 * A panel that slides in over the page — from `fixtures/ui/sheet.json`. Open it: `onOpenChange`
 * receives `true`; Cancel, Save, Escape or the overlay send `false`, and the story closes it.
 */
export const Sheet: Story = {
  render: ({ variant, onOpenChange }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <Live v={v} onOpenChange={onOpenChange} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Default' }));
    const page = within(canvasElement.ownerDocument.body);
    await step('Open the sheet', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Open settings' }));
      await expect(args.onOpenChange).toHaveBeenCalledWith(true);
      await expect(await page.findByRole('dialog', { name: 'Workspace settings' })).toBeInTheDocument();
    });
    await step('Cancel closes it', async () => {
      await userEvent.click(page.getByRole('button', { name: 'Cancel' }));
      await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
      await waitFor(() => expect(page.queryByRole('dialog')).toBeNull());
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('false');
    });
  },
};
