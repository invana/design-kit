import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { useForm } from 'react-hook-form';
import { Button, TabbedPanel } from '@invana/ui';
import { FieldGroup, Form, FormField, type FieldConfig, type FieldValues, type RowConfig } from '@invana/forms';
import { Bot, Info } from 'lucide-react';

import spec from '../../../fixtures/forms/settings-section.json';
import { snippet } from '../../_story/source';
import { VariantGrid, type Log } from '../../_story/variant-grid';
import { indent, objectField } from '../form-source';

/** JSON names a tab's icon; the story holds the component. */
const ICONS = { info: Info, bot: Bot };

interface SectionSpec {
  name: string;
  label: string;
  icon: keyof typeof ICONS;
  fields: FieldConfig[];
  rowConfig?: RowConfig[];
  initial: FieldValues;
}

const SECTIONS = spec.sections as SectionSpec[];
const VARIANTS = [{ caption: 'Settings Section', width: 440 }];

interface Args {
  onSubmit: (values: FieldValues) => void;
}

/** One section: its own `useForm`, its own Save — the sections never save together. */
function Section({ section, log, onSubmit }: { section: SectionSpec; log: Log } & Args) {
  const form = useForm<FieldValues>({ defaultValues: { [section.name]: section.initial } });
  const { isDirty } = form.formState;
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          onSubmit(values);
          log('onSubmit', values);
          // Saved is the new baseline: the button goes quiet, and the next edit is measured from here.
          form.reset(values);
        })}
      >
        <FieldGroup>
          <FormField.ObjectField
            control={form.control}
            name={section.name}
            fields={section.fields}
            rowConfig={section.rowConfig}
            labelPosition="top"
            size="md"
          />
          <Button type="submit" disabled={!isDirty}>
            {isDirty ? 'Save' : 'Saved'}
          </Button>
        </FieldGroup>
      </form>
    </Form>
  );
}

const meta = {
  title: 'Forms/Generated/Settings Section',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        code: snippet({
          imports: [
            "import { useForm } from 'react-hook-form';",
            "import { FieldGroup, Form, FormField } from '@invana/forms';",
            "import { Button, TabbedPanel } from '@invana/ui';",
          ],
          comment: 'One tab per question a person arrives with; each tab its own useForm and Save',
          data: Object.fromEntries(
            SECTIONS.flatMap((s) => [
              [`${s.name}Fields`, s.fields],
              ...(s.rowConfig ? [[`${s.name}Rows`, s.rowConfig]] : []),
              [`${s.name}Initial`, s.initial],
            ]),
          ),
          setup: [
            'function Section({ name, fields, rowConfig, initial }) {',
            '  const form = useForm({ defaultValues: { [name]: initial } });',
            '  // Save resets to what was saved, so the button goes quiet until the next edit.',
            '  const onSubmit = form.handleSubmit(async (values) => { await save(values); form.reset(values); });',
            '  return (',
            '    <Form {...form}>',
            '      <form onSubmit={onSubmit}>',
            '        <FieldGroup>',
            `          ${indent(objectField('name', 'fields', { rowConfig: 'rowConfig' }).replace('name="name"', 'name={name}'), '          ')}`,
            '          <Button type="submit" disabled={!form.formState.isDirty}>Save</Button>',
            '        </FieldGroup>',
            '      </form>',
            '    </Form>',
            '  );',
            '}',
          ].join('\n'),
          call: [
            `<TabbedPanel defaultTab="${spec.defaultTab}" tabs={[`,
            ...SECTIONS.map(
              (s) =>
                `  { value: "${s.name}", label: "${s.label}", icon: ${s.icon === 'info' ? 'Info' : 'Bot'}, content: <Section name="${s.name}" fields={${s.name}Fields}${s.rowConfig ? ` rowConfig={${s.name}Rows}` : ''} initial={${s.name}Initial} /> },`,
            ),
            ']} />',
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
 * **Settings of an existing thing, saved per section** — Studio's graph settings panel, from
 * `fixtures/forms/settings-section.json`. One tab per question a person arrives with; each tab
 * is its own `useForm` with its own Save, because the sections never save together.
 *
 * Save enables only once the section is dirty, and saving resets the form to what was saved —
 * so the button goes quiet again and a second edit is measured against the new values. What a
 * Save sends is written under the panel.
 */
export const SettingsSection: Story = {
  name: 'Settings Section',
  render: ({ onSubmit }) => (
    <VariantGrid variants={VARIANTS}>
      {(_v, log) => (
        <TabbedPanel
          defaultTab={spec.defaultTab}
          tabs={SECTIONS.map((s) => ({
            value: s.name,
            label: s.label,
            icon: ICONS[s.icon],
            content: <Section section={s} log={log} onSubmit={onSubmit} />,
          }))}
        />
      )}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Settings Section' }));
    const basic = SECTIONS[0]!;
    await step('Rename the graph — Save wakes up', async () => {
      await expect(cell.getByRole('button', { name: 'Saved' })).toBeDisabled();
      await userEvent.type(cell.getByRole('textbox', { name: 'Name' }), ' (EU)');
      await userEvent.click(cell.getByRole('button', { name: 'Save' }));
    });
    await step('The section is sent, and Save goes quiet again', async () => {
      await expect(args.onSubmit).toHaveBeenCalledWith({ basic: { ...basic.initial, name: `${basic.initial.name} (EU)` } });
      await expect(cell.getByRole('button', { name: 'Saved' })).toBeDisabled();
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('(EU)');
    });
  },
};
