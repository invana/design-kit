import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import {
  DropdownMenu as DropdownMenuRoot,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@invana/ui';

import data from '../../../../fixtures/ui/dropdown-menu.json';
import { json, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log, type Variant } from '../../../_story/variant-grid';
import { ButtonFromSpec, ICONS, Icon, buttonSource, type ButtonSpec, type IconName } from '../_content';

interface MenuItemSpec {
  value: string;
  label: string;
  icon?: IconName;
  shortcut?: string;
}

/** One line of the menu. Exactly one shape per entry. */
type Entry =
  | { heading: string }
  | { separator: true }
  | MenuItemSpec
  | { check: string; label: string; checked?: boolean }
  | { label: string; icon?: IconName; sub: MenuItemSpec[] };

interface DropdownMenuVariant extends Variant {
  trigger: ButtonSpec;
  entries: Entry[];
}

const VARIANTS = data as DropdownMenuVariant[];

interface Args {
  variant: string;
  onOpenChange: (open: boolean) => void;
  onSelect: (value: string) => void;
  onCheckedChange: (payload: { id: string; checked: boolean }) => void;
}

const initial = (v: DropdownMenuVariant) =>
  Object.fromEntries(v.entries.flatMap((e) => ('check' in e ? [[e.check, !!e.checked]] : [])));

function itemSource(i: MenuItemSpec, indent: string) {
  return `${indent}<DropdownMenuItem onSelect={() => onSelect(${json(i.value)})}>${i.icon ? `<${ICONS[i.icon].displayName} />` : ''}${i.label}${i.shortcut ? `<DropdownMenuShortcut>${i.shortcut}</DropdownMenuShortcut>` : ''}</DropdownMenuItem>`;
}

function entrySource(e: Entry): string {
  if ('heading' in e) return `    <DropdownMenuLabel>${e.heading}</DropdownMenuLabel>`;
  if ('separator' in e) return '    <DropdownMenuSeparator />';
  if ('check' in e)
    return `    <DropdownMenuCheckboxItem checked={checked[${json(e.check)}]} onCheckedChange={onCheckedChange(${json(e.check)})}>${e.label}</DropdownMenuCheckboxItem>`;
  if ('sub' in e)
    return [
      '    <DropdownMenuSub>',
      `      <DropdownMenuSubTrigger>${e.icon ? `<${ICONS[e.icon].displayName} />` : ''}${e.label}</DropdownMenuSubTrigger>`,
      '      <DropdownMenuSubContent>',
      ...e.sub.map((i) => itemSource(i, '        ')),
      '      </DropdownMenuSubContent>',
      '    </DropdownMenuSub>',
    ].join('\n');
  return itemSource(e, '    ');
}

const meta = {
  title: 'UI/UI/DropdownMenu',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import {\n  Button, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,\n  DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger,\n  DropdownMenuTrigger,\n} from '@invana/ui';",
            ],
            picked.map((v) => ({
              comment: v.caption,
              data: { initial: initial(v) },
              setup: [
                '// onOpenChange receives true or false. An item\'s onSelect runs it (the menu then closes);',
                '// a checkbox item\'s onCheckedChange receives its new state.',
                'const [open, setOpen] = React.useState(false);',
                'const [checked, setChecked] = React.useState(initial);',
                'const onCheckedChange = (id) => (next) => setChecked((c) => ({ ...c, [id]: next }));',
              ].join('\n'),
              call: [
                '<DropdownMenu open={open} onOpenChange={setOpen}>',
                `  <DropdownMenuTrigger asChild>${buttonSource(v.trigger, '')}</DropdownMenuTrigger>`,
                '  <DropdownMenuContent align="start">',
                ...v.entries.map(entrySource),
                '  </DropdownMenuContent>',
                '</DropdownMenu>',
              ].join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onOpenChange: fn(), onSelect: fn(), onCheckedChange: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Holds `open` and the checkbox items, as a consumer would, and reports every callback. */
function Live({ v, args, log }: { v: DropdownMenuVariant; args: Args; log: Log }) {
  const [open, setOpen] = React.useState(false);
  const [checked, setChecked] = React.useState(() => initial(v));
  const item = (i: MenuItemSpec) => (
    <DropdownMenuItem
      key={i.value}
      onSelect={() => {
        args.onSelect(i.value);
        log('onSelect', i.value);
      }}
    >
      <Icon name={i.icon} />
      {i.label}
      {i.shortcut ? <DropdownMenuShortcut>{i.shortcut}</DropdownMenuShortcut> : null}
    </DropdownMenuItem>
  );
  return (
    <DropdownMenuRoot
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        args.onOpenChange(next);
        log('onOpenChange', next);
      }}
    >
      <DropdownMenuTrigger asChild>
        <ButtonFromSpec spec={v.trigger} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {v.entries.map((e, n) => {
          if ('heading' in e) return <DropdownMenuLabel key={n}>{e.heading}</DropdownMenuLabel>;
          if ('separator' in e) return <DropdownMenuSeparator key={n} />;
          if ('check' in e)
            return (
              <DropdownMenuCheckboxItem
                key={e.check}
                checked={checked[e.check]}
                onCheckedChange={(next) => {
                  setChecked((all) => ({ ...all, [e.check]: next }));
                  args.onCheckedChange({ id: e.check, checked: next });
                  log('onCheckedChange', { id: e.check, checked: next });
                }}
              >
                {e.label}
              </DropdownMenuCheckboxItem>
            );
          if ('sub' in e)
            return (
              <DropdownMenuSub key={n}>
                <DropdownMenuSubTrigger>
                  <Icon name={e.icon} />
                  {e.label}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>{e.sub.map(item)}</DropdownMenuSubContent>
              </DropdownMenuSub>
            );
          return item(e);
        })}
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}

/**
 * A menu of actions behind a button — items with shortcuts, a checkbox item and a submenu,
 * from `fixtures/ui/dropdown-menu.json`. Open it: `onOpenChange` sends `true`. Pick an item:
 * `onSelect` sends its value and the menu closes. Tick the checkbox item: `onCheckedChange`
 * sends its new state.
 */
export const DropdownMenu: Story = {
  render: (args) => (
    <VariantGrid variants={VARIANTS} variant={args.variant}>
      {(v, log) => <Live v={v} args={args} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const v = VARIANTS[0];
    const cell = within(within(canvasElement).getByRole('group', { name: v.caption }));
    const page = within(canvasElement.ownerDocument.body);
    await step('Open the menu', async () => {
      await userEvent.click(cell.getByRole('button', { name: v.trigger.label }));
      await expect(args.onOpenChange).toHaveBeenCalledWith(true);
      await expect(await page.findByRole('menu')).toBeVisible();
    });
    await step('Pick an item: it is sent and the menu closes', async () => {
      await userEvent.click(page.getByRole('menuitem', { name: /Billing/ }));
      await expect(args.onSelect).toHaveBeenCalledWith('billing');
      await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
      await waitFor(() => expect(page.queryByRole('menu')).toBeNull());
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"billing"');
    });
  },
};
