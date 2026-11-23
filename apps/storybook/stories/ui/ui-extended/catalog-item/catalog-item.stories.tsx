import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { BrandMark, Button, CatalogItem as Component, OverflowMenu, StatusDot } from '@invana/ui';

import DATA from '../../../../fixtures/ui-extended/catalog-item.json';
import { json, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Variant } from '../../../_story/variant-grid';

interface ItemVariant extends Variant {
  title: string;
  mark?: string;
  size?: 'md' | 'sm';
  status?: 'success' | 'error';
  statusLabel?: string;
  meta: string[];
  opens?: boolean;
  action?: string;
  menu?: string[];
}

const VARIANTS = DATA as unknown as ItemVariant[];

interface Args {
  variant: string;
  onOpen: (title: string) => void;
  onAction: (title: string) => void;
  onMenu: (pick: { title: string; item: string }) => void;
}

const source = (v: ItemVariant) =>
  [
    '<CatalogItem',
    v.size === 'sm' ? '  size="sm"' : '',
    v.mark ? `  media={<BrandMark name=${json(v.mark)} src={connector.icon} />}` : '',
    `  title=${json(v.title)}`,
    v.status ? `  titleMark={<StatusDot tone="${v.status}" label=${json(v.statusLabel)} />}` : '',
    `  meta={${json(v.meta)}}`,
    v.action ? `  action={<Button size="sm" variant="secondary" onClick={onAction}>${v.action}</Button>}` : '',
    v.menu ? `  menu={<OverflowMenu label=${json(`More for ${v.title}`)} items={items} />}` : '',
    v.opens ? '  // the whole row opens it; the action and the menu keep their own clicks\n  onOpen={onOpen}' : '',
    '/>',
  ]
    .filter(Boolean)
    .join('\n');

const meta = {
  title: 'UI/UI Extended/CatalogItem',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { BrandMark, Button, CatalogItem, OverflowMenu, StatusDot } from '@invana/ui';"],
            picked.map((v) => ({ comment: v.caption, call: source(v) })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onOpen: fn(), onAction: fn(), onMenu: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * One row of a catalog list, from `fixtures/ui-extended/catalog-item.json`: a connection opens on
 * a click anywhere in the row, while its ⋯ menu and a connector's Connect keep their own clicks.
 * Each callback is reported under its cell.
 */
export const CatalogItem: Story = {
  render: (args) => (
    <VariantGrid variants={VARIANTS} variant={args.variant}>
      {(v, log) => (
        <Component
          size={v.size}
          media={v.mark ? <BrandMark name={v.mark} /> : undefined}
          title={v.title}
          titleMark={v.status ? <StatusDot tone={v.status} label={v.statusLabel} /> : undefined}
          meta={v.meta}
          action={
            v.action ? (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  args.onAction(v.title);
                  log('onAction', v.title);
                }}
              >
                {v.action}
              </Button>
            ) : undefined
          }
          menu={
            v.menu ? (
              <OverflowMenu
                label={`More for ${v.title}`}
                items={v.menu.map((item) => ({
                  key: item,
                  label: item,
                  destructive: item === 'Delete',
                  separatorBefore: item === 'Delete',
                  onSelect: () => {
                    args.onMenu({ title: v.title, item });
                    log('menu', item);
                  },
                }))}
              />
            ) : undefined
          }
          onOpen={
            v.opens
              ? () => {
                  args.onOpen(v.title);
                  log('onOpen', v.title);
                }
              : undefined
          }
        />
      )}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: VARIANTS[0].caption }));
    const page = within(canvasElement.ownerDocument.body);
    await step('A click on the row opens it', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'airways' }));
      await expect(args.onOpen).toHaveBeenCalledWith('airways');
    });
    await step('The menu acts on its own, without opening the row', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'More for airways' }));
      await userEvent.click(await page.findByRole('menuitem', { name: 'Check' }));
      await expect(args.onMenu).toHaveBeenCalledWith({ title: 'airways', item: 'Check' });
      await expect(args.onOpen).toHaveBeenCalledTimes(1);
    });
  },
};
