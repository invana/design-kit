import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Settings2 } from 'lucide-react';
import { Button, Popover as PopoverRoot, PopoverContent, PopoverTrigger, TypographyH6, TypographyMuted } from '@invana/ui';
import { FieldContent, FieldGroup, FieldLabel, Input } from '@invana/forms';

import data from '../../../../fixtures/ui/popover.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log, type Variant } from '../../../_story/variant-grid';

interface PopoverVariant extends Variant {
  trigger: string;
  icon?: keyof typeof ICONS;
  title: string;
  description?: string;
  fields: { id: string; label: string; value: string }[];
}

const ICONS = { settings: <Settings2 /> };

const VARIANTS = data as PopoverVariant[];

interface Args {
  variant: string;
  onOpenChange: (open: boolean) => void;
}

const meta = {
  title: 'UI/UI/Popover',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import * as React from 'react';",
              "import { Settings2 } from 'lucide-react';",
              "import { Button, Popover, PopoverContent, PopoverTrigger, TypographyH6, TypographyMuted } from '@invana/ui';",
              "import { FieldContent, FieldGroup, FieldLabel, Input } from '@invana/forms';",
            ],
            picked.map((v) => ({
              comment: v.caption,
              data: { fields: v.fields },
              setup: [
                'const [open, setOpen] = React.useState(false);',
                '// Called with true when the trigger opens it, false on Escape or a click outside.',
                'const onOpenChange = (next: boolean) => setOpen(next);',
              ].join('\n'),
              call: [
                '<Popover open={open} onOpenChange={onOpenChange}>',
                '  <PopoverTrigger asChild>',
                '    <Button variant="outline">',
                v.icon ? '      <Settings2 />' : null,
                `      ${v.trigger}`,
                '    </Button>',
                '  </PopoverTrigger>',
                '  <PopoverContent>',
                `    <TypographyH6>${v.title}</TypographyH6>`,
                v.description ? `    <TypographyMuted>${v.description}</TypographyMuted>` : null,
                '    <FieldGroup>',
                '      {fields.map((f) => (',
                '        <FieldContent key={f.id}>',
                '          <FieldLabel htmlFor={f.id}>{f.label}</FieldLabel>',
                '          <Input id={f.id} defaultValue={f.value} />',
                '        </FieldContent>',
                '      ))}',
                '    </FieldGroup>',
                '  </PopoverContent>',
                '</Popover>',
              ]
                .filter(Boolean)
                .join('\n'),
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

/** The popover, controlled: open is the story's state, and every change is logged. */
function LivePopover({ v, onOpenChange, log }: { v: PopoverVariant; onOpenChange: Args['onOpenChange']; log: Log }) {
  const [open, setOpen] = React.useState(false);
  const change = (next: boolean) => {
    setOpen(next);
    onOpenChange(next);
    log('onOpenChange', next);
  };
  return (
    <PopoverRoot open={open} onOpenChange={change}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {v.icon ? ICONS[v.icon] : null}
          {v.trigger}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <FieldGroup>
          <FieldContent>
            <TypographyH6>{v.title}</TypographyH6>
            {v.description ? <TypographyMuted>{v.description}</TypographyMuted> : null}
          </FieldContent>
          {v.fields.map((f) => (
            <FieldContent key={f.id}>
              <FieldLabel htmlFor={f.id}>{f.label}</FieldLabel>
              <Input id={f.id} defaultValue={f.value} />
            </FieldContent>
          ))}
        </FieldGroup>
      </PopoverContent>
    </PopoverRoot>
  );
}

/**
 * A floating panel anchored to its trigger, from `fixtures/ui/popover.json`. Open it, then
 * press Escape or click outside: `onOpenChange` receives `true` then `false` and the story
 * holds `open`.
 */
export const Popover: Story = {
  render: ({ variant, onOpenChange }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <LivePopover v={v} onOpenChange={onOpenChange} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Default' }));
    const page = within(canvasElement.ownerDocument.body);
    await step('Open the popover', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Dimensions' }));
      await expect(args.onOpenChange).toHaveBeenCalledWith(true);
      await expect(await page.findByLabelText('Width')).toHaveValue('100%');
    });
    await step('Escape closes it', async () => {
      await userEvent.keyboard('{Escape}');
      await expect(args.onOpenChange).toHaveBeenCalledWith(false);
      await waitFor(() => expect(page.queryByLabelText('Width')).toBeNull());
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('false');
    });
  },
};
