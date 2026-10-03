import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Bell, Settings, Shield, Users } from 'lucide-react';
import { MenuItem as Component, type MenuItemProps } from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/menu-item.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log, type Variant } from '../../../_story/variant-grid';

/** The kit ships no icon set; the story supplies the ones JSON names. */
const ICONS = { settings: Settings, users: Users, shield: Shield, bell: Bell };
const ICON_NAMES = { settings: 'Settings', users: 'Users', shield: 'Shield', bell: 'Bell' };
type IconName = keyof typeof ICONS;

interface Item {
  id: string;
  label: string;
  icon?: IconName;
  shortcut?: string;
  children?: Item[];
}

interface MenuVariant extends Variant {
  item: Item;
}

const VARIANTS = VARIANTS_JSON as MenuVariant[];

interface Args {
  variant: string;
  onClick: () => void;
}

/** An item as code: icons by component, every row with the click handler. */
function itemCode(item: Item, indent = ''): string {
  const inner = indent + '  ';
  const lines = [
    `id: "${item.id}"`,
    `label: "${item.label}"`,
    item.icon ? `icon: ${ICON_NAMES[item.icon]}` : '',
    item.shortcut ? `shortcut: "${item.shortcut}"` : '',
    `onClick: () => onClick("${item.id}")`,
    item.children ? `children: [\n${item.children.map((c) => inner + '  ' + itemCode(c, inner + '  ')).join(',\n')},\n${inner}]` : '',
  ].filter(Boolean);
  return `{\n${lines.map((l) => inner + l).join(',\n')}\n${indent}}`;
}

const icons = (item: Item): IconName[] => [...(item.icon ? [item.icon] : []), ...(item.children ?? []).flatMap(icons)];

const meta = {
  title: 'UI/UI Extended/MenuItem',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              `import { ${[...new Set(picked.flatMap((v) => icons(v.item)))].map((i) => ICON_NAMES[i]).join(', ')} } from 'lucide-react';`,
              "import { MenuItem } from '@invana/ui';",
            ],
            picked.map((v) => ({
              comment: v.caption,
              setup: `// A row's onClick receives nothing; the item it belongs to is the closure.\nconst onClick = (id) => {};\nconst item = ${itemCode(v.item)};`,
              call: '<ul role="menu">\n  <MenuItem {...item} />\n</ul>',
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

/** JSON's item as props: icons resolved, every row wired to the click handler. */
function toProps(item: Item, onClick: Args['onClick'], log: Log): MenuItemProps {
  return {
    ...item,
    icon: item.icon ? ICONS[item.icon] : undefined,
    onClick: () => {
      onClick();
      log('onClick', item.id);
    },
    children: item.children?.map((c) => toProps(c, onClick, log)),
  };
}

/**
 * A single menu row with an icon, label and shortcut, whose nested children reveal on hover. A
 * row's `onClick` receives nothing; the story logs which item it was.
 */
export const MenuItem: Story = {
  render: ({ variant, onClick }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => (
        // MenuItem draws an <li>; the list it belongs to is the caller's.
        <ul role="menu">
          <Component {...toProps(v.item, onClick, log)} />
        </ul>
      )}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'A plain row' }));
    await step('Click the row', async () => {
      await userEvent.click(cell.getByRole('button', { name: /Notifications/ }));
      await expect(args.onClick).toHaveBeenCalled();
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"notifications"');
    });
  },
};
