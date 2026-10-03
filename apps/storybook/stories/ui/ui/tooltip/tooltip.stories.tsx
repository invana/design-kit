import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor, within } from 'storybook/test';
import { Button, Tooltip as TooltipPart, TooltipContent, TooltipProvider, TooltipTrigger } from '@invana/ui';
import { Plus } from 'lucide-react';

import data from '../../../../fixtures/ui/tooltip.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log, type Variant } from '../../../_story/variant-grid';

/** JSON names an icon; the story owns the glyphs (packages ship icon-agnostic). */
const ICONS = { plus: [Plus, 'Plus'] } as const;

interface TooltipVariant extends Variant {
  icon: keyof typeof ICONS;
  /** The trigger's accessible name. */
  trigger: string;
  content: string;
}

const VARIANTS = data as TooltipVariant[];

interface Args {
  variant: string;
  onOpenChange: (open: boolean) => void;
}

const meta = {
  title: 'UI/UI/Tooltip',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import * as React from 'react';",
              "import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@invana/ui';",
              `import { ${[...new Set(picked.map((v) => ICONS[v.icon][1]))].join(', ')} } from 'lucide-react';`,
            ],
            picked.map((v) => ({
              comment: v.caption,
              setup: [
                'const [open, setOpen] = React.useState(false);',
                '// Called with true on hover or focus, false when the pointer or focus leaves.',
                'const onOpenChange = (next: boolean) => setOpen(next);',
              ].join('\n'),
              call: [
                '<TooltipProvider>',
                '  <Tooltip open={open} onOpenChange={onOpenChange}>',
                '    <TooltipTrigger asChild>',
                `      <Button variant="outline" size="icon" aria-label="${v.trigger}">`,
                `        <${ICONS[v.icon][1]} />`,
                '      </Button>',
                '    </TooltipTrigger>',
                `    <TooltipContent>${v.content}</TooltipContent>`,
                '  </Tooltip>',
                '</TooltipProvider>',
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

/** One tooltip, controlled: it is open when the story says so. */
function LiveTooltip({ v, onOpenChange, log }: { v: TooltipVariant; onOpenChange: Args['onOpenChange']; log: Log }) {
  const [open, setOpen] = React.useState(false);
  const Icon = ICONS[v.icon][0];
  return (
    <TooltipProvider>
      <TooltipPart
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          onOpenChange(next);
          log('onOpenChange', next);
        }}
      >
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" aria-label={v.trigger}>
            <Icon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{v.content}</TooltipContent>
      </TooltipPart>
    </TooltipProvider>
  );
}

/**
 * A label for a control that has none of its own — every variant from `fixtures/ui/tooltip.json`,
 * controlled. Hover or focus the button: `onOpenChange` receives `true` and the story opens it.
 */
export const Tooltip: Story = {
  render: ({ variant, onOpenChange }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveTooltip v={v} onOpenChange={onOpenChange} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Default' }));
    await step('Focus the button', async () => {
      cell.getByRole('button', { name: 'Add item' }).focus();
      await waitFor(() => expect(args.onOpenChange).toHaveBeenCalledWith(true));
    });
    await step('The tooltip opens with its text', async () => {
      await waitFor(() => expect(within(document.body).getByRole('tooltip')).toHaveTextContent('Add a new item'));
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('true');
    });
  },
};
