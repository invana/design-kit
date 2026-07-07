import { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import { Card, CardContent } from '@invana/ui';
import { Form, FormField, type FieldConfig, type RowConfig } from '@invana/forms';

/**
 * Dense inspector / properties panel built entirely from the form generator at
 * `size="xs"`. This is the ultra-compact density used by side panels like the
 * modeller "Diagram Properties" editor — small controls, tight rows and compact
 * collapsible section headers, all driven by the single `size` prop.
 */
const meta: Meta = {
  title: 'Form Generator/Properties Panel',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

const subjectAreas = [
  { label: '-- Root --', value: 'root' },
  { label: 'Sales', value: 'sales' },
  { label: 'Inventory', value: 'inventory' },
];

const nameDisplayOptions = [
  { label: 'Object only', value: 'object' },
  { label: 'Object and schema', value: 'object-schema' },
  { label: 'Fully-qualified name', value: 'fqn' },
];

const notationOptions = [
  { label: 'IDEF1X', value: 'idef1x' },
  { label: "Crow's Foot", value: 'crows-foot' },
];

const fields: FieldConfig[] = [
  // Diagram
  { name: 'subjectArea', type: 'select', label: 'Subject area', options: subjectAreas, group: 'diagram', colSpan: 2 },
  { name: 'diagram', type: 'text', label: 'Diagram', group: 'diagram', colSpan: 2 },

  // View mode options
  { name: 'fixedObjectHeight', type: 'boolean', label: 'Fixed object height', group: 'viewMode', row: 'vm-1' },
  { name: 'dataType', type: 'boolean', label: 'Data type', group: 'viewMode', row: 'vm-1' },
  { name: 'dataTypeForViews', type: 'boolean', label: 'Data type for views', group: 'viewMode', row: 'vm-2' },
  { name: 'colorDataType', type: 'boolean', label: 'Color data type', group: 'viewMode', row: 'vm-2' },
  { name: 'nullOption', type: 'boolean', label: 'Null option', group: 'viewMode', row: 'vm-3' },
  { name: 'keys', type: 'boolean', label: 'Keys', group: 'viewMode', row: 'vm-3' },
  { name: 'objectNameDisplay', type: 'select', label: 'Object name display', options: nameDisplayOptions, group: 'viewMode', colSpan: 2 },

  // Global user preferences
  { name: 'disableZoom', type: 'boolean', label: 'Disable zoom', group: 'globalPrefs', row: 'gp-1' },
  { name: 'showGrid', type: 'boolean', label: 'Show grid', group: 'globalPrefs', row: 'gp-1' },

  // Notation
  { name: 'notation', type: 'select', label: 'Notation', options: notationOptions, group: 'notation', colSpan: 2 },

  // Description
  { name: 'comment', type: 'textarea', label: 'Comment', placeholder: 'Comment', rows: 3, group: 'description', colSpan: 2 },
];

const rowConfig: RowConfig[] = [
  { id: 'vm-1', fields: ['fixedObjectHeight', 'dataType'] },
  { id: 'vm-2', fields: ['dataTypeForViews', 'colorDataType'] },
  { id: 'vm-3', fields: ['nullOption', 'keys'] },
  { id: 'gp-1', fields: ['disableZoom', 'showGrid'] },
];

const defaultValues = {
  props: {
    subjectArea: 'root',
    diagram: 'Sample diagram',
    fixedObjectHeight: false,
    dataType: true,
    dataTypeForViews: true,
    colorDataType: true,
    nullOption: true,
    keys: true,
    objectNameDisplay: 'object-schema',
    disableZoom: false,
    showGrid: false,
    notation: 'idef1x',
    comment: '',
  },
};

export const PropertiesPanel: Story = {
  render: () => {
    const form = useForm({ defaultValues });

    return (
      <Card className="w-[300px]">
        <CardContent className="max-h-[80vh] overflow-y-auto p-3">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Diagram Properties
          </h2>
          <Form {...form}>
            <FormField.ObjectField
              control={form.control}
              name="props"
              fields={fields}
              rowConfig={rowConfig}
              labelPosition="top"
              size="xs"
            />
          </Form>
        </CardContent>
      </Card>
    );
  },
};
