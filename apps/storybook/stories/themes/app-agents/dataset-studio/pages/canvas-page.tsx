import * as React from 'react';
import {
  Badge,
  Button,
  EmptyState,
  Eyebrow,
  FloatingPanel,
  Legend,
  LegendItem,
  PanelBox,
  PropertyList,
  PropertyRow,
  Stack,
} from '@invana/ui';
import { GitBranch, Maximize2, Shapes } from 'lucide-react';

import { usePlayable, useReduced } from '../../playbook/playbook';
import { DATA, plural, sourceOf } from '../data';
import { canvasOps, EMPTY_CANVAS, type CanvasState, type Graph, type GraphEdgeRecord } from '../ops/graph-ops';
import { GraphFrame, GraphView, type GraphPick, type GraphViewHandle } from '../graph-view';
import { useDataset, useGraph } from '../work';

/** An edge's id on the canvas: its ends and its type. */
export const edgeId = (e: Pick<GraphEdgeRecord, 'source' | 'type' | 'target'>) => `${e.source}|${e.type}|${e.target}`;
const edgeOf = (graph: Graph, id: string) => graph.edges.find((e) => edgeId(e) === id);

/** What a session's canvas shows at the playbook's position. */
export function useCanvasState(sid: string): CanvasState {
  const { received } = usePlayable(`canvas:${sid}`);
  return useReduced(EMPTY_CANVAS, received, canvasOps.apply!);
}

export function CanvasPage({
  session,
  parent,
  selected,
  onSelect,
  onLoadAll,
  onClear,
}: {
  session: { id: string; name: string };
  parent?: string;
  selected: GraphPick | null;
  onSelect: (pick: GraphPick | null) => void;
  onLoadAll: () => void;
  onClear: () => void;
}) {
  const { graph } = useGraph();
  const { ids } = useCanvasState(session.id);
  const view = React.useRef<GraphViewHandle>(null);
  const shown = graph ? ids.filter((id) => graph.nodes[id]) : [];

  const nodes = graph
    ? shown.map((id) => ({
        id,
        type: graph.nodes[id]!.label,
        label: graph.nodes[id]!.name,
        size: graph.nodes[id]!.label === 'Variety' ? 14 : 10,
      }))
    : [];
  const set = new Set(shown);
  const edges = graph
    ? graph.edges.filter((e) => set.has(e.source) && set.has(e.target)).map((e) => ({ id: edgeId(e), ...e }))
    : [];

  return (
    <PanelBox
      title={
        <Stack direction="row" gap="xs">
          {parent ? <GitBranch /> : <Shapes />}
          {session.name}
          {parent ? <Badge tone="muted">branched from {parent}</Badge> : null}
          <Badge variant="outline" tone="muted">
            {plural(shown.length, 'node')}
          </Badge>
        </Stack>
      }
      aside={
        <Stack direction="row" gap="sm">
          <Legend>
            {Object.entries(DATA.palette).map(([label, color]) => (
              <LegendItem key={label} color={color} label={label} />
            ))}
          </Legend>
          <Button variant="outline" size="sm" disabled={!shown.length} onClick={() => view.current?.relayout()}>
            <Maximize2 />
            Re-layout
          </Button>
          <Button variant="outline" size="sm" disabled={!shown.length} onClick={onClear}>
            Clear
          </Button>
        </Stack>
      }
      flush
      fill
    >
      {shown.length && graph ? (
        <GraphFrame height="100%">
          <GraphView
            ref={view}
            nodes={nodes}
            edges={edges}
            palette={DATA.palette}
            onSelect={onSelect}
            preview={(pick) => <GraphPreview pick={pick} graph={graph} />}
          />
        </GraphFrame>
      ) : (
        <EmptyState
          icon={<Shapes />}
          title={graph ? 'This canvas is empty' : 'Nothing to show yet'}
          description={
            graph
              ? 'Ask a question in this session and choose “Show on canvas”, or load the whole graph.'
              : 'Once your dataset is imported into the graph model, results you ask for can be loaded here.'
          }
          actions={
            graph ? (
              <Button variant="outline" size="sm" onClick={onLoadAll}>
                Load whole graph
              </Button>
            ) : undefined
          }
        />
      )}
      {selected && !(selected.kind === 'node' ? set.has(selected.id) : edges.some((e) => e.id === selected.id)) ? (
        <Deselect onSelect={onSelect} />
      ) : null}
    </PanelBox>
  );
}

/** A selection the canvas no longer shows is dropped. */
function Deselect({ onSelect }: { onSelect: (pick: null) => void }) {
  React.useEffect(() => onSelect(null), [onSelect]);
  return null;
}

/** A node's properties as rows, its key value first (it is the name). */
function propRows(props: Record<string, unknown>, limit?: number) {
  const rows = Object.entries(props).filter(([k]) => k !== 'name');
  return (limit ? rows.slice(0, limit) : rows).map(([k, v]) => (
    <PropertyRow key={k} label={k} mono>
      {k === 'yieldQHa' && typeof v === 'number' ? v.toFixed(1) : String(v ?? '—')}
    </PropertyRow>
  ));
}

/** Where an edge came from: the row and the column that named its far end. */
function useEdgeOrigin(edge: GraphEdgeRecord) {
  const dataset = useDataset();
  const row = dataset.rows.find((r) => r.id === edge.row);
  const column = dataset.columns.find((c) => c.key === edge.column);
  return { row, column };
}

/**
 * The glance on hover: a node's type, name and first properties, or an edge's ends and type —
 * then where to click for the rest.
 */
function GraphPreview({ pick, graph }: { pick: GraphPick; graph: Graph }) {
  if (pick.kind === 'edge') {
    const edge = edgeOf(graph, pick.id);
    return edge ? <EdgePreview edge={edge} graph={graph} /> : null;
  }
  const node = graph.nodes[pick.id];
  if (!node) return null;
  const rels = graph.edges.filter((e) => e.source === node.id || e.target === node.id).length;
  return (
    <FloatingPanel
      title={
        <Legend>
          <LegendItem color={DATA.palette[node.label]} label={node.label} />
        </Legend>
      }
      aside={node.name}
      footer={`${plural(rels, 'relationship')} · click for every property`}
      bodyClassName="p-3"
    >
      {Object.keys(node.props).length > 1 ? <PropertyList>{propRows(node.props, 3)}</PropertyList> : null}
    </FloatingPanel>
  );
}

function EdgePreview({ edge, graph }: { edge: GraphEdgeRecord; graph: Graph }) {
  const { row, column } = useEdgeOrigin(edge);
  return (
    <FloatingPanel title="Relationship" aside={edge.type} footer="Click for details" bodyClassName="p-3">
      <PropertyList>
        <PropertyRow label="From">{graph.nodes[edge.source]?.name}</PropertyRow>
        <PropertyRow label="To">{graph.nodes[edge.target]?.name}</PropertyRow>
        {row && column ? <PropertyRow label="From the row">{`${row.name} · ${column.label}`}</PropertyRow> : null}
      </PropertyList>
    </FloatingPanel>
  );
}

/** A node in a list that opens it. */
function NodeLink({ graph, id, onPick }: { graph: Graph; id: string; onPick: (pick: GraphPick) => void }) {
  const node = graph.nodes[id];
  if (!node) return null;
  return (
    <Button variant="ghost" size="sm" onClick={() => onPick({ kind: 'node', id })}>
      <LegendItem color={DATA.palette[node.label]} label={node.name} />
    </Button>
  );
}

/**
 * A node's details: every property, its relationships by type (each opens the node at the far
 * end), its sources; grow the canvas from it or ask about it.
 */
export function NodePanel({
  id,
  graph,
  onClose,
  onPick,
  onExpand,
  onAsk,
}: {
  id: string;
  graph: Graph;
  onClose: () => void;
  onPick: (pick: GraphPick) => void;
  onExpand: (id: string) => void;
  onAsk: (name: string) => void;
}) {
  const dataset = useDataset();
  const node = graph.nodes[id];
  if (!node) return null;
  const rels = graph.edges.filter((e) => e.source === id || e.target === id);
  // Grouped by type and direction: `DEVELOPED_BY →`, `← DERIVED_FROM`.
  const groups = new Map<string, string[]>();
  rels.forEach((e) => {
    const out = e.source === id;
    const key = out ? `${e.type} →` : `← ${e.type}`;
    groups.set(key, [...(groups.get(key) ?? []), out ? e.target : e.source]);
  });
  const row = node.label === 'Variety' ? dataset.rows.find((r) => r.id === node.rows[0]) : undefined;
  return (
    <FloatingPanel
      title={
        <Legend>
          <LegendItem color={DATA.palette[node.label]} label={node.label} />
        </Legend>
      }
      aside={node.name}
      summary={node.name}
      onClose={onClose}
      bodyClassName="p-3"
      footer={
        <Stack direction="row" gap="xs">
          <Button variant="outline" size="sm" onClick={() => onExpand(id)}>
            Expand neighbours
          </Button>
          <Button variant="outline" size="sm" onClick={() => onAsk(node.name)}>
            Ask about this
          </Button>
        </Stack>
      }
    >
      <Stack gap="md">
        {Object.keys(node.props).length > 1 ? (
          <Stack gap="xs">
            <Eyebrow>Properties</Eyebrow>
            <PropertyList>{propRows(node.props)}</PropertyList>
          </Stack>
        ) : null}
        <Stack gap="xs">
          <Eyebrow aside={rels.length}>Relationships</Eyebrow>
          {[...groups].map(([type, ids]) => (
            <Stack key={type} gap="none">
              <Eyebrow tone="foreground">{type}</Eyebrow>
              <Stack direction="row" gap="none" wrap>
                {ids.map((x) => (
                  <NodeLink key={x} graph={graph} id={x} onPick={onPick} />
                ))}
              </Stack>
            </Stack>
          ))}
        </Stack>
        <Stack gap="xs">
          <Eyebrow>Sources</Eyebrow>
          {row ? (
            <Stack direction="row" gap="xs" wrap>
              {row.src.map((x) => (
                <Badge key={x} variant="soft" tone="primary" title={sourceOf(x).title}>
                  {x}
                </Badge>
              ))}
            </Stack>
          ) : (
            plural(node.rows.length, 'dataset row')
          )}
        </Stack>
      </Stack>
    </FloatingPanel>
  );
}

/** An edge's details: its two ends (each opens its node), its type, and the row and column it came from, with that row's sources. */
export function EdgePanel({
  id,
  graph,
  onClose,
  onPick,
  onAsk,
}: {
  id: string;
  graph: Graph;
  onClose: () => void;
  onPick: (pick: GraphPick) => void;
  onAsk: (question: string) => void;
}) {
  const edge = edgeOf(graph, id);
  if (!edge) return null;
  return <EdgeDetails edge={edge} graph={graph} onClose={onClose} onPick={onPick} onAsk={onAsk} />;
}

function EdgeDetails({
  edge,
  graph,
  onClose,
  onPick,
  onAsk,
}: {
  edge: GraphEdgeRecord;
  graph: Graph;
  onClose: () => void;
  onPick: (pick: GraphPick) => void;
  onAsk: (question: string) => void;
}) {
  const { row, column } = useEdgeOrigin(edge);
  const from = graph.nodes[edge.source];
  const to = graph.nodes[edge.target];
  return (
    <FloatingPanel
      title="Relationship"
      aside={edge.type}
      summary={edge.type}
      onClose={onClose}
      bodyClassName="p-3"
      footer={
        <Button variant="outline" size="sm" onClick={() => onAsk(`Why is ${from?.name} ${edge.type} ${to?.name}?`)}>
          Ask about this
        </Button>
      }
    >
      <Stack gap="md">
        <Stack direction="row" gap="xs" wrap>
          <NodeLink graph={graph} id={edge.source} onPick={onPick} />
          <Badge variant="outline" tone="muted">
            {edge.type} →
          </Badge>
          <NodeLink graph={graph} id={edge.target} onPick={onPick} />
        </Stack>
        <Stack gap="xs">
          <Eyebrow>Where it came from</Eyebrow>
          <PropertyList>
            <PropertyRow label="Dataset">{row ? 'Chickpea varieties' : '—'}</PropertyRow>
            <PropertyRow label="Row">{row?.name ?? '—'}</PropertyRow>
            <PropertyRow label="Column">{column?.label ?? edge.column}</PropertyRow>
            {row && column ? (
              <PropertyRow label="Value" mono>
                {String(row[column.key] ?? '—')}
              </PropertyRow>
            ) : null}
          </PropertyList>
        </Stack>
        {row ? (
          <Stack gap="xs">
            <Eyebrow>Sources</Eyebrow>
            <Stack direction="row" gap="xs" wrap>
              {row.src.map((x) => (
                <Badge key={x} variant="soft" tone="primary" title={sourceOf(x).title}>
                  {x}
                </Badge>
              ))}
            </Stack>
          </Stack>
        ) : null}
      </Stack>
    </FloatingPanel>
  );
}
