import { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import { SettingsPanel, type FieldConfig } from '@invana/forms';
import { TabbedPanel } from '@invana/ui';
import { SlidersHorizontal, Info } from 'lucide-react';

/**
 * The exact same sectioned `SettingsPanel` from the Settings Panel story, but
 * dropped whole into a {@link TabbedPanel} body — the panel (title, grouped
 * accordions with count badges, per-field status pills) renders inside the
 * "Settings" tab. The panel's own `Card` chrome is flattened (`border-0`,
 * `shadow-none`) so it sits cleanly within the tab's card, and it stretches to
 * fill the tab instead of carrying a fixed width.
 */
const meta: Meta = {
  title: 'Form Generator/Showcase/SettingsPanel/Tabbed',
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

export const Tabbed: Story = {
  render: () => {
    const form = useForm({ defaultValues });

    return (
      <div className="w-[360px] h-[560px]">
        <TabbedPanel
          defaultTab="settings"
          tabs={[
            {
              value: 'settings',
              label: 'Settings',
              icon: SlidersHorizontal,
              content: (
                <SettingsPanel
                  form={form}
                  name="canvas"
                  fields={fields}
                  labelPosition="top"
                  size="sm"
                  columns={2}
                  className="border-0 rounded-none shadow-none"
                  contentClassName="max-h-none"
                />
              ),
            },
            {
              value: 'about',
              label: 'About',
              icon: Info,
              content: (
                <div className="p-4 text-base text-muted-foreground">
                  These settings drive the canvas renderer. Toggle layers,
                  interaction behaviours, and the active layout algorithm — all
                  values are held in a single shared form.
                </div>
              ),
            },
          ]}
        />
      </div>
    );
  },
};
