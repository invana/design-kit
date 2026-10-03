import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, fn, userEvent, waitFor, within } from 'storybook/test';
import { NestedMenu, TypographyMuted, type MenuItem } from '@invana/ui';
import { Bell, File, FolderOpen, Mail, Settings, Shield, Users } from 'lucide-react';

import VARIANTS from '../../../../fixtures/ui-extended/nested-menu.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log } from '../../../_story/variant-grid';

/** Icons are named in the JSON; a consumer imports its own. */
const ICONS: Record<string, React.ElementType> = {
  file: File,
  'folder-open': FolderOpen,
  settings: Settings,
  users: Users,
  shield: Shield,
  bell: Bell,
  mail: Mail,
};

interface MenuJson extends Omit<MenuItem, 'icon' | 'children' | 'onClick'> {
  icon?: string;
  children?: MenuJson[];
}

interface Args {
  variant: string;
  onClick: (id: string) => void;
}

const meta = {
  title: 'UI/UI Extended/NestedMenu',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { NestedMenu } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { menuItems: v.menuItems },
              setup: [
                '// Every row, at any depth, gets an icon and an onClick; onClick receives nothing,',
                '// so close over the id.',
                'const toItems = (items) => items.map(({ icon, children, ...m }) => ({',
                '  ...m,',
                '  icon: ICONS[icon],',
                '  onClick: () => onClick(m.id), // "messages"',
                '  children: children && toItems(children),',
                '}));',
              ].join('\n'),
              call: jsx('NestedMenu', { menuItems: 'toItems(menuItems)' }),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onClick: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

function toItems(items: MenuJson[], pick: (id: string) => void): MenuItem[] {
  return items.map(({ icon, children, ...m }) => ({
    ...m,
    icon: icon ? ICONS[icon] : undefined,
    onClick: () => pick(m.id),
    children: children && toItems(children, pick),
  }));
}

function Live({ items, log, onClick }: { items: MenuJson[]; log: Log; onClick: Args['onClick'] }) {
  const [picked, setPicked] = React.useState<string | null>(null);
  const pick = (id: string) => {
    onClick(id);
    log('onClick', id);
    setPicked(id);
  };
  return (
    <>
      <NestedMenu menuItems={toItems(items, pick)} />
      {picked ? <TypographyMuted>Opened {picked}</TypographyMuted> : null}
    </>
  );
}

/**
 * A menubar whose rows open their children to the right on hover, at any depth — from
 * `fixtures/ui-extended/nested-menu.json`. Each row carries an icon and a `shortcut` hint. Click
 * a row: its id is logged, and the story writes what a consumer would open.
 */
export const NestedMenuStory: Story = {
  name: 'NestedMenu',
  render: ({ variant, onClick }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <Live items={v.menuItems as MenuJson[]} log={log} onClick={onClick} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Secondary' }));
    await userEvent.click(cell.getByRole('button', { name: /Messages/ }));
    await expect(args.onClick).toHaveBeenCalledWith('messages');
    await expect(cell.getByText('Opened messages')).toBeInTheDocument();
    // A submenu opens from the keyboard on its first row, and closes back to its row.
    const files = cell.getByRole('menuitem', { name: /Files/ });
    files.focus();
    fireEvent.keyDown(files, { key: 'ArrowRight' });
    await expect(files).toHaveAttribute('aria-expanded', 'true');
    const shared = cell.getByRole('button', { name: /Shared Files/ });
    await waitFor(() => expect(shared).toHaveFocus());
    fireEvent.keyDown(shared, { key: 'Escape' });
    await expect(files).toHaveAttribute('aria-expanded', 'false');
    await expect(files).toHaveFocus();
  },
};
