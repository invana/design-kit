import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { useForm } from 'react-hook-form';
import { Button, PanelBox } from '@invana/ui';
import { FieldGroup, Form, FormField, type FieldConfig, type FieldValues, type RowConfig } from '@invana/forms';

import spec from '../../../fixtures/forms/rows-and-columns.json';
import { snippet } from '../../_story/source';
import { VariantGrid, type Log } from '../../_story/variant-grid';
import { USE_FORM, indent, objectField } from '../form-source';

interface Section {
  name: string;
  title: string;
  aside: string;
  columns?: number;
  fields: FieldConfig[];
  rowConfig?: RowConfig[];
}

const SECTIONS = spec.sections as Section[];
const VARIANTS = [{ caption: 'Rows and Columns', width: 768 }];

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
          {SECTIONS.map((s) => (
            <PanelBox key={s.name} title={s.title} aside={s.aside}>
              <FormField.ObjectField
                control={form.control}
                name={s.name}
                fields={s.fields}
                rowConfig={s.rowConfig}
                columns={s.columns}
                labelPosition="top"
                size="md"
              />
            </PanelBox>
          ))}
          <Button type="submit">Save</Button>
        </FieldGroup>
      </form>
    </Form>
  );
}

const meta = {
  title: 'Forms/Generated/Rows and Columns',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        code: snippet({
          imports: [
            "import { useForm } from 'react-hook-form';",
            "import { FieldGroup, Form, FormField } from '@invana/forms';",
            "import { Button, PanelBox } from '@invana/ui';",
          ],
          comment: 'Three ObjectFields write into one useForm, each under its own name, so one Submit hands back one object',
          data: {
            ...Object.fromEntries(
              SECTIONS.flatMap((s) => [
                [`${s.name}Fields`, s.fields],
                ...(s.rowConfig ? [[`${s.name}Rows`, s.rowConfig]] : []),
              ]),
            ),
            defaultValues: spec.defaultValues,
          },
          setup: USE_FORM,
          call: [
            '<Form {...form}>',
            '  <form onSubmit={onSubmit}>',
            '    <FieldGroup>',
            ...SECTIONS.flatMap((s) => [
              `      <PanelBox title="${s.title}">`,
              `        ${indent(
                objectField(s.name, `${s.name}Fields`, {
                  rowConfig: s.rowConfig ? `${s.name}Rows` : undefined,
                  columns: s.columns ? String(s.columns) : undefined,
                }),
                '        ',
              )}`,
              '      </PanelBox>',
            ]),
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
 * Where each field sits, from `fixtures/forms/rows-and-columns.json`. Three `ObjectField`s write
 * into one `useForm`, each under its own name (`profile.*`, `connection.*`, `address.*`), so one
 * Save hands back a single object — written under the form.
 *
 * - `rowConfig` — rows by name. A row of one keeps the next field off its line; unlisted fields
 *   follow in the plain grid.
 * - `colSpan: 2` — a full-width field in the default two-column grid.
 * - `columns={3}` — a wider grid; `street` takes two of three, `notes` all three.
 */
export const RowsAndColumns: Story = {
  name: 'Rows and Columns',
  render: (args) => <VariantGrid variants={VARIANTS}>{(_v, log) => <Live {...args} log={log} />}</VariantGrid>,
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Rows and Columns' }));
    await step('Fill the city and save', async () => {
      await userEvent.type(cell.getByRole('textbox', { name: 'City' }), 'Lisbon');
      await userEvent.click(cell.getByRole('button', { name: 'Save' }));
    });
    await step('One object comes back, every section in it', async () => {
      const values = { ...spec.defaultValues, address: { ...spec.defaultValues.address, city: 'Lisbon' } };
      await expect(args.onSubmit).toHaveBeenCalledWith(values);
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"city": "Lisbon"');
    });
  },
};
