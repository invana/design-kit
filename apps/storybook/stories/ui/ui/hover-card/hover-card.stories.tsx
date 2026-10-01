import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { HoverCard as HoverCardRoot, HoverCardContent, HoverCardTrigger } from '@invana/ui';

import data from '../../../../fixtures/ui/hover-card.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Log, type Variant } from '../../../_story/variant-board';
import { ButtonFromSpec, Content, buttonSource, contentSource, type Block, type ButtonSpec } from '../_content';

interface HoverCardVariant extends Variant {
  trigger: ButtonSpec;
  /** Milliseconds the pointer rests before the card opens. */
  openDelay: number;
  content: Block[];
}

const VARIANTS = data as HoverCardVariant[];

interface Args {
  variant: string;
  onOpenChange: (open: boolean) => void;
}

const meta = {
  title: 'UI/UI/HoverCard',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import {\n  Avatar, AvatarFallback, Button, HoverCard, HoverCardContent, HoverCardTrigger,\n  Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle,\n} from '@invana/ui';",
            ],
            picked.map((v) => ({
              comment: v.caption,
              setup: '// onOpenChange receives true when the pointer rests on the trigger, false when it leaves.\nconst [open, setOpen] = React.useState(false);',
              call: [
                `<HoverCard openDelay={${v.openDelay}} open={open} onOpenChange={setOpen}>`,
                `  <HoverCardTrigger asChild>${buttonSource(v.trigger, '')}</HoverCardTrigger>`,
                '  <HoverCardContent>',
                contentSource(v.content, '    '),
                '  </HoverCardContent>',
                '</HoverCard>',
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

/** Holds `open`, as a consumer would, and reports each change. */
function Live({ v, onOpenChange, log }: { v: HoverCardVariant; onOpenChange: Args['onOpenChange']; log: Log }) {
  const [open, setOpen] = React.useState(false);
  return (
    <HoverCardRoot
      openDelay={v.openDelay}
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        onOpenChange(next);
        log('onOpenChange', next);
      }}
    >
      <HoverCardTrigger asChild>
        <ButtonFromSpec spec={v.trigger} />
      </HoverCardTrigger>
      <HoverCardContent>
        <Content blocks={v.content} />
      </HoverCardContent>
    </HoverCardRoot>
  );
}

/**
 * A preview of what a link points at, shown while the pointer rests on it — from
 * `fixtures/ui/hover-card.json`. Hover the trigger: `onOpenChange` sends `true`; move away
 * and it sends `false`.
 */
export const HoverCard: Story = {
  render: ({ variant, onOpenChange }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => <Live v={v} onOpenChange={onOpenChange} log={log} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args }) => {
    const v = VARIANTS[0];
    const cell = within(within(canvasElement).getByRole('group', { name: v.caption }));
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.hover(cell.getByRole('button', { name: v.trigger.label }));
    await waitFor(() => expect(args.onOpenChange).toHaveBeenCalledWith(true));
    await expect(await page.findByText('The open-source graph visualization and analytics platform.')).toBeVisible();
    await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('onOpenChange');
  },
};
