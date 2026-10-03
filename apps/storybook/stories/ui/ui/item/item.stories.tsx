import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  AgentChip,
  Badge,
  Button,
  Item as ItemRow,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  StatusDot,
} from '@invana/ui';
import { Bot, ChevronRight, FileText } from 'lucide-react';

import data from '../../../../fixtures/ui/item.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log, type Variant } from '../../../_story/variant-grid';

/** What JSON names an icon by; the story holds the icons. */
const ICONS = { file: <FileText /> };

type Tone = 'success' | 'warning' | 'muted';

interface Row {
  id: string;
  icon?: keyof typeof ICONS;
  dot?: Tone;
  title: string;
  /** A small label beside the title. */
  tag?: string;
  /** An agent named before the description. */
  agent?: string;
  description: string;
  status?: { text: string; tone: Tone };
  /** An open button, named for screen readers. */
  action?: string;
  /** Present, not in play — faded in place. */
  dim?: boolean;
  /** Failed or refused — its title struck. */
  struck?: boolean;
}

interface ItemVariant extends Variant {
  variant?: 'default' | 'outline' | 'muted';
  size?: 'default' | 'sm' | 'xs';
  /** The row picked when the cell draws — rows become links that move it. */
  selected?: string;
  items: Row[];
}

const VARIANTS = data as ItemVariant[];

interface Args {
  variant: string;
  onSelect: (id: string) => void;
  onClick: (id: string) => void;
}

const rowCode = (v: ItemVariant, r: Row) =>
  [
    v.selected
      ? `<Item asChild size="${v.size}" selected={selected === ${JSON.stringify(r.id)}}${r.dim ? ' dim' : ''}${r.struck ? ' struck' : ''}>`
      : `<Item${v.variant ? ` variant="${v.variant}"` : ''}${v.size ? ` size="${v.size}"` : ''}>`,
    v.selected ? `  <button type="button" onClick={() => onSelect(${JSON.stringify(r.id)})}>` : null,
    r.icon ? '  <ItemMedia variant="icon"><FileText /></ItemMedia>' : null,
    r.dot ? `  <ItemMedia><StatusDot tone="${r.dot}" size="md" /></ItemMedia>` : null,
    '  <ItemContent>',
    `    <ItemTitle>${r.title}${r.tag ? ` <Badge variant="outline" size="xs" tone="muted">${r.tag}</Badge>` : ''}</ItemTitle>`,
    `    <ItemDescription>${r.agent ? `<AgentChip icon={<Bot />} name="${r.agent}" /> · ` : ''}${r.description}</ItemDescription>`,
    '  </ItemContent>',
    r.status
      ? `  <ItemActions><Badge variant="outline" size="sm" tone="${r.status.tone}">${r.status.text}</Badge></ItemActions>`
      : null,
    r.action
      ? `  <ItemActions>\n    <Button variant="ghost" size="icon" aria-label="${r.action}" onClick={onClick}><ChevronRight /></Button>\n  </ItemActions>`
      : null,
    v.selected ? '  </button>' : null,
    '</Item>',
  ]
    .filter(Boolean)
    .join('\n');

const meta = {
  title: 'UI/UI/Item',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import * as React from 'react';",
              "import { AgentChip, Badge, Button, Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle, StatusDot } from '@invana/ui';",
              "import { Bot, ChevronRight, FileText } from 'lucide-react';",
            ],
            picked.map((v) => ({
              comment: v.caption,
              setup: v.selected
                ? `// The picked row's id. A row the user chose stays marked while they work elsewhere.\nconst [selected, setSelected] = React.useState(${JSON.stringify(v.selected)});\nconst onSelect = (id: string) => setSelected(id);`
                : '// Opens the item.\nconst onClick = () => open(item);',
              call:
                v.items.length > 1
                  ? `<ItemGroup>\n${v.items.map((r) => rowCode(v, r).replace(/^/gm, '  ')).join('\n')}\n</ItemGroup>`
                  : rowCode(v, v.items[0]),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onSelect: fn(), onClick: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

function RowBody({ r, onClick, log }: { r: Row; onClick: Args['onClick']; log: Log }) {
  return (
    <>
      {r.icon ? <ItemMedia variant="icon">{ICONS[r.icon]}</ItemMedia> : null}
      {r.dot ? (
        <ItemMedia>
          <StatusDot tone={r.dot} size="md" />
        </ItemMedia>
      ) : null}
      <ItemContent>
        <ItemTitle>
          {r.title}{' '}
          {r.tag ? (
            <Badge variant="outline" size="xs" tone="muted">
              {r.tag}
            </Badge>
          ) : null}
        </ItemTitle>
        <ItemDescription>
          {r.agent ? (
            <>
              <AgentChip icon={<Bot />} name={r.agent} /> ·{' '}
            </>
          ) : null}
          {r.description}
        </ItemDescription>
      </ItemContent>
      {r.status ? (
        <ItemActions>
          <Badge variant="outline" size="sm" tone={r.status.tone}>
            {r.status.text}
          </Badge>
        </ItemActions>
      ) : null}
      {r.action ? (
        <ItemActions>
          <Button
            variant="ghost"
            size="icon"
            aria-label={r.action}
            onClick={() => {
              onClick(r.id);
              log('onClick', r.id);
            }}
          >
            <ChevronRight />
          </Button>
        </ItemActions>
      ) : null}
    </>
  );
}

function LiveItems({ v, onSelect, onClick, log }: { v: ItemVariant } & Omit<Args, 'variant'> & { log: Log }) {
  const [selected, setSelected] = React.useState(v.selected);
  const rows = v.items.map((r) =>
    v.selected ? (
      <ItemRow key={r.id} asChild size={v.size} variant={v.variant} selected={selected === r.id} dim={r.dim} struck={r.struck}>
        <button
          type="button"
          aria-current={selected === r.id ? 'true' : undefined}
          onClick={() => {
            setSelected(r.id);
            onSelect(r.id);
            log('onSelect', r.id);
          }}
        >
          <RowBody r={r} onClick={onClick} log={log} />
        </button>
      </ItemRow>
    ) : (
      <ItemRow key={r.id} size={v.size} variant={v.variant}>
        <RowBody r={r} onClick={onClick} log={log} />
      </ItemRow>
    ),
  );
  return rows.length > 1 ? <ItemGroup>{rows}</ItemGroup> : rows;
}

/**
 * A row: media, a title and description, actions — every variant from `fixtures/ui/item.json`.
 * The entity row is the application list at `size="xs"` (a control's `md` height) — each row a
 * button, with a selected state: click a row and `onSelect` logs its id while the mark moves to
 * it. A retired row is `dim`, a refused one `struck`. The default row's chevron logs
 * `onClick`.
 */
export const Item: Story = {
  render: ({ variant, onSelect, onClick }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveItems v={v} onSelect={onSelect} onClick={onClick} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('Open the file', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Default' }));
      await userEvent.click(cell.getByRole('button', { name: 'Open' }));
      await expect(args.onClick).toHaveBeenCalledWith('proposal');
    });
    await step('Pick another row; the selection moves', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Entity row' }));
      await userEvent.click(cell.getByRole('button', { name: /Market Scout/ }));
      await expect(args.onSelect).toHaveBeenCalledWith('scout');
      await expect(cell.getByRole('button', { name: /Market Scout/ })).toHaveAttribute('aria-current', 'true');
      await expect(cell.getByRole('button', { name: /^Intraday Analyst/ })).not.toHaveAttribute('aria-current');
    });
  },
};
