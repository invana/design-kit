import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import {
  AlertDialog as AlertDialogRoot,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@invana/ui';

import data from '../../../../fixtures/ui/alert-dialog.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log, type Variant } from '../../../_story/variant-grid';
import { ButtonFromSpec, buttonSource, type ButtonSpec } from '../_content';

interface AlertDialogVariant extends Variant {
  trigger: ButtonSpec;
  title: string;
  description: string;
  cancel: string;
  action: string;
}

const VARIANTS = data as AlertDialogVariant[];

interface Args {
  variant: string;
  onOpenChange: (open: boolean) => void;
  onAction: () => void;
}

const meta = {
  title: 'UI/UI/AlertDialog',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import {\n  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,\n  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, Button,\n} from '@invana/ui';",
            ],
            picked.map((v) => ({
              comment: v.caption,
              setup: [
                '// onOpenChange receives true when the trigger opens it, false when it closes.',
                'const [open, setOpen] = React.useState(false);',
                '// onAction runs the confirmed action; the dialog then closes itself.',
                'const onAction = () => deleteProject();',
              ].join('\n'),
              call: [
                '<AlertDialog open={open} onOpenChange={setOpen}>',
                '  <AlertDialogTrigger asChild>',
                `    ${buttonSource(v.trigger, '')}`,
                '  </AlertDialogTrigger>',
                '  <AlertDialogContent>',
                '    <AlertDialogHeader>',
                `      <AlertDialogTitle>${v.title}</AlertDialogTitle>`,
                `      <AlertDialogDescription>${v.description}</AlertDialogDescription>`,
                '    </AlertDialogHeader>',
                '    <AlertDialogFooter>',
                `      <AlertDialogCancel>${v.cancel}</AlertDialogCancel>`,
                `      <AlertDialogAction onClick={onAction}>${v.action}</AlertDialogAction>`,
                '    </AlertDialogFooter>',
                '  </AlertDialogContent>',
                '</AlertDialog>',
              ].join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onOpenChange: fn(), onAction: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Holds `open`, as a consumer would, and reports opening, closing and the action. */
function Live({ v, args, log }: { v: AlertDialogVariant; args: Args; log: Log }) {
  const [open, setOpen] = React.useState(false);
  return (
    <AlertDialogRoot
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        args.onOpenChange(next);
        log('onOpenChange', next);
      }}
    >
      <AlertDialogTrigger asChild>
        <ButtonFromSpec spec={v.trigger} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{v.title}</AlertDialogTitle>
          <AlertDialogDescription>{v.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{v.cancel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              args.onAction();
              log('onAction', v.action);
            }}
          >
            {v.action}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
}

/**
 * A question that blocks the page until it is answered, from `fixtures/ui/alert-dialog.json`.
 * Open it from its trigger: `onOpenChange` sends `true`; confirm and `onAction` runs, then
 * `onOpenChange` sends `false`.
 */
export const AlertDialog: Story = {
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
      await expect(await page.findByRole('alertdialog')).toHaveTextContent(v.title);
    });
    await step('Confirm: the action runs and the dialog closes', async () => {
      await userEvent.click(page.getByRole('button', { name: v.action }));
      await expect(args.onAction).toHaveBeenCalled();
      await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
      await waitFor(() => expect(page.queryByRole('alertdialog')).toBeNull());
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('onAction');
    });
  },
};
