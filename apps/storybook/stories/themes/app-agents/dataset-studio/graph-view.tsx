import * as React from 'react';
import {
  BackgroundLayer,
  CanvasThemeSync,
  ClickSelectBehaviour,
  D3ForceLayout,
  DragNodeBehaviour,
  DragPanBehaviour,
  GraphCanvas,
  GraphLayer,
  HoverActivateBehaviour,
  ThemeBehaviour,
  WheelZoomBehaviour,
  useSelection,
  type CanvasConfig,
  type GraphLayerProps,
} from '@invana/canvas-react';
import type { GraphCanvas as GraphEngine, GraphData, GraphEdge, GraphNode } from '@invana/graph';
import { useThemeOptional } from '@invana/themes';

/**
 * A graph drawn by the canvas engine (`@invana/canvas-react`, linked from the canvas repo):
 * force layout, drag, pan and zoom, hover lighting a node's neighbours, click to select. The
 * colour of a node is its type's, read from the theme's data tokens so it follows the theme.
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
  const mode = useThemeOptional()?.variantId ?? 'light';

  // The palette in the theme's colours; a new theme draws the layer afresh.
  const colours = React.useMemo(() => {
    void mode;
    return Object.fromEntries(Object.entries(palette).map(([type, css]) => [type, toHex(css)]));
  }, [palette, mode]);
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

  return (
    <GraphCanvas ref={engine} autoResize config={CONFIG}>
      <BackgroundLayer id="bg" type="pattern" patternType="dots" />
      <ThemeBehaviour id="theme" />
      <CanvasThemeSync />
      <GraphLayer key={`${mode}-${edgeLabels}`} id="graph" data={data} node={node} edge={edge} />
      <D3ForceLayout id="force" targetLayerId="graph" />
      <DragPanBehaviour id="pan" />
      <WheelZoomBehaviour id="wheel" />
      <DragNodeBehaviour id="drag-node" targetLayerId="graph" pinOnRelease />
      <HoverActivateBehaviour id="hover" targetLayerId="graph" degree={1} inactiveState="dimmed" />
      <ClickSelectBehaviour id="select" targetLayerId="graph" unselectedState="dimmed" />
      {onSelect ? <SelectionBridge onChange={select} /> : null}
    </GraphCanvas>
  );
});
