import * as React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Form, ObjectField, type FieldConfig } from '@invana/forms';
import { DataTable, type CellEdit, type ColumnDef } from '@invana/tables';
import {
  Badge,
  Button,
  CaveatNote,
  EmptyState,
  Legend,
  LegendItem,
  PanelBox,
  PanelContent,
  RecordHeader,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  SegmentedControl,
  Stack,
} from '@invana/ui';
import { FileJson, Network, Play, Plus, Table, Trash2 } from 'lucide-react';

import { DATA, plural, type GraphModel } from '../data';
import { validateModel } from '../ops/model-ops';
import { GraphFrame, GraphView } from '../graph-view';
import { useDataset, useModel } from '../work';

type View = 'form' | 'map' | 'file';

const VIEWS = [
  { value: 'form', label: 'Form' },
  { value: 'map', label: 'Column mapping' },
  { value: 'file', label: 'Model file' },
];

/** The schema as the canvas draws it: a node per type, an edge per relationship. */
function SchemaPreview({ model }: { model: GraphModel }) {
  const nodes = model.nodes.map((n, i) => ({
    id: n.label,
    type: n.label,
    label: `${n.label} · ${plural(n.props.length, 'prop')}`,
    size: i === 0 ? 16 : 11,
  }));
  const edges = model.rels
    .filter((r) => model.nodes.some((n) => n.label === r.from) && model.nodes.some((n) => n.label === r.to))
    .map((r, i) => ({
      id: `${i}`,
      source: r.from,
      target: r.to,
      type: r.type,
    }));
  return <GraphView nodes={nodes} edges={edges} palette={DATA.palette} edgeLabels />;
}

/**
 * The model as a form, from the forms generator: each node type's label and key, its
 * properties (name ← column), and the relationships. Edits are held until `Apply`, then sent as
 * one step by the reader.
 */
function ModelForm({
  model,
  columns,
  onChange,
}: {
  model: GraphModel;
  columns: { value: string; label: string }[];
  onChange: (m: GraphModel, title: string) => void;
}) {
  const form = useForm<GraphModel>({ values: model });
  const live = useWatch({ control: form.control }) as GraphModel;
  const labels = (live.nodes ?? model.nodes).map((n) => ({
    value: n.label,
    label: n.label || '—',
  }));
  const nodeFields: FieldConfig[] = [
    { name: 'label', label: 'Label', type: 'text', row: 'n' },
    {
      name: 'key',
      label: 'Key column',
      type: 'select',
      options: columns,
      row: 'n',
    },
  ];
  const propFields: FieldConfig[] = [
    { name: 'name', label: 'Property', type: 'text', row: 'p' },
    {
      name: 'column',
      label: '← column',
      type: 'select',
      options: columns,
      row: 'p',
    },
  ];
  const relFields: FieldConfig[] = [
    { name: 'from', label: 'From', type: 'select', options: labels, row: 'r' },
    { name: 'type', label: 'Type', type: 'text', row: 'r' },
    { name: 'to', label: 'To', type: 'select', options: labels, row: 'r' },
  ];
  // Renaming a node takes its relationships with it.
  const apply = form.handleSubmit((next) => {
    const renamed = new Map(model.nodes.map((n, i) => [n.label, next.nodes[i]?.label ?? n.label]));
    const rels = next.rels.map((r, i) =>
      model.rels[i] && r.from === model.rels[i]!.from && r.to === model.rels[i]!.to
        ? {
            ...r,
            from: renamed.get(r.from) ?? r.from,
            to: renamed.get(r.to) ?? r.to,
          }
        : r,
    );
    onChange(
      {
        nodes: next.nodes,
        rels: rels.map((r) => ({
          ...r,
          type: r.type.trim().toUpperCase().replace(/\s+/g, '_'),
        })),
      },
      'Edit the model',
    );
  });
  const remove = (m: GraphModel, title: string) => onChange(m, title);

  return (
    <Form {...form}>
      <Stack gap="md">
        {model.nodes.map((n, i) => (
          <PanelBox
            key={i}
            title={
              <Legend>
                <LegendItem color={DATA.palette[n.label]} label={n.label} />
              </Legend>
            }
            aside={
              i === 0 ? (
                <Badge tone="muted">row node</Badge>
              ) : (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label={`Remove ${n.label}`}
                  onClick={() =>
                    remove(
                      {
                        nodes: model.nodes.filter((_, j) => j !== i),
                        rels: model.rels.filter((r) => r.from !== n.label && r.to !== n.label),
                      },
                      `Remove ${n.label}`,
                    )
                  }
                >
                  <Trash2 />
                </Button>
              )
            }
          >
            <Stack gap="sm">
              <ObjectField
                control={form.control}
                name={`nodes.${i}`}
                fields={nodeFields}
                rowConfig={[{ id: 'n', fields: ['label', 'key'] }]}
                labelPosition="top"
                fit="container"
              />
              {n.props.map((_, j) => (
                <Stack key={j} direction="row" gap="xs" align="end">
                  <ObjectField
                    control={form.control}
                    name={`nodes.${i}.props.${j}`}
                    fields={propFields}
                    rowConfig={[{ id: 'p', fields: ['name', 'column'] }]}
                    labelPosition="top"
                    fit="container"
                  />
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Remove property"
                    onClick={() =>
                      remove(
                        {
                          ...model,
                          nodes: model.nodes.map((x, k) =>
                            k === i
                              ? {
                                  ...x,
                                  props: x.props.filter((_, q) => q !== j),
                                }
                              : x,
                          ),
                        },
                        `Remove ${n.label}.${n.props[j]!.name}`,
                      )
                    }
                  >
                    <Trash2 />
                  </Button>
                </Stack>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  remove(
                    {
                      ...model,
                      nodes: model.nodes.map((x, k) =>
                        k === i
                          ? {
                              ...x,
                              props: [...x.props, { name: '', column: columns[0]!.value }],
                            }
                          : x,
                      ),
                    },
                    `Add a property to ${n.label}`,
                  )
                }
              >
                <Plus />
                Property
              </Button>
            </Stack>
          </PanelBox>
        ))}
        <Stack direction="row" gap="sm">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              remove(
                {
                  ...model,
                  nodes: [
                    ...model.nodes,
                    {
                      label: `NewNode${model.nodes.length}`,
                      key: columns[0]!.value,
                      props: [{ name: 'name', column: columns[0]!.value }],
                    },
                  ],
                },
                'Add a node type',
              )
            }
          >
            <Plus />
            Node type
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              remove(
                {
                  ...model,
                  rels: [
                    ...model.rels,
                    {
                      from: model.nodes[0]!.label,
                      type: 'RELATED_TO',
                      to: model.nodes[1]?.label ?? model.nodes[0]!.label,
                    },
                  ],
                },
                'Add a relationship',
              )
            }
          >
            <Plus />
            Relationship
          </Button>
        </Stack>
        <PanelBox title="Relationships">
          <Stack gap="sm">
            {model.rels.map((r, k) => (
              <Stack key={k} direction="row" gap="xs" align="end">
                <ObjectField
                  control={form.control}
                  name={`rels.${k}`}
                  fields={relFields}
                  rowConfig={[{ id: 'r', fields: ['from', 'type', 'to'] }]}
                  columns={3}
                  labelPosition="top"
                  fit="container"
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Remove relationship"
                  onClick={() => remove({ ...model, rels: model.rels.filter((_, q) => q !== k) }, `Remove ${r.type}`)}
                >
                  <Trash2 />
                </Button>
              </Stack>
            ))}
          </Stack>
        </PanelBox>
        <Stack direction="row" gap="sm">
          <Button size="sm" disabled={!form.formState.isDirty} onClick={() => void apply()}>
            Apply changes
          </Button>
          <Button variant="ghost" size="sm" disabled={!form.formState.isDirty} onClick={() => form.reset(model)}>
            Discard
          </Button>
        </Stack>
      </Stack>
    </Form>
  );
}

/** Each column of the dataset and the node type it fills; a column that keys a node makes that node. */
function ColumnMapping({
  model,
  columns,
  onChange,
}: {
  model: GraphModel;
  columns: { key: string; label: string }[];
  onChange: (m: GraphModel, title: string) => void;
}) {
  type Row = { key: string; column: string; mapsTo: string; property: string };
  const rows: Row[] = columns.map((c) => {
    const keyOf = model.nodes.find((n, i) => i > 0 && n.key === c.key);
    const owner = model.nodes.find((n) => n.props.some((p) => p.column === c.key));
    return {
      key: c.key,
      column: c.label,
      mapsTo: keyOf ? `${keyOf.label} (key)` : (owner?.label ?? ''),
      property: owner?.props.find((p) => p.column === c.key)?.name ?? '',
    };
  });
  const options = [{ value: '', label: 'Not mapped' }, ...model.nodes.map((n) => ({ value: n.label, label: n.label }))];
  const table: ColumnDef<Row>[] = [
    { accessorKey: 'column', header: 'Dataset column' },
    {
      accessorKey: 'mapsTo',
      header: 'Maps to',
      meta: { editable: true, editType: 'select', options },
    },
    { accessorKey: 'property', header: 'Property', meta: { mono: true } },
  ];
  const onCellEdit = ({ row, value }: CellEdit<Row>) => {
    const to = String(value ?? '');
    const nodes = model.nodes.map((n) => ({
      ...n,
      props: n.props.filter((p) => p.column !== row.key || n.key === row.key),
    }));
    const target = nodes.find((n) => n.label === to);
    if (target) target.props = [...target.props, { name: row.key, column: row.key }];
    onChange({ ...model, nodes }, to ? `Map ${row.column} to ${to}` : `Unmap ${row.column}`);
  };
  return (
    <Stack gap="sm">
      Each dataset column maps to one node type. Columns set as a node's key create that node.
      <DataTable columns={table} data={rows} getRowId={(r) => r.key} density="compact" onCellEdit={onCellEdit} enableSorting={false} />
    </Stack>
  );
}

/** The model as JSON, from the forms generator's textarea; `Apply file` replaces the model. */
function ModelFile({ model, onChange }: { model: GraphModel; onChange: (m: GraphModel, title: string) => void }) {
  const form = useForm<{ file: { json: string } }>({
    values: { file: { json: JSON.stringify(model, null, 2) } },
  });
  const [error, setError] = React.useState('');
  const fields: FieldConfig[] = [
    {
      name: 'json',
      label: 'Model file',
      type: 'textarea',
      rows: 18,
      colSpan: 2,
    },
  ];
  const applyText = (text: string) => {
    try {
      const m = JSON.parse(text) as GraphModel;
      if (!Array.isArray(m.nodes) || !Array.isArray(m.rels) || !m.nodes.length)
        throw new Error('The file needs a “nodes” list and a “rels” list.');
      m.nodes.forEach((n) => {
        if (typeof n.label !== 'string' || !Array.isArray(n.props)) throw new Error('Each node needs a label and a props list.');
      });
      setError('');
      onChange(m, 'Apply a model file');
    } catch (e) {
      setError(e instanceof SyntaxError ? 'That isn’t valid JSON. Check for a missing comma or bracket.' : (e as Error).message);
    }
  };
  const load = (file: File | undefined) => void file?.text().then(applyText);
  return (
    <Form {...form}>
      <Stack gap="sm">
        Edit the model as JSON, or load a .json file. Apply replaces the current model.
        <ObjectField control={form.control} name="file" fields={fields} labelPosition="top" columns={2} />
        <Stack direction="row" gap="sm">
          <Button size="sm" onClick={() => applyText(form.getValues('file.json'))}>
            Apply file
          </Button>
          <Button variant="outline" size="sm" asChild>
            <label>
              <FileJson />
              Load .json
              <input type="file" accept=".json,application/json" hidden onChange={(e) => load(e.target.files?.[0])} />
            </label>
          </Button>
        </Stack>
        {error ? (
          <CaveatNote tone="warning" label="File">
            {error}
          </CaveatNote>
        ) : null}
      </Stack>
    </Form>
  );
}

export function ModelPage({ onChange, onImport }: { onChange: (m: GraphModel, title: string) => void; onImport: () => void }) {
  const { model } = useModel();
  const dataset = useDataset();
  const [view, setView] = React.useState<View>('form');
  if (!model)
    return (
      <EmptyState icon={<Network />} title="No model yet" description="Ask the assistant to turn a saved dataset into a graph model." />
    );
  const issues = validateModel(model, dataset.columns);
  const columns = dataset.columns.map((c) => ({
    value: c.key,
    label: c.label,
  }));

  return (
    <Stack gap="none" fill>
      <RecordHeader
        crumbs={['Chickpea graph model']}
        chips={
          <>
            <Badge variant="outline" tone="muted">
              from {dataset.name} {dataset.version}
            </Badge>
            <Badge variant="outline" tone="muted">
              {plural(model.nodes.length, 'node type')} · {plural(model.rels.length, 'relationship')}
            </Badge>
            {issues.length ? <Badge tone="warning">{plural(issues.length, 'issue')}</Badge> : <Badge tone="success">Valid</Badge>}
          </>
        }
        actions={
          <>
            <SegmentedControl size="sm" options={VIEWS} value={view} onValueChange={(v) => setView(v as View)} />
            <Button size="sm" onClick={onImport}>
              <Play />
              Import dataset
            </Button>
          </>
        }
      />
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize="58%" minSize="320px">
          <PanelContent titleText={VIEWS.find((v) => v.value === view)!.label}>
            <Stack gap="md">
              {issues.map((x) => (
                <CaveatNote key={x} tone="warning" label="Issue">
                  {x}
                </CaveatNote>
              ))}
              {view === 'form' ? <ModelForm key={JSON.stringify(model)} model={model} columns={columns} onChange={onChange} /> : null}
              {view === 'map' ? <ColumnMapping model={model} columns={dataset.columns} onChange={onChange} /> : null}
              {view === 'file' ? <ModelFile model={model} onChange={onChange} /> : null}
            </Stack>
          </PanelContent>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize="240px">
          <PanelBox title="Schema preview" aside={<Table />} flush fill>
            <GraphFrame height="100%">
              <SchemaPreview model={model} />
            </GraphFrame>
          </PanelBox>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Stack>
  );
}
