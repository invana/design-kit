import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Button, Toaster } from '@invana/ui';
import { toast } from 'sonner';

import data from '../../../../fixtures/ui/sonner.json';
import { inline, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Variant } from '../../../_story/variant-board';

interface ToastVariant extends Variant {
  /** The button that fires it. */
  label: string;
  type: 'message' | 'success' | 'error';
  title: string;
  description?: string;
}

const VARIANTS = data as ToastVariant[];

interface Fired {
  type: ToastVariant['type'];
  title: string;
  description?: string;
}

interface Args {
  variant: string;
  onToast: (toast: Fired) => void;
}

/** `toast("…")`, `toast.success("…", { description })` — what each variant calls. */
function callOf(v: ToastVariant) {
  const fnName = v.type === 'message' ? 'toast' : `toast.${v.type}`;
  const opts = v.description ? `, ${inline({ description: v.description })}` : '';
  return `${fnName}(${JSON.stringify(v.title)}${opts})`;
}

const meta = {
  title: 'UI/UI/Sonner',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { Button, Toaster } from '@invana/ui';", "import { toast } from 'sonner';"],
            [
              { comment: 'Mount once, at the app root.', call: '<Toaster />' },
              ...picked.map((v) => ({
                comment: v.caption,
                call: `<Button variant="outline" onClick={() => ${callOf(v)}}>\n  ${v.label}\n</Button>`,
              })),
            ],
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onToast: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * A passing notice, fired from code — every variant from `fixtures/ui/sonner.json`. Click a
 * button: the story fires the toast through the one mounted `<Toaster />` and logs what it fired.
 */
export const Sonner: Story = {
  render: ({ variant, onToast }) => (
    <>
      <VariantBoard variants={VARIANTS} variant={variant}>
        {(v, log) => (
          <Button
            variant="outline"
            onClick={() => {
              const fired: Fired = { type: v.type, title: v.title, description: v.description };
              if (v.type === 'message') toast(v.title, { description: v.description });
              else toast[v.type](v.title, { description: v.description });
              onToast(fired);
              log('toast', fired);
            }}
          >
            {v.label}
          </Button>
        )}
      </VariantBoard>
      <Toaster />
    </>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Success' }));
    const page = within(canvasElement.ownerDocument.body);
    await step('Fire the success toast', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Success' }));
      await expect(args.onToast).toHaveBeenCalledWith({
        type: 'success',
        title: 'Changes saved',
        description: 'Your profile has been updated.',
      });
    });
    await step('The toast shows, and the cell logs it', async () => {
      await waitFor(() => expect(page.getByText('Changes saved')).toBeInTheDocument());
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"success"');
    });
  },
};
