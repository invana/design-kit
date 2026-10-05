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

/** Reports the selection to the host; a click on nothing clears it. */
function SelectionBridge({ onChange }: { onChange: (id: string | null) => void }) {
  const { selectedNodeIds } = useSelection({ clickSelectId: 'select' });
  const first = selectedNodeIds[0] ?? null;
  React.useEffect(() => onChange(first), [first, onChange]);
  return null;
}

export const GraphView = React.forwardRef<
  GraphViewHandle,
  {
    nodes: ViewNode[];
    edges: ViewEdge[];
    /** A node type's colour, as CSS — `var(--color-data-1)`. */
    palette: Record<string, string>;
    onSelect?: (id: string | null) => void;
    /** Draw every edge's type, not only when hovered — a schema. */
    edgeLabels?: boolean;
  }
>(function GraphView({ nodes, edges, palette, onSelect, edgeLabels = false }, ref) {
  const engine = React.useRef<GraphEngine>(null);
  React.useImperativeHandle(ref, () => ({ relayout: () => void engine.current?.runActiveLayout({ fitCamera: true }) }), []);
  const theme = useThemeVersion();

  // The palette in the theme's colours.
  const colours = React.useMemo(() => {
    void theme;
    return Object.fromEntries(Object.entries(palette).map(([type, css]) => [type, toHex(css)]));
  }, [palette, theme]);
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
    }),
    [colours],
  );
  const edge: GraphLayerProps['edge'] = React.useMemo(
    () => ({
      style: {
        strokeWidth: 1.3,
        arrowTargetShape: 'triangle',
        ...(edgeLabels ? { labelText: (e: GraphEdge) => e.type, labelFontSize: 10 } : {}),
      },
    }),
    [edgeLabels],
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
  const select = React.useCallback((id: string | null) => onSelect?.(id), [onSelect]);

  // A layer's style is set when it is made, and the behaviours hold the layer they were given,
  // so a new theme draws the whole canvas afresh rather than only its layer.
  return (
    <GraphCanvas key={theme} ref={engine} autoResize config={CONFIG}>
      <BackgroundLayer id="bg" type="pattern" patternType="dots" />
      <ThemeBehaviour id="theme" />
      <CanvasThemeSync />
      <GraphLayer key={String(edgeLabels)} id="graph" data={data} node={node} edge={edge} />
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
    </GraphCanvas>
  );
});

/** A canvas needs a height to draw in. */
export function GraphFrame({ children, height = 320 }: { children: React.ReactNode; height?: number | string }) {
  return <div style={{ height, minWidth: 0, width: '100%' }}>{children}</div>;
}
