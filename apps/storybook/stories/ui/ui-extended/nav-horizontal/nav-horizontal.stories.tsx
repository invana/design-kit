import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  NavHorizontal,
  PanelBox,
  SearchInput,
  TypographyMuted,
  TypographySmall,
  type NavItemConfig,
} from '@invana/ui';

import VARIANTS from '../../../../fixtures/ui-extended/nav-horizontal.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Log } from '../../../_story/variant-board';
import { ICONS, MAP_ITEMS, toNavItems, type NavJson } from '../nav-base/_nav-items';

type Variant = (typeof VARIANTS)[number];

interface Args {
  variant: string;
  onClick: (name: string) => void;
  onSelect: (item: string, id: string) => void;
  onChange: (query: string) => void;
}

const meta = {
  title: 'UI/UI Extended/NavHorizontal',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { NavHorizontal, SearchInput, TypographyMuted, TypographySmall } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { leftNavItems: v.leftNavItems, rightNavItems: v.rightNavItems },
              setup: [
                MAP_ITEMS,
                v.search ? "const [query, setQuery] = React.useState('');\n// onChange receives the text: \"orders\"." : '',
                v.workspaces
                  ? [
                      `const [workspace, setWorkspace] = React.useState(${JSON.stringify(v.workspaces[0])});`,
                      `const [unread, setUnread] = React.useState(${v.unread});`,
                      'const [muted, setMuted] = React.useState(false);',
                      '// The workspace switcher and the bell are built from that state — see the story.',
                    ].join('\n')
                  : '',
              ]
                .filter(Boolean)
                .join('\n\n'),
              call: jsx('NavHorizontal', {
                left: v.left ? `<TypographySmall>${v.left}</TypographySmall>` : undefined,
                leftNavItems: 'toItems(leftNavItems)',
                center: v.search
                  ? `<SearchInput inputSize="sm" value={query} onChange={setQuery} placeholder="${v.search.placeholder}" />`
                  : v.status
                    ? `<TypographyMuted>${v.status}</TypographyMuted>`
                    : undefined,
                rightNavItems: 'toItems(rightNavItems)',
              }),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onClick: fn(), onSelect: fn(), onChange: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

type On = Omit<Args, 'variant'>;

/** What a consumer of this header holds: the search text, and the With menus header's state. */
function Live({ v, log, onClick, onSelect, onChange }: { v: Variant; log: Log } & On) {
  const [query, setQuery] = React.useState('');
  const [workspace, setWorkspace] = React.useState(v.workspaces?.[0] ?? '');
  const [unread, setUnread] = React.useState(v.unread ?? 0);
  const [muted, setMuted] = React.useState(false);

  const handlers = {
    onClick: (name: string) => {
      onClick(name);
      log('onClick', name);
    },
    onSelect: (item: string, id: string) => {
      onSelect(item, id);
      log('onSelect', [item, id]);
      if (item === 'Switch workspace' && v.workspaces?.includes(id)) setWorkspace(id);
      if (id === 'read') setUnread(0);
      if (id === 'mute') setMuted((m) => !m);
    },
  };

  let left = toNavItems(v.leftNavItems as NavJson[], handlers);
  let right = toNavItems(v.rightNavItems as NavJson[], handlers);

  if (v.workspaces) {
    const switcher: NavItemConfig = {
      name: 'Switch workspace',
      label: workspace,
      icon: ICONS['chevron-down'],
      menuItems: [
        ...v.workspaces.map((id) => ({
          id,
          label: id,
          icon: id === workspace ? ICONS.check : undefined,
          onSelect: () => handlers.onSelect('Switch workspace', id),
        })),
        { id: 'new', label: 'New workspace…', icon: ICONS.plus, shortcut: '⌘⇧N', separatorBefore: true, onSelect: () => handlers.onSelect('Switch workspace', 'new') },
      ],
    };
    const bell: NavItemConfig = {
      name: muted ? 'Notifications muted' : 'Notifications',
      icon: muted ? ICONS['bell-off'] : ICONS.bell,
      badge: !muted && unread > 0 ? unread : undefined,
      menuItems: [
        { id: 'read', label: 'Mark all as read', icon: ICONS.check, disabled: unread === 0, onSelect: () => handlers.onSelect('Notifications', 'read') },
        { id: 'mute', label: muted ? 'Unmute notifications' : 'Mute for an hour', icon: muted ? ICONS.bell : ICONS['bell-off'], onSelect: () => handlers.onSelect('Notifications', 'mute') },
      ],
    };
    left = [switcher, ...left];
    right = [bell, ...right];
  }

  return (
    <PanelBox>
      <NavHorizontal
        left={v.left ? <TypographySmall>{v.left}</TypographySmall> : undefined}
        leftNavItems={left}
        center={
          v.search ? (
            <SearchInput
              inputSize="sm"
              value={query}
              placeholder={v.search.placeholder}
              onChange={(q) => {
                onChange(q);
                log('onChange', q);
                setQuery(q);
              }}
            />
          ) : v.status ? (
            <TypographyMuted>{v.status}</TypographyMuted>
          ) : undefined
        }
        rightNavItems={right}
      />
    </PanelBox>
  );
}

/**
 * A header nav: `left` for brand chrome, `leftNavItems`, a flexible `center` (a search box, a
 * status line), and `rightNavItems` for actions — from `fixtures/ui-extended/nav-horizontal.json`.
 * Any item with `menuItems` becomes a menu trigger (rows take an icon, a `shortcut`, `disabled`,
 * `destructive` and `separatorBefore`); `badge` pins a bare count to an item's corner, and a label
 * with no `href` / `onClick` / menu is plain text. The With menus header is live: switching
 * workspace moves the check, Mark all as read clears the badge, muting swaps the bell. Every click
 * and menu row is logged with what it carries.
 */
export const NavHorizontalStory: Story = {
  name: 'NavHorizontal',
  render: ({ variant, ...on }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => <Live v={v} log={log} {...on} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const board = within(canvasElement);
    await step('An action item reports its name', async () => {
      const cell = within(board.getByRole('group', { name: 'Default' }));
      await userEvent.click(cell.getByRole('button', { name: 'Home' }));
      await expect(args.onClick).toHaveBeenCalledWith('Home');
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('onClick"Home"');
    });
    await step('Typing in the centre search', async () => {
      const cell = within(board.getByRole('group', { name: 'Center search' }));
      await userEvent.type(cell.getByPlaceholderText(/Search nodes/), 'ab');
      await expect(args.onChange).toHaveBeenLastCalledWith('ab');
      await expect(cell.getByPlaceholderText(/Search nodes/)).toHaveValue('ab');
    });
    await step('Mark all as read clears the badge', async () => {
      const cell = within(board.getByRole('group', { name: 'With menus' }));
      await expect(cell.getByText('3')).toBeInTheDocument();
      await userEvent.click(cell.getByRole('button', { name: /Notifications/ }));
      await userEvent.click(within(document.body).getByRole('menuitem', { name: 'Mark all as read' }));
      await expect(args.onSelect).toHaveBeenCalledWith('Notifications', 'read');
      await expect(cell.queryByText('3')).toBeNull();
    });
    await step('A submenu opens beside its row, and its rows are the choices', async () => {
      const cell = within(board.getByRole('group', { name: 'Center search' }));
      await userEvent.click(cell.getByRole('button', { name: 'Export' }));
      const menu = within(document.body);
      await userEvent.click(await menu.findByRole('menuitem', { name: 'Send to' }));
      await userEvent.click(await menu.findByRole('menuitem', { name: 'Email' }));
      await expect(args.onSelect).toHaveBeenCalledWith('Export', 'send-email');
    });
  },
};
