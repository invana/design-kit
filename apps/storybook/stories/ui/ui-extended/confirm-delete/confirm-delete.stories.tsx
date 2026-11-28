import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Button, ConfirmDelete as Component, type ConfirmDeleteProps } from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/confirm-delete.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log, type Variant } from '../../../_story/variant-grid';

interface ConfirmDeleteVariant extends Variant {
  trigger: string;
  props: Omit<ConfirmDeleteProps, 'open' | 'onOpenChange' | 'onConfirm'>;
}

const VARIANTS = VARIANTS_JSON as ConfirmDeleteVariant[];

interface Args {
  variant: string;
  onConfirm: () => void;
}

const meta = {
  title: 'UI/UI Extended/ConfirmDelete',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { ConfirmDelete } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              setup: [
                'const [open, setOpen] = React.useState(false);',
                '// goesWith and blockedBy are the engine’s delete-impact answer; the kit never counts.',
                '// The dialog stays open until you close it: close it when the delete succeeds.',
              ].join('\n'),
              call: [
                '<ConfirmDelete',
                '  open={open}',
                '  onOpenChange={setOpen}',
                `  title=${JSON.stringify(v.props.title)}`,
                v.props.confirmName ? `  confirmName=${JSON.stringify(v.props.confirmName)}` : '',
                v.props.light ? '  light' : '',
                '  onConfirm={async () => { await deleteIt(); setOpen(false); }}',
                '/>',
              ]
                .filter(Boolean)
                .join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onConfirm: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Holds `open`, as a consumer would; the dialog closes only when the confirmed call settles. */
function Live({ v, args, log }: { v: ConfirmDeleteVariant; args: Args; log: Log }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        {v.trigger}
      </Button>
      <Component
        {...v.props}
        open={open}
        onOpenChange={setOpen}
        onConfirm={() => {
          args.onConfirm();
          log('onConfirm', v.props.title);
          setOpen(false);
        }}
      />
    </>
  );
}

/**
 * One confirmation for every delete, from `fixtures/ui-extended/confirm-delete.json`. It composes
 * `AlertDialog` and adds what a delete needs: what goes with the thing, what blocks it, a name to
 * type. Delete stays off, with its reason beside it, until nothing blocks and the name matches.
 *
 * The engine answers `goes_with` and `blocked_by`; the kit only draws them. A refused call keeps
 * the dialog open, which is why Delete is a plain `Button` and not `AlertDialogAction`.
 */
export const ConfirmDelete: Story = {
  render: (args) => (
    <VariantGrid variants={VARIANTS} variant={args.variant}>
      {(v, log) => <Live v={v} args={args} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const page = within(canvasElement.ownerDocument.body);
    const cell = (i: number) => within(within(canvasElement).getByRole('group', { name: VARIANTS[i].caption }));

    await step('Type the name: Delete is off until it matches', async () => {
      await userEvent.click(cell(0).getByRole('button', { name: VARIANTS[0].trigger }));
      const dialog = await page.findByRole('alertdialog');
      const del = within(dialog).getByRole('button', { name: 'Delete' });
      await expect(del).toBeDisabled();
      await userEvent.type(within(dialog).getByLabelText('Type the name to confirm'), 'airways');
      await expect(del).toBeEnabled();
      await userEvent.click(del);
      await expect(args.onConfirm).toHaveBeenCalled();
      await waitFor(() => expect(page.queryByRole('alertdialog')).toBeNull());
    });

    await step('Blocked: Delete stays off while anything uses it', async () => {
      await userEvent.click(cell(1).getByRole('button', { name: VARIANTS[1].trigger }));
      const dialog = await page.findByRole('alertdialog');
      await expect(within(dialog).getByRole('button', { name: 'Delete' })).toBeDisabled();
      await expect(within(dialog).getAllByRole('link', { name: 'Remove AirRoutes from it' })).toHaveLength(2);
      await userEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));
      await waitFor(() => expect(page.queryByRole('alertdialog')).toBeNull());
    });
  },
};
