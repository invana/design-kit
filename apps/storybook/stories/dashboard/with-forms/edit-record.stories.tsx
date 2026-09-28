import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm, useFormContext, useWatch } from 'react-hook-form';
import { Dashboard, type DashboardSpec, type PanelRendererProps, type StagedSpec } from '@invana/dashboard';
import { Form, FormField, type FieldConfig, type RowConfig } from '@invana/forms';

import { ICONS, Surface, useLoaded } from '../_fixtures';

const meta: Meta<typeof Dashboard> = {
  title: 'Dashboard/With Forms/Edit Record',
  component: Dashboard,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ── the record, as the server would send it ────────────────────────────────

interface Model {
  name: string;
  description: string;
  validation: string;
  origin: string;
  retentionDays: number;
  versioned: boolean;
}

const RECORD: Model = {
  name: 'AirRoutes',
  description: 'Airports, countries and continents, and the routes flown between them',
  validation: 'strict',
  origin: 'starter',
  retentionDays: 90,
  versioned: true,
};

const FIELDS: FieldConfig[] = [
  { name: 'name', type: 'text', label: 'Name' },
  {
    name: 'validation',
    type: 'select',
    label: 'Validation',
    options: [
      { label: 'Strict', value: 'strict' },
      { label: 'Lenient', value: 'lenient' },
      { label: 'Off', value: 'off' },
    ],
  },
  { name: 'description', type: 'textarea', label: 'Description', rows: 2, colSpan: 2 },
  {
    name: 'origin',
    type: 'select',
    label: 'Origin',
    options: [
      { label: 'Starter', value: 'starter' },
      { label: 'Imported', value: 'imported' },
      { label: 'Hand-built', value: 'custom' },
    ],
  },
  { name: 'retentionDays', type: 'number', label: 'Retention (days)', min: 1, max: 365 },
  { name: 'versioned', type: 'boolean', label: 'Keep every version', colSpan: 2 },
];

const ROWS: RowConfig[] = [
  { id: 'identity', fields: ['name', 'validation'] },
  { id: 'keeping', fields: ['origin', 'retentionDays'] },
];

// ── a `form` panel, registered by the consumer ─────────────────────────────
// The dashboard ships no form kind: the spec carries the fields as data, and
// the story owns `useForm` and hands it down through `<Form>`, exactly as a
// product would. The panel only draws the fields it is told about.

interface FormOptions {
  name: string;
  fields: FieldConfig[];
  rowConfig?: RowConfig[];
}

function FormPanel({ options }: PanelRendererProps<FormOptions>) {
  const { control } = useFormContext();
  return (
    <FormField.ObjectField
      control={control}
      name={options.name}
      fields={options.fields}
      rowConfig={options.rowConfig}
      labelPosition="top"
    />
  );
}

type WithForm = { form: FormOptions };

const same = (a: unknown, b: unknown) => String(a) === String(b);

/**
 * **Load, edit, save** — a record opened in a dashboard with a form on it.
 *
 * The record arrives after the page draws and fills the form (`reset`). Every
 * field that now differs from what was saved is listed in the `staged` bar,
 * each with its own `×`; **Save** and **Discard** in the header stay disabled
 * until there is something to save. Save writes the values back as the new
 * saved record — shown beside the form as `record.json` — and the staged bar
 * empties. The `form` kind is the consumer's registry entry, not a built-in.
 */
export const EditRecord: Story = {
  render: function Render() {
    const [last, setLast] = React.useState('—');
    const [saved, setSaved] = React.useState<Model | null>(null);
    const [version, setVersion] = React.useState(1);
    const [tab, setTab] = React.useState('details');
    const loaded = useLoaded(RECORD);
    const form = useForm<{ record: Model }>();
    const values = useWatch({ control: form.control, name: 'record' });

    React.useEffect(() => {
      if (!loaded) return;
      setSaved(loaded);
      form.reset({ record: loaded });
    }, [loaded, form]);

    const changed = saved && values ? (Object.keys(saved) as Array<keyof Model>).filter((k) => !same(values[k], saved[k])) : [];
    const staged: StagedSpec | undefined = changed.length
      ? {
          items: changed.map((k) => ({ id: k, op: 'change', name: k, note: `${saved![k]} → ${values[k]}` })),
          discardAction: 'discard-one',
          discardAllAction: 'discard',
        }
      : undefined;

    const save = form.handleSubmit(({ record }) => {
      const next = { ...record, retentionDays: Number(record.retentionDays) };
      setSaved(next);
      setVersion((v) => v + 1);
      form.reset({ record: next });
    });

    const spec: DashboardSpec<WithForm> = {
      header: {
        tone: saved ? (changed.length ? 'warning' : 'success') : 'running',
        crumbs: ['Models', saved?.name ?? 'Loading…'],
        chips: saved
          ? [changed.length ? { label: `${changed.length} unsaved`, tone: 'warning' } : { label: `v${version} · saved`, variant: 'outline' }]
          : [{ label: 'loading', tone: 'running' }],
        actions: [
          { id: 'save', label: 'Save', icon: 'check', variant: 'default', disabled: !changed.length },
          { id: 'discard', label: 'Discard', variant: 'outline', disabled: !changed.length },
        ],
        description: saved?.description,
        details: saved
          ? [
              { label: 'Validation', value: saved.validation, mono: true },
              { label: 'Origin', value: saved.origin },
            ]
          : undefined,
      },
      staged,
      tab,
      tabAction: 'tab',
      tabs: [
        {
          id: 'details',
          label: 'Details',
          rows: [
            {
              panels: saved
                ? [
                    { kind: 'form', title: 'Model', aside: 'edits stage until you save', options: { name: 'record', fields: FIELDS, rowConfig: ROWS } },
                    { kind: 'json', title: 'record.json', aside: `as saved · v${version}`, width: 340, flush: true, options: { value: { ...saved } } },
                  ]
                : [{ kind: 'text', title: 'Model', options: { text: 'Fetching the record…' } }],
            },
          ],
        },
        { id: 'usage', label: 'Usage', locked: true, rows: [] },
      ],
      rows: [],
    };

    return (
      <Surface last={last}>
        <Form {...form}>
          <Dashboard
            className="min-h-0 flex-1"
            spec={spec}
            registry={{ form: FormPanel as never }}
            icons={ICONS}
            onAction={(id, ctx) => {
              setLast([id, ctx?.itemId, ctx?.option].filter(Boolean).join(' · '));
              if (id === 'tab' && ctx?.option) setTab(ctx.option);
              if (id === 'save') void save();
              if (id === 'discard' && saved) form.reset({ record: saved });
              if (id === 'discard-one' && saved && ctx?.itemId) {
                const key = ctx.itemId as keyof Model;
                form.setValue(`record.${key}`, saved[key], { shouldDirty: true });
              }
            }}
          />
        </Form>
      </Surface>
    );
  },
};
