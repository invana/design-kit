import { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import { SettingsPanel, type ColorPreset, type FieldConfig } from '@invana/forms';

/**
 * Sectioned settings panel in the style of a canvas / diagram node-style
 * inspector, built with the reusable `SettingsPanel` component. The field set
 * is the real `NodeStyle` editor schema (as used by the Invana canvas building
 * studio): grouped `FieldConfig`s across **Geometry**, **Background**,
 * **Stroke** and **Label** sections, mixing color pickers with presets, numeric
 * inputs with `min`/`max`/`step`, selects and text — each `group` renders as a
 * collapsible section with an uppercase header and a count badge.
 *
 * The **Geometry** section shows the discriminated-union pattern: changing the
 * `Shape` select swaps in that kind's geometry numerics (radius vs
 * width/height vs sides…), recomputed from the live form values via
 * `form.watch`.
 */
const meta: Meta = {
  title: 'Form Generator/Showcase/SettingsPanel',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

const COLOR_PRESETS: ColorPreset[] = [
  { label: 'Blue', value: '#3b82f6' },
  { label: 'Indigo', value: '#6366f1' },
  { label: 'Violet', value: '#8b5cf6' },
  { label: 'Emerald', value: '#10b981' },
  { label: 'Amber', value: '#f59e0b' },
  { label: 'Rose', value: '#f43f5e' },
  { label: 'Slate', value: '#64748b' },
  { label: 'White', value: '#ffffff', darkValue: '#0f172a' },
];

type ShapeKind = 'circle' | 'rect' | 'regular-polygon' | 'star';

const SHAPE_KIND_FIELD: FieldConfig = {
  name: 'shapeKind',
  type: 'select',
  label: 'Shape',
  group: 'Geometry',
  options: [
    { value: 'circle', label: 'Circle' },
    { value: 'rect', label: 'Rectangle' },
    { value: 'regular-polygon', label: 'Regular polygon' },
    { value: 'star', label: 'Star' },
  ],
};

const SIZE_FIELD: FieldConfig = {
  name: 'size',
  type: 'number',
  label: 'Size',
  group: 'Geometry',
  min: 0,
  max: 200,
  step: 1,
  description: "Unified radius / half-extent. Overrides the shape's native size axis.",
};

/** Per-kind geometry numerics, keyed by shape kind. */
const GEOMETRY_BY_KIND: Record<ShapeKind, FieldConfig[]> = {
  circle: [{ name: 'radius', type: 'number', label: 'Radius', group: 'Geometry', min: 0, max: 200, step: 1 }],
  rect: [
    { name: 'width', type: 'number', label: 'Width', group: 'Geometry', min: 0, max: 400, step: 1 },
    { name: 'height', type: 'number', label: 'Height', group: 'Geometry', min: 0, max: 400, step: 1 },
    { name: 'cornerRadius', type: 'number', label: 'Corner radius', group: 'Geometry', min: 0, max: 200, step: 1 },
  ],
  'regular-polygon': [
    { name: 'sides', type: 'number', label: 'Sides', group: 'Geometry', min: 3, max: 20, step: 1 },
    { name: 'radius', type: 'number', label: 'Radius', group: 'Geometry', min: 0, max: 200, step: 1 },
  ],
  star: [
    { name: 'points', type: 'number', label: 'Points', group: 'Geometry', min: 3, max: 20, step: 1 },
    { name: 'innerRadius', type: 'number', label: 'Inner radius', group: 'Geometry', min: 0, max: 200, step: 1 },
    { name: 'outerRadius', type: 'number', label: 'Outer radius', group: 'Geometry', min: 0, max: 200, step: 1 },
  ],
};

const BACKGROUND_FIELDS: FieldConfig[] = [
  {
    name: 'bgFill',
    type: 'color',
    label: 'Fill color',
    group: 'Background',
    presetColors: COLOR_PRESETS,
    description: 'Solid color. Use the engine API directly for stacked / image / glyph fills.',
  },
  { name: 'bgAlpha', type: 'number', label: 'Fill alpha', group: 'Background', min: 0, max: 1, step: 0.01 },
];

const STROKE_FIELDS: FieldConfig[] = [
  { name: 'bgStrokeColor', type: 'color', label: 'Stroke color', group: 'Stroke', presetColors: COLOR_PRESETS },
  { name: 'bgStrokeAlpha', type: 'number', label: 'Stroke alpha', group: 'Stroke', min: 0, max: 1, step: 0.01 },
  { name: 'bgStrokeWidth', type: 'number', label: 'Stroke width', group: 'Stroke', min: 0, max: 50, step: 0.5 },
  {
    name: 'bgStrokeAlignment',
    type: 'select',
    label: 'Stroke alignment',
    group: 'Stroke',
    options: [
      { value: 'inside', label: 'Inside' },
      { value: 'center', label: 'Center' },
      { value: 'outside', label: 'Outside' },
    ],
  },
  {
    name: 'bgStrokeDashLength',
    type: 'number',
    label: 'Dash length',
    group: 'Stroke',
    min: 0,
    max: 50,
    step: 1,
    description: 'Leave dash + gap at 0 for a solid stroke.',
  },
  { name: 'bgStrokeDashGap', type: 'number', label: 'Dash gap', group: 'Stroke', min: 0, max: 50, step: 1 },
  {
    name: 'bgStrokeCap',
    type: 'select',
    label: 'Cap',
    group: 'Stroke',
    options: [
      { value: 'butt', label: 'Butt' },
      { value: 'round', label: 'Round' },
      { value: 'square', label: 'Square' },
    ],
  },
  {
    name: 'bgStrokeJoin',
    type: 'select',
    label: 'Join',
    group: 'Stroke',
    options: [
      { value: 'miter', label: 'Miter' },
      { value: 'round', label: 'Round' },
      { value: 'bevel', label: 'Bevel' },
    ],
  },
];

const LABEL_FIELDS: FieldConfig[] = [
  { name: 'labelText', type: 'text', label: 'Text', group: 'Label', placeholder: '(uses node id / data field)' },
  { name: 'labelColor', type: 'color', label: 'Color', group: 'Label', presetColors: COLOR_PRESETS },
  { name: 'labelFontSize', type: 'number', label: 'Font size', group: 'Label', min: 1, max: 120, step: 1 },
  { name: 'labelFontWeight', type: 'number', label: 'Font weight', group: 'Label', min: 100, max: 900, step: 100 },
  {
    name: 'labelPlacement',
    type: 'select',
    label: 'Placement',
    group: 'Label',
    description: 'inside-* placements clip / truncate to fit the shape.',
    options: [
      { value: 'center', label: 'Center (anchor)' },
      { value: 'top', label: 'Top' },
      { value: 'bottom', label: 'Bottom' },
      { value: 'left', label: 'Left' },
      { value: 'right', label: 'Right' },
      { value: 'inside-center', label: 'Inside center (contained)' },
    ],
  },
  { name: 'labelOffsetX', type: 'number', label: 'Offset X', group: 'Label', min: -200, max: 200, step: 1 },
  { name: 'labelOffsetY', type: 'number', label: 'Offset Y', group: 'Label', min: -200, max: 200, step: 1 },
];

/**
 * The full NodeStyle field set as one grouped `FieldConfig[]`. Geometry
 * numerics vary with the current `shapeKind` (the discriminated union), so
 * this is a function of the live values.
 */
function nodeStyleFields(shapeKind: ShapeKind): FieldConfig[] {
  return [
    SHAPE_KIND_FIELD,
    ...(GEOMETRY_BY_KIND[shapeKind] ?? []),
    SIZE_FIELD,
    ...BACKGROUND_FIELDS,
    ...STROKE_FIELDS,
    ...LABEL_FIELDS,
  ];
}

const defaultValues = {
  style: {
    shapeKind: 'circle' as ShapeKind,
    radius: 28,
    size: 28,
    bgFill: '#3b82f6',
    bgAlpha: 1,
    bgStrokeColor: '#1e3a8a',
    bgStrokeAlpha: 1,
    bgStrokeWidth: 3,
    bgStrokeAlignment: 'center',
    bgStrokeDashLength: 0,
    bgStrokeDashGap: 0,
    bgStrokeCap: 'butt',
    bgStrokeJoin: 'miter',
    labelText: 'Node',
    labelColor: '#ffffff',
    labelFontSize: 14,
    labelFontWeight: 400,
    labelPlacement: 'center',
    labelOffsetX: 0,
    labelOffsetY: 0,
  },
};

export const CanvasSettings: Story = {
  render: () => {
    const form = useForm({ defaultValues });
    // Watch the shape kind so the Geometry section swaps its numerics live.
    const shapeKind = form.watch('style.shapeKind') as ShapeKind;

    return (
      <SettingsPanel
        title="Node Style"
        form={form}
        name="style"
        fields={nodeStyleFields(shapeKind)}
        labelPosition="top"
        size="sm"
        columns={2}
        className="w-[360px]"
      />
    );
  },
};
