import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { FormRenderer, type FormSchema } from '@invana/forms';

const meta: Meta<typeof FormRenderer> = {
  title: 'Form Generator/FormRenderer',
  component: FormRenderer,
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof FormRenderer>;

const shapeTypes = [
  { label: 'Circle', value: 'circle' },
  { label: 'Rectangle', value: 'rectangle' },
  { label: 'Diamond', value: 'diamond' },
  { label: 'Hexagon', value: 'hexagon' },
];

const nodeDisplaySchema: FormSchema = {
  fields: [
    {
      type: 'group',
      name: 'shape',
      label: 'Shape',
      fields: [
        {
          type: 'row',
          fields: [
            { type: 'select', name: 'type', label: 'Type', cols: 6, options: shapeTypes },
            { type: 'number', name: 'size', label: 'Size', cols: 6, min: 0, max: 500 },
          ],
        },
        { type: 'switch', name: 'animated', label: 'Animated' },
        {
          type: 'row',
          fields: [
            { type: 'color', name: 'bgColor', label: 'Background', cols: 6 },
            { type: 'number', name: 'bgOpacity', label: 'Opacity', cols: 6, min: 0, max: 1, step: 0.1 },
          ],
        },
        {
          type: 'row',
          fields: [
            { type: 'color', name: 'borderColor', label: 'Border', cols: 6 },
            { type: 'number', name: 'borderWidth', label: 'Width', cols: 6, min: 0, max: 20 },
          ],
        },
      ],
    },
    {
      type: 'group',
      name: 'label',
      label: 'Label',
      fields: [
        {
          type: 'row',
          fields: [
            { type: 'color', name: 'textColor', label: 'Text color', cols: 6 },
            { type: 'number', name: 'fontSize', label: 'Font size', cols: 6, min: 8, max: 72 },
          ],
        },
        { type: 'text', name: 'fontFamily', label: 'Font family', placeholder: 'Inter' },
      ],
    },
  ],
};

const defaultValues = {
  shape: {
    type: 'circle',
    size: 80,
    animated: false,
    bgColor: '#ffffff',
    bgOpacity: 1,
    borderColor: '#3b82f6',
    borderWidth: 2,
  },
  label: {
    textColor: '#000000',
    fontSize: 12,
    fontFamily: 'Inter',
  },
};

export const NodeDisplaySettings: Story = {
  render: () => {
    const [submitted, setSubmitted] = React.useState<unknown>(null);
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 max-w-4xl">
        <div className="rounded-lg border p-4">
          <FormRenderer
            schema={nodeDisplaySchema}
            defaultValues={defaultValues}
            onSubmit={setSubmitted}
          />
        </div>
        <div>
          <h4 className="mb-2 text-sm font-medium text-muted-foreground">
            Submitted payload
          </h4>
          <pre className="rounded-md border bg-muted/40 p-3 text-xs">
            {submitted ? JSON.stringify(submitted, null, 2) : '— submit the form —'}
          </pre>
        </div>
      </div>
    );
  },
};
