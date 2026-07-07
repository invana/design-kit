import { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import { Form, ObjectField, type FieldConfig } from '@invana/forms';
import { TabbedPanel } from '@invana/ui';
import { Layers, MousePointer2, Network } from 'lucide-react';

/**
 * The same canvas / diagram inspector as the Settings Panel story, but with each
 * group surfaced as a tab in a {@link TabbedPanel} instead of stacked collapsible
 * accordions. All tabs write into a single shared `useForm` instance (the fields
 * still render as `canvas.${field.name}`), so switching tabs never loses state.
 * Fields drop their `group` here — the tab itself is the grouping — and render
 * flat within each tab's `ObjectField`.
 */
const meta: Meta = {
  title: 'Form Generator/Showcase/Settings Panel Tabbed',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

const layoutOptions = [
  { label: 'D3 Force', value: 'd3-force' },
  { label: 'Dagre', value: 'dagre' },
  { label: 'Grid', value: 'grid' },
];

const layerFields: FieldConfig[] = [
  { name: 'background', type: 'boolean', control: 'checkbox', label: 'Background Layer' },
  { name: 'graph', type: 'boolean', control: 'checkbox', label: 'Graph Layer' },
  { name: 'minimap', type: 'boolean', control: 'checkbox', label: 'Mini-map Layer', badge: { label: 'beta' } },
];

const behaviourFields: FieldConfig[] = [
  { name: 'colorByLabel', type: 'boolean', control: 'checkbox', label: 'Color by Label', badge: { label: 'on', variant: 'default' } },
  { name: 'dragPan', type: 'boolean', control: 'checkbox', label: 'Drag Pan', badge: { label: 'on', variant: 'default' } },
  { name: 'wheelZoom', type: 'boolean', control: 'checkbox', label: 'Wheel Zoom', badge: { label: 'on', variant: 'default' } },
  { name: 'dragNode', type: 'boolean', control: 'checkbox', label: 'Drag Node', badge: { label: 'on', variant: 'default' } },
  { name: 'hoverActivate', type: 'boolean', control: 'checkbox', label: 'Hover Activate' },
  { name: 'clickSelect', type: 'boolean', control: 'checkbox', label: 'Click Select', badge: { label: 'on', variant: 'default' } },
  { name: 'brushSelect', type: 'boolean', control: 'checkbox', label: 'Brush Select' },
];

const layoutFields: FieldConfig[] = [
  { name: 'layout', type: 'select', label: 'Algorithm', options: layoutOptions, badge: { label: 'active', variant: 'default' }, colSpan: 2 },
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

export const CanvasSettingsTabbed: Story = {
  render: () => {
    const form = useForm({ defaultValues });

    const section = (fields: FieldConfig[]) => (
      <Form {...form}>
        <div className="p-4">
          <ObjectField
            control={form.control}
            name="canvas"
            fields={fields}
            labelPosition="top"
            size="sm"
            columns={2}
          />
        </div>
      </Form>
    );

    return (
      <div className="w-[360px] h-[420px]">
        <TabbedPanel
          defaultTab="layers"
          tabs={[
            { value: 'layers', label: 'Layers', icon: Layers, content: section(layerFields) },
            { value: 'behaviours', label: 'Behaviours', icon: MousePointer2, content: section(behaviourFields) },
            { value: 'layouts', label: 'Layouts', icon: Network, content: section(layoutFields) },
          ]}
        />
      </div>
    );
  },
};
