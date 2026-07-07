import { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import { SettingsPanel, type FieldConfig } from '@invana/forms';

/**
 * Sectioned settings panel in the style of a canvas / diagram inspector, built
 * with the reusable `SettingsPanel` component. Each `group` renders as a flat
 * collapsible section with an uppercase header and a count badge; individual
 * rows carry an optional status pill via each field's `badge` config
 * (`variant: 'default'` for the solid accent "on" chip, the neutral
 * `secondary` for muted tags like "beta").
 */
const meta: Meta = {
  title: 'Form Generator/Showcase/Settings Panel',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

const layoutOptions = [
  { label: 'D3 Force', value: 'd3-force' },
  { label: 'Dagre', value: 'dagre' },
  { label: 'Grid', value: 'grid' },
];

const fields: FieldConfig[] = [
  // Layers — toggles for the drawable layers
  { name: 'background', type: 'boolean', control: 'checkbox', label: 'Background Layer', group: 'layers' },
  { name: 'graph', type: 'boolean', control: 'checkbox', label: 'Graph Layer', group: 'layers' },
  { name: 'minimap', type: 'boolean', control: 'checkbox', label: 'Mini-map Layer', group: 'layers', badge: { label: 'beta' } },

  // Behaviours — interaction toggles, each showing an "on" status pill
  { name: 'colorByLabel', type: 'boolean', control: 'checkbox', label: 'Color by Label', group: 'behaviours', badge: { label: 'on', variant: 'default' } },
  { name: 'dragPan', type: 'boolean', control: 'checkbox', label: 'Drag Pan', group: 'behaviours', badge: { label: 'on', variant: 'default' } },
  { name: 'wheelZoom', type: 'boolean', control: 'checkbox', label: 'Wheel Zoom', group: 'behaviours', badge: { label: 'on', variant: 'default' } },
  { name: 'dragNode', type: 'boolean', control: 'checkbox', label: 'Drag Node', group: 'behaviours', badge: { label: 'on', variant: 'default' } },
  { name: 'hoverActivate', type: 'boolean', control: 'checkbox', label: 'Hover Activate', group: 'behaviours' },
  { name: 'clickSelect', type: 'boolean', control: 'checkbox', label: 'Click Select', group: 'behaviours', badge: { label: 'on', variant: 'default' } },
  { name: 'brushSelect', type: 'boolean', control: 'checkbox', label: 'Brush Select', group: 'behaviours' },

  // Layouts — a single active layout algorithm
  { name: 'layout', type: 'select', label: 'Algorithm', options: layoutOptions, group: 'layouts', badge: { label: 'active', variant: 'default' }, colSpan: 2 },
];

const defaultValues = {
  canvas: {
    background: true,
    graph: true,
    minimap: false,
    colorByLabel: true,
    dragPan: true,
    wheelZoom: true,
    dragNode: true,
    hoverActivate: false,
    clickSelect: true,
    brushSelect: false,
    layout: 'd3-force',
  },
};

export const CanvasSettings: Story = {
  render: () => {
    const form = useForm({ defaultValues });

    return (
      <SettingsPanel
        title="Canvas Settings"
        form={form}
        name="canvas"
        fields={fields}
        labelPosition="top"
        size="sm"
        columns={2}
        className="w-[360px]"
      />
    );
  },
};
