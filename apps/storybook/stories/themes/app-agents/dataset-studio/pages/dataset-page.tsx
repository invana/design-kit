import { PaginatedTable, type CellEdit, type ColumnDef, type TableFilter } from '@invana/tables';
import { Badge, Button, CitationList, CitationRow, EmptyState, FloatingPanel, RecordHeader, Stack, StatusDot } from '@invana/ui';
import { Plus, Save, Table } from 'lucide-react';

import { DATA, plural, sourceOf, type StudioRow, type Value } from '../data';
import { cellKey, cellStatus, sourceCount, type CellStatus } from '../ops/dataset-ops';
import { useDataset } from '../work';

/** A picked cell: its row id and column key. */
export interface PickedCell {
  row: string;
  column: string;
}

const fmt = (v: unknown, key: string) => (v === '' || v == null ? '' : key === 'yield' && typeof v === 'number' ? v.toFixed(1) : String(v));

/** A cell's value with what is known about it: a dot when its sources disagree, the reader changed it, or none had it. */
function CellView({ value, status }: { value: string; status: CellStatus['status'] }) {
  if (status === 'missing') return <StatusDot tone="warning" label="Not found" />;
  if (status === 'conflict') {
    return (
      <Stack direction="row" gap="xs">
        {value}
        <StatusDot tone="warning" label="" />
      </Stack>
    );
  }
  if (status === 'edited') {
    return (
      <Stack direction="row" gap="xs">
        {value}
        <StatusDot tone="info" label="" />
      </Stack>
    );
  }
  return <>{value}</>;
}

export function DatasetPage({
  picked,
  onPick,
  onEdit,
  onSave,
  onAddColumn,
}: {
  picked: PickedCell | null;
  onPick: (cell: PickedCell) => void;
  /** The reader typed a value into a cell. */
  onEdit: (cell: PickedCell, value: Value) => void;
  onSave: () => void;
  onAddColumn: () => void;
}) {
  const s = useDataset();
  if (!s.rows.length) {
    return <EmptyState icon={<Table />} title="Collecting rows" description="Rows appear here as the assistant extracts them." />;
  }
  const conflicts = Object.keys(s.conflicts).length;
  const index = new Map(s.rows.map((r, i) => [r.id, i + 1]));

  const columns: ColumnDef<StudioRow>[] = [
    { id: '#', header: '#', accessorFn: (r) => index.get(r.id), meta: { mono: true, align: 'right' }, enableSorting: false },
    ...s.columns.map<ColumnDef<StudioRow>>((c) => ({
      id: c.key,
      accessorFn: (r) => r[c.key],
      header: () => (
        <Stack direction="row" gap="xs">
          {c.label}
          <Badge variant="outline" tone="muted">
            {c.type === 'number' ? '123' : 'abc'}
          </Badge>
        </Stack>
      ),
      cell: (ctx) => {
        const row = ctx.row.original;
        const value = c.key === 'type' && row.type ? row.type : fmt(ctx.getValue(), c.key);
        return <CellView value={String(value)} status={cellStatus(s, row, c.key).status} />;
      },
      meta: {
        editable: true,
        editType: c.type === 'number' ? 'number' : 'text',
        align: c.type === 'number' ? 'right' : undefined,
        mono: c.type === 'number',
      },
    })),
    {
      id: 'sources',
      header: 'Sources',
      enableSorting: false,
      accessorFn: (r) => r.src.join(' '),
      cell: (ctx) => (
        <Stack direction="row" gap="xs">
          {ctx.row.original.src.map((x) => (
            <Badge key={x} variant="soft" tone="primary">
              {x}
            </Badge>
          ))}
        </Stack>
      ),
    },
  ];

  const filters: TableFilter<StudioRow>[] = s.columns.some((c) => c.key === 'type') ? [{ id: 'type', label: 'Type', single: true }] : [];

  const onCellEdit = ({ row, columnId, value }: CellEdit<StudioRow>) => {
    const column = s.columns.find((c) => c.key === columnId);
    if (!column) return;
    const next = column.type === 'number' ? (value == null || value === '' ? '' : Number(value)) : String(value ?? '').trim();
    if (next !== row[columnId]) onEdit({ row: row.id, column: columnId }, next as Value);
  };

  return (
    <Stack gap="none">
      <RecordHeader
        crumbs={[s.name]}
        chips={
          <>
            {s.saved ? <Badge tone="success">Saved {s.version}</Badge> : <Badge tone="muted">Draft</Badge>}
            <Badge variant="outline" tone="muted">
              {plural(s.rows.length, 'row')} · {plural(s.columns.length, 'column')} · {plural(sourceCount(s), 'source')}
            </Badge>
            {conflicts ? <Badge tone="warning">{plural(conflicts, 'conflict')}</Badge> : null}
            <Badge variant="outline" tone="warning">
              Sample data: names, figures and sources are fictional
            </Badge>
          </>
        }
        actions={
          <Button size="sm" onClick={onSave}>
            <Save />
            {s.saved ? 'Save new version' : 'Save dataset'}
          </Button>
        }
      />
      <PaginatedTable<StudioRow>
        columns={columns}
        data={s.rows}
        getRowId={(r) => r.id}
        density="compact"
        seamless
        searchPlaceholder="Search rows"
        filters={filters}
        noun="varieties"
        pageSize={50}
        editTrigger="dblclick"
        onCellEdit={onCellEdit}
        onCellClick={(row, columnId) => s.columns.some((c) => c.key === columnId) && onPick({ row: row.id, column: columnId })}
        isCellHighlighted={(row, columnId) =>
          (picked?.row === row.id && picked.column === columnId) || cellKey(row.id, columnId) in s.conflicts
        }
        toolbar={
          <Button variant="outline" size="sm" onClick={onAddColumn}>
            <Plus />
            Column
          </Button>
        }
      />
    </Stack>
  );
}

/**
 * Where a cell's value came from: its sources, how sure the research is, and — when the sources
 * disagree — each value with its source, to keep one.
 */
export function ProvenancePanel({
  cell,
  onClose,
  onResolve,
  onSearchAgain,
}: {
  cell: PickedCell;
  onClose: () => void;
  onResolve: (cell: PickedCell, option: number) => void;
  onSearchAgain: (cell: PickedCell) => void;
}) {
  const s = useDataset();
  const row = s.rows.find((r) => r.id === cell.row);
  const column = s.columns.find((c) => c.key === cell.column);
  if (!row || !column) return null;
  const info = cellStatus(s, row, cell.column);
  const value = fmt(row[cell.column], cell.column) || '—';
  const badge = {
    ok: info.status === 'ok' ? <Badge tone="success">Confidence {Math.round(info.confidence * 100)}%</Badge> : null,
    conflict: <Badge tone="warning">Sources disagree</Badge>,
    edited: <Badge tone="primary">Edited by you</Badge>,
    missing: <Badge tone="warning">No source found</Badge>,
    manual: <Badge tone="muted">Entered by you</Badge>,
  }[info.status];
  const sources = info.status === 'ok' ? info.sources : row.src;
  const quote = (source: number) => {
    const said = info.status === 'conflict' ? info.options.find((o) => o.source === source)?.value : row[cell.column];
    return cell.column === 'name'
      ? `…${row.name} (${row.type}), released ${row.year}…`
      : `…${row.name}: ${column.label.toLowerCase()} ${fmt(said, cell.column) || 'not stated'}…`;
  };

  return (
    <FloatingPanel title={`${column.label} · ${row.name}`} aside={value} summary={value} onClose={onClose} bodyClassName="p-3">
      <Stack gap="sm">
        <Stack direction="row" gap="xs">
          {badge}
        </Stack>
        {info.status === 'conflict' ? (
          <CitationList note="Pick the value to keep. The other stays on record." noteTone="warning">
            {info.options.map((o, i) => (
              <CitationRow
                key={o.source}
                marker={o.source}
                kind={sourceOf(o.source).kind}
                source={sourceOf(o.source).host}
                detail={
                  <Button variant="outline" size="xs" onClick={() => onResolve(cell, i)}>
                    Use this
                  </Button>
                }
              >
                {fmt(o.value, cell.column)}
              </CitationRow>
            ))}
          </CitationList>
        ) : null}
        {info.status === 'missing' ? (
          <Stack gap="xs">
            None of the sources named a value for this cell.
            <Button variant="outline" size="sm" onClick={() => onSearchAgain(cell)}>
              Ask assistant to search again
            </Button>
          </Stack>
        ) : null}
        {info.status === 'edited' ? 'You changed this value. The original sources for this row are listed below.' : null}
        <CitationList note={`Retrieved ${DATA.retrieved}`}>
          {sources.map((x) => (
            <CitationRow key={x} marker={x} kind={sourceOf(x).kind} source={sourceOf(x).host} detail={quote(x)}>
              {sourceOf(x).title}
            </CitationRow>
          ))}
        </CitationList>
      </Stack>
    </FloatingPanel>
  );
}
