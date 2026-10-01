import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import data from '../../../fixtures/themes/app-v2.json';
import { json, snippets, sourceFor, variantArg } from '../../_story/source';
import { VariantBoard, type Log, type Variant } from '../../_story/variant-board';
import { ChatShell, type ChatData } from './chat';
import { ExplorerShell, type ExplorerData } from './explorer';
import type { V2Handlers } from './handlers';
import { IdeShell, type IdeData } from './ide';
import { RegionsShell, type RegionsData } from './regions';

type ShellVariant = Variant & (IdeData | ExplorerData | ChatData | RegionsData);

const VARIANTS = data as unknown as ShellVariant[];

interface Args extends V2Handlers {
  variant: string;
}

/** Every callback to the Actions panel and the cell's log, under the name a consumer wires. */
function wire(args: Args, log: Log): V2Handlers {
  const to =
    <K extends keyof V2Handlers>(name: K) =>
    (value: string) => {
      args[name](value);
      log(name, value);
    };
  return { onClick: to('onClick'), onSearch: to('onSearch'), onTabChange: to('onTabChange'), onSelect: to('onSelect') };
}

function Shell({ v, on }: { v: ShellVariant; on: V2Handlers }) {
  switch (v.kind) {
    case 'ide':
      return <IdeShell v={v} on={on} />;
    case 'explorer':
      return <ExplorerShell v={v} on={on} />;
    case 'chat':
      return <ChatShell v={v} on={on} />;
    default:
      return <RegionsShell v={v} on={on} />;
  }
}

const IMPORTS = [
  "import { AppLayoutV2 } from '@invana/themes';",
  "import { EmptyState, TabbedPanel, TreeView, SearchInput } from '@invana/ui';",
];

/** The Code tab: the variant's data, then the call that lays it out. */
function code(v: ShellVariant) {
  if (v.kind === 'regions')
    return {
      comment: v.caption,
      data: { regions: v.regions, footer: v.footer },
      call: [
        '<AppLayoutV2',
        ...(v.bottomSpan ? [`  bottomSpan="${v.bottomSpan}"`] : []),
        `  header={{ leftNavItems: [{ name: ${JSON.stringify(v.brand)}, label: ${JSON.stringify(v.brand)} }] }}`,
        ...(v.rail ? ['  leftNav={{ topNavItems, bottomNavItems }} // icons from your own library, onClick: () => onClick(item.name)'] : []),
        '  leftSection={{ content: <EmptyState title={regions.left.label} description={regions.left.hint} /> }}',
        '  mainSection={{ content: <EmptyState title={regions.main.label} description={regions.main.hint} /> }}',
        '  rightSection={{ content: <EmptyState title={regions.right.label} description={regions.right.hint} /> }}',
        '  bottomSection={{ content: <EmptyState title={regions.bottom.label} description={regions.bottom.hint} /> }}',
        '  footer={{ leftNavItems: footer.left, rightNavItems: footer.right }}',
        '/>',
      ].join('\n'),
    };
  const { caption: _c, wide: _w, kind: _k, ...shell } = v as ShellVariant & Record<string, unknown>;
  return {
    comment: v.caption,
    setup: `// Nav items and menu rows call onClick(name); tabs onTabChange(value); tree rows and list items onSelect(label);\n// the header search onSearch(text). Each panel is a TabbedPanel whose tabs come from the data.\nconst shell = ${json(shell)};`,
    call: [
      '<AppLayoutV2',
      `  bottomSpan="${'bottomSpan' in v && v.bottomSpan ? v.bottomSpan : 'left-main'}"`,
      '  header={{ leftNavItems, center: <SearchInput value={q} onChange={onSearch} />, rightNavItems }}',
      '  leftNav={{ topNavItems: rail.top, bottomNavItems: rail.bottom }}',
      '  leftSection={{ content: <TabbedPanel tabs={leftTabs} headerActions={leftActions} /> }}',
      '  mainSection={{ content: <TabbedPanel tabs={mainTabs} onTabChange={onTabChange} /> }}',
      '  rightSection={{ content: <TabbedPanel tabs={rightTabs} onTabChange={onTabChange} /> }}',
      '  bottomSection={{ content: <TabbedPanel tabs={bottomTabs} onTabChange={onTabChange} /> }}',
      '  footer={{ leftNavItems: shell.footer.left, rightNavItems: shell.footer.right }}',
      '/>',
    ].join('\n'),
  };
}

const meta = {
  title: 'Themes/AppV2',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) => snippets(IMPORTS, picked.map(code))),
      },
    },
  },
  args: { variant: VARIANTS[0].caption, onClick: fn(), onSearch: fn(), onTabChange: fn(), onSelect: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * `AppLayoutV2` — header, rail, left · main · right · bottom sections, status bar — from
 * `fixtures/themes/app-v2.json`, one shell at a time (pick another with `variant`):
 *
 * - **Default** — an IDE: the rail swaps the left panel (click the lit icon to collapse it), the
 *   Layout menu toggles the side panels, every panel maximises and closes.
 * - **Explorer shell** — Studio's Explorer: type visibility, search, three collapsible regions,
 *   and the header's own theme picker (it wraps a `ThemeProvider`).
 * - **Chat** — sessions, a prompt over a canvas, changes and files.
 * - **Bottom span …** — how far the bottom panel reaches for each `bottomSpan`.
 * - **No left nav** — no `leftNav`, so no activity bar.
 *
 * Every nav item, menu row, panel action and close answers `onClick` with its name; tabs answer
 * `onTabChange`, tree rows and list items `onSelect`, the header search `onSearch`.
 */
export const AppV2: Story = {
  render: (args) => (
    <VariantBoard variants={VARIANTS} variant={args.variant}>
      {(v, log) => <Shell v={v} on={wire(args, log)} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const body = within(canvasElement.ownerDocument.body);
    const cell = within(within(canvasElement).getByRole('group', { name: 'Default' }));
    await step('The rail swaps the left panel', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Search' }));
      await expect(args.onClick).toHaveBeenCalledWith('Search');
      await expect(cell.getByText('SEARCH')).toBeInTheDocument();
    });
    await step('Layout › Toggle Panel hides the bottom panel', async () => {
      await expect(cell.getByText('PROBLEMS')).toBeInTheDocument();
      await userEvent.click(cell.getByRole('button', { name: 'Layout' }));
      await userEvent.click(await body.findByRole('menuitem', { name: /Toggle Panel/ }));
      await expect(args.onClick).toHaveBeenCalledWith('Toggle Panel');
      await waitFor(() => expect(cell.queryByText('PROBLEMS')).toBeNull());
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('onClick"Toggle Panel"');
    });
  },
};
