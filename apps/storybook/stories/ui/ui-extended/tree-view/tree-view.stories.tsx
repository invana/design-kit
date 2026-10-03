import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { SectionHeader, TreeView, TypographyMuted, type TreeItem } from '@invana/ui';
import { File, Folder } from 'lucide-react';

import VARIANTS from '../../../../fixtures/ui-extended/tree-view.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log } from '../../../_story/variant-grid';

/** Icons are named in the JSON; a consumer draws its own. */
const ICONS: Record<string, React.ReactNode> = {
  folder: <Folder size={16} aria-hidden />,
  file: <File size={16} aria-hidden />,
};

interface ItemJson extends Omit<TreeItem, 'icon' | 'children' | 'onClick'> {
  icon?: string;
  children?: ItemJson[];
}

interface Args {
  variant: string;
  onClick: (id: string | number, label: string) => void;
}

const meta = {
  title: 'UI/UI Extended/TreeView',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { SectionHeader, TreeView } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { items: v.items, ...(v.header ? { header: v.header } : {}) },
              setup: [
                '// onClick receives (id, label): ("1-2", "Child 1-2").',
                'const toItems = (items) => items.map(({ icon, children, ...i }) => ({',
                '  ...i,',
                '  icon: ICONS[icon],',
                '  onClick,',
                '  children: children && toItems(children),',
                '}));',
              ].join('\n'),
              call: jsx('TreeView', {
                items: 'toItems(items)',
                searchable: v.searchable ? 'true' : undefined,
                header: v.header ? '<SectionHeader bare title={header.title} count={header.count} />' : undefined,
              }),
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

function toItems(items: ItemJson[], onClick: TreeItem['onClick']): TreeItem[] {
  return items.map(({ icon, children, ...i }) => ({
    ...i,
    icon: icon ? ICONS[icon] : undefined,
    onClick,
    children: children && toItems(children, onClick),
  }));
}

function Live({ v, log, onClick }: { v: (typeof VARIANTS)[number]; log: Log; onClick: Args['onClick'] }) {
  const [opened, setOpened] = React.useState<string | null>(null);
  const click = (id: string | number, label: string) => {
    onClick(id, label);
    log('onClick', [id, label]);
    setOpened(label);
  };
  return (
    <>
      <TreeView
        items={toItems(v.items as ItemJson[], click)}
        searchable={v.searchable}
        header={v.header ? <SectionHeader bare title={v.header.title} count={v.header.count} /> : undefined}
      />
      {opened ? <TypographyMuted>Opened {opened}</TypographyMuted> : null}
    </>
  );
}

/**
 * A nested list of folders and files, guided by rules, with an optional search box that keeps
 * every ancestor of a match — from `fixtures/ui-extended/tree-view.json`. A `header` sits above
 * the search. Click a row: it reports `(id, label)` and a folder folds; type to filter.
 */
export const TreeViewStory: Story = {
  name: 'TreeView',
  render: ({ variant, onClick }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <Live v={v} log={log} onClick={onClick} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Searchable' }));
    await step('A row reports its id and label', async () => {
      await userEvent.click(cell.getByRole('button', { name: /Child 1-2/ }));
      await expect(args.onClick).toHaveBeenCalledWith('1-2', 'Child 1-2');
      await expect(cell.getByText('Opened Child 1-2')).toBeInTheDocument();
    });
    await step('Search keeps the match and its ancestors', async () => {
      await userEvent.type(cell.getByRole('textbox'), 'Root 2');
      await expect(cell.queryByRole('button', { name: /Root 1/ })).toBeNull();
      await expect(cell.getByRole('button', { name: /Root 2/ })).toBeInTheDocument();
    });
  },
};
