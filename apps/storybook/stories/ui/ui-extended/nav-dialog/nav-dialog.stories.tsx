import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { NavDialog as Component, Stack } from '@invana/ui';

import DATA from '../../../../fixtures/ui-extended/nav-dialog.json';
import { json, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log, type Variant } from '../../../_story/variant-grid';
import {
  type Block,
  ButtonFromSpec,
  buttonSource,
  type ButtonSpec,
  Content,
  ICONS,
  type IconName,
  iconTag,
} from '../../ui/_content';

interface Item {
  key: string;
  label: string;
  icon?: IconName;
}

interface NavDialogVariant extends Variant {
  trigger: ButtonSpec;
  title: string;
  description?: string;
  searchable?: boolean;
  groups: { label?: string; items: Item[] }[];
  /** Each section's body, by its key. */
  sections: Record<string, Block[]>;
  /** A button pinned under the `leftNav`. */
  footer?: ButtonSpec;
}

const VARIANTS = DATA as unknown as NavDialogVariant[];

interface Args {
  variant: string;
  onOpenChange: (open: boolean) => void;
  onSelect: (key: string) => void;
}

const groupsOf = (v: NavDialogVariant) =>
  v.groups.map((g) => ({ ...g, items: g.items.map((i) => ({ ...i, icon: i.icon && ICONS[i.icon] })) }));

/** `const groups = […]` as a consumer writes it: icons are components, not names. */
const groupsSource = (v: NavDialogVariant) => {
  const item = (i: Item) =>
    `{ key: ${json(i.key)}, label: ${json(i.label)}${i.icon ? `, icon: ${iconTag(i.icon)}` : ''} }`;
  const group = (g: NavDialogVariant['groups'][number]) =>
    `  {${g.label ? ` label: ${json(g.label)},` : ''} items: [\n${g.items.map((i) => `    ${item(i)},`).join('\n')}\n  ] },`;
  return `const groups = [\n${v.groups.map(group).join('\n')}\n];`;
};

const meta = {
  title: 'UI/UI Extended/NavDialog',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { NavDialog } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              setup: [
                groupsSource(v),
                '// Both live with you — in state here, or in the URL.',
                'const [open, setOpen] = React.useState(false);',
                `const [section, setSection] = React.useState(${json(v.groups[0].items[0].key)});`,
              ].join('\n'),
              call: [
                `${buttonSource(v.trigger, '() => setOpen(true)')}`,
                '<NavDialog',
                '  open={open}',
                '  // false when Escape, the close button or the overlay closes it',
                '  onOpenChange={setOpen}',
                `  title="${v.title}"`,
                v.description ? `  description="${v.description}"` : '',
                v.searchable === false ? '  searchable={false}' : '',
                '  groups={groups}',
                '  activeKey={section}',
                '  // the picked row\'s key',
                '  onSelect={setSection}',
                v.footer ? `  leftNavFooter={${buttonSource(v.footer, '')}}` : '',
                '>',
                '  {/* the section named by `section` */}',
                '</NavDialog>',
              ]
                .filter(Boolean)
                .join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onOpenChange: fn(), onSelect: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Holds `open` and the section, as a consumer would. */
function Live({ v, args, log }: { v: NavDialogVariant; args: Args; log: Log }) {
  const [open, setOpen] = React.useState(false);
  const [section, setSection] = React.useState(v.groups[0].items[0].key);
  const change = (next: boolean) => {
    setOpen(next);
    args.onOpenChange(next);
    log('onOpenChange', next);
  };
  const select = (key: string) => {
    setSection(key);
    args.onSelect(key);
    log('onSelect', key);
  };
  return (
    <>
      <ButtonFromSpec spec={v.trigger} onClick={() => change(true)} />
      <Component
        open={open}
        onOpenChange={change}
        title={v.title}
        description={v.description}
        searchable={v.searchable}
        groups={groupsOf(v)}
        activeKey={section}
        onSelect={select}
        leftNavFooter={v.footer && <ButtonFromSpec spec={v.footer} onClick={() => log('footer', v.footer!.label)} />}
      >
        <Stack gap="md">
          <Content blocks={v.sections[section] ?? []} send={log} />
        </Stack>
      </Component>
    </>
  );
}

/**
 * Sections in one dialog, from `fixtures/ui-extended/nav-dialog.json`: a `leftNav` of grouped
 * rows, the picked section beside it. Open it from its trigger, pick a row — `onSelect` sends
 * its key and the story shows that section — or type in the search to narrow the rows. The
 * dialog keeps its size whichever section is shown.
 */
export const NavDialog: Story = {
  render: (args) => (
    <VariantGrid variants={VARIANTS} variant={args.variant}>
      {(v, log) => <Live v={v} args={args} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const v = VARIANTS[0];
    const cell = within(within(canvasElement).getByRole('group', { name: v.caption }));
    const page = within(canvasElement.ownerDocument.body);
    await step('Open it: the first section is shown', async () => {
      await userEvent.click(cell.getByRole('button', { name: v.trigger.label }));
      await expect(args.onOpenChange).toHaveBeenCalledWith(true);
      const dialog = await page.findByRole('dialog');
      await expect(within(dialog).getByRole('button', { name: 'Account' })).toHaveAttribute('aria-current', 'page');
    });
    await step('Pick a row: its key is sent and its section shown', async () => {
      await userEvent.click(page.getByRole('button', { name: 'Access record' }));
      await expect(args.onSelect).toHaveBeenCalledWith('access');
      await expect(page.getByRole('region', { name: 'Access record' })).toHaveTextContent('Sign-in failed');
    });
    await step('Search narrows the rows', async () => {
      await userEvent.type(page.getByRole('textbox', { name: 'Search' }), 'bill');
      await expect(page.queryByRole('button', { name: 'Account' })).toBeNull();
      await expect(page.getByRole('button', { name: 'Billing' })).toBeVisible();
    });
    await step('Escape closes it with false', async () => {
      await userEvent.keyboard('{Escape}');
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(page.queryByRole('dialog')).toBeNull());
      await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    });
  },
};
