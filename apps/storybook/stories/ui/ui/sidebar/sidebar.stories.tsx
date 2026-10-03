import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  Avatar,
  AvatarFallback,
  Item,
  ItemMedia,
  ItemTitle,
  SectionHeader,
  Sidebar as SidebarPart,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  TypographyMuted,
} from '@invana/ui';
import { LayoutDashboard, LifeBuoy, Search, Settings, Users } from 'lucide-react';

import data from '../../../../fixtures/ui/sidebar.json';
import { json, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log, type Variant } from '../../../_story/variant-grid';

const ICONS = { dashboard: LayoutDashboard, search: Search, users: Users, settings: Settings, support: LifeBuoy };

interface Entry {
  title: string;
  icon: keyof typeof ICONS;
}

interface SidebarVariant extends Variant {
  height: number;
  collapsible: 'icon' | 'offcanvas' | 'none';
  brand: { initial: string; name: string };
  group: string;
  items: Entry[];
  active: string;
  footer: Entry[];
  body: string;
}

const VARIANTS = data as SidebarVariant[];

interface Args {
  variant: string;
  onOpenChange: (open: boolean) => void;
  onSelect: (title: string) => void;
}

const meta = {
  title: 'UI/UI/Sidebar',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import * as React from 'react';",
              "import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@invana/ui';",
              "import { LayoutDashboard, LifeBuoy, Search, Settings, Users } from 'lucide-react';",
            ],
            picked.map((v) => ({
              comment: v.caption,
              data: { items: v.items },
              setup: [
                'const ICONS = { dashboard: LayoutDashboard, search: Search, users: Users, settings: Settings, support: LifeBuoy };',
                `const [active, setActive] = React.useState(${JSON.stringify(v.active)});`,
                'const [open, setOpen] = React.useState(true);',
                '// The trigger sends false to collapse to icons, true to expand.',
                'const onOpenChange = (next: boolean) => setOpen(next);',
                '// A menu button sends its title, e.g. "Explore".',
                'const onSelect = (title: string) => setActive(title);',
              ].join('\n'),
              call: [
                '<SidebarProvider open={open} onOpenChange={onOpenChange}>',
                `  <Sidebar collapsible="${v.collapsible}">`,
                `    <SidebarHeader>${v.brand.name}</SidebarHeader>`,
                '    <SidebarContent>',
                '      <SidebarGroup>',
                `        <SidebarGroupLabel>${v.group}</SidebarGroupLabel>`,
                '        <SidebarMenu>',
                '          {items.map(({ title, icon }) => {',
                '            const Icon = ICONS[icon];',
                '            return (',
                '              <SidebarMenuItem key={title}>',
                '                <SidebarMenuButton isActive={title === active} tooltip={title} onClick={() => onSelect(title)}>',
                '                  <Icon />',
                '                  <span>{title}</span>',
                '                </SidebarMenuButton>',
                '              </SidebarMenuItem>',
                '            );',
                '          })}',
                '        </SidebarMenu>',
                '      </SidebarGroup>',
                '    </SidebarContent>',
                `    <SidebarFooter>{/* ${json(v.footer.map((f) => f.title))} */}</SidebarFooter>`,
                '  </Sidebar>',
                '  <SidebarInset>',
                '    <SidebarTrigger />',
                '  </SidebarInset>',
                '</SidebarProvider>',
              ].join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: VARIANTS[0].caption, onOpenChange: fn(), onSelect: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

function Menu({ entries, active, select }: { entries: Entry[]; active?: string; select: (title: string) => void }) {
  return (
    <SidebarMenu>
      {entries.map(({ title, icon }) => {
        const Icon = ICONS[icon];
        return (
          <SidebarMenuItem key={title}>
            <SidebarMenuButton isActive={title === active} tooltip={title} onClick={() => select(title)}>
              <Icon />
              <span>{title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

/** The app's sidebar, controlled: open and the active item are the story's state. */
function Live({ v, onOpenChange, onSelect, log }: { v: SidebarVariant; onOpenChange: Args['onOpenChange']; onSelect: Args['onSelect']; log: Log }) {
  const [open, setOpen] = React.useState(true);
  const [active, setActive] = React.useState(v.active);
  const toggle = (next: boolean) => {
    setOpen(next);
    onOpenChange(next);
    log('onOpenChange', next);
  };
  const select = (title: string) => {
    setActive(title);
    onSelect(title);
    log('onSelect', title);
  };
  return (
    <SidebarProvider
      open={open}
      onOpenChange={toggle}
      // Kit gap: the collapsible Sidebar is `position: fixed` to the viewport and `h-svh`, with
      // no contained mode. A transform makes the provider its containing block, so it stays in
      // the cell.
      style={{ minHeight: v.height, height: v.height, transform: 'translateZ(0)', overflow: 'hidden' }}
    >
      <SidebarPart collapsible={v.collapsible}>
        <SidebarHeader>
          <Item size="xs">
            <ItemMedia>
              <Avatar>
                <AvatarFallback>{v.brand.initial}</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemTitle>{v.brand.name}</ItemTitle>
          </Item>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{v.group}</SidebarGroupLabel>
            <Menu entries={v.items} active={active} select={select} />
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <Menu entries={v.footer} active={active} select={select} />
        </SidebarFooter>
      </SidebarPart>
      <SidebarInset>
        <SectionHeader title={active} actions={<SidebarTrigger />} />
        <TypographyMuted>{v.body}</TypographyMuted>
      </SidebarInset>
    </SidebarProvider>
  );
}

/**
 * The app's navigation rail, collapsing to icons — from `fixtures/ui/sidebar.json`. Pick an
 * item: `onSelect` receives its title and the story moves the active mark. The trigger sends
 * `onOpenChange` with `false` / `true`. Heavy, so the grid draws the first variant.
 */
export const Sidebar: Story = {
  render: ({ variant, onOpenChange, onSelect }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <Live v={v} onOpenChange={onOpenChange} onSelect={onSelect} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Default' }));
    const page = within(canvasElement.ownerDocument.body);
    const mobile = window.matchMedia('(max-width: 767px)').matches;
    await step('Pick Explore', async () => {
      // Below 768px the sidebar is a sheet: open it first.
      if (mobile) await userEvent.click(cell.getByRole('button', { name: 'Toggle Sidebar' }));
      await userEvent.click(await page.findByRole('button', { name: 'Explore' }));
      await expect(args.onSelect).toHaveBeenCalledWith('Explore');
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"Explore"');
    });
    if (!mobile)
      await step('Collapse it to icons', async () => {
        await userEvent.click(cell.getByRole('button', { name: 'Toggle Sidebar' }));
        await expect(args.onOpenChange).toHaveBeenCalledWith(false);
      });
  },
};
