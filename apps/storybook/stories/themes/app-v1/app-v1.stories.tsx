import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { AppLayoutV1 as Layout } from '@invana/themes/app-v1/layout';

import data from '../../../fixtures/themes/app-v1.json';
import { json, snippets, sourceFor, variantArg } from '../../_story/source';
import { VariantBoard, type Log, type Variant } from '../../_story/variant-board';
import {
  DashboardPage,
  footerProps,
  headerProps,
  railProps,
  type FooterData,
  type HeaderData,
  type NavItemData,
  type PageData,
} from '../shell';

interface ShellVariant extends Variant {
  /** The activity rail; absent, the bar is not drawn and `main` takes the full width. */
  leftNav?: { top?: NavItemData[]; bottom?: NavItemData[] };
  header: HeaderData;
  page: PageData;
  footer: FooterData;
}

const VARIANTS = data as ShellVariant[];

interface Args {
  variant: string;
  onClick: (name: string) => void;
  onSearch: (value: string) => void;
}

/** Holds what a consumer would: the search text. Every click and keystroke is logged. */
function Live({ v, args, log }: { v: ShellVariant; args: Args; log: Log }) {
  const [search, setSearch] = React.useState('');
  const on = {
    onClick: (name: string) => {
      args.onClick(name);
      log('onClick', name);
    },
    onSearch: (value: string) => {
      setSearch(value);
      args.onSearch(value);
      log('onSearch', value);
    },
  };
  return (
    <Layout
      header={headerProps(v.header, search, on)}
      leftNav={railProps(v.leftNav, on.onClick)}
      main={<DashboardPage page={v.page} on={on} />}
      footer={footerProps(v.footer, on)}
    />
  );
}

const meta = {
  title: 'Themes/AppV1',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { AppLayoutV1 } from '@invana/themes';", "import { SearchInput, PanelContent } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { leftNav: v.leftNav, header: v.header, footer: v.footer },
              setup:
                '// Nav items carry onClick: () => onClick(item.name); SearchInput\'s onChange receives the text.\n' +
                `const page = ${json(v.page)};`,
              call: [
                '<AppLayoutV1',
                ...(v.leftNav ? ['  leftNav={{ topNavItems: leftNav.top, bottomNavItems: leftNav.bottom }}'] : []),
                '  header={{ leftNavItems: [brand], center: <SearchInput value={q} onChange={setQ} placeholder={header.search} />, rightNavItems: actions }}',
                '  main={<PanelContent title={page.title} headerActions={page.actions}>{/* MetricGrid, PanelBox… */}</PanelContent>}',
                '  footer={{ leftNavItems: footer.left, centerNavItems: footer.center, rightNavItems: footer.right }}',
                '/>',
              ].join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: VARIANTS[0].caption, onClick: fn(), onSearch: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * `AppLayoutV1` — `AppLayoutBase` plus a left activity rail — with a dashboard in `main`, from
 * `fixtures/themes/app-v1.json`. Without `leftNav` the rail is not drawn and `main` takes the
 * full width. Rail icons answer `onClick` too. One shell at a time (pick another with `variant`). Header
 * actions, page actions and footer links answer `onClick` with their name; the search answers
 * `onSearch` with its text.
 */
export const AppV1: Story = {
  render: (args) => (
    <VariantBoard variants={VARIANTS} variant={args.variant}>
      {(v, log) => <Live v={v} args={args} log={log} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: VARIANTS[0].caption }));
    await userEvent.click(cell.getByRole('button', { name: 'Projects' }));
    await expect(args.onClick).toHaveBeenCalledWith('Projects');
    await userEvent.click(cell.getByRole('button', { name: 'Notifications' }));
    await expect(args.onClick).toHaveBeenCalledWith('Notifications');
    await userEvent.type(cell.getByPlaceholderText(VARIANTS[0].header.search!), 'r');
    await expect(args.onSearch).toHaveBeenCalledWith('r');
    await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('onSearch"r"');
  },
};
