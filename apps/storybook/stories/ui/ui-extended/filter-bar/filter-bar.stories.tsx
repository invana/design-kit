import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, within } from 'storybook/test';
import {
  FilterBar as Component,
  FilterChip,
  MultiFilterChip,
  SearchInput,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  type FilterChipOption,
} from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/filter-bar.json';
import { inline, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Log, type Variant } from '../../../_story/variant-board';

interface Chip {
  label: string;
  value?: string;
}

interface Multi {
  label: string;
  options: FilterChipOption[];
  value: string[];
  multiple?: boolean;
}

interface FilterVariant extends Variant {
  summary?: string;
  /** Plain chips — each a button that would open its picker. */
  chips?: Chip[];
  /** Give every set chip the × that clears it. */
  closable?: boolean;
  /** Chips with their menus. */
  multi?: Multi[];
  /** Over a table: the bar draws no rule, the table is the frame. */
  seamless?: boolean;
  /** A search box first, with this placeholder. */
  search?: string;
  /** The rows the bar narrows. */
  rows?: { title: string; kind: string }[];
}

const VARIANTS = VARIANTS_JSON as FilterVariant[];

interface Args {
  variant: string;
  /** A plain chip was pressed — where its picker would open. */
  onClick: (label: string) => void;
  onRemove: () => void;
  onChange: (next: string[]) => void;
  onSearch: (query: string) => void;
}

const multiCall = (m: Multi, i: number) =>
  `  <MultiFilterChip label="${m.label}" options={options${i}} value={value${i}} onChange={setValue${i}}${m.multiple === false ? ' multiple={false}' : ''} />`;

function code(v: FilterVariant) {
  if (v.chips && v.closable)
    return {
      data: { initial: Object.fromEntries(v.chips.map((c) => [c.label, c.value ?? null])) },
      setup: [
        'const [filters, setFilters] = React.useState(initial);',
        '// onRemove receives nothing — the chip it belongs to is the closure.',
        'const clear = (key) => setFilters((f) => ({ ...f, [key]: null }));',
      ].join('\n'),
      call: [
        '<FilterBar summary={`${Object.values(filters).filter(Boolean).length} narrowing`}>',
        '  {Object.entries(filters).map(([key, value]) => (',
        '    <FilterChip key={key} label={key} value={value} active={value != null} onRemove={value != null ? () => clear(key) : undefined} />',
        '  ))}',
        '</FilterBar>',
      ].join('\n'),
    };
  if (v.chips)
    return {
      setup: '// A plain chip is a button: open its picker on click.\nconst onClick = (event) => {};',
      call: [
        `<FilterBar summary="${v.summary}">`,
        ...v.chips.map((c) =>
          c.value
            ? `  <FilterChip label="${c.label}" value="${c.value}" active onClick={onClick} />`
            : `  <FilterChip label="${c.label}" onClick={onClick} />`,
        ),
        '</FilterBar>',
      ].join('\n'),
    };
  const multi = v.multi ?? [];
  return {
    data: { ...Object.fromEntries(multi.map((m, i) => [`options${i}`, m.options])), ...(v.rows ? { all: v.rows } : {}) },
    setup: [
      '// onChange receives the whole next selection — ["import", "bulk"], or [] once cleared.',
      ...multi.map((m, i) => `const [value${i}, setValue${i}] = React.useState(${inline(m.value)});`),
      ...(v.search ? ['// SearchInput hands back the string, not the event.', "const [query, setQuery] = React.useState('');"] : []),
      ...(v.rows
        ? ['const rows = all.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()) && (!value0.length || value0.includes(r.kind)));']
        : []),
    ].join('\n'),
    call: [
      `<FilterBar${v.seamless ? ' seamless' : ''} summary=${v.rows ? '{`${rows.length} of ${all.length} items`}' : `"${v.summary}"`}>`,
      ...(v.search ? [`  <SearchInput inputSize="sm" placeholder="${v.search}" value={query} onChange={setQuery} />`] : []),
      ...multi.map(multiCall),
      '</FilterBar>',
      ...(v.rows ? ['<Table>{/* the rows that match query and kind */}</Table>'] : []),
    ].join('\n'),
  };
}

const meta = {
  title: 'UI/UI Extended/FilterBar',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import { FilterBar, FilterChip, MultiFilterChip, SearchInput, Table } from '@invana/ui';",
            ],
            picked.map((v) => ({ comment: v.caption, ...code(v) })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onClick: fn(), onRemove: fn(), onChange: fn(), onSearch: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

function Chips({ v, args, log }: { v: FilterVariant; args: Args; log: Log }) {
  const [filters, setFilters] = React.useState(() => v.chips!.map((c) => ({ ...c })));
  const narrowing = filters.filter((c) => c.value != null).length;
  return (
    <Component summary={v.closable ? `${narrowing} narrowing` : v.summary}>
      {filters.map((c) => (
        <FilterChip
          key={c.label}
          label={c.label}
          value={c.value}
          active={c.value != null}
          onClick={() => {
            args.onClick(c.label);
            log('onClick', c.label);
          }}
          onRemove={
            v.closable && c.value != null
              ? () => {
                  args.onRemove();
                  log('onRemove', c.label);
                  setFilters((all) => all.map((f) => (f.label === c.label ? { label: f.label } : f)));
                }
              : undefined
          }
        />
      ))}
    </Component>
  );
}

function Menus({ v, args, log }: { v: FilterVariant; args: Args; log: Log }) {
  const [values, setValues] = React.useState(() => v.multi!.map((m) => m.value));
  const [query, setQuery] = React.useState('');
  const kind = values[0] ?? [];
  const rows = (v.rows ?? []).filter(
    (r) => r.title.toLowerCase().includes(query.toLowerCase()) && (!v.rows || !kind.length || kind.includes(r.kind)),
  );
  return (
    <>
      <Component seamless={v.seamless} summary={v.rows ? `${rows.length} of ${v.rows.length} items` : v.summary}>
        {v.search ? (
          <SearchInput
            inputSize="sm"
            placeholder={v.search}
            value={query}
            onChange={(next) => {
              args.onSearch(next);
              log('onChange', next);
              setQuery(next);
            }}
          />
        ) : null}
        {v.multi!.map((m, i) => (
          <MultiFilterChip
            key={m.label}
            label={m.label}
            options={m.options}
            multiple={m.multiple}
            value={values[i]!}
            onChange={(next) => {
              args.onChange(next);
              log('onChange', next);
              setValues((all) => all.map((x, j) => (j === i ? next : x)));
            }}
          />
        ))}
      </Component>
      {v.rows ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Kind</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.title}>
                <TableCell>{r.title}</TableCell>
                <TableCell>{r.kind}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : null}
    </>
  );
}

/**
 * The row above a list that narrows it — controls that hide rows, never actions that change data.
 *
 * A chip that is **set** can be cleared without opening its menu (`Closable`). Only a set chip
 * gets the ×: an unset one has nothing to clear. The pair is two controls, so both reach the
 * keyboard and the × carries its own name — *Clear since*.
 *
 * `MultiFilterChip` is a `FilterChip` with its menu: many picks by default — the chip reads the one
 * value, or `2 selected` — or one at a time with `multiple={false}`, where picking the current
 * choice again clears it. The tables' filter row is built from these.
 *
 * Over a table (`seamless`) the table is the frame: no rule under the bar, and its search and
 * summary flush with the table's edges. Type or pick there and the rows under it narrow.
 */
export const FilterBar: Story = {
  render: (args) => (
    <VariantBoard variants={VARIANTS} variant={args.variant}>
      {(v, log) => (v.chips ? <Chips v={v} args={args} log={log} /> : <Menus v={v} args={args} log={log} />)}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('Clear a set chip without opening it', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Closable' }));
      await userEvent.click(cell.getByRole('button', { name: 'Clear since' }));
      await expect(args.onRemove).toHaveBeenCalled();
      await expect(cell.getByText('1 narrowing')).toBeInTheDocument();
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"since"');
    });
    await step('Pick an agent from its menu', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Multi-filter chips' }));
      await userEvent.click(cell.getByRole('button', { name: /^agent/ }));
      await userEvent.click(await screen.findByRole('menuitemcheckbox', { name: 'Analyst' }));
      await expect(args.onChange).toHaveBeenCalledWith(['Analyst']);
      await userEvent.keyboard('{Escape}');
    });
    await step('Search narrows the table', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Seamless, over a table' }));
      await userEvent.type(cell.getByPlaceholderText('Search items'), 'churn');
      await expect(args.onSearch).toHaveBeenLastCalledWith('churn');
      await expect(cell.getByText('1 of 3 items')).toBeInTheDocument();
      await expect(cell.queryByText('Pipeline health')).toBeNull();
    });
  },
};
