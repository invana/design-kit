import type * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { useForm } from 'react-hook-form';
import { FieldGroup, Form, FormField, type FieldValues } from '@invana/forms';
import { Button } from '@invana/ui';

import spec from '../../../fixtures/forms/labelled-fields.json';
import { snippet } from '../../_story/source';
import { VariantBoard, type Log } from '../../_story/variant-board';

/** JSON names the row; the story holds the component. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- each row takes its own props
const ROWS: Record<string, React.ComponentType<any>> = {
  Input: FormField.Input,
  Textarea: FormField.Textarea,
  Select: FormField.Select,
  Number: FormField.Number,
  Boolean: FormField.Boolean,
  Color: FormField.Color,
};

interface RowSpec {
  name: string;
  row: keyof typeof ROWS;
  label: string;
  required?: string;
  [prop: string]: unknown;
}

const SPECS = spec.rows as RowSpec[];
const VARIANTS = [{ caption: 'Labelled Fields', width: 576 }];

interface Args {
  onSubmit: (values: FieldValues) => void;
}

function Live({ log, onSubmit }: Args & { log: Log }) {
  const form = useForm<FieldValues>({ defaultValues: spec.defaultValues });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          onSubmit(values);
          log('onSubmit', values);
        })}
      >
        <FieldGroup>
          {SPECS.map(({ name, row, required, ...props }) => {
            const Row = ROWS[row]!;
            return (
              <FormField
                key={name}
                control={form.control}
                name={name}
                rules={required ? { required } : undefined}
                render={({ field }) => (
                  <Row {...props} labelPosition="top" size="md" value={field.value} onChange={field.onChange} />
                )}
              />
            );
          })}
          <Button type="submit">Save</Button>
        </FieldGroup>
      </form>
    </Form>
  );
}

/** A row as a consumer writes it, from its JSON. */
function rowSource({ name, row, required, ...props }: RowSpec) {
  const attrs = Object.entries(props)
    .map(([k, v]) => (typeof v === 'string' ? `${k}="${v}"` : `${k}={${JSON.stringify(v)}}`))
    .join(' ');
  return [
    `<FormField control={form.control} name="${name}"${required ? ` rules={{ required: "${required}" }}` : ''} render={({ field }) => (`,
    `  <FormField.${row} ${attrs} labelPosition="top" size="md" value={field.value} onChange={field.onChange} />`,
    ')} />',
  ].join('\n');
}

const meta = {
  title: 'Forms/Manual/Labelled Fields',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        code: snippet({
          imports: [
            "import { useForm } from 'react-hook-form';",
            "import { FieldGroup, Form, FormField } from '@invana/forms';",
            "import { Button } from '@invana/ui';",
          ],
          comment: "The generator's rows, placed by hand — each takes value / onChange from `field`",
          data: { defaultValues: spec.defaultValues },
          setup: [
            'const form = useForm({ defaultValues });',
            '// handleSubmit hands over every field: { name, instructions, connector, maxRuns, pauseOnError, accent }.',
            'const onSubmit = form.handleSubmit((values) => save(values));',
          ].join('\n'),
          call: [
            '<Form {...form}>',
            '  <form onSubmit={onSubmit}>',
            '    <FieldGroup>',
            ...SPECS.map((s) => `      ${rowSource(s).replace(/\n/g, '\n      ')}`),
            '      <Button type="submit">Save</Button>',
            '    </FieldGroup>',
            '  </form>',
            '</Form>',
          ].join('\n'),
        }),
      },
    },
  },
  args: { onSubmit: fn() },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * **The generator's rows, placed by hand.** `FormField.Input`, `.Textarea`, `.Select`,
 * `.Number`, `.Boolean`, `.Color`, … are the same label + control + description + message rows
 * `ObjectField` renders from config — here each is returned from a `FormField` render, so the
 * page owns order, markup and what sits between the fields, and still gets the generator's
 * look. Studio's graph settings (Basic tab) is built this way.
 *
 * Each row takes `value` / `onChange` from `field`, plus the same props a `FieldConfig` would
 * carry; they are `fixtures/forms/labelled-fields.json`. What Save hands over is written under
 * the form.
 */
export const LabelledFields: Story = {
  name: 'Labelled Fields',
  render: (args) => <VariantBoard variants={VARIANTS}>{(_v, log) => <Live {...args} log={log} />}</VariantBoard>,
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Labelled Fields' }));
    await step('Write the instructions and save', async () => {
      await userEvent.type(cell.getByRole('textbox', { name: 'Instructions' }), 'Answer from the graph.');
      await userEvent.click(cell.getByRole('button', { name: 'Save' }));
    });
    await step('Every field is handed over', async () => {
      await expect(args.onSubmit).toHaveBeenCalledWith({ ...spec.defaultValues, instructions: 'Answer from the graph.' });
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"instructions": "Answer from the graph."');
    });
  },
};
