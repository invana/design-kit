import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { NavVertical, PanelBox, StatusDot, TypographyMuted, type StatusDotProps } from '@invana/ui';

import VARIANTS from '../../../../fixtures/ui-extended/nav-vertical.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log } from '../../../_story/variant-grid';
import { MAP_ITEMS, toNavItems, type NavJson } from '../nav-base/_nav-items';

type Variant = (typeof VARIANTS)[number];

interface Args {
  variant: string;
  onClick: (name: string) => void;
  onSelect: (item: string, id: string) => void;
}

const meta = {
  title: 'UI/UI Extended/NavVertical',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { NavVertical, StatusDot } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { topNavItems: v.topNavItems, bottomNavItems: v.bottomNavItems },
              setup: `${MAP_ITEMS}\n\n// The rail fills its parent's height: put it in the app shell's sidebar slot.`,
              call: jsx('NavVertical', {
                topNavItems: 'toItems(topNavItems)',
                middle: v.middle ? `<StatusDot tone="${v.middle.status}" size="md" label="${v.middle.label}" />` : undefined,
                bottomNavItems: 'toItems(bottomNavItems)',
              }),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onClick: fn(), onSelect: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

function Live({ v, log, onClick, onSelect }: { v: Variant; log: Log } & Omit<Args, 'variant'>) {
  const [last, setLast] = React.useState<string | null>(null);
  const on = {
    onClick: (name: string) => {
      onClick(name);
      log('onClick', name);
      setLast(`Opened ${name}`);
    },
    onSelect: (item: string, id: string) => {
      onSelect(item, id);
      log('onSelect', [item, id]);
      setLast(`${item} → ${id}`);
    },
  };
  return (
    <>
      {/* A rail fills its parent's height; the story's box stands in for the app's sidebar slot. */}
      <PanelBox flush style={{ height: v.height, width: 'fit-content' }} bodyClassName="h-full">
        <NavVertical
          topNavItems={toNavItems(v.topNavItems as NavJson[], on)}
          middle={
            v.middle ? (
              <StatusDot tone={v.middle.status as StatusDotProps['tone']} size="md" label={v.middle.label} />
            ) : undefined
          }
          bottomNavItems={toNavItems(v.bottomNavItems as NavJson[], on)}
        />
      </PanelBox>
      {last ? <TypographyMuted>{last}</TypographyMuted> : null}
    </>
  );
}

/**
 * A 45px rail: `topNavItems`, a flexible `middle`, and `bottomNavItems` anchored to the foot —
 * from `fixtures/ui-extended/nav-vertical.json`. Icon-only items take their tooltip on the right;
 * `badge` pins a count, and `tooltip` overrides `name` when the number needs a sentence. Menus open
 * to the **right**, so the rail is never covered by its own dropdown. Click an item or a menu row:
 * the payload is logged and the consumer's reaction written under the rail.
 */
export const NavVerticalStory: Story = {
  name: 'NavVertical',
  render: ({ variant, ...on }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <Live v={v} log={log} {...on} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const grid = within(canvasElement);
    await step('A rail item reports its name', async () => {
      const cell = within(grid.getByRole('group', { name: 'Default' }));
      await userEvent.click(cell.getByRole('button', { name: 'Home' }));
      await expect(args.onClick).toHaveBeenCalledWith('Home');
      await expect(cell.getByText('Opened Home')).toBeInTheDocument();
    });
    await step('The New menu creates a query', async () => {
      const cell = within(grid.getByRole('group', { name: 'With menus' }));
      await userEvent.click(cell.getByRole('button', { name: 'New' }));
      await userEvent.click(within(document.body).getByRole('menuitem', { name: /New query/ }));
      await expect(args.onSelect).toHaveBeenCalledWith('New', 'query');
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('["New", "query"]');
    });
  },
};
