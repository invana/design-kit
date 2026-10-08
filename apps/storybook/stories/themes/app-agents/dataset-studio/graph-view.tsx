import * as React from 'react';
import {
  BackgroundLayer,
  CanvasThemeSync,
  ClickSelectBehaviour,
  D3ForceLayout,
  DragNodeBehaviour,
  DragPanBehaviour,
  EdgeLabelLODBehaviour,
  GraphCanvas,
  GraphLayer,
  HoverActivateBehaviour,
  HoverElementPreviewBehaviour,
  LabelCollisionBehaviour,
  NodeLabelLODBehaviour,
  TextResolutionLODBehaviour,
  ThemeBehaviour,
  WheelZoomBehaviour,
  useSelection,
  type CanvasConfig,
  type GraphLayerProps,
} from '@invana/canvas-react';
import type { GraphCanvas as GraphEngine, GraphData, GraphEdge, GraphNode } from '@invana/graph';

/**
 * A graph drawn by the canvas engine (`@invana/canvas-react`, linked from the canvas repo):
 * force layout, drag, pan and zoom, hover lighting a node's neighbours, click to select. The
 * colour of a node is its type's, read from the theme's data tokens so it follows the theme.
 * Labels are re-rastered as the camera zooms in, so they stay sharp; they keep a readable size
 * on screen, hide when zoomed far out (the best-connected stay) and give way where they overlap.
 */

export interface ViewNode {
  id: string;
  type: string;
  label: string;
  /** Larger for the row node. */
  size?: number;
}
export interface ViewEdge {
  id: string;
  source: string;
  target: string;
  type: string;
}

/** What a click picked on the canvas: a node, or an edge (by its view id). */
export type GraphPick = { kind: 'node' | 'edge'; id: string };

export interface GraphViewHandle {
  relayout: () => void;
}

const CONFIG: CanvasConfig = {
  activeLayout: 'force',
  layouts: {
    force: { charge: { strength: -260 }, link: { distance: 90 }, collide: { radius: 28 }, center: { x: 0, y: 0 }, animate: true },
  },
};

let pixel: CanvasRenderingContext2D | null = null;
/** A CSS colour — a token, `var()` — as the `0xRRGGBB` number the canvas paints with. */
function toHex(css: string): number {
  const probe = document.createElement('span');
  probe.style.color = css;
  probe.style.display = 'none';
  document.body.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  probe.remove();
  // Painted to one pixel and read back: the one form every colour space comes out as.
  pixel ??= Object.assign(document.createElement('canvas'), { width: 1, height: 1 }).getContext('2d', { willReadFrequently: true });
  if (!pixel) return 0x888888;
  pixel.clearRect(0, 0, 1, 1);
  pixel.fillStyle = computed;
  pixel.fillRect(0, 0, 1, 1);
  const [r, g, b] = pixel.getImageData(0, 0, 1, 1).data;
  return (r! << 16) | (g! << 8) | b!;
}

/**
 * Bumps when the theme on `<html>` changes — after it lands, so the tokens read are the new
 * ones (the provider applies a theme in an effect, after its children render). Works under any
 * theme source: the story's provider or Storybook's toolbar.
 */
function useThemeVersion() {
  const [version, setVersion] = React.useState(0);
  React.useEffect(() => {
    const html = document.documentElement;
    const observer = new MutationObserver(() => setVersion((v) => v + 1));
    observer.observe(html, { attributes: true, attributeFilter: ['class', 'data-theme', 'style'] });
    return () => observer.disconnect();
  }, []);
  return version;
}

/** Reports the selection to the host — a node, else an edge; a click on nothing clears it. */
function SelectionBridge({ onChange }: { onChange: (pick: GraphPick | null) => void }) {
  const { selectedNodeIds, selectedEdgeIds } = useSelection({ clickSelectId: 'select' });
  const node = selectedNodeIds[0];
  const edge = selectedEdgeIds[0];
  const key = node ? `node:${node}` : edge ? `edge:${edge}` : '';
  React.useEffect(() => onChange(node ? { kind: 'node', id: node } : edge ? { kind: 'edge', id: edge } : null), [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

export const GraphView = React.forwardRef<
  GraphViewHandle,
  {
    nodes: ViewNode[];
    edges: ViewEdge[];
    /** A node type's colour, as CSS — `var(--color-data-1)`. */
    palette: Record<string, string>;
    onSelect?: (pick: GraphPick | null) => void;
    /** Draw every edge's type, not only when hovered — a schema. */
    edgeLabels?: boolean;
    /** A glance at a hovered node or edge, by id — a card that follows it as the camera moves. */
    preview?: (pick: GraphPick) => React.ReactNode;
  }
>(function GraphView({ nodes, edges, palette, onSelect, edgeLabels = false, preview }, ref) {
  const engine = React.useRef<GraphEngine>(null);
  React.useImperativeHandle(ref, () => ({ relayout: () => void engine.current?.runActiveLayout({ fitCamera: true }) }), []);
  const theme = useThemeVersion();

  // The palette, and the marks of hover and selection, in the theme's colours: the engine's own
  // are fixed (a near-black hovered edge, a white ring), which vanish on one theme or the other.
  const colours = React.useMemo(() => {
    void theme;
    return Object.fromEntries(Object.entries(palette).map(([type, css]) => [type, toHex(css)]));
  }, [palette, theme]);
  const marks = React.useMemo(() => {
    void theme;
    return { ink: toHex('var(--color-foreground)'), accent: toHex('var(--color-primary)') };
  }, [theme]);
  const node: GraphLayerProps['node'] = React.useMemo(
    () => ({
      style: {
        shape: { kind: 'circle', radius: 12 },
        size: (n: GraphNode) => (n.data as { size?: number })?.size ?? 10,
        bgFill: (n: GraphNode) => colours[n.type] ?? 0x8b94a3,
        bgStrokeWidth: 2,
        labelText: (n: GraphNode) => (n.data as { label?: string })?.label ?? n.id,
        labelPlacement: 'bottom',
        labelOffsetY: 6,
        labelFontSize: 11,
      },
      // The canonical slots by id, so these replace the engine's rings rather than add to them.
      state: {
        hovered: { decorations: [{ kind: 'ring', id: 'canonical-hover-ring', color: marks.ink, width: 1.5, gap: 3, alpha: 0.85 }] },
        selected: {
          decorations: [
            { kind: 'ring', id: 'canonical-select-ring', color: marks.accent, width: 2, gap: 4, alpha: 1 },
            { kind: 'glow', id: 'canonical-select-halo', color: marks.accent, strokeWidth: 18, innerAlpha: 0.3, layers: 3 },
          ],
        },
      },
    }),
    [colours, marks],
  );
  const edge: GraphLayerProps['edge'] = React.useMemo(
    () => ({
      style: {
        strokeWidth: 1.3,
        arrowTargetShape: 'triangle',
        ...(edgeLabels ? { labelText: (e: GraphEdge) => e.type, labelFontSize: 10 } : {}),
      },
      state: {
        hovered: { strokeColor: marks.ink, arrowTargetColor: marks.ink, strokeWidth: 2 },
        selected: { strokeColor: marks.accent, arrowTargetColor: marks.accent, strokeWidth: 2.5 },
      },
    }),
    [edgeLabels, marks],
  );
  // The data's identity is its ids — a new list of the same nodes keeps the layout.
  const signature = nodes.map((n) => `${n.id}:${n.label}`).join('|') + '#' + edges.map((e) => e.id).join('|');
  const data: GraphData = React.useMemo(
    () => ({
      nodes: nodes.map((n) => ({ id: n.id, type: n.type, data: { label: n.label, size: n.size } })),
      edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target, type: e.type })),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signature],
  );
  const select = React.useCallback((pick: GraphPick | null) => onSelect?.(pick), [onSelect]);

  // A layer's style is set when it is made, and the behaviours hold the layer they were given,
  // so a new theme draws the whole canvas afresh rather than only its layer.
  return (
    <GraphCanvas key={theme} ref={engine} autoResize config={CONFIG}>
      <BackgroundLayer id="bg" type="pattern" patternType="dots" />
      <ThemeBehaviour id="theme" />
      <CanvasThemeSync />
      {/* An edge is a few px wide: picking it falls back to the nearest within 8px. */}
      <GraphLayer key={String(edgeLabels)} id="graph" data={data} node={node} edge={edge} hitFloorPx={8} />
      <D3ForceLayout id="force" targetLayerId="graph" />
      <DragPanBehaviour id="pan" />
      <WheelZoomBehaviour id="wheel" />
      <DragNodeBehaviour id="drag-node" targetLayerId="graph" pinOnRelease />
      <HoverActivateBehaviour id="hover" targetLayerId="graph" degree={1} inactiveState="dimmed" />
      <ClickSelectBehaviour id="select" targetLayerId="graph" unselectedState="dimmed" />
      <TextResolutionLODBehaviour id="text-resolution" targetLayerId="graph" />
      <NodeLabelLODBehaviour id="node-labels" targetLayerId="graph" minZoom={0.35} alwaysShowTop={0.2} zoomGrowth={0.5} minFontPx={10} maxFontPx={15} />
      {edgeLabels ? <EdgeLabelLODBehaviour id="edge-labels" targetLayerId="graph" zoomGrowth={0.5} minFontPx={9} maxFontPx={12} /> : null}
      <LabelCollisionBehaviour id="label-collision" targetLayerId="graph" />
      {onSelect ? <SelectionBridge onChange={select} /> : null}
      {preview ? (
        <HoverElementPreviewBehaviour
          id="preview"
          targetLayerId="graph"
          enabled
          openDelay={300}
          renderNode={(n) => <>{preview({ kind: 'node', id: n.id })}</>}
          renderEdge={(e) => <>{preview({ kind: 'edge', id: e.id })}</>}
        />
      ) : null}
    </GraphCanvas>
  );
});

/** A canvas needs a height to draw in. */
export function GraphFrame({ children, height = 320 }: { children: React.ReactNode; height?: number | string }) {
  return <div style={{ height, minWidth: 0, width: '100%' }}>{children}</div>;
}
