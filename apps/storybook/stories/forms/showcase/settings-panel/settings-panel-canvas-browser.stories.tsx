import { useEffect, useRef, useState } from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Card,
  CardContent,
} from '@invana/ui';
import { SettingsPanel, Switch, type ColorPreset, type FieldConfig } from '@invana/forms';

/**
 * A faithful design-kit rebuild of the canvas studio's `CanvasSettingsBrowser`:
 * a single **Canvas Settings** panel whose sections (**Layers** / **Behaviours**
 * / **Layouts**) are collapsible groups with a count, and whose **instance rows**
 * show the id + a muted type label + a status pill (`on` / `active`), each row
 * expanding in place to that editor's schema-driven form.
 *
 * The chrome is a nested `Accordion` (section → instance); the expanded editor is
 * a chrome-flattened `SettingsPanel`. Field schemas are ported verbatim from the
 * canvas `@invana/canvas-ui` editors (Background / Mini-map / D3-Force / ELK / …).
 * Several are **dynamic**: the Background layer's Pattern fields only appear for a
 * `pattern` fill, ELK's layer-spacing only for the `layered` algorithm,
 * Wheel-zoom's ease frames only while smooth-scroll is on — recomputed from each
 * editor's live values via `form.watch`. Defaults are synthesized from each
 * schema, so every editor is interactive standalone.
 */

const PRESETS: ColorPreset[] = [
  { label: 'Blue', value: '#3b82f6' },
  { label: 'Indigo', value: '#6366f1' },
  { label: 'Violet', value: '#8b5cf6' },
  { label: 'Emerald', value: '#10b981' },
  { label: 'Amber', value: '#f59e0b' },
  { label: 'Rose', value: '#f43f5e' },
  { label: 'Slate', value: '#64748b' },
  { label: 'White', value: '#ffffff', darkValue: '#0f172a' },
];

// ============================================================
// LAYERS
// ============================================================

function backgroundLayerFields(values: any = {}): FieldConfig[] {
  return [
    { name: 'type', type: 'select', label: 'Type', options: [{ value: 'solid', label: 'Solid' }, { value: 'pattern', label: 'Pattern' }], group: 'Fill' },
    { name: 'backgroundColor', type: 'color', label: 'Background color', presetColors: PRESETS, description: 'Solid backdrop painted behind the pattern.', group: 'Fill' },
    { name: 'mode', type: 'select', label: 'Theme mode', description: 'How light/dark colour variants resolve.', options: [{ value: 'auto', label: 'Auto (follow theme)' }, { value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }], group: 'Fill' },
    ...(values.type === 'pattern' ? [
      { name: 'patternType', type: 'select', label: 'Pattern', options: [{ value: 'dots', label: 'Dots' }, { value: 'grid', label: 'Grid' }, { value: 'lines', label: 'Lines' }], group: 'Pattern' },
      { name: 'color', type: 'color', label: 'Pattern color', presetColors: PRESETS, description: 'Dot / line / grid colour.', group: 'Pattern' },
      { name: 'size', type: 'number', label: 'Size', min: 0, max: 20, step: 0.5, description: 'Dot radius / line thickness, in texture pixels.', group: 'Pattern' },
      { name: 'spacing', type: 'number', label: 'Spacing', min: 1, max: 100, step: 1, description: 'Tile cell spacing, in texture pixels.', group: 'Pattern' },
      { name: 'alpha', type: 'number', label: 'Alpha', min: 0, max: 1, step: 0.01, group: 'Pattern' },
      { name: 'followCamera', type: 'boolean', label: 'Follow camera', description: 'Pattern shifts + scales with the camera when on.', group: 'Pattern' },
    ] as FieldConfig[] : []),
    { name: 'surfaceRole', type: 'text', label: 'Surface role', description: 'Palette role read for the backdrop on theme change. Default "surface".', group: 'Theme' },
    { name: 'patternRole', type: 'text', label: 'Pattern role', description: 'Palette role read for the pattern on theme change. Default "divider".', group: 'Theme' },
  ];
}

const devInfoLayerFields: FieldConfig[] = [
  { name: 'corner', type: 'select', label: 'Corner', description: 'Which corner the overlay anchors to.', options: [{ label: 'Top left', value: 'top-left' }, { label: 'Top right', value: 'top-right' }, { label: 'Bottom left', value: 'bottom-left' }, { label: 'Bottom right', value: 'bottom-right' }] },
  { name: 'marginX', type: 'number', label: 'Margin X', min: 0, step: 1, description: 'Horizontal inset from the corner, in px. Default 10.' },
  { name: 'marginY', type: 'number', label: 'Margin Y', min: 0, step: 1, description: 'Vertical inset from the corner, in px. Default 10.' },
  { name: 'fontSize', type: 'number', label: 'Font size', min: 6, max: 32, step: 1, description: 'Overlay text size in px. Default 11.' },
  { name: 'opacity', type: 'number', label: 'Opacity', min: 0, max: 1, step: 0.01, description: 'Panel opacity 0–1. Default 0.92.' },
  { name: 'backgroundColor', type: 'text', label: 'Background colour', description: "Overlay background CSS colour. Accepts rgba(). Default 'rgba(10,10,10,0.82)'." },
  { name: 'textColor', type: 'color', label: 'Text colour', description: "Overlay text colour. Default '#c8d3e0'." },
  { name: 'accentColor', type: 'color', label: 'Accent colour', description: "Header / accent colour. Default '#4fc3f7'." },
];

const miniMapLayerFields: FieldConfig[] = [
  { name: 'width', type: 'number', label: 'Width', min: 0, step: 10, description: 'Minimap width in screen px. Default 200.', group: 'Layout' },
  { name: 'height', type: 'number', label: 'Height', min: 0, step: 10, description: 'Minimap height in screen px. Default 150.', group: 'Layout' },
  { name: 'position', type: 'select', label: 'Position', description: 'Anchor corner inside the viewport.', options: [{ value: 'top-left', label: 'Top-left' }, { value: 'top-right', label: 'Top-right' }, { value: 'bottom-left', label: 'Bottom-left' }, { value: 'bottom-right', label: 'Bottom-right' }], group: 'Layout' },
  { name: 'margin', type: 'number', label: 'Margin', min: 0, step: 1, description: 'Symmetric inset from the corner, in screen px. Default 10.', group: 'Layout' },
  { name: 'padding', type: 'number', label: 'Padding', min: 0, step: 1, description: 'World-space padding around node bounds. Default 20.', group: 'Layout' },
  { name: 'enableDrag', type: 'boolean', label: 'Enable drag', description: 'Dragging the minimap pans the main camera.', group: 'Layout' },
  { name: 'mode', type: 'select', label: 'Theme mode', description: 'How light/dark colour variants resolve.', options: [{ value: 'auto', label: 'Auto (follow theme)' }, { value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }], group: 'Layout' },
  { name: 'backgroundColor', type: 'color', label: 'Background', presetColors: PRESETS, description: 'Backdrop fill. Default #1a1a2e.', group: 'Chrome' },
  { name: 'borderColor', type: 'color', label: 'Border color', presetColors: PRESETS, description: 'Border stroke colour. Default #444444.', group: 'Chrome' },
  { name: 'borderWidth', type: 'number', label: 'Border width', min: 0, step: 0.5, group: 'Chrome' },
  { name: 'viewportFill', type: 'color', label: 'Viewport fill', presetColors: PRESETS, description: 'Viewport indicator fill. Default #4a90d9.', group: 'Viewport' },
  { name: 'viewportStroke', type: 'color', label: 'Viewport stroke', presetColors: PRESETS, description: 'Viewport indicator stroke. Default #2a70b9.', group: 'Viewport' },
  { name: 'viewportFillAlpha', type: 'number', label: 'Viewport fill alpha', min: 0, max: 1, step: 0.05, group: 'Viewport' },
  { name: 'viewportStrokeWidth', type: 'number', label: 'Viewport stroke width', min: 0, step: 0.5, group: 'Viewport' },
];

const densityContourFillLayerFields: FieldConfig[] = [
  { name: 'bandwidth', type: 'number', label: 'Bandwidth', min: 1, max: 200, step: 1, description: 'Kernel bandwidth in world units. Larger = smoother, broader blobs.', group: 'Density' },
  { name: 'thresholds', type: 'number', label: 'Bands', min: 1, max: 60, step: 1, description: 'Number of iso-bands d3-contour computes.', group: 'Density' },
  { name: 'cellSize', type: 'number', label: 'Cell size', min: 1, max: 16, step: 1, description: 'Grid cell size in world units. Must be a power of two (1, 2, 4, 8, 16).', group: 'Density' },
  { name: 'padding', type: 'number', label: 'Padding', min: 0, max: 200, step: 1, description: 'Padding around the node bounding box before building the grid.', group: 'Density' },
  { name: 'palette', type: 'select', label: 'Palette', options: [{ value: 'blues', label: 'Blues' }, { value: 'greens', label: 'Greens' }, { value: 'oranges', label: 'Oranges' }, { value: 'purples', label: 'Purples' }, { value: 'reds', label: 'Reds' }, { value: 'viridis', label: 'Viridis' }, { value: 'plasma', label: 'Plasma' }, { value: 'magma', label: 'Magma' }, { value: 'inferno', label: 'Inferno' }, { value: 'warm', label: 'Warm' }, { value: 'cool', label: 'Cool' }], description: 'Named colour ramp for the bands, low-density to high-density.', group: 'Colour' },
  { name: 'paletteRangeStart', type: 'number', label: 'Palette start', min: 0, max: 1, step: 0.01, description: 'Ramp start fraction 0..1. Applied only when both start + end are set.', group: 'Colour' },
  { name: 'paletteRangeEnd', type: 'number', label: 'Palette end', min: 0, max: 1, step: 0.01, description: 'Ramp end fraction 0..1. Applied only when both start + end are set.', group: 'Colour' },
  { name: 'fillOpacity', type: 'number', label: 'Fill opacity', min: 0, max: 1, step: 0.01, description: 'Band fill alpha 0..1. Default 0.4.', group: 'Colour' },
  { name: 'recompute', type: 'select', label: 'Recompute', options: [{ value: 'auto', label: 'Auto (debounced)' }, { value: 'manual', label: 'Manual' }], description: 'How the overlay recomputes: on source changes (auto) or only on demand (manual).', group: 'Lifecycle' },
  { name: 'recomputeDebounceMs', type: 'number', label: 'Debounce (ms)', min: 0, max: 2000, step: 10, description: 'Debounce window for auto recomputes.', group: 'Lifecycle' },
];

function densityContourStrokeLayerFields(values: any = {}): FieldConfig[] {
  return [
    { name: 'bandwidth', type: 'number', label: 'Bandwidth', min: 1, max: 200, step: 1, description: 'Kernel bandwidth in world units. Larger = smoother, broader blobs.', group: 'Density' },
    { name: 'thresholds', type: 'number', label: 'Bands', min: 1, max: 60, step: 1, description: 'Number of iso-bands d3-contour computes.', group: 'Density' },
    { name: 'cellSize', type: 'number', label: 'Cell size', min: 1, max: 16, step: 1, description: 'Grid cell size in world units. Must be a power of two (1, 2, 4, 8, 16).', group: 'Density' },
    { name: 'padding', type: 'number', label: 'Padding', min: 0, max: 200, step: 1, description: 'Padding around the node bounding box before building the grid.', group: 'Density' },
    { name: 'strokePalette', type: 'boolean', label: 'Palette stroke', description: 'Colour each iso-line from the palette instead of a constant swatch.', group: 'Stroke' },
    ...(values.strokePalette ? [
      { name: 'palette', type: 'select', label: 'Palette', options: [{ value: 'blues', label: 'Blues' }, { value: 'greens', label: 'Greens' }, { value: 'oranges', label: 'Oranges' }, { value: 'purples', label: 'Purples' }, { value: 'reds', label: 'Reds' }, { value: 'viridis', label: 'Viridis' }, { value: 'plasma', label: 'Plasma' }, { value: 'magma', label: 'Magma' }, { value: 'inferno', label: 'Inferno' }, { value: 'warm', label: 'Warm' }, { value: 'cool', label: 'Cool' }], description: 'Named colour ramp for the iso-lines, low-density to high-density.', group: 'Stroke' },
      { name: 'paletteRangeStart', type: 'number', label: 'Palette start', min: 0, max: 1, step: 0.01, description: 'Ramp start fraction 0..1. Applied only when both start + end are set.', group: 'Stroke' },
      { name: 'paletteRangeEnd', type: 'number', label: 'Palette end', min: 0, max: 1, step: 0.01, description: 'Ramp end fraction 0..1. Applied only when both start + end are set.', group: 'Stroke' },
    ] as FieldConfig[] : [
      { name: 'strokeColor', type: 'color', label: 'Stroke color', presetColors: PRESETS, description: 'Constant iso-line colour.', group: 'Stroke' },
    ] as FieldConfig[]),
    { name: 'strokeWidth', type: 'number', label: 'Stroke width', min: 0, max: 10, step: 0.25, description: 'Constant iso-line width in world units.', group: 'Stroke' },
    { name: 'indexEvery', type: 'number', label: 'Index every', min: 1, max: 20, step: 1, description: 'Every Nth band is stroked as a heavy "index" contour.', group: 'Index contours' },
    { name: 'indexMajorWidth', type: 'number', label: 'Major width', min: 0, max: 10, step: 0.25, description: 'Width of the index (major) contours.', group: 'Index contours' },
    { name: 'indexMinorWidth', type: 'number', label: 'Minor width', min: 0, max: 10, step: 0.25, description: 'Width of the in-between (minor) contours.', group: 'Index contours' },
    { name: 'recompute', type: 'select', label: 'Recompute', options: [{ value: 'auto', label: 'Auto (debounced)' }, { value: 'manual', label: 'Manual' }], description: 'How the overlay recomputes: on source changes (auto) or only on demand (manual).', group: 'Lifecycle' },
    { name: 'recomputeDebounceMs', type: 'number', label: 'Debounce (ms)', min: 0, max: 2000, step: 10, description: 'Debounce window for auto recomputes.', group: 'Lifecycle' },
  ];
}

function bubbleSetsLayerFields(values: any = {}): FieldConfig[] {
  return [
    { name: 'nodeR0', type: 'number', label: 'Node radius (full)', min: 0, max: 200, step: 1, description: 'Node-influence inner radius — full influence, world units.', group: 'Influence' },
    { name: 'nodeR1', type: 'number', label: 'Node radius (falloff)', min: 0, max: 400, step: 1, description: 'Node-influence outer radius — zero influence, world units.', group: 'Influence' },
    { name: 'edgeR0', type: 'number', label: 'Edge radius (full)', min: 0, max: 200, step: 1, description: 'Edge-influence inner radius, world units.', group: 'Influence' },
    { name: 'edgeR1', type: 'number', label: 'Edge radius (falloff)', min: 0, max: 400, step: 1, description: 'Edge-influence outer radius, world units.', group: 'Influence' },
    { name: 'morphBuffer', type: 'number', label: 'Padding', min: 0, max: 100, step: 1, description: 'Padding around the energy grid before sampling, world units.', group: 'Influence' },
    { name: 'smoothness', type: 'select', label: 'Smoothness', options: [{ value: 'chaikin', label: 'Chaikin (organic)' }, { value: 'bspline', label: 'B-spline (tight)' }, { value: 'none', label: 'None (jagged)' }], description: 'Contour smoothing algorithm.', group: 'Style' },
    ...(values.smoothness === 'chaikin' ? [
      { name: 'chaikinIterations', type: 'number', label: 'Chaikin iterations', min: 1, max: 8, step: 1, description: 'Corner-cutting passes; each doubles the point count.', group: 'Style' },
    ] as FieldConfig[] : []),
    { name: 'styleFill', type: 'color', label: 'Fill color', presetColors: PRESETS, description: 'Default set fill colour.', group: 'Style' },
    { name: 'styleFillOpacity', type: 'number', label: 'Fill opacity', min: 0, max: 1, step: 0.01, description: 'Default set fill alpha 0..1.', group: 'Style' },
    { name: 'styleStroke', type: 'color', label: 'Stroke color', presetColors: PRESETS, description: 'Default set stroke colour.', group: 'Style' },
    { name: 'styleStrokeOpacity', type: 'number', label: 'Stroke opacity', min: 0, max: 1, step: 0.01, description: 'Default set stroke alpha 0..1.', group: 'Style' },
    { name: 'styleStrokeWidth', type: 'number', label: 'Stroke width', min: 0, max: 20, step: 0.5, description: 'Default set stroke width in world units.', group: 'Style' },
    { name: 'pixelGroup', type: 'number', label: 'Grid resolution', min: 1, max: 32, step: 1, description: 'Grid cell size in square world units. Smaller = sharper, costlier.', group: 'Compute' },
    { name: 'maxRoutingIterations', type: 'number', label: 'Routing iterations', min: 1, max: 1000, step: 1, description: 'Max routing iterations to wrap obstacles.', group: 'Compute' },
    { name: 'maxMarchingIterations', type: 'number', label: 'Marching iterations', min: 1, max: 200, step: 1, description: 'Max marching-squares refinement iterations.', group: 'Compute' },
    { name: 'recompute', type: 'select', label: 'Recompute', options: [{ value: 'auto', label: 'Auto (debounced)' }, { value: 'manual', label: 'Manual' }], description: 'How the overlay recomputes: on source changes (auto) or only on demand (manual).', group: 'Lifecycle' },
    { name: 'recomputeDebounceMs', type: 'number', label: 'Debounce (ms)', min: 0, max: 2000, step: 10, description: 'Debounce window for auto recomputes.', group: 'Lifecycle' },
  ];
}

const mapLayerFields: FieldConfig[] = [
  { name: 'styleUrl', type: 'text', label: 'Style URL', description: 'MapLibre style URL. Defaults to the OpenFreeMap "liberty" style.', group: 'Basemap' },
  { name: 'centerLng', type: 'number', label: 'Center longitude', min: -180, max: 180, step: 0.0001, description: 'Initial centre longitude in degrees.', group: 'View' },
  { name: 'centerLat', type: 'number', label: 'Center latitude', min: -90, max: 90, step: 0.0001, description: 'Initial centre latitude in degrees.', group: 'View' },
  { name: 'zoom', type: 'number', label: 'Zoom', min: 0, max: 22, step: 0.1, description: 'Initial MapLibre zoom level (0..22).', group: 'View' },
  { name: 'minZoom', type: 'number', label: 'Min zoom', min: 0, max: 22, step: 0.1, description: 'Minimum allowed MapLibre zoom.', group: 'View' },
  { name: 'maxZoom', type: 'number', label: 'Max zoom', min: 0, max: 22, step: 0.1, description: 'Maximum allowed MapLibre zoom.', group: 'View' },
  { name: 'passInputToMap', type: 'boolean', label: 'Pass input to map', description: 'Pixi canvas is pointer-transparent so MapLibre receives pan / zoom / click. Default on.', group: 'Input' },
];

// ============================================================
// BEHAVIOURS
// ============================================================

const dragPanFields: FieldConfig[] = [
  { name: 'modifier', type: 'select', label: 'Modifier key', description: 'Which key must be held to pan. `none` = any left-drag pans.', options: [{ label: 'None', value: 'none' }, { label: 'Space', value: 'space' }, { label: 'Shift', value: 'shift' }, { label: 'Alt / Option', value: 'alt' }] },
  { name: 'mouseButtons', type: 'select', label: 'Mouse buttons', description: 'Which mouse buttons trigger a pan drag.', options: [{ label: 'All', value: 'all' }, { label: 'Left', value: 'left' }, { label: 'Right', value: 'right' }, { label: 'Middle', value: 'middle' }] },
  { name: 'decelerate', type: 'boolean', label: 'Decelerate', description: 'Add momentum glide after the pointer lifts.' },
  { name: 'dragCursor', type: 'text', label: 'Drag cursor', description: "CSS cursor shown while panning. Default 'grabbing'." },
];

const pinchZoomFields: FieldConfig[] = [
  { name: 'noDrag', type: 'boolean', label: 'No drag', description: 'Pinch only zooms; suppress the implicit two-finger pan.' },
  { name: 'percent', type: 'number', label: 'Zoom speed', min: 0, max: 1, step: 0.01, description: 'Zoom speed multiplier. Default 0.1 (10%).' },
];

const keyboardCameraFields: FieldConfig[] = [
  { name: 'panStep', type: 'number', label: 'Pan step', min: 1, step: 1, description: 'Pan distance per key press, in screen pixels. Default 40.' },
  { name: 'zoomFactor', type: 'number', label: 'Zoom factor', min: 1, step: 0.05, description: 'Zoom multiplier per key press. 1.1 = 10% in/out. Default 1.1.' },
];

function wheelZoomFields(values: any = {}): FieldConfig[] {
  return [
    { name: 'requireCtrl', type: 'boolean', label: 'Require Ctrl', description: 'Only Ctrl+scroll zooms; plain scroll falls through to the page.' },
    { name: 'percent', type: 'number', label: 'Zoom speed', min: 0, max: 1, step: 0.01, description: 'Zoom fraction per wheel tick. Default 0.1 (10%).' },
    { name: 'smooth', type: 'boolean', label: 'Smooth scroll', description: 'Ease-out zoom instead of an instant snap.' },
    ...(values.smooth ? [
      { name: 'smoothFrames', type: 'number', label: 'Ease frames', min: 1, max: 60, step: 1, description: 'Frame count for the ease-out. Higher = slower glide.' },
    ] as FieldConfig[] : []),
  ];
}

const dragShapeFields: FieldConfig[] = [
  { name: 'reRouteConnectors', type: 'boolean', label: 'Re-route connectors', description: 'Recompute every connector after each move. Needed for obstacle-aware routers.' },
  { name: 'dragCursor', type: 'text', label: 'Drag cursor', description: "CSS cursor shown while dragging a shape. Default 'grabbing'." },
];

const dragNodeFields: FieldConfig[] = [
  { name: 'dragCursor', type: 'text', label: 'Drag cursor', description: 'CSS cursor applied to the canvas while dragging. Default "grabbing".' },
  { name: 'groupAware', type: 'boolean', label: 'Group aware', description: 'Dragging an expanded group node translates its whole subtree together.' },
  { name: 'pinOnRelease', type: 'boolean', label: 'Pin on release', description: 'Pin dragged nodes on drop so layouts keep them where the user placed them.' },
  { name: 'dragSelection', type: 'boolean', label: 'Drag selection', description: 'Grabbing a selected node drags the whole selection together.' },
  { name: 'selectionState', type: 'text', label: 'Selection state', description: 'Layer visual-state name that marks a node as selected. Default "selected".' },
  { name: 'selectionBodyDrag', type: 'boolean', label: 'Selection body drag', description: 'Let a press in the empty space inside the selection box grab the whole set.' },
  { name: 'selectionBodyPadding', type: 'number', label: 'Selection body padding', min: 0, step: 1, description: 'Extra world-space padding around the selection box for body-drag hit-testing.' },
];

const hoverActivateFields: FieldConfig[] = [
  { name: 'state', type: 'text', label: 'Active state', description: 'State name applied to the hovered element (and neighbours). Default "hovered".' },
  { name: 'inactiveState', type: 'text', label: 'Inactive state', description: 'State applied to everything NOT in the active set (e.g. "dimmed"). Blank to skip.' },
  { name: 'raiseActive', type: 'boolean', label: 'Raise active', description: 'Lift the hovered set above its peers so unrelated data does not paint over it.' },
  { name: 'degree', type: 'number', label: 'Neighbour degree', min: 0, max: 6, step: 1, description: 'N-hop neighbour radius. 0 = hovered element only; 1 = direct neighbours; N = N-hop.' },
  { name: 'direction', type: 'select', label: 'Direction', options: [{ label: 'Both', value: 'both' }, { label: 'In', value: 'in' }, { label: 'Out', value: 'out' }], description: 'Edge-traversal direction used when expanding neighbours.' },
  { name: 'zoomThreshold', type: 'number', label: 'Zoom threshold', min: 0, step: 0.01, description: 'Camera scale at/below which the zoomed-out states + scale kick in. Blank disables.' },
  { name: 'zoomedOutState', type: 'text', label: 'Zoomed-out node state', description: 'State applied to hovered nodes below the zoom threshold. Falls back to Active state.' },
  { name: 'zoomedOutEdgeState', type: 'text', label: 'Zoomed-out edge state', description: 'State applied to connecting edges below the zoom threshold. Falls back to Active state.' },
  { name: 'zoomedOutScale', type: 'number', label: 'Zoomed-out scale', min: 1, step: 0.1, description: 'Gfx-transform multiplier grown on hovered nodes below the threshold. 1 disables.' },
];

const clickSelectFields: FieldConfig[] = [
  { name: 'multiple', type: 'boolean', label: 'Multi-select', description: 'A qualifying click toggles membership instead of replacing the selection.' },
  { name: 'trigger', type: 'select', label: 'Modifier gate', description: 'Modifier required for a click to affect the selection. "None" = every click selects.', options: [{ value: 'none', label: 'None' }, { value: 'shift', label: 'Shift' }, { value: 'control', label: 'Control' }, { value: 'alt', label: 'Alt' }, { value: 'meta', label: 'Meta' }] },
  { name: 'degree', type: 'number', label: 'Neighbour degree', min: 0, max: 10, step: 1, description: 'N-hop neighbour radius around each clicked seed. 0 = clicked element only.' },
  { name: 'direction', type: 'select', label: 'Direction', description: 'Edge-traversal direction for neighbour expansion.', options: [{ value: 'both', label: 'Both' }, { value: 'in', label: 'Incoming' }, { value: 'out', label: 'Outgoing' }] },
  { name: 'state', type: 'text', label: 'Active state', description: 'State name applied to selected elements. Default "selected".' },
  { name: 'unselectedState', type: 'text', label: 'Unselected state', description: 'State applied to every non-selected element (dimming). Empty = no dimming.' },
  { name: 'raiseActive', type: 'boolean', label: 'Raise active', description: 'Lift the selected set above its peers so nothing paints over it.' },
  { name: 'clearOnBackground', type: 'boolean', label: 'Clear on background', description: 'Clear the selection when clicking the empty canvas background.' },
];

const clickInspectFields: FieldConfig[] = [
  { name: 'clearOnBackground', type: 'boolean', label: 'Clear on background', description: 'Clear the inspected element when clicking the empty canvas background.' },
];

const clickViewFields: FieldConfig[] = [
  { name: 'clearOnBackground', type: 'boolean', label: 'Clear on background', description: 'Clear the viewed element when clicking the empty canvas background.' },
];

const hoverElementPreviewFields: FieldConfig[] = [
  { name: 'openDelay', type: 'number', label: 'Open delay (ms)', min: 0, step: 10, description: 'Dwell before a hovered element’s card shows. Default 50ms.' },
  { name: 'closeDelay', type: 'number', label: 'Close delay (ms)', min: 0, step: 10, description: 'Grace period after the pointer leaves before the card hides. Default 50ms.' },
  { name: 'placement', type: 'select', label: 'Placement', options: [{ label: 'Auto', value: 'auto' }, { label: 'Top', value: 'top' }, { label: 'Right', value: 'right' }, { label: 'Bottom', value: 'bottom' }, { label: 'Left', value: 'left' }, { label: 'Top-left', value: 'top-left' }, { label: 'Top-right', value: 'top-right' }, { label: 'Bottom-left', value: 'bottom-left' }, { label: 'Bottom-right', value: 'bottom-right' }], description: 'Anchor placement hint passed to the card renderer. Default "bottom-right".' },
  { name: 'interactive', type: 'boolean', label: 'Interactive', description: 'Let the pointer enter the card (select text, click links) without it vanishing.' },
];

const brushSelectFields: FieldConfig[] = [
  { name: 'enableShapes', type: 'boolean', label: 'Select nodes', group: 'Selection', description: 'Include enclosed nodes in the brush selection.' },
  { name: 'enableConnectors', type: 'boolean', label: 'Select edges', group: 'Selection', description: 'Include enclosed edges (both endpoints inside the rect) in the selection.' },
  { name: 'trigger', type: 'select', label: 'Modifier gate', group: 'Selection', description: 'Modifier held on pointerdown to activate the brush. "None" = any left-drag.', options: [{ value: 'none', label: 'None' }, { value: 'shift', label: 'Shift' }, { value: 'control', label: 'Control' }, { value: 'alt', label: 'Alt' }, { value: 'meta', label: 'Meta' }] },
  { name: 'immediately', type: 'boolean', label: 'Live update', group: 'Selection', description: 'Update the selection as the rectangle grows. Off = apply on release.' },
  { name: 'state', type: 'text', label: 'State name', group: 'Selection', description: 'Visual state applied to brushed elements on the fallback path. Default "selected".' },
  { name: 'clearOnBackground', type: 'boolean', label: 'Clear on background', group: 'Selection', description: 'Clear the selection on a background click (no drag).' },
  { name: 'styleFill', type: 'color', label: 'Fill color', group: 'Rectangle', presetColors: PRESETS, description: 'Rubber-band rectangle fill colour.' },
  { name: 'styleFillAlpha', type: 'number', label: 'Fill alpha', group: 'Rectangle', min: 0, max: 1, step: 0.01 },
  { name: 'styleStroke', type: 'color', label: 'Stroke color', group: 'Rectangle', presetColors: PRESETS, description: 'Rectangle border colour.' },
  { name: 'styleStrokeAlpha', type: 'number', label: 'Stroke alpha', group: 'Rectangle', min: 0, max: 1, step: 0.01 },
  { name: 'styleStrokeWidth', type: 'number', label: 'Stroke width', group: 'Rectangle', min: 0, max: 10, step: 0.5 },
];

const lassoSelectFields: FieldConfig[] = [
  { name: 'enableShapes', type: 'boolean', label: 'Select nodes', group: 'Selection', description: 'Include enclosed nodes in the lasso selection.' },
  { name: 'enableConnectors', type: 'boolean', label: 'Select edges', group: 'Selection', description: 'Include enclosed edges (both endpoints inside the polygon) in the selection.' },
  { name: 'trigger', type: 'select', label: 'Modifier gate', group: 'Selection', description: 'Modifier held on pointerdown to activate the lasso. "None" = any left-drag.', options: [{ value: 'none', label: 'None' }, { value: 'shift', label: 'Shift' }, { value: 'control', label: 'Control' }, { value: 'alt', label: 'Alt' }, { value: 'meta', label: 'Meta' }] },
  { name: 'immediately', type: 'boolean', label: 'Live update', group: 'Selection', description: 'Update the selection as the polygon grows. Off = apply on release.' },
  { name: 'state', type: 'text', label: 'State name', group: 'Selection', description: 'Visual state applied to lassoed elements on the fallback path. Default "selected".' },
  { name: 'clearOnBackground', type: 'boolean', label: 'Clear on background', group: 'Selection', description: 'Clear the selection on a background click (no drag).' },
  { name: 'styleFill', type: 'color', label: 'Fill color', group: 'Polygon', presetColors: PRESETS, description: 'Lasso polygon fill colour.' },
  { name: 'styleFillAlpha', type: 'number', label: 'Fill alpha', group: 'Polygon', min: 0, max: 1, step: 0.01 },
  { name: 'styleStroke', type: 'color', label: 'Stroke color', group: 'Polygon', presetColors: PRESETS, description: 'Polygon border colour.' },
  { name: 'styleStrokeAlpha', type: 'number', label: 'Stroke alpha', group: 'Polygon', min: 0, max: 1, step: 0.01 },
  { name: 'styleStrokeWidth', type: 'number', label: 'Stroke width', group: 'Polygon', min: 0, max: 10, step: 0.5, description: 'Border width in screen pixels (auto-divided by zoom).' },
];

const createNodeFields: FieldConfig[] = [];

const drawEdgeFields: FieldConfig[] = [
  { name: 'allowSelfLoop', type: 'boolean', label: 'Allow self-loops', description: 'Releasing on the source node creates a loop edge instead of cancelling.' },
  { name: 'draftColor', type: 'color', label: 'Preview colour', description: 'Stroke colour of the rubber-band preview while drawing. Default light blue.' },
  { name: 'draftWidth', type: 'number', label: 'Preview width', min: 0, step: 0.5, description: 'Line width of the preview stroke. Default 2.' },
  { name: 'draftAlpha', type: 'number', label: 'Preview opacity', min: 0, max: 1, step: 0.05, description: 'Opacity of the preview stroke. Default 0.9.' },
  { name: 'draftDashLength', type: 'number', label: 'Dash length', min: 0, step: 1, description: 'Length of each dash in the preview. Default 6.' },
  { name: 'draftDashGap', type: 'number', label: 'Dash gap', min: 0, step: 1, description: 'Gap between dashes in the preview. Default 4.' },
];

const eraseFields: FieldConfig[] = [
  { name: 'target', type: 'select', label: 'Erase target', description: 'Which element kinds a click removes. Erasing a node cascades its edges.', options: [{ label: 'Nodes and edges', value: 'both' }, { label: 'Nodes only', value: 'node' }, { label: 'Edges only', value: 'edge' }] },
];

const nodeResizeFields: FieldConfig[] = [
  { name: 'handleRadius', type: 'number', label: 'Handle radius', min: 1, step: 1, description: 'Resize-handle outer radius in px. Default 5.' },
  { name: 'handleFill', type: 'color', label: 'Handle fill', description: 'Fill colour of the round resize handles. Default white.' },
  { name: 'frameColor', type: 'color', label: 'Frame colour', description: 'Colour of the dashed frame border + handle outlines. Default blue.' },
  { name: 'dashLength', type: 'number', label: 'Dash length', min: 0, step: 1, description: 'Dash segment length of the frame border in px. Default 5.' },
  { name: 'dashGap', type: 'number', label: 'Dash gap', min: 0, step: 1, description: 'Gap between dash segments of the frame border in px. Default 4.' },
  { name: 'framePadding', type: 'number', label: 'Frame padding', min: 0, step: 1, description: 'Gap between the host silhouette and the dashed frame. Default 4.' },
  { name: 'minSize', type: 'number', label: 'Minimum size', min: 1, step: 1, description: 'Smallest width / height / radius allowed during a resize drag. Default 20.' },
];

const collapseExpandFields: FieldConfig[] = [];

const colorByLabelFields: FieldConfig[] = [
  { name: 'colorNodes', type: 'boolean', label: 'Colour nodes', description: 'Fill each node with the colour assigned to its label. Default on.' },
  { name: 'colorEdges', type: 'boolean', label: 'Colour edges', description: 'Stroke each edge with the colour assigned to its label. Default on.' },
  { name: 'fallbackColor', type: 'color', label: 'Fallback colour', description: 'Colour for items whose label is missing or empty. Default grey.' },
];

const themeFields: FieldConfig[] = [
  { name: 'mode', type: 'select', label: 'Colour mode', description: 'How the light/dark kind is chosen. "System" follows the OS setting.', options: [{ label: 'System', value: 'system' }, { label: 'Light', value: 'light' }, { label: 'Dark', value: 'dark' }] },
  { name: 'active', type: 'text', label: 'Active theme', description: 'Name of the theme to apply (e.g. "default", "forest", "ocean").' },
  { name: 'fallback', type: 'text', label: 'Fallback theme', description: 'Theme used when the active name is not found. Default "default".' },
  { name: 'accentVar', type: 'text', label: 'Accent CSS variable', description: 'CSS custom property read for the accent role. Default "--color-primary".' },
];

const degreeSizeFields: FieldConfig[] = [
  { name: 'direction', type: 'select', label: 'Direction', description: 'Edges counted per node when computing degree.', options: [{ value: 'in', label: 'In' }, { value: 'out', label: 'Out' }, { value: 'both', label: 'Both' }] },
  { name: 'minSize', type: 'number', label: 'Min size', min: 0, step: 1, description: 'Output size for a node with degree 0. Default 8.' },
  { name: 'maxSize', type: 'number', label: 'Max size', min: 0, step: 1, description: 'Output size for the max-degree node. Default 32.' },
  { name: 'scale', type: 'select', label: 'Scale', description: 'Curve mapping normalized degree to size.', options: [{ value: 'linear', label: 'Linear' }, { value: 'sqrt', label: 'Square root' }, { value: 'log', label: 'Logarithmic' }] },
];

const contextMenuFields: FieldConfig[] = [
  { name: 'targetNode', type: 'boolean', label: 'On nodes', description: 'Fire the context-menu callback when a node is right-clicked.' },
  { name: 'targetEdge', type: 'boolean', label: 'On edges', description: 'Fire the context-menu callback when an edge is right-clicked.' },
  { name: 'targetCanvas', type: 'boolean', label: 'On empty canvas', description: 'Fire the context-menu callback when empty canvas is right-clicked.' },
  { name: 'state', type: 'text', label: 'Transient state', description: 'State name applied to the right-clicked element (e.g. "context-open"). Blank = none.' },
];

const labelResolutionLodFields: FieldConfig[] = [
  { name: 'baseResolution', type: 'number', label: 'Base resolution', min: 0, step: 0.5, description: 'Base DPR multiplied by the active tier. Default devicePixelRatio.' },
  { name: 'hysteresis', type: 'number', label: 'Hysteresis', min: 0, step: 0.05, description: 'Zoom margin before dropping down a tier — stops boundary flicker. Default 0.1.' },
];

const nodeSizeLodFields: FieldConfig[] = [
  { name: 'scaleEpsilon', type: 'number', label: 'Scale epsilon', min: 0, step: 0.001, description: 'Skip apply below this relative zoom delta. Default 0.005.' },
  { name: 'settleMs', type: 'number', label: 'Settle (ms)', min: 0, step: 10, description: '0 = per-frame; > 0 debounces the apply after zoom silence.' },
];

const edgeSizeLodFields: FieldConfig[] = [
  { name: 'scaleEpsilon', type: 'number', label: 'Scale epsilon', min: 0, step: 0.001, description: 'Skip apply below this relative zoom delta. Default 0.005.' },
  { name: 'settleMs', type: 'number', label: 'Settle (ms)', min: 0, step: 10, description: '0 = per-frame; > 0 debounces the apply after zoom silence. Default 80.' },
];

const parallelEdgeFields: FieldConfig[] = [
  { name: 'spacing', type: 'number', label: 'Spacing', min: 0, step: 1, description: 'Gap between adjacent ranks in world units. Default 12.' },
  { name: 'basis', type: 'select', label: 'Basis', description: 'How a rank is translated into a fan direction.', options: [{ value: 'auto', label: 'Auto' }, { value: 'perpendicular', label: 'Perpendicular' }, { value: 'axis-aligned', label: 'Axis-aligned' }] },
  { name: 'anchorOffset', type: 'boolean', label: 'Anchor offset', description: 'Fan port-anchored endpoints along the host face, not just waypoints.' },
];

const labelCollisionFields: FieldConfig[] = [
  { name: 'strategy', type: 'select', label: 'Strategy', description: 'What to do with overlapping labels.', options: [{ value: 'hide', label: 'Hide' }] },
  { name: 'prioritise', type: 'select', label: 'Prioritise by', description: 'How labels are ranked when resolving overlaps.', options: [{ value: 'priority-field', label: 'Priority field' }, { value: 'node-degree', label: 'Node degree' }] },
  { name: 'flickerGuardMs', type: 'number', label: 'Flicker guard (ms)', min: 0, step: 10, description: 'Minimum hold before a just-flipped label can flip back. Default 100.' },
  { name: 'groupNodes', type: 'text', label: 'Node group', description: 'Collision group name for node labels. Default "nodes".' },
  { name: 'groupEdges', type: 'text', label: 'Edge group', description: 'Collision group name for edge labels. Default "edges".' },
];

// ============================================================
// LAYOUTS
// ============================================================

const d3ForceLayoutFields: FieldConfig[] = [
  { name: 'animate', type: 'boolean', label: 'Animate', description: 'Write positions every tick (live settle) vs. flush once when settled.', group: 'Simulation' },
  { name: 'reheatAlpha', type: 'number', label: 'Reheat alpha', min: 0, max: 1, step: 0.01, description: 'Alpha for incremental streaming adds (only with Animate off). Default 0.5.', group: 'Simulation' },
  { name: 'alpha', type: 'number', label: 'Alpha', min: 0, max: 1, step: 0.01, description: 'Initial simulation heat. d3 default 1.', group: 'Simulation' },
  { name: 'alphaMin', type: 'number', label: 'Alpha min', min: 0, max: 1, step: 0.001, description: 'Stop threshold. d3 default 0.001.', group: 'Simulation' },
  { name: 'alphaDecay', type: 'number', label: 'Alpha decay', min: 0, max: 1, step: 0.001, description: 'Cooling rate per tick. d3 default ~0.0228.', group: 'Simulation' },
  { name: 'alphaTarget', type: 'number', label: 'Alpha target', min: 0, max: 1, step: 0.01, description: 'Alpha the sim decays toward. d3 default 0.', group: 'Simulation' },
  { name: 'velocityDecay', type: 'number', label: 'Velocity decay', min: 0, max: 1, step: 0.01, description: 'Friction per tick. d3 default 0.4.', group: 'Simulation' },
  { name: 'linkDistance', type: 'number', label: 'Distance', min: 0, max: 2000, step: 1, description: 'Target distance between connected nodes.', group: 'Link force' },
  { name: 'linkStrength', type: 'number', label: 'Strength', min: 0, max: 2, step: 0.01, description: 'How rigidly links hold their distance.', group: 'Link force' },
  { name: 'linkIterations', type: 'number', label: 'Iterations', min: 1, max: 20, step: 1, description: 'Constraint-relaxation passes per tick.', group: 'Link force' },
  { name: 'chargeStrength', type: 'number', label: 'Strength', min: -2000, max: 2000, step: 10, description: 'n-body charge: negative repels, positive attracts.', group: 'Charge force' },
  { name: 'chargeTheta', type: 'number', label: 'Theta', min: 0, max: 2, step: 0.1, description: 'Barnes–Hut accuracy threshold. d3 default 0.9.', group: 'Charge force' },
  { name: 'chargeDistanceMin', type: 'number', label: 'Distance min', min: 0, max: 1000, step: 1, description: 'Minimum inter-node distance considered.', group: 'Charge force' },
  { name: 'chargeDistanceMax', type: 'number', label: 'Distance max', min: 0, max: 100000, step: 10, description: 'Maximum inter-node distance considered.', group: 'Charge force' },
  { name: 'centerX', type: 'number', label: 'Center X', min: -10000, max: 10000, step: 10, description: 'Centroid target x.', group: 'Center force' },
  { name: 'centerY', type: 'number', label: 'Center Y', min: -10000, max: 10000, step: 10, description: 'Centroid target y.', group: 'Center force' },
  { name: 'centerStrength', type: 'number', label: 'Strength', min: 0, max: 2, step: 0.01, description: 'Recentring strength.', group: 'Center force' },
  { name: 'collideRadius', type: 'number', label: 'Radius', min: 0, max: 500, step: 1, description: 'Collision radius (constant). Per-node functions are out of scope here.', group: 'Collide force' },
  { name: 'collideStrength', type: 'number', label: 'Strength', min: 0, max: 1, step: 0.01, description: 'Overlap-resolution strength in [0, 1].', group: 'Collide force' },
  { name: 'collideIterations', type: 'number', label: 'Iterations', min: 1, max: 20, step: 1, description: 'Constraint-relaxation passes per tick.', group: 'Collide force' },
];

function elkLayoutFields(values: any = {}): FieldConfig[] {
  const NODE_SPACING_FIELD: FieldConfig = { name: 'nodeSpacing', type: 'number', label: 'Node spacing', min: 0, max: 1000, step: 1, description: 'Minimum gap between sibling nodes.' };
  const LAYER_SPACING_FIELD: FieldConfig = { name: 'layerSpacing', type: 'number', label: 'Layer spacing', min: 0, max: 1000, step: 1, description: 'Gap between consecutive layers (layered algorithm only).' };
  const OTHER_SPACING_FIELDS: FieldConfig[] = [
    { name: 'edgeNodeSpacing', type: 'number', label: 'Edge–node spacing', min: 0, max: 1000, step: 1, description: 'Gap between an edge and a node.' },
    { name: 'edgeSpacing', type: 'number', label: 'Edge spacing', min: 0, max: 1000, step: 1, description: 'Gap between parallel edges.' },
    { name: 'padding', type: 'number', label: 'Padding', min: 0, max: 1000, step: 1, description: 'Symmetric graph-level padding.' },
  ];
  const spacing =
    values.algorithm === 'layered'
      ? [NODE_SPACING_FIELD, LAYER_SPACING_FIELD, ...OTHER_SPACING_FIELDS]
      : [NODE_SPACING_FIELD, ...OTHER_SPACING_FIELDS];
  return [
    { name: 'algorithm', type: 'select', label: 'Algorithm', description: 'ELK layout algorithm. `layered` (Sugiyama) is the default for directed graphs.', options: [{ value: 'layered', label: 'Layered (Sugiyama)' }, { value: 'mrtree', label: 'Tree (mrtree)' }, { value: 'radial', label: 'Radial' }, { value: 'force', label: 'Force' }, { value: 'stress', label: 'Stress' }, { value: 'disco', label: 'Disconnected packing' }, { value: 'box', label: 'Box packing' }, { value: 'rectpacking', label: 'Rect packing' }, { value: 'random', label: 'Random' }, { value: 'fixed', label: 'Fixed' }], group: 'Algorithm' },
    { name: 'direction', type: 'select', label: 'Direction', description: 'Primary layout axis. Respected by `layered`, `mrtree`, …', options: [{ value: 'RIGHT', label: 'Right' }, { value: 'LEFT', label: 'Left' }, { value: 'DOWN', label: 'Down' }, { value: 'UP', label: 'Up' }], group: 'Algorithm' },
    ...spacing.map((f): FieldConfig => ({ ...f, group: 'Spacing' })),
    { name: 'edgeRouting', type: 'select', label: 'Edge routing', description: 'Node-avoiding edge geometry written back as waypoints. `ORTHOGONAL` suits layered graphs.', options: [{ value: 'ORTHOGONAL', label: 'Orthogonal' }, { value: 'POLYLINE', label: 'Polyline' }, { value: 'SPLINES', label: 'Splines' }], group: 'Edges' },
    { name: 'defaultNodeWidth', type: 'number', label: 'Default node width', min: 1, max: 1000, step: 1, description: 'Fallback width when a node has no resolvable shape. Default 40.', group: 'Node size' },
    { name: 'defaultNodeHeight', type: 'number', label: 'Default node height', min: 1, max: 1000, step: 1, description: 'Fallback height when a node has no resolvable shape. Default 40.', group: 'Node size' },
    { name: 'transition', type: 'boolean', label: 'Animate', description: 'Glide nodes to their new positions instead of snapping.', group: 'Transition' },
    { name: 'transitionEase', type: 'text', label: 'Ease', placeholder: 'e.g. cubic-in-out', group: 'Transition' },
  ];
}

function d3HierarchyLayoutFields(values: any = {}): FieldConfig[] {
  const ORIENTATION_FIELD: FieldConfig = { name: 'orientation', type: 'select', label: 'Orientation', description: 'Cartesian depth axis. Default `vertical`.', options: [{ value: 'vertical', label: 'Vertical' }, { value: 'horizontal', label: 'Horizontal' }] };
  const SIZE_FIELDS: FieldConfig[] = [
    { name: 'sizeWidth', type: 'number', label: 'Size width', min: 0, max: 20000, step: 10, description: 'Cartesian layout width. Default 640 (with height).' },
    { name: 'sizeHeight', type: 'number', label: 'Size height', min: 0, max: 20000, step: 10, description: 'Cartesian layout height. Default 480 (with width).' },
    { name: 'nodeSizeX', type: 'number', label: 'Node size X', min: 0, max: 5000, step: 1, description: 'Per-node horizontal spacing. Mutually exclusive with Size.' },
    { name: 'nodeSizeY', type: 'number', label: 'Node size Y', min: 0, max: 5000, step: 1, description: 'Per-node vertical spacing. Mutually exclusive with Size.' },
  ];
  const RADIUS_FIELD: FieldConfig = { name: 'radius', type: 'number', label: 'Radius', min: 0, max: 10000, step: 10, description: 'Polar radius for radial modes. Default 400.' };
  const PADDING_FIELD: FieldConfig = { name: 'padding', type: 'number', label: 'Padding', min: 0, max: 500, step: 1, description: 'Pack-only: padding between sibling circles. Default 0.' };
  const isCartesian = (mode?: string) => mode === 'tree' || mode === 'cluster';
  const isRadial = (mode?: string) => mode === 'radial-tree' || mode === 'radial-cluster';
  const modeFields = (mode?: string): FieldConfig[] => {
    if (isCartesian(mode)) return [ORIENTATION_FIELD, ...SIZE_FIELDS];
    if (isRadial(mode)) return [RADIUS_FIELD];
    if (mode === 'pack') return [PADDING_FIELD];
    return [];
  };
  return [
    ...[
      { name: 'mode', type: 'select', label: 'Mode', description: 'Hierarchy layout family. Default `radial-tree`.', options: [{ value: 'tree', label: 'Tree' }, { value: 'cluster', label: 'Cluster' }, { value: 'radial-tree', label: 'Radial tree' }, { value: 'radial-cluster', label: 'Radial cluster' }, { value: 'pack', label: 'Pack' }, { value: 'sunburst', label: 'Sunburst' }] } as FieldConfig,
      { name: 'rootId', type: 'text', label: 'Root id', placeholder: 'auto-detected', description: 'Explicit tree root. Auto-detected (unique node with no parent) when blank.' } as FieldConfig,
      ...modeFields(values.mode),
    ].map((f): FieldConfig => ({ ...f, group: 'Layout' })),
    { name: 'centerX', type: 'number', label: 'Center X', min: -10000, max: 10000, step: 10, group: 'Position' },
    { name: 'centerY', type: 'number', label: 'Center Y', min: -10000, max: 10000, step: 10, group: 'Position' },
    { name: 'transition', type: 'boolean', label: 'Animate', description: 'Glide nodes to their new positions (ignored for pack / sunburst).', group: 'Transition' },
    { name: 'transitionEase', type: 'text', label: 'Ease', placeholder: 'e.g. cubic-in-out', group: 'Transition' },
  ];
}

const d3SankeyLayoutFields: FieldConfig[] = [
  { name: 'nodeAlign', type: 'select', label: 'Node align', description: 'Column-alignment strategy. Default `justify` (sources left, sinks right).', options: [{ value: 'justify', label: 'Justify' }, { value: 'left', label: 'Left' }, { value: 'right', label: 'Right' }, { value: 'center', label: 'Center' }], group: 'Layout' },
  { name: 'nodeWidth', type: 'number', label: 'Node width', min: 1, max: 500, step: 1, description: 'Column rectangle width. Default 24.', group: 'Layout' },
  { name: 'nodePadding', type: 'number', label: 'Node padding', min: 0, max: 200, step: 1, description: 'Vertical gap between nodes in a column. Default 8.', group: 'Layout' },
  { name: 'iterations', type: 'number', label: 'Iterations', min: 1, max: 100, step: 1, description: 'Relaxation passes. More = tighter, slower. Default 6.', group: 'Layout' },
  { name: 'sizeWidth', type: 'number', label: 'Size width', min: 0, max: 20000, step: 10, description: 'Viewport width the layout fills. Default 1000 (with height).', group: 'Layout' },
  { name: 'sizeHeight', type: 'number', label: 'Size height', min: 0, max: 20000, step: 10, description: 'Viewport height the layout fills. Default 600 (with width).', group: 'Layout' },
  { name: 'centerX', type: 'number', label: 'Center X', min: -10000, max: 10000, step: 10, group: 'Position' },
  { name: 'centerY', type: 'number', label: 'Center Y', min: -10000, max: 10000, step: 10, group: 'Position' },
];

function geometricLayoutFields(values: any = {}): FieldConfig[] {
  const MODE_FIELD: FieldConfig = { name: 'mode', type: 'select', label: 'Mode', options: [{ value: 'grid', label: 'Grid' }, { value: 'snake', label: 'Snake' }, { value: 'circular', label: 'Circular' }] };
  const GRID_FIELDS: FieldConfig[] = [
    { name: 'columns', type: 'number', label: 'Columns', min: 1, max: 200, step: 1, description: 'Default ⌈√n⌉ (a square-ish block).' },
    { name: 'columnGap', type: 'number', label: 'Column gap', min: 0, max: 500, step: 1 },
    { name: 'rowGap', type: 'number', label: 'Row gap', min: 0, max: 500, step: 1 },
  ];
  const CIRCULAR_FIELDS: FieldConfig[] = [
    { name: 'radius', type: 'number', label: 'Radius', min: 0, max: 5000, step: 10, description: 'Default: auto from node count + spacing.' },
    { name: 'nodeSpacing', type: 'number', label: 'Node spacing', min: 1, max: 500, step: 1, description: 'Arc spacing used to auto-derive radius.' },
    { name: 'startAngle', type: 'number', label: 'Start angle', min: -6.2832, max: 6.2832, step: 0.0873, description: 'First node angle, in radians. Default -π/2 (12 o’clock).' },
    { name: 'clockwise', type: 'boolean', label: 'Clockwise' },
  ];
  const perMode = values.mode === 'circular' ? CIRCULAR_FIELDS : GRID_FIELDS;
  return [
    ...[MODE_FIELD, ...perMode].map((f): FieldConfig => ({ ...f, group: 'Layout' })),
    { name: 'centerX', type: 'number', label: 'Center X', min: -10000, max: 10000, step: 10, group: 'Position' },
    { name: 'centerY', type: 'number', label: 'Center Y', min: -10000, max: 10000, step: 10, group: 'Position' },
    { name: 'transition', type: 'boolean', label: 'Animate', description: 'Glide nodes to their new positions instead of snapping.', group: 'Transition' },
    { name: 'transitionEase', type: 'text', label: 'Ease', placeholder: 'e.g. cubic-in-out', group: 'Transition' },
  ];
}

// ============================================================
// REGISTRY
// ============================================================

type EditorEntry = {
  section: 'layers' | 'behaviours' | 'layouts';
  typeLabel: string;
  id: string;
  fields: FieldConfig[] | ((v: any) => FieldConfig[]);
};

const CANVAS_REGISTRY: EditorEntry[] = [
  // Layers
  { section: 'layers', typeLabel: 'Background Layer', id: 'background-layer', fields: backgroundLayerFields },
  { section: 'layers', typeLabel: 'Dev Info Layer', id: 'dev-info-layer', fields: devInfoLayerFields },
  { section: 'layers', typeLabel: 'Mini-map Layer', id: 'minimap-layer', fields: miniMapLayerFields },
  { section: 'layers', typeLabel: 'Density Contour Fill', id: 'density-contour-fill-layer', fields: densityContourFillLayerFields },
  { section: 'layers', typeLabel: 'Density Contour Stroke', id: 'density-contour-stroke-layer', fields: densityContourStrokeLayerFields },
  { section: 'layers', typeLabel: 'Bubble Sets Layer', id: 'bubble-sets-layer', fields: bubbleSetsLayerFields },
  { section: 'layers', typeLabel: 'Map Layer', id: 'map-layer', fields: mapLayerFields },
  // Behaviours
  { section: 'behaviours', typeLabel: 'Drag Pan', id: 'drag-pan', fields: dragPanFields },
  { section: 'behaviours', typeLabel: 'Pinch Zoom', id: 'pinch-zoom', fields: pinchZoomFields },
  { section: 'behaviours', typeLabel: 'Keyboard Camera', id: 'keyboard-camera', fields: keyboardCameraFields },
  { section: 'behaviours', typeLabel: 'Wheel Zoom', id: 'wheel-zoom', fields: wheelZoomFields },
  { section: 'behaviours', typeLabel: 'Drag Shape', id: 'drag-shape', fields: dragShapeFields },
  { section: 'behaviours', typeLabel: 'Drag Node', id: 'drag-node', fields: dragNodeFields },
  { section: 'behaviours', typeLabel: 'Hover Activate', id: 'hover-activate', fields: hoverActivateFields },
  { section: 'behaviours', typeLabel: 'Click Select', id: 'click-select', fields: clickSelectFields },
  { section: 'behaviours', typeLabel: 'Click Inspect', id: 'click-inspect', fields: clickInspectFields },
  { section: 'behaviours', typeLabel: 'Click View', id: 'click-view', fields: clickViewFields },
  { section: 'behaviours', typeLabel: 'Hover Preview', id: 'hover-element-preview', fields: hoverElementPreviewFields },
  { section: 'behaviours', typeLabel: 'Brush Select', id: 'brush-select', fields: brushSelectFields },
  { section: 'behaviours', typeLabel: 'Lasso Select', id: 'lasso-select', fields: lassoSelectFields },
  { section: 'behaviours', typeLabel: 'Create Node', id: 'create-node', fields: createNodeFields },
  { section: 'behaviours', typeLabel: 'Draw Edge', id: 'draw-edge', fields: drawEdgeFields },
  { section: 'behaviours', typeLabel: 'Erase', id: 'erase', fields: eraseFields },
  { section: 'behaviours', typeLabel: 'Node Resize', id: 'node-resize', fields: nodeResizeFields },
  { section: 'behaviours', typeLabel: 'Collapse / Expand', id: 'collapse-expand', fields: collapseExpandFields },
  { section: 'behaviours', typeLabel: 'Color by Label', id: 'color-by-label', fields: colorByLabelFields },
  { section: 'behaviours', typeLabel: 'Theme', id: 'theme', fields: themeFields },
  { section: 'behaviours', typeLabel: 'Degree Size', id: 'degree-size', fields: degreeSizeFields },
  { section: 'behaviours', typeLabel: 'Context Menu', id: 'context-menu', fields: contextMenuFields },
  { section: 'behaviours', typeLabel: 'Label Resolution LOD', id: 'label-resolution-lod', fields: labelResolutionLodFields },
  { section: 'behaviours', typeLabel: 'Node Size LOD', id: 'node-size-lod', fields: nodeSizeLodFields },
  { section: 'behaviours', typeLabel: 'Edge Size LOD', id: 'edge-size-lod', fields: edgeSizeLodFields },
  { section: 'behaviours', typeLabel: 'Parallel Edge', id: 'parallel-edge', fields: parallelEdgeFields },
  { section: 'behaviours', typeLabel: 'Label Collision', id: 'label-collision', fields: labelCollisionFields },
  // Layouts
  { section: 'layouts', typeLabel: 'D3 Force', id: 'd3-force-layout', fields: d3ForceLayoutFields },
  { section: 'layouts', typeLabel: 'ELK', id: 'elk-layout', fields: elkLayoutFields },
  { section: 'layouts', typeLabel: 'D3 Hierarchy', id: 'd3-hierarchy-layout', fields: d3HierarchyLayoutFields },
  { section: 'layouts', typeLabel: 'D3 Sankey', id: 'd3-sankey-layout', fields: d3SankeyLayoutFields },
  { section: 'layouts', typeLabel: 'Geometric', id: 'geometric-layout', fields: geometricLayoutFields },
];

// ============================================================
// BROWSER
// ============================================================

const SECTIONS: { id: 'layers' | 'behaviours' | 'layouts'; label: string }[] = [
  { id: 'layers', label: 'Layers' },
  { id: 'behaviours', label: 'Behaviours' },
  { id: 'layouts', label: 'Layouts' },
];

const resolve = (
  fields: FieldConfig[] | ((v: any) => FieldConfig[]),
  values: any,
): FieldConfig[] => (typeof fields === 'function' ? fields(values) : fields);

/**
 * Reasonable standalone defaults derived from each field's schema — the canvas
 * app seeds these from a live engine instance; here we synthesize them so every
 * editor is interactive with no engine attached.
 */
function deriveDefaults(fields: FieldConfig[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    if (f.defaultValue !== undefined) {
      out[f.name] = f.defaultValue;
      continue;
    }
    switch (f.type) {
      case 'boolean':
      case 'checkbox':
        out[f.name] = false;
        break;
      case 'number':
        out[f.name] = f.min ?? 0;
        break;
      case 'select':
      case 'radio':
        out[f.name] = f.options?.[0]?.value ?? '';
        break;
      case 'color':
        out[f.name] = f.presetColors?.[0]?.value ?? '#64748b';
        break;
      default:
        out[f.name] = '';
    }
  }
  return out;
}

/** The layout badged as `active` in the Layouts section (mirrors the studio's
 * `activeLayoutId`). */
const ACTIVE_LAYOUT_ID = 'd3-force-layout';

/**
 * VS Code tree-style disclosure chevron: point right (▸) when collapsed, rotate
 * down (⌄) when open. Merges through AccordionTrigger's `cn`, so the trailing
 * `rotate-0` overrides the component's default `rotate-180` open state.
 */
const CHEVRON_RIGHT = '[&>svg]:-rotate-90 [&[data-state=open]>svg]:rotate-0';

/**
 * A JSON config that seeds the browser — shape mirrors the canvas `CanvasConfig`
 * (`{ [section]: { [instanceId]: options } }`). Instances listed here load with
 * these values; everything else falls back to synthesized defaults. This is the
 * "load from JSON" entry point — swap it for a fetched/imported document.
 */
type CanvasConfig = Record<string, Record<string, Record<string, unknown>>>;

const INITIAL_CONFIG: CanvasConfig = {
  layers: {
    'background-layer': {
      type: 'pattern',
      backgroundColor: '#0f172a',
      mode: 'dark',
      patternType: 'dots',
      color: '#334155',
      size: 1.5,
      spacing: 24,
      alpha: 0.6,
      followCamera: true,
    },
    'minimap-layer': { position: 'bottom-right', width: 240, height: 160, enableDrag: true },
  },
  behaviours: {
    'wheel-zoom': { requireCtrl: true, percent: 0.15, smooth: true, smoothFrames: 24 },
    'drag-node': { pinOnRelease: true, groupAware: true },
  },
  layouts: {
    'd3-force-layout': { linkDistance: 90, chargeStrength: -300, animate: true },
    'elk-layout': { algorithm: 'layered', direction: 'RIGHT', nodeSpacing: 40, layerSpacing: 60 },
  },
};

/**
 * The expanded row content: one editor's schema as a chrome-flattened
 * `SettingsPanel` rendered inline, seeded from the loaded JSON (`saved`) merged
 * over synthesized defaults.
 *
 * - `onLiveChange` fires on **every** edit with just the **single changed
 *   field** (a minimal `{ [field]: value }` patch) — wire it to
 *   `canvas.update({ [section]: { [id]: patch } })` for real-time, per-field
 *   updates. There is no Save/Discard step: every edit is applied immediately.
 */
function EditorForm({
  entry,
  saved,
  onLiveChange,
}: {
  entry: EditorEntry;
  saved?: Record<string, unknown>;
  onLiveChange?: (patch: Record<string, unknown>) => void;
}) {
  const initial = { ...deriveDefaults(resolve(entry.fields, {})), ...(saved ?? {}) };
  const form = useForm({ defaultValues: { opts: initial } });
  const values = form.watch('opts');

  // Emit only the single field that changed (RHF gives its path in `name`), not
  // the whole object — a minimal patch the host can apply and undo per field. A
  // ref keeps the subscription stable while always calling the latest callback.
  const liveRef = useRef(onLiveChange);
  liveRef.current = onLiveChange;
  useEffect(() => {
    const sub = form.watch((v, { name }) => {
      if (!name) return; // skip whole-form (non-field) events
      const key = name.replace(/^opts\./, '');
      const opts = (v.opts ?? {}) as Record<string, unknown>;
      liveRef.current?.({ [key]: opts[key] });
    });
    return () => sub.unsubscribe();
  }, [form]);

  // Flat form: drop per-field descriptions and `group` so ObjectField renders
  // every field inline instead of in collapsible sub-accordions.
  const fields = resolve(entry.fields, values ?? {}).map((f) => ({
    ...f,
    description: undefined,
    group: undefined,
  }));

  if (fields.length === 0) {
    return (
      <p className="px-3 py-2 italic text-muted-foreground">
        No settings editor for this instance.
      </p>
    );
  }

  return (
    <SettingsPanel
      form={form}
      name="opts"
      fields={fields}
      labelPosition="top"
      size="sm"
      columns={2}
      className="border-0 bg-transparent shadow-none"
      contentClassName="max-h-none overflow-visible p-3"
    />
  );
}

const meta: Meta = {
  title: 'Form Generator/Showcase/SettingsPanel/Canvas Browser',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

function CanvasBrowserView() {
  // The config document the browser loads from; every live edit is applied
  // immediately (no Save step).
  const [config, setConfig] = useState<CanvasConfig>(INITIAL_CONFIG);

  // The most recent live edit — a single-field patch a host pushes to the canvas.
  const [livePatch, setLivePatch] = useState<{
    section: string;
    id: string;
    patch: Record<string, unknown>;
  } | null>(null);
  const liveUpdate = (section: string, id: string, patch: Record<string, unknown>) => {
    setLivePatch({ section, id, patch });
    setConfig((c) => ({
      ...c,
      [section]: { ...(c[section] ?? {}), [id]: { ...(c[section]?.[id] ?? {}), ...patch } },
    }));
    // In a real host: canvas.update({ [section]: { [id]: patch } });
  };

  // Which instance rows are expanded, per section — controlled so a behaviour
  // can be force-collapsed when it is switched off.
  const [openRows, setOpenRows] = useState<Record<string, string[]>>({});

  return (
    <div className="flex items-start gap-4">
      <Card className="w-[380px]">
        <CardContent className="flex flex-col gap-1 p-2">
          <h2 className="px-1 py-1 text-base font-semibold">Canvas Settings</h2>

          {/* Folders: Layers / Behaviours / Layouts */}
          <Accordion type="multiple" defaultValue={SECTIONS.map((s) => s.id)}>
            {SECTIONS.map((section) => {
              const items = CANVAS_REGISTRY.filter((e) => e.section === section.id);
              return (
                <AccordionItem key={section.id} value={section.id} className="border-b">
                  <AccordionTrigger
                    className={`px-1 py-2 font-semibold uppercase tracking-wide text-muted-foreground hover:no-underline ${CHEVRON_RIGHT}`}
                  >
                    {section.label}
                  </AccordionTrigger>
                  <AccordionContent className="pb-1">
                    {/* Files: one expandable instance per registered editor, with
                        a tree-style indentation guide line (VS Code explorer). */}
                    <div className="ml-2 border-l pl-2">
                      <Accordion
                        type="multiple"
                        value={openRows[section.id] ?? []}
                        onValueChange={(v) =>
                          setOpenRows((s) => ({ ...s, [section.id]: v }))
                        }
                      >
                        {items.map((entry) => {
                          // Layers and behaviours can be enabled/disabled; layouts use
                          // an "active" selection instead.
                          const toggleable =
                            section.id === 'layers' || section.id === 'behaviours';
                          const rowOff =
                            toggleable &&
                            config[section.id]?.[entry.id]?.enabled === false;
                          return (
                          <AccordionItem
                            key={entry.id}
                            value={`${section.id}:${entry.id}`}
                            className="last:border-b-0"
                          >
                            <div className="flex items-center gap-2">
                              {toggleable && (
                                <Switch
                                  checked={config[section.id]?.[entry.id]?.enabled !== false}
                                  onCheckedChange={(v) => {
                                    liveUpdate(section.id, entry.id, { enabled: v });
                                    if (!v)
                                      setOpenRows((s) => ({
                                        ...s,
                                        [section.id]: (s[section.id] ?? []).filter(
                                          (val) => val !== `${section.id}:${entry.id}`,
                                        ),
                                      }));
                                  }}
                                  aria-label={`Toggle ${entry.id}`}
                                  className="ml-1 shrink-0"
                                />
                              )}
                              <div className="min-w-0 flex-1">
                                <AccordionTrigger
                                  disabled={rowOff}
                                  className={`py-2 hover:no-underline ${CHEVRON_RIGHT} ${
                                    rowOff ? 'opacity-50' : ''
                                  }`}
                                >
                                  <span className="flex min-w-0 items-center gap-2">
                                    <span className="truncate font-medium">{entry.id}</span>
                                    <span className="truncate text-muted-foreground">
                                      {entry.typeLabel}
                                    </span>
                                    {section.id === 'layouts' && entry.id === ACTIVE_LAYOUT_ID && (
                                      <Badge variant="secondary" className="px-1.5 py-0">
                                        active
                                      </Badge>
                                    )}
                                  </span>
                                </AccordionTrigger>
                              </div>
                            </div>
                            <AccordionContent className="p-0">
                              <div className="ml-2 border-l pl-2">
                                <EditorForm
                                  entry={entry}
                                  saved={config[section.id]?.[entry.id]}
                                  onLiveChange={(v) => liveUpdate(section.id, entry.id, v)}
                                />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                          );
                        })}
                      </Accordion>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>

      {/* Right column: the live patch (every edit) + the running config document. */}
      <div className="flex w-[340px] flex-col gap-4">
        <div>
          <div className="mb-1 px-1 font-medium text-muted-foreground">
            Live → canvas.update()
          </div>
          <pre className="max-h-[34vh] overflow-auto rounded-lg border bg-muted/30 p-3 font-mono leading-relaxed">
            {livePatch
              ? `canvas.update(${JSON.stringify(
                  { [livePatch.section]: { [livePatch.id]: livePatch.patch } },
                  null,
                  2,
                )})`
              : '// edit any field to see the live patch'}
          </pre>
        </div>
        <div>
          <div className="mb-1 px-1 font-medium text-muted-foreground">Config document</div>
          <pre className="max-h-[44vh] overflow-auto rounded-lg border bg-muted/30 p-3 font-mono leading-relaxed">
            {JSON.stringify(config, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

export const CanvasBrowser: Story = {
  render: () => <CanvasBrowserView />,
};
