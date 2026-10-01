import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  applyCellEdit,
  DataTable,
  type CellEdit,
  type CellEditHandler,
  type ExpandedState,
  type SortingState,
  type StreamMode,
  type TableStream,
} from '@invana/tables';
import { Card, CardContent, PropertyList, PropertyRow, SegmentedControl, type TableDensity } from '@invana/ui';

import variants from '../../../fixtures/data-tables/data-table.json';
import stores from '../../../fixtures/data-tables/stores.json';
import people from '../../../fixtures/data-tables/people.json';
import evaluationFeed from '../../../fixtures/data-tables/evaluation-feed.json';
import sessionFeed from '../../../fixtures/data-tables/session-feed.json';
import { ReplayFrame, useReplay } from '../../_story/replay';
import { jsx, snippets, sourceFor, variantArg } from '../../_story/source';
import { VariantBoard, type Log, type Variant } from '../../_story/variant-board';
import { COLUMN_SETS, columnsSource, fieldColumns, type ColumnSetName, type Columns, type Field } from '../columns';
import { EVALUATIONS, SESSIONS } from '../usecases/fixtures';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- each variant's rows have their own shape
type Row = Record<string, any>;

/** One cell of the board, as `fixtures/data-tables/data-table.json` writes it. */
interface TableVariant extends Variant {
  /** The column set, from `../columns.tsx` — cells draw React, so columns are code. */
  columns: ColumnSetName;
  /** The rows, or the name of a shared rows file. */
  data: Row[] | keyof typeof SHARED;
  /** Only the first rows of a shared file — a screenful. */
  limit?: number;
  /** Props passed as they are. */
  props?: {
    density?: TableDensity;
    seamless?: boolean;
    enableSorting?: boolean;
    defaultSorting?: SortingState;
    enableColumnPinning?: boolean;
    enableColumnResizing?: boolean;
    enableColumnReordering?: boolean;
    minWidth?: number;
    defaultExpanded?: ExpandedState;
    expandOnRowClick?: boolean;
    streamMode?: StreamMode;
    maxRows?: number;
    preview?: { total?: number; noun?: string };
  };
  /** `getRowId` reads this field. */
  rowId?: string;
  /** `getSubRows` reads this field. */
  subRows?: string;
  /** `rowIndent` reads this field. */
  indent?: string;
  /** The row open elsewhere, by id; a row click moves it. */
  selected?: string;
  highlight?: {
    cells?: { column: string; below: number }[];
    row?: { column: string; equals: unknown };
  };
  /** `renderExpanded` lists these fields; a row whose `unless` matches has nothing to open. */
  detail?: { fields: string[]; unless?: { column: string; equals: unknown } };
  /** `preview.onOpen` — the `Open all` link. */
  open?: boolean;
  toolbar?: 'density';
  footer?: 'edit' | 'fields';
  /** The stand-in server `onCellEdit` saves to: how long it takes, and the smallest number it takes. */
  save?: { delayMs: number; min: number; message: string };
  /** Drawn inside a card. */
  frame?: 'card';
  /** Rows a source sends, replayed one batch every `every` ms. */
  feed?: { name: keyof typeof FEEDS; every: number };
}

const VARIANTS = variants as unknown as TableVariant[];

const SHARED = { stores, people, evaluations: EVALUATIONS, sessions: SESSIONS } as Record<string, Row[]>;

/** Each feed's batches. Sessions arrive as the fields that moved; the row is merged in the story. */
const FEEDS = {
  evaluations: evaluationFeed as Row[][],
  sessions: (sessionFeed as Row[]).map((r) => [r]),
};

const rowsOf = (v: TableVariant): Row[] => {
  const rows = typeof v.data === 'string' ? SHARED[v.data]! : v.data;
  return v.limit ? rows.slice(0, v.limit) : rows;
};

const DENSITIES = [
  { value: 'compact', label: 'Compact' },
  { value: 'default', label: 'Default' },
  { value: 'comfortable', label: 'Comfortable' },
];

/** TanStack hands `onSortingChange` / `onExpandedChange` the new state or an updater of the last one. */
const resolve = <T,>(next: T | ((old: T) => T), old: T) =>
  typeof next === 'function' ? (next as (old: T) => T)(old) : next;

/** What a cell edit carries that a server needs — the rest is the row itself. */
const editPayload = (e: CellEdit<Row>) => ({
  rowId: e.rowId,
  field: e.field,
  previousValue: e.previousValue,
  value: e.value,
});

interface Args {
  variant: string;
  onSortingChange: (sorting: SortingState) => void;
  onCellEdit: (edit: ReturnType<typeof editPayload>) => void;
  onRowClick: (rowId: string) => void;
  onExpandedChange: (expanded: ExpandedState) => void;
  onOpen: () => void;
  onFieldChange: (id: string, changes: Partial<Field>) => void;
}

type Callbacks = Omit<Args, 'variant'>;

/** One variant, held the way a consumer holds it: rows in state, every callback answered. */
function LiveTable({ v, log, on }: { v: TableVariant; log: Log; on: Callbacks }) {
  const [rows, setRows] = React.useState(() => rowsOf(v));
  const [density, setDensity] = React.useState<TableDensity>(v.props?.density ?? 'default');
  const [selected, setSelected] = React.useState(v.selected);
  const [last, setLast] = React.useState<{ edit: CellEdit<Row>; outcome: string } | null>(null);

  // The table owns sorting and expansion; the story keeps the last state it reported, to log
  // what an updater resolves to.
  const sorting = React.useRef<SortingState>(v.props?.defaultSorting ?? []);
  const expanded = React.useRef<ExpandedState>(v.props?.defaultExpanded ?? {});

  const onSortingChange = (next: SortingState | ((old: SortingState) => SortingState)) => {
    sorting.current = resolve(next, sorting.current);
    on.onSortingChange(sorting.current);
    log('onSortingChange', sorting.current);
  };

  const onExpandedChange = (next: ExpandedState | ((old: ExpandedState) => ExpandedState)) => {
    expanded.current = resolve(next, expanded.current);
    on.onExpandedChange(expanded.current);
    log('onExpandedChange', expanded.current);
  };

  const onCellEdit: CellEditHandler<Row> = async (edit) => {
    on.onCellEdit(editPayload(edit));
    log('onCellEdit', editPayload(edit));
    if (v.save) {
      const { delayMs, min, message } = v.save;
      setLast({ edit, outcome: 'saving…' });
      await new Promise((r) => setTimeout(r, delayMs));
      if (typeof edit.value === 'number' && edit.value < min) {
        setLast({ edit, outcome: `refused — ${message}` });
        log('refused', message);
        throw new Error(message);
      }
      setLast({ edit, outcome: 'saved' });
    }
    setRows((all) => applyCellEdit(all, edit));
  };

  const patch = (id: string, changes: Partial<Field>) => {
    on.onFieldChange(id, changes);
    log('onChange', { id, ...changes });
    setRows((all) => all.map((r) => (r.id === id ? { ...r, ...changes } : r)));
  };

  const columns = (v.columns === 'fields' ? fieldColumns(patch) : COLUMN_SETS[v.columns]) as Columns<Row>;
  const editable = columns.some((c) => (c.meta as { editable?: boolean } | undefined)?.editable);
  const sortable = v.props?.enableSorting !== false;
  const id = v.rowId;

  const stream = useFeed(v, log);

  const table = (
    <DataTable<Row>
      key={stream.epoch}
      {...v.props}
      columns={columns}
      data={rows}
      density={density}
      getRowId={id ? (r) => String(r[id]) : undefined}
      getSubRows={v.subRows ? (r) => r[v.subRows!] : undefined}
      rowIndent={v.indent ? (r) => r[v.indent!] : undefined}
      onSortingChange={sortable ? onSortingChange : undefined}
      onCellEdit={editable ? onCellEdit : undefined}
      onExpandedChange={v.subRows || v.detail ? onExpandedChange : undefined}
      isRowSelected={v.selected ? (r) => r[id!] === selected : undefined}
      onRowClick={
        v.selected
          ? (r) => {
              on.onRowClick(r[id!]);
              log('onRowClick', r[id!]);
              setSelected(r[id!]);
            }
          : undefined
      }
      isCellHighlighted={
        v.highlight?.cells
          ? (r, column) => v.highlight!.cells!.some((c) => c.column === column && r[column] < c.below)
          : undefined
      }
      isRowHighlighted={v.highlight?.row ? (r) => r[v.highlight!.row!.column] === v.highlight!.row!.equals : undefined}
      canExpand={v.detail?.unless ? (r) => r[v.detail!.unless!.column] !== v.detail!.unless!.equals : undefined}
      renderExpanded={
        v.detail
          ? (r) => (
              <PropertyList labelWidth={72}>
                {v.detail!.fields
                  .filter((f) => f !== 'error' || r[f])
                  .map((f) => (
                    <PropertyRow key={f} label={f} mono={f !== 'trigger'}>
                      {r[f] ?? '—'}
                    </PropertyRow>
                  ))}
              </PropertyList>
            )
          : undefined
      }
      preview={
        v.props?.preview
          ? {
              ...v.props.preview,
              onOpen: v.open
                ? () => {
                    on.onOpen();
                    log('preview.onOpen', null);
                  }
                : undefined,
            }
          : undefined
      }
      streaming={!!v.feed}
      stream={v.feed ? stream.source : undefined}
      toolbar={
        v.toolbar === 'density' ? (
          <SegmentedControl
            size="sm"
            options={DENSITIES}
            value={density}
            onValueChange={(d) => {
              log('density', d);
              setDensity(d as TableDensity);
            }}
          />
        ) : undefined
      }
      footer={
        v.footer === 'edit' ? (
          last ? (
            <PropertyList labelWidth={96}>
              <PropertyRow label="rowId" mono>
                {last.edit.rowId}
              </PropertyRow>
              <PropertyRow label="field" mono>
                {last.edit.field}
              </PropertyRow>
              <PropertyRow label="previousValue" mono>
                {JSON.stringify(last.edit.previousValue)}
              </PropertyRow>
              <PropertyRow label="value" mono>
                {JSON.stringify(last.edit.value)}
              </PropertyRow>
              <PropertyRow label="outcome">{last.outcome}</PropertyRow>
            </PropertyList>
          ) : (
            'Edit a cell — what onCellEdit receives shows here.'
          )
        ) : v.footer === 'fields' ? (
          `${rows.length} fields · ${rows.filter((r) => r.semanticType === 'metric').length} metric · 1 filter`
        ) : undefined
      }
    />
  );

  if (v.feed)
    return (
      <ReplayFrame replay={stream.replay} noun="batch" width={1200}>
        {table}
      </ReplayFrame>
    );
  if (v.frame === 'card')
    return (
      <Card>
        <CardContent>{table}</CardContent>
      </Card>
    );
  return table;
}

/**
 * A source of rows replayed from JSON: the table subscribes through `stream`, and each batch the
 * replay reaches is emitted into it — the way a socket would. Restarting the replay remounts
 * the table (a new `epoch`), which starts its rows over from `data`.
 */
function useFeed(v: TableVariant, log: Log) {
  const batches = v.feed ? FEEDS[v.feed.name] : [];
  const replay = useReplay(batches.length, { every: v.feed?.every, autoplay: !!v.feed });
  const [epoch, setEpoch] = React.useState(0);
  const emit = React.useRef<((rows: Row[]) => void) | null>(null);
  const sent = React.useRef(0);
  // An upsert sends the whole row; the feed holds only what moved, so merge it into the last.
  const current = React.useRef(new Map<string, Row>());

  const source = React.useCallback<TableStream<Row>>((push) => {
    emit.current = push;
    return () => {
      emit.current = null;
    };
  }, []);

  React.useEffect(() => {
    if (!v.feed) return;
    if (replay.at < sent.current) {
      sent.current = 0;
      current.current = new Map();
      setEpoch((e) => e + 1);
      return;
    }
    const arrived = batches.slice(sent.current, replay.at).flat();
    sent.current = replay.at;
    if (!arrived.length) return;
    const rows = arrived.map((r): Row => {
      if (v.feed!.name !== 'sessions') return r;
      const whole = { ...(current.current.get(r.id) ?? SESSIONS.find((s) => s.id === r.id)), ...r };
      current.current.set(r.id, whole);
      return whole;
    });
    emit.current?.(rows);
    log('emit', rows.map((r) => (v.feed!.name === 'sessions' ? r.id : r.at)));
  }, [replay.at]); // eslint-disable-line react-hooks/exhaustive-deps -- a new frame is the only trigger

  return { replay, source, epoch };
}

/** The Code tab for one variant: its rows, its columns, and the call with every callback named. */
function source(v: TableVariant) {
  const rows = rowsOf(v);
  const columns = v.columns === 'fields' ? fieldColumns(() => {}) : COLUMN_SETS[v.columns];
  const props = { ...v.props };
  const setup: string[] = [];
  const call: Record<string, string | { literal: string } | undefined> = { columns: 'columns', data: 'rows' };

  if (props.density && v.toolbar !== 'density') call.density = { literal: props.density };
  if (props.seamless) call.seamless = 'true';
  if (props.enableSorting === false) call.enableSorting = 'false';
  if (props.defaultSorting) call.defaultSorting = JSON.stringify(props.defaultSorting);
  if (props.enableColumnPinning) call.enableColumnPinning = 'true';
  if (props.enableColumnResizing) call.enableColumnResizing = 'true';
  if (props.enableColumnReordering) call.enableColumnReordering = 'true';
  if (props.minWidth) call.minWidth = String(props.minWidth);
  if (v.rowId) call.getRowId = `(r) => r.${v.rowId}`;
  if (v.subRows) call.getSubRows = `(r) => r.${v.subRows}`;
  if (v.indent) call.rowIndent = `(r) => r.${v.indent}`;
  if (props.defaultExpanded) call.defaultExpanded = JSON.stringify(props.defaultExpanded);
  if (props.expandOnRowClick) call.expandOnRowClick = 'true';

  if (props.enableSorting !== false) {
    setup.push('// The new sort, or an updater of the last one: [{ id: "margin", desc: false }]', 'const onSortingChange = (sorting) => {};');
    call.onSortingChange = 'onSortingChange';
  }
  if (columns.some((c) => (c.meta as { editable?: boolean } | undefined)?.editable)) {
    setup.push(
      '// { rowId, field, previousValue, value, updatedRow, … } — return a promise to save on a server;',
      '// a rejection puts the old value back and says why on the cell.',
      'const [rows, setRows] = React.useState(initial);',
      'const onCellEdit = async (edit) => {',
      v.save ? `  await api.patch(\`/schedules/\${edit.rowId}\`, { [edit.field]: edit.value });` : '',
      '  setRows((all) => applyCellEdit(all, edit));',
      '};',
    );
    call.onCellEdit = 'onCellEdit';
  }
  if (v.subRows || v.detail) {
    setup.push('// Which rows are open, by row id: { "finance": true }', 'const onExpandedChange = (expanded) => {};');
    call.onExpandedChange = 'onExpandedChange';
  }
  if (v.highlight?.cells) {
    const rules = v.highlight.cells.map((c) => `(columnId === "${c.column}" && row.${c.column} < ${c.below})`);
    call.isCellHighlighted = `(row, columnId) => ${rules.join(' || ')}`;
  }
  if (v.highlight?.row) call.isRowHighlighted = `(row) => row.${v.highlight.row.column} === ${JSON.stringify(v.highlight.row.equals)}`;
  if (v.selected) {
    setup.push(`const [selected, setSelected] = React.useState(${JSON.stringify(v.selected)});`);
    call.isRowSelected = `(row) => row.${v.rowId} === selected`;
    call.onRowClick = `(row) => setSelected(row.${v.rowId})`;
  }
  if (v.detail) {
    if (v.detail.unless) call.canExpand = `(r) => r.${v.detail.unless.column} !== ${JSON.stringify(v.detail.unless.equals)}`;
    call.renderExpanded = `(r) => (\n    <PropertyList labelWidth={72}>\n${v.detail.fields
      .map((f) => `      <PropertyRow label="${f}">{r.${f}}</PropertyRow>`)
      .join('\n')}\n    </PropertyList>\n  )`;
  }
  if (props.preview) {
    if (v.open) setup.push('// Called with nothing: open the rows in full.', 'const onOpen = () => {};');
    const p = { ...props.preview };
    call.preview = v.open ? `{ total: ${p.total}, noun: "${p.noun}", onOpen }` : JSON.stringify(p);
  }
  if (v.feed) {
    setup.push(
      '// The source: call emit with each batch as it arrives; return what closes it.',
      'const stream = (emit) => {',
      '  const socket = new WebSocket(url);',
      '  socket.onmessage = (m) => emit(JSON.parse(m.data));',
      '  return () => socket.close();',
      '};',
    );
    call.streaming = 'live';
    call.stream = 'stream';
    call.streamMode = { literal: props.streamMode ?? 'prepend' };
    if (props.maxRows) call.maxRows = String(props.maxRows);
  }
  if (v.toolbar === 'density') {
    setup.push('const [density, setDensity] = React.useState("default");');
    call.density = 'density';
    call.toolbar = '<SegmentedControl size="sm" options={DENSITIES} value={density} onValueChange={setDensity} />';
  }
  if (v.footer === 'fields') call.footer = '`${rows.length} fields`';

  const shown = rows.length > 8 ? rows.slice(0, 3) : rows;
  const comment = rows.length > 8 ? `${v.caption} — the first 3 of ${rows.length} rows` : v.caption;
  const tag = jsx('DataTable', call);
  return {
    comment,
    data: { [setup.some((s) => s.includes('useState(initial)')) ? 'initial' : 'rows']: shown, columns: columnsSource(columns) },
    setup: setup.filter(Boolean).join('\n'),
    call: v.frame === 'card' ? `<Card>\n  <CardContent>\n    ${tag.replace(/\n/g, '\n    ')}\n  </CardContent>\n</Card>` : tag,
  };
}

const meta = {
  title: 'Data Tables/DataTable',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import { DataTable, applyCellEdit } from '@invana/tables';",
              "import { Card, CardContent, PropertyList, PropertyRow, SegmentedControl } from '@invana/ui';",
              '// `cell: "…"` marks a column that draws its own cell — see stories/data-tables/columns.tsx.',
            ],
            picked.map(source),
          ),
        ),
      },
    },
  },
  args: {
    variant: VARIANTS[0]!.caption,
    onSortingChange: fn(),
    onCellEdit: fn(),
    onRowClick: fn(),
    onExpandedChange: fn(),
    onOpen: fn(),
    onFieldChange: fn(),
  },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * Every row at once — the table a card, an answer or a record shows, with no search and no page
 * line (that is `PaginatedTable`, or `RemotePaginatedTable` when the server holds the rows).
 * One variant per feature, from `fixtures/data-tables/data-table.json`: sorting, highlighting,
 * pinned / resized / reordered columns, cells edited in place (a save that takes a moment and
 * refuses a schedule under five minutes), rows under rows, detail under a row, a preview with
 * `Open all`, a replayed stream (prepend, and upsert by id), the three densities, `seamless`
 * inside a card, a grid of always-on controls, and the journal with its selection and indent.
 *
 * Heavy, so the `variant` select draws one at a time. Every callback is in the Actions panel and
 * under the table.
 */
export const DataTableStory: Story = {
  name: 'DataTable',
  render: ({ variant, ...on }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveTable v={v} log={log} on={on} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Default' }));
    await step('Sort by store', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Store' }));
      await expect(args.onSortingChange).toHaveBeenCalledWith([{ id: 'store', desc: false }]);
    });
    await step('The rows are in name order, and the sort is logged', async () => {
      const rows = cell.getAllByRole('row');
      await expect(rows[1]).toHaveTextContent('Airport');
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('[{ "id": "store", "desc": false }]');
    });
  },
};
