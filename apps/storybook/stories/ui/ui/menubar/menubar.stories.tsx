import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import {
  Menubar as MenubarRoot,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@invana/ui';

import data from '../../../../fixtures/ui/menubar.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Log, type Variant } from '../../../_story/variant-board';

type Entry =
  | { type: 'item'; label: string; shortcut?: string }
  | { type: 'separator' }
  | { type: 'sub'; label: string; items: string[] }
  | { type: 'checkbox'; label: string; checked: boolean }
  | { type: 'radio'; name: string; value: string; options: string[] };

interface MenubarVariant extends Variant {
  menus: { label: string; items: Entry[] }[];
}

const VARIANTS = data as MenubarVariant[];

interface Args {
  variant: string;
  /** The open menu's label, or `""` when it closes. */
  onValueChange: (menu: string) => void;
  /** An item picked — its label. */
  onSelect: (item: string) => void;
  onCheckedChange: (change: { item: string; checked: boolean }) => void;
  onRadioChange: (change: { group: string; value: string }) => void;
}

const valueOf = (option: string) => option.toLowerCase();

const entryCode = (e: Entry): string[] => {
  switch (e.type) {
    case 'separator':
      return ['<MenubarSeparator />'];
    case 'item':
      return [
        `<MenubarItem onSelect={() => onSelect(${JSON.stringify(e.label)})}>`,
        `  ${e.label}${e.shortcut ? ` <MenubarShortcut>${e.shortcut}</MenubarShortcut>` : ''}`,
        '</MenubarItem>',
      ];
    case 'sub':
      return [
        '<MenubarSub>',
        `  <MenubarSubTrigger>${e.label}</MenubarSubTrigger>`,
        '  <MenubarSubContent>',
        ...e.items.map((i) => `    <MenubarItem onSelect={() => onSelect(${JSON.stringify(i)})}>${i}</MenubarItem>`),
        '  </MenubarSubContent>',
        '</MenubarSub>',
      ];
    case 'checkbox':
      return [
        `<MenubarCheckboxItem checked={checked[${JSON.stringify(e.label)}]} onCheckedChange={(c) => onCheckedChange(${JSON.stringify(e.label)}, c)}>`,
        `  ${e.label}`,
        '</MenubarCheckboxItem>',
      ];
    case 'radio':
      return [
        `<MenubarRadioGroup value={${e.name}} onValueChange={set${e.name[0].toUpperCase()}${e.name.slice(1)}}>`,
        ...e.options.map((o) => `  <MenubarRadioItem value="${valueOf(o)}">${o}</MenubarRadioItem>`),
        '</MenubarRadioGroup>',
      ];
  }
};

const meta = {
  title: 'UI/UI/Menubar',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import * as React from 'react';",
              "import { Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarMenu, MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from '@invana/ui';",
            ],
            picked.map((v) => {
              const entries = v.menus.flatMap((m) => m.items);
              const checks = Object.fromEntries(
                entries.flatMap((e) => (e.type === 'checkbox' ? [[e.label, e.checked]] : [])),
              );
              const radios = entries.flatMap((e) => (e.type === 'radio' ? [e] : []));
              return {
                comment: v.caption,
                setup: [
                  '// The open menu\'s label, or "" when the bar closes.',
                  'const [open, setOpen] = React.useState("");',
                  `const [checked, setChecked] = React.useState(${JSON.stringify(checks)});`,
                  ...radios.map(
                    (r) =>
                      `const [${r.name}, set${r.name[0].toUpperCase()}${r.name.slice(1)}] = React.useState(${JSON.stringify(r.value)});`,
                  ),
                  '// Called with the picked item\'s label.',
                  'const onSelect = (item: string) => run(item);',
                  'const onCheckedChange = (item: string, c: boolean) => setChecked((all) => ({ ...all, [item]: c }));',
                ].join('\n'),
                call: [
                  '<Menubar value={open} onValueChange={setOpen}>',
                  ...v.menus.flatMap((m) => [
                    `  <MenubarMenu value="${m.label}">`,
                    `    <MenubarTrigger>${m.label}</MenubarTrigger>`,
                    '    <MenubarContent>',
                    ...m.items.flatMap(entryCode).map((l) => `      ${l}`),
                    '    </MenubarContent>',
                    '  </MenubarMenu>',
                  ]),
                  '</Menubar>',
                ].join('\n'),
              };
            }),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onValueChange: fn(), onSelect: fn(), onCheckedChange: fn(), onRadioChange: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

function LiveMenubar({ v, log, ...on }: { v: MenubarVariant; log: Log } & Omit<Args, 'variant'>) {
  const entries = v.menus.flatMap((m) => m.items);
  const [open, setOpen] = React.useState('');
  const [checked, setChecked] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(entries.flatMap((e) => (e.type === 'checkbox' ? [[e.label, e.checked]] : []))),
  );
  const [radios, setRadios] = React.useState<Record<string, string>>(() =>
    Object.fromEntries(entries.flatMap((e) => (e.type === 'radio' ? [[e.name, e.value]] : []))),
  );
  const select = (item: string) => {
    on.onSelect(item);
    log('onSelect', item);
  };

  const entry = (e: Entry, i: number) => {
    switch (e.type) {
      case 'separator':
        return <MenubarSeparator key={i} />;
      case 'item':
        return (
          <MenubarItem key={i} onSelect={() => select(e.label)}>
            {e.label} {e.shortcut ? <MenubarShortcut>{e.shortcut}</MenubarShortcut> : null}
          </MenubarItem>
        );
      case 'sub':
        return (
          <MenubarSub key={i}>
            <MenubarSubTrigger>{e.label}</MenubarSubTrigger>
            <MenubarSubContent>
              {e.items.map((s) => (
                <MenubarItem key={s} onSelect={() => select(s)}>
                  {s}
                </MenubarItem>
              ))}
            </MenubarSubContent>
          </MenubarSub>
        );
      case 'checkbox':
        return (
          <MenubarCheckboxItem
            key={i}
            checked={checked[e.label]}
            onCheckedChange={(c) => {
              setChecked((all) => ({ ...all, [e.label]: c }));
              on.onCheckedChange({ item: e.label, checked: c });
              log('onCheckedChange', { item: e.label, checked: c });
            }}
          >
            {e.label}
          </MenubarCheckboxItem>
        );
      case 'radio':
        return (
          <MenubarRadioGroup
            key={i}
            value={radios[e.name]}
            onValueChange={(value) => {
              setRadios((all) => ({ ...all, [e.name]: value }));
              on.onRadioChange({ group: e.name, value });
              log('onValueChange', { group: e.name, value });
            }}
          >
            {e.options.map((o) => (
              <MenubarRadioItem key={o} value={valueOf(o)}>
                {o}
              </MenubarRadioItem>
            ))}
          </MenubarRadioGroup>
        );
    }
  };

  return (
    <MenubarRoot
      value={open}
      onValueChange={(menu) => {
        setOpen(menu);
        on.onValueChange(menu);
        log('onValueChange', menu);
      }}
    >
      {v.menus.map((m) => (
        <MenubarMenu key={m.label} value={m.label}>
          <MenubarTrigger>{m.label}</MenubarTrigger>
          <MenubarContent>{m.items.map(entry)}</MenubarContent>
        </MenubarMenu>
      ))}
    </MenubarRoot>
  );
}

/**
 * An application's menu bar, from `fixtures/ui/menubar.json`: items with shortcuts, a submenu,
 * checkbox items and a radio group. Opening a menu logs `onValueChange` with its label; picking
 * an item logs `onSelect`; the checkbox and radio items stay controlled by the story.
 */
export const Menubar: Story = {
  render: ({ variant, ...on }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveMenubar v={v} log={log} {...on} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Default' }));
    await step('Open File', async () => {
      await userEvent.click(cell.getByRole('menuitem', { name: 'File' }));
      await expect(args.onValueChange).toHaveBeenCalledWith('File');
    });
    await step('Pick New Tab; the menu closes', async () => {
      await userEvent.click(await screen.findByRole('menuitem', { name: /New Tab/ }));
      await expect(args.onSelect).toHaveBeenCalledWith('New Tab');
      await waitFor(() => expect(screen.queryByRole('menuitem', { name: /New Tab/ })).toBeNull());
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"New Tab"');
    });
  },
};
