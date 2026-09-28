import { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import { Button, TabbedPanel } from '@invana/ui';
import { Form, FormField, type FieldConfig, type RowConfig } from '@invana/forms';
import { Bot, Info } from 'lucide-react';

const meta: Meta = {
  title: 'Forms/Generated/Settings Section',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

/**
 * **Settings of an existing thing, saved per section** — Studio's graph
 * settings panel. One tab per question a person arrives with; each tab is its
 * own `useForm` with its own Save, because the sections never save together.
 *
 * Save enables only once the section is dirty, and saving resets the form to
 * what was saved — so the button goes quiet again and a second edit is
 * measured against the new values, not the ones the panel loaded with.
 */
const basicFields: FieldConfig[] = [
  { name: 'name', type: 'text', label: 'Name', placeholder: 'Customer analysis', colSpan: 2 },
  {
    name: 'description',
    type: 'textarea',
    label: 'Description',
    description: 'A short summary of this graph.',
    rows: 3,
    colSpan: 2,
  },
  {
    name: 'instructions',
    type: 'textarea',
    label: 'Instructions',
    description: 'What this graph is for and how its agents should behave. Grounds every prompt it runs.',
    rows: 8,
    colSpan: 2,
  },
];

const agentFields: FieldConfig[] = [
  { name: 'maxRuns', type: 'number', label: 'Concurrent runs', min: 1, max: 32, step: 1 },
  {
    name: 'overflow',
    type: 'select',
    label: 'When full',
    options: [
      { label: 'Queue the run', value: 'queue' },
      { label: 'Reject the run', value: 'reject' },
    ],
  },
  { name: 'pauseOnError', type: 'boolean', label: 'Pause the queue when a run fails' },
];

const agentRows: RowConfig[] = [
  { id: 'limits', fields: ['maxRuns', 'overflow'] },
  { id: 'errors', fields: ['pauseOnError'] },
];

/** One section: its own form, its own Save. */
function Section<T extends Record<string, unknown>>({
  name,
  fields,
  rowConfig,
  initial,
}: {
  name: string;
  fields: FieldConfig[];
  rowConfig?: RowConfig[];
  initial: T;
}) {
  const form = useForm({ defaultValues: { [name]: initial } });
  const { isDirty } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => form.reset(values))} className="space-y-4 p-4">
        <FormField.ObjectField
          control={form.control}
          name={name}
          fields={fields}
          rowConfig={rowConfig}
          labelPosition="top"
          size="md"
        />
        <Button type="submit" disabled={!isDirty}>
          {isDirty ? 'Save' : 'Saved'}
        </Button>
      </form>
    </Form>
  );
}

export const SettingsSection: Story = {
  name: 'Settings Section',
  render: () => (
    <div className="h-[640px] w-[440px]">
      <TabbedPanel
        defaultTab="basic"
        tabs={[
          {
            value: 'basic',
            label: 'Basic',
            icon: Info,
            content: (
              <Section
                name="basic"
                fields={basicFields}
                initial={{
                  name: 'Customer analysis',
                  description: 'Accounts, orders and the people behind them.',
                  instructions: '',
                }}
              />
            ),
          },
          {
            value: 'agents',
            label: 'Agents',
            icon: Bot,
            content: (
              <Section
                name="agents"
                fields={agentFields}
                rowConfig={agentRows}
                initial={{ maxRuns: 4, overflow: 'queue', pauseOnError: false }}
              />
            ),
          },
        ]}
      />
    </div>
  ),
};
