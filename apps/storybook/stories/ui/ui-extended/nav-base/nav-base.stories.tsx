import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { NavBase, NavItems, TypographyMuted, TypographySmall, type NavItemsVariant } from '@invana/ui';

import VARIANTS from '../../../../fixtures/ui-extended/nav-base.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log } from '../../../_story/variant-grid';
import { toMenu, toNavItems, type MenuJson, type NavJson } from './_nav-items';

type Variant = (typeof VARIANTS)[number];

interface Strip {
  variant: string;
  active: string;
  fallback?: string;
  overflowLabel: string;
  activeMenu?: MenuJson[];
  items: NavJson[];
}

interface Args {
  variant: string;
  onActiveChange: (key: string) => void;
  onSelect: (item: string, id: string) => void;
  onClose: (key: string) => void;
}

const meta = {
  title: 'UI/UI Extended/NavBase',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { NavBase, NavItems } from '@invana/ui';"],
            picked.map((v) => {
              if (!v.strip) {
                return {
                  comment: v.caption,
                  data: { sections: v.sections },
                  call: [
                    '<NavBase',
                    '  orientation="horizontal"',
                    '  sections={{',
                    '    start: { content: <TypographySmall>{sections.start}</TypographySmall> },',
                    '    center: { content: <TypographyMuted>{sections.center}</TypographyMuted> },',
                    '    end: { content: sections.end },',
                    '  }}',
                    '/>',
                  ].join('\n'),
                };
              }
              const s = v.strip as Strip;
              return {
                comment: v.caption,
                data: { items: s.items, ...(s.activeMenu ? { activeMenu: s.activeMenu } : {}) },
                setup: [
                  `const [active, setActive] = React.useState(${JSON.stringify(s.active)});`,
                  '// onActiveChange receives the picked key: "layers".',
                  s.activeMenu
                    ? '// The caret menu belongs to the active page only: attach `activeMenu` to it.\n// A row\'s onSelect receives nothing — the row knows its own id.'
                    : '',
                  s.items.some((i) => i.closable)
                    ? '// onClose receives nothing — close over the key: onClose: () => close(item.key).'
                    : '',
                ]
                  .filter(Boolean)
                  .join('\n'),
                call: jsx('NavItems', {
                  items: 'items',
                  variant: { literal: s.variant },
                  selectionMode: { literal: 'tabs' },
                  activeKey: 'active',
                  onActiveChange: 'setActive',
                  overflow: 'true',
                  overflowLabel: { literal: s.overflowLabel },
                }),
              };
            }),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onActiveChange: fn(), onSelect: fn(), onClose: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** A tab strip as a consumer holds it: the active key, and which pages are still open. */
function LiveStrip({ strip, log, onActiveChange, onSelect, onClose }: { strip: Strip; log: Log } & Omit<Args, 'variant'>) {
  const [active, setActive] = React.useState(strip.active);
  const [open, setOpen] = React.useState(strip.items.map((i) => i.key!));

  const close = (key: string) => {
    onClose(key);
    log('onClose', key);
    setOpen((keys) => keys.filter((k) => k !== key));
    if (key === active && strip.fallback) setActive(strip.fallback);
  };
  const select = (item: string, id: string) => {
    onSelect(item, id);
    log('onSelect', [item, id]);
    const page = strip.items.find((i) => i.name === item);
    if (id === 'close' && page?.key) close(page.key);
  };

  const items = toNavItems(
    strip.items.filter((i) => open.includes(i.key!)),
    { onClose: close, onSelect: select },
  ).map((item, n) => {
    const json = strip.items.filter((i) => open.includes(i.key!))[n];
    return json.menuTrigger === 'caret' && json.key === active
      ? { ...item, menuItems: toMenu(json.name, strip.activeMenu, { onSelect: select }) }
      : item;
  });

  return (
    <NavItems
      items={items}
      variant={strip.variant as NavItemsVariant}
      selectionMode="tabs"
      activeKey={active}
      onActiveChange={(key) => {
        onActiveChange(key);
        log('onActiveChange', key);
        setActive(key);
      }}
      overflow
      overflowLabel={strip.overflowLabel}
    />
  );
}

/**
 * The layout primitive under every nav, and `NavItems` — the strip of items it lays out — from
 * `fixtures/ui-extended/nav-base.json`. `NavBase` places `start`, `center` and `end`; prefer
 * `NavHorizontal` / `NavVertical` for DX. A strip with **`overflow`** folds what doesn't fit into a
 * `…` menu (the active item never folds); **`variant`** picks the treatment — `nav` the capsule,
 * `underline` a panel's views, `folder` a workbook's pages; **`selectionMode="tabs"`** makes it a
 * real tab list (← → Home End move, selection follows focus). `menuTrigger: 'caret'` puts the
 * menu behind a chevron inside the item, so the body still selects; `onClose` draws an `×`.
 * Pick a tab or close one: the strip moves, and the payload is logged.
 */
export const NavBaseStory: Story = {
  name: 'NavBase',
  render: ({ variant, ...on }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v: Variant, log) =>
        v.strip ? (
          <LiveStrip strip={v.strip as Strip} log={log} {...on} />
        ) : (
          <NavBase
            orientation="horizontal"
            sections={{
              start: { content: <TypographySmall>{v.sections!.start}</TypographySmall> },
              center: { content: <TypographyMuted>{v.sections!.center}</TypographyMuted> },
              end: { content: v.sections!.end },
            }}
          />
        )
      }
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const grid = within(canvasElement);
    await step('Pick a tab in the underline strip', async () => {
      const cell = within(grid.getByRole('group', { name: VARIANTS[2].caption }));
      await userEvent.click(cell.getByRole('tab', { name: /Canvas/ }));
      await expect(args.onActiveChange).toHaveBeenCalledWith('canvas');
      await expect(cell.getByRole('tab', { name: /Canvas/ })).toHaveAttribute('aria-selected', 'true');
    });
    await step('Close a page tab', async () => {
      const cell = within(grid.getByRole('group', { name: 'Closable tabs' }));
      await userEvent.click(cell.getByRole('button', { name: 'Close Run #42' }));
      await expect(args.onClose).toHaveBeenCalledWith('run');
      await expect(cell.queryByText('Run #42')).toBeNull();
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('onClose"run"');
    });
  },
};
