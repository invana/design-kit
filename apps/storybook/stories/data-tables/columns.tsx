import { type ColumnDef } from '@invana/tables';
import { InlineMeter } from '@invana/charts';
import {
  Checkbox,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@invana/forms';
import { Badge, KindChip, RunStatusText } from '@invana/ui';

import { formatCount, formatRuntime, type Evaluation, type Session, type Verdict } from './usecases/fixtures';

/**
 * Story-only column sets for `Data Tables/*` — the one thing a table's JSON cannot hold, since a
 * column's `cell` draws React. The rows are JSON in `fixtures/data-tables/`; a variant names its
 * column set. Not a story file, so Storybook does not index it.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- a column's value type varies by column
export type Columns<T> = ColumnDef<T, any>[];

export type Store = { store: string; region: string; revenue: number; margin: number; delta: number };

export type Person = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  team: string;
  status: 'active' | 'invited' | 'disabled';
  visits: number;
};

export type Schedule = { id: string; name: string; owner: string; everyMinutes: number | null; lastRun: string };

export type CatalogNode = {
  id: string;
  name: string;
  kind: 'dataset' | 'table' | 'column';
  type?: string;
  rows?: number;
  updated?: string;
  children?: CatalogNode[];
};

export type Run = {
  id: string;
  workflow: string;
  status: 'succeeded' | 'failed' | 'running' | 'queued';
  started: string;
  duration: string;
  [detail: string]: string;
};

export type Margin = { store: string; margin: string; delta: string };
export type Dataset = { name: string; owner: string; rows: number; freshness: string; status: 'fresh' | 'stale' | 'failing' };
export type Ceiling = { key: string; value: string; bounds: string };

export type SemanticType = 'fact' | 'dimension' | 'time' | 'metric';
export type Field = {
  id: string;
  name: string;
  include: boolean;
  dataType: '' | 'int' | 'string' | 'datetime';
  logicalName: string;
  semanticType: SemanticType;
  synonyms: string;
};

export type JournalRun = {
  id: string;
  about: string;
  kind: string;
  agent: string;
  world: string;
  elapsed: string;
  tokens: string;
  tasks: string;
  cost: string;
  status: string;
  depth: number;
};

const money = (v: number) => `$${v.toLocaleString()}`;
const signed = (v: number) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(1)}`;

const STORES: Columns<Store> = [
  { id: 'store', accessorKey: 'store', header: 'Store', size: 160 },
  { id: 'region', accessorKey: 'region', header: 'Region', size: 110 },
  {
    id: 'revenue',
    accessorKey: 'revenue',
    header: 'Revenue',
    size: 120,
    meta: { align: 'right', mono: true },
    cell: ({ getValue }) => money(getValue() as number),
  },
  {
    id: 'margin',
    accessorKey: 'margin',
    header: 'Margin',
    size: 90,
    meta: { align: 'right', mono: true },
    cell: ({ getValue }) => `${(getValue() as number).toFixed(1)}%`,
  },
  {
    id: 'delta',
    accessorKey: 'delta',
    header: 'Δ pts',
    size: 90,
    meta: { align: 'right', mono: true },
    cell: ({ getValue }) => signed(getValue() as number),
  },
];

const STATUS_VARIANT = { active: 'default', invited: 'secondary', disabled: 'outline' } as const;

/** Name, email, role, team and visits edit in place; status is read-only. */
export const PEOPLE_COLUMNS: Columns<Person> = [
  { id: 'name', accessorKey: 'name', header: 'Name', size: 220, meta: { editable: true } },
  { id: 'email', accessorKey: 'email', header: 'Email', size: 240, meta: { editable: true } },
  {
    id: 'role',
    accessorKey: 'role',
    header: 'Role',
    size: 140,
    meta: {
      editable: true,
      editType: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Viewer', value: 'viewer' },
      ],
    },
  },
  { id: 'team', accessorKey: 'team', header: 'Team', size: 140, meta: { editable: true } },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    size: 120,
    cell: ({ getValue }) => {
      const v = getValue() as Person['status'];
      return <Badge variant={STATUS_VARIANT[v]}>{v}</Badge>;
    },
  },
  {
    id: 'visits',
    accessorKey: 'visits',
    header: 'Visits',
    size: 100,
    meta: { editable: true, editType: 'number', align: 'right', mono: true },
  },
];

const SCHEDULES: Columns<Schedule> = [
  { id: 'name', accessorKey: 'name', header: 'Schedule', size: 240, meta: { editable: true } },
  {
    id: 'owner',
    accessorKey: 'owner',
    header: 'Owner',
    size: 140,
    meta: {
      editable: true,
      editType: 'select',
      options: [
        { label: 'Finance', value: 'finance' },
        { label: 'Ops', value: 'ops' },
        { label: 'Research', value: 'research' },
      ],
    },
  },
  {
    id: 'everyMinutes',
    accessorKey: 'everyMinutes',
    header: 'Every (min)',
    size: 110,
    meta: { editable: true, editType: 'number', align: 'right', mono: true },
  },
  { id: 'lastRun', accessorKey: 'lastRun', header: 'Last run', size: 90, meta: { mono: true, align: 'right' } },
];

const orDash = (v: unknown) => (v == null ? '—' : String(v));

const CATALOG: Columns<CatalogNode> = [
  { id: 'name', accessorKey: 'name', header: 'Name', size: 260, meta: { mono: true } },
  {
    id: 'kind',
    accessorKey: 'kind',
    header: 'Kind',
    size: 100,
    cell: ({ getValue }) => (
      <Badge variant="outline" tone="muted" size="xs">
        {getValue() as string}
      </Badge>
    ),
  },
  { id: 'type', accessorKey: 'type', header: 'Type', size: 110, meta: { mono: true }, cell: ({ getValue }) => orDash(getValue()) },
  {
    id: 'rows',
    accessorKey: 'rows',
    header: 'Rows',
    size: 110,
    meta: { mono: true, align: 'right' },
    cell: ({ getValue }) => (getValue() as number | undefined)?.toLocaleString() ?? '—',
  },
  { id: 'updated', accessorKey: 'updated', header: 'Updated', size: 110, cell: ({ getValue }) => orDash(getValue()) },
];

const RUN_TONE = { succeeded: 'success', failed: 'muted', running: 'info', queued: 'muted' } as const;

const RUNS: Columns<Run> = [
  { id: 'id', accessorKey: 'id', header: 'Run', size: 130, meta: { mono: true } },
  { id: 'workflow', accessorKey: 'workflow', header: 'Workflow', size: 160 },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    size: 110,
    cell: ({ getValue }) => {
      const v = getValue() as Run['status'];
      return v === 'failed' ? (
        <Badge variant="destructive" size="xs">
          failed
        </Badge>
      ) : (
        <Badge variant="soft" tone={RUN_TONE[v]} size="xs">
          {v}
        </Badge>
      );
    },
  },
  { id: 'started', accessorKey: 'started', header: 'Started', size: 100, meta: { mono: true } },
  { id: 'duration', accessorKey: 'duration', header: 'Took', size: 90, meta: { mono: true, align: 'right' } },
];

const MARGINS: Columns<Margin> = [
  { id: 'store', accessorKey: 'store', header: 'Store' },
  { id: 'margin', accessorKey: 'margin', header: 'Margin', meta: { align: 'right' } },
  { id: 'delta', accessorKey: 'delta', header: 'Δ pts', meta: { align: 'right' } },
];

const VERDICT_TONE: Record<Verdict, 'destructive' | 'warning' | 'success' | 'info' | 'muted'> = {
  denied: 'destructive',
  egress: 'destructive',
  warn: 'warning',
  approved: 'success',
  allow: 'success',
  masked: 'info',
};

const EVALUATIONS: Columns<Evaluation> = [
  { id: 'at', accessorKey: 'at', header: 'Time', size: 84, meta: { mono: true } },
  {
    id: 'verdict',
    accessorKey: 'verdict',
    header: 'Verdict',
    size: 104,
    cell: ({ row }) => (
      <Badge variant="soft" tone={VERDICT_TONE[row.original.verdict]} size="xs">
        {row.original.verdict}
      </Badge>
    ),
  },
  { id: 'policy', accessorKey: 'policy', header: 'Policy', size: 150, meta: { mono: true } },
  { id: 'sid', accessorKey: 'sid', header: 'Session', size: 80, meta: { mono: true } },
  { id: 'text', accessorKey: 'text', header: 'What happened' },
];

const SESSION_STATUS = { running: 'running', waiting: 'held', failed: 'failed', idle: 'queued' } as const;

const SESSIONS: Columns<Session> = [
  { id: 'id', accessorKey: 'id', header: 'Session', size: 80, meta: { mono: true } },
  { id: 'title', accessorKey: 'title', header: 'Conversation' },
  {
    id: 'context',
    accessorKey: 'context',
    header: 'Context',
    size: 130,
    cell: ({ getValue }) => {
      const share = getValue() as number;
      return <InlineMeter value={share} tone={share >= 0.8 ? 'warning' : 'primary'} label="Context window held" />;
    },
  },
  {
    id: 'tokens',
    accessorKey: 'tokens',
    header: 'Tokens',
    size: 80,
    meta: { mono: true, align: 'right' },
    cell: ({ getValue }) => formatCount(getValue() as number),
  },
  {
    id: 'runtime',
    accessorKey: 'runtime',
    header: 'Runtime',
    size: 80,
    meta: { mono: true, align: 'right' },
    cell: ({ getValue }) => formatRuntime(getValue() as number),
  },
  {
    id: 'state',
    accessorKey: 'state',
    header: 'State',
    size: 110,
    cell: ({ row }) => <RunStatusText status={SESSION_STATUS[row.original.state]} />,
  },
];

const DATASET_TONE = { fresh: 'success', stale: 'warning', failing: 'muted' } as const;

const DATASETS: Columns<Dataset> = [
  { id: 'name', accessorKey: 'name', header: 'Dataset', size: 200, meta: { mono: true } },
  { id: 'owner', accessorKey: 'owner', header: 'Owner', size: 120 },
  {
    id: 'rows',
    accessorKey: 'rows',
    header: 'Rows',
    size: 110,
    meta: { mono: true, align: 'right' },
    cell: ({ getValue }) => (getValue() as number).toLocaleString(),
  },
  { id: 'freshness', accessorKey: 'freshness', header: 'Updated', size: 120 },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    size: 100,
    cell: ({ getValue }) => {
      const v = getValue() as Dataset['status'];
      return (
        <Badge variant="soft" tone={DATASET_TONE[v]} size="xs">
          {v}
        </Badge>
      );
    },
  },
];

const CEILINGS: Columns<Ceiling> = [
  { id: 'key', accessorKey: 'key', header: 'Ceiling' },
  { id: 'value', accessorKey: 'value', header: 'Value' },
  { id: 'bounds', accessorKey: 'bounds', header: 'What it bounds' },
];

const JOURNAL: Columns<JournalRun> = [
  { accessorKey: 'id', header: 'run', size: 100, meta: { mono: true } },
  { accessorKey: 'about', header: 'what it was about', size: 260 },
  { accessorKey: 'kind', header: 'kind', size: 80, cell: ({ row }) => <KindChip kind={row.original.kind} /> },
  { accessorKey: 'agent', header: 'agent', size: 90 },
  { accessorKey: 'world', header: 'world', size: 120 },
  { accessorKey: 'elapsed', header: 'elapsed', size: 80, meta: { mono: true, align: 'right' } },
  { accessorKey: 'tokens', header: 'tokens', size: 70, meta: { mono: true, align: 'right' } },
  { accessorKey: 'tasks', header: 'tasks', size: 60, meta: { mono: true, align: 'right' } },
  { accessorKey: 'cost', header: 'cost', size: 70, meta: { mono: true, align: 'right' } },
  { accessorKey: 'status', header: 'status', size: 130, cell: ({ row }) => <RunStatusText status={row.original.status} /> },
];

const SEMANTIC: Record<SemanticType, string> = {
  fact: 'Fact',
  dimension: 'Dimension',
  time: 'Time dimension',
  metric: 'Metric',
};
const DATA_TYPES: Field['dataType'][] = ['int', 'string', 'datetime'];

/** A change one control in the grid makes — what a consumer would send for that field. */
export type FieldPatch = (id: string, changes: Partial<Field>) => void;

/**
 * A grid of controls that are always on: each column's `cell` renders a `Checkbox`, a `Select`
 * or an `Input` at its `sm` size, wired to `patch`. `meta.control` gives up the cell's vertical
 * padding, so a row of controls is the height of a row of text.
 */
export function fieldColumns(patch: FieldPatch): Columns<Field> {
  return [
    { id: 'name', accessorKey: 'name', header: 'Field', size: 200, meta: { mono: true } },
    {
      id: 'include',
      header: 'Include',
      size: 90,
      meta: { control: true, align: 'center' },
      cell: ({ row }) => (
        <Checkbox
          aria-label={`Include ${row.original.name}`}
          checked={row.original.include}
          onCheckedChange={(v) => patch(row.original.id, { include: v === true })}
        />
      ),
    },
    {
      id: 'dataType',
      header: 'Data type',
      size: 140,
      meta: { control: true },
      cell: ({ row }) =>
        row.original.dataType === '' ? (
          '—'
        ) : (
          <Select
            value={row.original.dataType}
            onValueChange={(v) => patch(row.original.id, { dataType: v as Field['dataType'] })}
          >
            <SelectTrigger triggerSize="sm" aria-label={`Data type of ${row.original.name}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DATA_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ),
    },
    {
      id: 'logicalName',
      header: 'Logical name',
      size: 200,
      meta: { control: true },
      cell: ({ row }) => (
        <Input
          inputSize="sm"
          aria-label={`Logical name of ${row.original.name}`}
          value={row.original.logicalName}
          onChange={(e) => patch(row.original.id, { logicalName: e.target.value })}
        />
      ),
    },
    {
      id: 'semanticType',
      header: 'Semantic type',
      size: 180,
      meta: { control: true },
      cell: ({ row }) => (
        <Select
          value={row.original.semanticType}
          onValueChange={(v) => patch(row.original.id, { semanticType: v as SemanticType })}
        >
          <SelectTrigger triggerSize="sm" aria-label={`Semantic type of ${row.original.name}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(SEMANTIC) as SemanticType[]).map((t) => (
              <SelectItem key={t} value={t}>
                {SEMANTIC[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    { id: 'synonyms', accessorKey: 'synonyms', header: 'Synonyms', size: 220 },
  ];
}

const SETS = {
  stores: STORES,
  // Region names a place, not an order, so its header is not a sort button.
  storesRegionUnsorted: STORES.map((c) => (c.id === 'region' ? { ...c, enableSorting: false } : c)),
  people: PEOPLE_COLUMNS,
  schedules: SCHEDULES,
  catalog: CATALOG,
  runs: RUNS,
  margins: MARGINS,
  evaluations: EVALUATIONS,
  sessions: SESSIONS,
  datasets: DATASETS,
  ceilings: CEILINGS,
  journal: JOURNAL,
};

export type ColumnSetName = keyof typeof SETS | 'fields';

/** Every column set a variant can name, read with the variant's own rows. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- each set reads its own row shape
export const COLUMN_SETS = SETS as Record<keyof typeof SETS, Columns<any>>;

/**
 * A column set as the Code tab writes it: every key but the cell renderer, which is code — the
 * comment says which columns draw their own cell.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- any column set
export function columnsSource(columns: Columns<any>) {
  return columns.map(({ cell, ...rest }) => (cell ? { ...rest, cell: '…' } : rest));
}
