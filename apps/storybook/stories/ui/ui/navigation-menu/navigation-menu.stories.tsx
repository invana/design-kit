import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
  NavigationMenu as NavigationMenuRoot,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@invana/ui';

import data from '../../../../fixtures/ui/navigation-menu.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Log, type Variant } from '../../../_story/variant-board';

interface NavLink {
  title: string;
  description?: string;
  href: string;
}

/** A menu that opens a panel of links, or a plain link in the bar. */
type Menu = { label: string; links: NavLink[] } | { label: string; href: string };

interface NavigationMenuVariant extends Variant {
  menus: Menu[];
}

const VARIANTS = data as NavigationMenuVariant[];

interface Args {
  variant: string;
  /** The open menu's label, or `""` when it closes. */
  onValueChange: (menu: string) => void;
  /** A link followed — its href. */
  onSelect: (href: string) => void;
}

const menuCode = (m: Menu) =>
  'links' in m
    ? [
        `<NavigationMenuItem value="${m.label}">`,
        `  <NavigationMenuTrigger>${m.label}</NavigationMenuTrigger>`,
        '  <NavigationMenuContent>',
        '    <ItemGroup>',
        ...m.links.flatMap((l) => [
          '      <NavigationMenuLink asChild>',
          `        <Item asChild size="sm"><a href="${l.href}" onClick={onSelect}>`,
          `          <ItemContent><ItemTitle>${l.title}</ItemTitle>${l.description ? `<ItemDescription>${l.description}</ItemDescription>` : ''}</ItemContent>`,
          '        </a></Item>',
          '      </NavigationMenuLink>',
        ]),
        '    </ItemGroup>',
        '  </NavigationMenuContent>',
        '</NavigationMenuItem>',
      ]
    : [
        '<NavigationMenuItem>',
        `  <NavigationMenuLink href="${m.href}" className={navigationMenuTriggerStyle()} onClick={onSelect}>${m.label}</NavigationMenuLink>`,
        '</NavigationMenuItem>',
      ];

const meta = {
  title: 'UI/UI/NavigationMenu',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import * as React from 'react';",
              "import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle, NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@invana/ui';",
            ],
            picked.map((v) => ({
              comment: v.caption,
              setup: [
                '// The open menu\'s label, or "" when it closes.',
                'const [open, setOpen] = React.useState("");',
                '// A link followed: route to e.currentTarget.href.',
                'const onSelect = (e: React.MouseEvent<HTMLAnchorElement>) => navigate(e.currentTarget.href);',
              ].join('\n'),
              call: [
                '<NavigationMenu value={open} onValueChange={setOpen}>',
                '  <NavigationMenuList>',
                ...v.menus.flatMap(menuCode).map((l) => `    ${l}`),
                '  </NavigationMenuList>',
                '</NavigationMenu>',
              ].join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onValueChange: fn(), onSelect: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

function LiveNavigationMenu({ v, log, onValueChange, onSelect }: { v: NavigationMenuVariant; log: Log } & Omit<Args, 'variant'>) {
  const [open, setOpen] = React.useState('');
  const follow = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen('');
    onSelect(href);
    log('onSelect', href);
  };
  return (
    <NavigationMenuRoot
      value={open}
      onValueChange={(menu) => {
        setOpen(menu);
        onValueChange(menu);
        log('onValueChange', menu);
      }}
    >
      <NavigationMenuList>
        {v.menus.map((m) =>
          'links' in m ? (
            <NavigationMenuItem key={m.label} value={m.label}>
              <NavigationMenuTrigger>{m.label}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ItemGroup>
                  {m.links.map((l) => (
                    <NavigationMenuLink key={l.href} asChild>
                      <Item asChild size="sm">
                        <a href={l.href} onClick={follow(l.href)}>
                          <ItemContent>
                            <ItemTitle>{l.title}</ItemTitle>
                            {l.description ? <ItemDescription>{l.description}</ItemDescription> : null}
                          </ItemContent>
                        </a>
                      </Item>
                    </NavigationMenuLink>
                  ))}
                </ItemGroup>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem key={m.label}>
              {/* The kit's own trigger style, so a plain link sits in the bar like a trigger. */}
              <NavigationMenuLink href={m.href} className={navigationMenuTriggerStyle()} onClick={follow(m.href)}>
                {m.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ),
        )}
      </NavigationMenuList>
    </NavigationMenuRoot>
  );
}

/**
 * A site's top navigation, from `fixtures/ui/navigation-menu.json`: menus that open a panel of
 * links, and a plain link. Opening a menu logs `onValueChange` with its label; following a link
 * logs `onSelect` with its href and the story closes the menu as a router would.
 */
export const NavigationMenu: Story = {
  render: ({ variant, onValueChange, onSelect }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveNavigationMenu v={v} log={log} onValueChange={onValueChange} onSelect={onSelect} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Default' }));
    await step('Open Products', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Products' }));
      await expect(args.onValueChange).toHaveBeenCalledWith('Products');
    });
    await step('Follow Dashboards; the menu closes', async () => {
      await userEvent.click(await screen.findByRole('link', { name: /Dashboards/ }));
      await expect(args.onSelect).toHaveBeenCalledWith('#dashboards');
      await waitFor(() => expect(screen.queryByRole('link', { name: /Dashboards/ })).toBeNull());
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"#dashboards"');
    });
  },
};
