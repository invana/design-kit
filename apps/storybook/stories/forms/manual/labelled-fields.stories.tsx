import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import { Form, FormField } from '@invana/forms';
import { Button, PanelBox } from '@invana/ui';

const meta: Meta = {
  title: 'Forms/Manual/Labelled Fields',
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

/**
 * **The generator's rows, placed by hand.** `FormField.Input`, `.Textarea`,
 * `.Select`, `.Number`, `.Boolean`, `.Color`, … are the same label + control +
 * description + message rows `ObjectField` renders from config — here each is
 * returned from a `FormField` render, so the page owns order, markup and what
 * sits between the fields, and still gets the generator's look.
 *
 * Studio's graph settings (Basic tab) is built this way. Each row takes
 * `value` / `onChange` from `field`, plus the same props a `FieldConfig` would
 * carry (`label`, `description`, `options`, `min`/`max`, `size`, …).
 */
const defaultValues = {
  name: 'Customer analysis',
  instructions: '',
  connector: 'neo4j',
  maxRuns: 4,
  pauseOnError: false,
  accent: '#3b82f6',
};

export const LabelledFields: Story = {
  name: 'Labelled Fields',
  render: function Render() {
    const form = useForm({ defaultValues });
    const [submitted, setSubmitted] = React.useState<unknown>(null);

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(setSubmitted)} className="max-w-xl space-y-4">
          <FormField
            control={form.control}
            name="name"
            rules={{ required: 'Name is required.' }}
            render={({ field }) => (
              <FormField.Input label="Name" labelPosition="top" size="md" value={field.value} onChange={field.onChange} />
            )}
          />
          <FormField
            control={form.control}
            name="instructions"
            render={({ field }) => (
              <FormField.Textarea
                label="Instructions"
                description="What this graph is for. Grounds every prompt it runs."
                rows={6}
                labelPosition="top"
                size="md"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <FormField
            control={form.control}
            name="connector"
            render={({ field }) => (
              <FormField.Select
                label="Connector"
                options={[
                  { label: 'Neo4j', value: 'neo4j' },
                  { label: 'JanusGraph', value: 'janusgraph' },
                ]}
                labelPosition="top"
                size="md"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <FormField
            control={form.control}
            name="maxRuns"
            render={({ field }) => (
              <FormField.Number label="Concurrent runs" min={1} max={32} step={1} labelPosition="top" size="md" value={field.value} onChange={field.onChange} />
            )}
          />
          <FormField
            control={form.control}
            name="pauseOnError"
            render={({ field }) => (
              <FormField.Boolean label="Pause the queue when a run fails" labelPosition="top" size="md" value={field.value} onChange={field.onChange} />
            )}
          />
          <FormField
            control={form.control}
            name="accent"
            render={({ field }) => (
              <FormField.Color label="Accent" labelPosition="top" size="md" value={field.value} onChange={field.onChange} />
            )}
          />

          <Button type="submit">Save</Button>

          <PanelBox title="Submitted payload">
            <pre>{submitted ? JSON.stringify(submitted, null, 2) : '— submit the form —'}</pre>
          </PanelBox>
        </form>
      </Form>
    );
  },
};
