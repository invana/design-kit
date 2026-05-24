import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@invana/ui';
import { Form, FormField, type FieldConfig, type RowConfig } from '@invana/forms';

const meta: Meta = {
  title: 'Form Generator/NodeDisplaySettings/Complex',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

/* -------------------------------------------------------------------------- */
/*  Field configs — same shape as the archived NodeDisplaySettings             */
/* -------------------------------------------------------------------------- */

const propertyKeys = ['name', 'label', 'url', 'lat_lng', 'created_at'];
const propertyOptions = propertyKeys.map((k) => ({ label: k, value: k }));

const shapeTypes = [
  { label: 'Circle', value: 'circle' },
  { label: 'Rectangle', value: 'rectangle' },
  { label: 'Diamond', value: 'diamond' },
  { label: 'Triangle', value: 'triangle' },
  { label: 'Hexagon', value: 'hexagon' },
];

const presetColors = [
  { label: 'White', value: '#ffffff' },
  { label: 'Gray', value: '#f3f4f6' },
  { label: 'Primary', value: '#3b82f6' },
];

const importantFields: FieldConfig[] = [
  { name: 'labelField', type: 'select', options: propertyOptions, row: 'basic' },
  { name: 'imageField', type: 'select', options: propertyOptions, row: 'basic' },
  { name: 'geoField', type: 'select', options: propertyOptions, row: 'basic' },
  { name: 'timestampField', type: 'select', options: propertyOptions, row: 'basic' },
];

const importantFieldsRowConfig: RowConfig[] = [
  { id: 'imp-basic-1', fields: ['labelField', 'imageField'] },
  { id: 'imp-basic-2', fields: ['geoField', 'timestampField'] },
];

const shapeFields: FieldConfig[] = [
  { name: 'type', type: 'select', options: shapeTypes, group: 'general', row: 'basic' },
  { name: 'size', type: 'number', min: 0, max: 500, step: 1, group: 'general', row: 'basic' },
  { name: 'animated', type: 'boolean', group: 'general', row: 'basic' },
  { name: 'bgColor', type: 'color', group: 'background', row: 'bg-main', presetColors, defaultValue: '#ffffff' },
  { name: 'bgOpacity', type: 'number', min: 0, max: 1, step: 0.1, group: 'background', row: 'bg-main' },
  { name: 'bgPadding', type: 'number', min: 0, max: 50, step: 1, group: 'background', row: 'bg-main' },
  { name: 'borderColor', type: 'color', group: 'border', row: 'border-main', presetColors, defaultValue: '#3b82f6' },
  { name: 'borderWidth', type: 'number', min: 0, max: 20, step: 1, group: 'border', row: 'border-main' },
  { name: 'borderRadius', type: 'number', min: 0, max: 50, step: 1, group: 'border', row: 'border-main' },
  { name: 'dottedBorder', type: 'boolean', group: 'border', row: 'border-main' },
  { name: 'iconText', type: 'icon', group: 'icon', row: 'icon-main' },
  { name: 'iconSize', type: 'number', min: 0, max: 100, step: 1, group: 'icon', row: 'icon-main' },
  { name: 'iconColor', type: 'color', group: 'icon', row: 'icon-main', presetColors, defaultValue: '#ffffff' },
];

const shapeRowConfig: RowConfig[] = [
  { id: 'general-1', fields: ['type', 'size'] },
  { id: 'general-2', fields: ['animated'] },
  { id: 'bg-1', fields: ['bgPadding', 'bgOpacity'] },
  { id: 'bg-2', fields: ['bgColor'] },
  { id: 'border-1', fields: ['borderColor', 'borderWidth'] },
  { id: 'border-2', fields: ['borderRadius', 'dottedBorder'] },
  { id: 'icon-1', fields: ['iconText', 'iconSize'] },
  { id: 'icon-2', fields: ['iconColor'] },
];

const labelFields: FieldConfig[] = [
  { name: 'bgColor', type: 'color', group: 'background', row: 'bg-main', presetColors, defaultValue: '#ffffff' },
  { name: 'bgOpacity', type: 'number', min: 0, max: 1, step: 0.1, group: 'background', row: 'bg-main' },
  { name: 'bgPadding', type: 'number', min: 0, max: 50, step: 1, group: 'background', row: 'bg-main' },
  { name: 'borderColor', type: 'color', group: 'border', row: 'border-main', presetColors, defaultValue: '#e5e7eb' },
  { name: 'borderWidth', type: 'number', min: 0, max: 20, step: 1, group: 'border', row: 'border-main' },
  { name: 'borderRadius', type: 'number', min: 0, max: 50, step: 1, group: 'border', row: 'border-main' },
  { name: 'textColor', type: 'color', group: 'text', row: 'text-main', presetColors, defaultValue: '#000000' },
  { name: 'textFontSize', type: 'number', min: 8, max: 72, step: 1, group: 'text', row: 'text-main' },
  { name: 'textFontFamily', type: 'text', group: 'text', row: 'text-main' },
  { name: 'textOpacity', type: 'number', min: 0, max: 1, step: 0.1, group: 'text', row: 'text-main' },
];

const labelRowConfig: RowConfig[] = [
  { id: 'bg-1', fields: ['bgColor', 'bgOpacity'] },
  { id: 'bg-2', fields: ['bgPadding'] },
  { id: 'border-1', fields: ['borderColor', 'borderWidth'] },
  { id: 'border-2', fields: ['borderRadius'] },
  { id: 'text-1', fields: ['textColor', 'textFontSize'] },
  { id: 'text-2', fields: ['textFontFamily', 'textOpacity'] },
];

const defaultValues = {
  fields: { labelField: 'name', imageField: '', geoField: 'lat_lng', timestampField: 'created_at' },
  shape: {
    type: 'circle', size: 80, animated: false,
    bgColor: '#ffffff', bgOpacity: 1, bgPadding: 8,
    borderColor: '#3b82f6', borderWidth: 2, borderRadius: 50, dottedBorder: false,
    iconText: '', iconSize: 16, iconColor: '#ffffff',
  },
  label: {
    bgColor: '#ffffff', bgOpacity: 1, bgPadding: 4,
    borderColor: '#e5e7eb', borderWidth: 1, borderRadius: 4,
    textColor: '#000000', textFontSize: 12, textFontFamily: 'Inter', textOpacity: 1,
  },
};

export const Complex: Story = {
  render: () => {
    const form = useForm({ defaultValues });
    const [submitted, setSubmitted] = React.useState<Record<string, unknown> | null>(null);

    return (
      <Card className="flex w-[520px] flex-col">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(setSubmitted)}>
            <CardContent className="max-h-[70vh] space-y-4 overflow-y-auto p-4">
              {/* Top: important fields (4 selects in a 2x2 grid) */}
              <FormField.ObjectField
                control={form.control}
                name="fields"
                fields={importantFields}
                rowConfig={importantFieldsRowConfig}
                labelPosition="top"
              />

              <Tabs defaultValue="shape" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="shape">Shape</TabsTrigger>
                  <TabsTrigger value="label">Label</TabsTrigger>
                </TabsList>
                <TabsContent value="shape" className="mt-3">
                  <FormField.ObjectField
                    control={form.control}
                    name="shape"
                    fields={shapeFields}
                    rowConfig={shapeRowConfig}
                    labelPosition="top"
                  />
                </TabsContent>
                <TabsContent value="label" className="mt-3">
                  <FormField.ObjectField
                    control={form.control}
                    name="label"
                    fields={labelFields}
                    rowConfig={labelRowConfig}
                    labelPosition="top"
                  />
                </TabsContent>
              </Tabs>

              {submitted && (
                <pre className="overflow-auto rounded-md border bg-muted/40 p-2 text-[10px]">
                  {JSON.stringify(submitted, null, 2)}
                </pre>
              )}
            </CardContent>

            <CardFooter className="border-t p-3">
              <div className="flex w-full justify-between gap-2">
                <Button type="submit" className="flex-1">Update Settings</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset(defaultValues)}
                >
                  Reset
                </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    );
  },
};
