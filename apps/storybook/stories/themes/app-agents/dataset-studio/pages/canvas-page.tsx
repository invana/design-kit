import * as React from 'react';
import { Badge, Button, EmptyState, FloatingPanel, Legend, LegendItem, PanelBox, PropertyList, PropertyRow, Stack } from '@invana/ui';
import { GitBranch, Maximize2, Shapes } from 'lucide-react';

import { usePlayable, useReduced } from '../../playbook/playbook';
import { DATA, plural, sourceOf } from '../data';
import { canvasOps, EMPTY_CANVAS, type CanvasState, type Graph } from '../ops/graph-ops';
import { GraphFrame, GraphView, type GraphViewHandle } from '../graph-view';
import { useDataset, useGraph } from '../work';

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
  selected: string | null;
  onSelect: (id: string | null) => void;
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
    ? graph.edges.filter((e) => set.has(e.source) && set.has(e.target)).map((e) => ({ id: `${e.source}|${e.type}|${e.target}`, ...e }))
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
          <GraphView ref={view} nodes={nodes} edges={edges} palette={DATA.palette} onSelect={onSelect} />
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
      {selected && !shown.includes(selected) ? <Deselect onSelect={onSelect} /> : null}
    </PanelBox>
  );
}

/** A selection the canvas no longer shows is dropped. */
function Deselect({ onSelect }: { onSelect: (id: null) => void }) {
  React.useEffect(() => onSelect(null), [onSelect]);
  return null;
}

/** A node's details: its properties, how it is connected, its sources; grow the canvas from it or ask about it. */
export function NodePanel({
  id,
  graph,
  onClose,
  onExpand,
  onAsk,
}: {
  id: string;
  graph: Graph;
  onClose: () => void;
  onExpand: (id: string) => void;
  onAsk: (name: string) => void;
}) {
  const dataset = useDataset();
  const node = graph.nodes[id];
  if (!node) return null;
  const rels = graph.edges.filter((e) => e.source === id || e.target === id).length;
  const row = node.label === 'Variety' ? dataset.rows.find((r) => r.id === node.rows[0]) : undefined;
  const props = Object.entries(node.props).filter(([k]) => k !== 'name');
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
      <Stack gap="sm">
        {props.length ? (
          <PropertyList>
            {props.map(([k, v]) => (
              <PropertyRow key={k} label={k} mono>
                {k === 'yieldQHa' && typeof v === 'number' ? v.toFixed(1) : String(v ?? '—')}
              </PropertyRow>
            ))}
          </PropertyList>
        ) : null}
        {plural(rels, 'relationship')}
        {node.label !== 'Variety' ? ` · ${plural(node.rows.length, 'source row')}` : ''}
        {row ? (
          <Stack direction="row" gap="xs" wrap>
            Sources
            {row.src.map((x) => (
              <Badge key={x} variant="soft" tone="primary" title={sourceOf(x).title}>
                {x}
              </Badge>
            ))}
          </Stack>
        ) : null}
      </Stack>
    </FloatingPanel>
  );
}
