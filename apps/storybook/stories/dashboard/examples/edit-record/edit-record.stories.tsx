import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { useForm, useFormContext, useWatch } from 'react-hook-form';
import { Dashboard, type ActionContext, type DashboardSpec, type PanelRendererProps, type StagedSpec } from '@invana/dashboard';
import { Form, FormField, type FieldConfig, type RowConfig } from '@invana/forms';

import page from '../../../../fixtures/dashboards/edit-record.json';
import { jsx, snippet } from '../../../_story/source';
import { ICONS, Surface, mapPanels, useLoaded, useSent } from '../../_fixtures';

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
type Model = typeof page.record;
type Spec = DashboardSpec<WithForm>;

// JSON widens the literal unions (`"success"`, `"text"`); the shape is the dashboard's own.
const SPEC = page.spec as unknown as Spec;
const LOADING = page.loading as unknown as Spec['rows'][number]['panels'];

interface Args {
  onAction: (id: string, ctx?: ActionContext) => void;
}

const meta = {
  title: 'Dashboard/Examples/Edit Record',
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: {
        language: 'tsx',
        code: snippet({
          imports: [
            "import { useForm } from 'react-hook-form';",
            "import { Dashboard } from '@invana/dashboard';",
            "import { Form } from '@invana/forms';",
            "import { FormPanel } from './form-panel'; // FormField.ObjectField over the panel's fields",
          ],
          data: { spec: SPEC },
          setup: [
            'const form = useForm({ defaultValues: { record } });',
            '// The header and the staged bar report through one callback:',
            '//   Save               → onAction("save")      → form.handleSubmit(write)',
            '//   Discard            → onAction("discard")   → form.reset({ record: saved })',
            '//   a staged item\'s × → onAction("discard-one", { itemId: "name" }) → put that field back',
            '//   a tab              → onAction("tab", { option: "usage" })',
            '// …and the page re-derives `staged`, the chips and the disabled buttons from what changed.',
          ].join('\n'),
          call: `<Form {...form}>\n  ${jsx('Dashboard', { spec: 'spec', registry: '{ form: FormPanel }', icons: 'icons', onAction: 'onAction' }).replace(/\n/g, '\n  ')}\n</Form>`,
        }),
      },
    },
  },
  args: { onAction: fn() },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

const same = (a: unknown, b: unknown) => String(a) === String(b);

/** The page for one state of the record: loading, saved, or with edits staged. */
function view(saved: Model | null, values: Model | undefined, version: number, tab: string): Spec {
  if (!saved)
    return {
      ...SPEC,
      header: { ...SPEC.header!, tone: 'running', crumbs: [SPEC.header!.crumbs[0], 'Loading…'], chips: [{ label: 'loading', tone: 'running' }], description: undefined, details: undefined },
      tabs: SPEC.tabs!.map((t, i) => (i === 0 ? { ...t, rows: [{ panels: LOADING }] } : t)),
    };

  const changed = values ? (Object.keys(saved) as (keyof Model)[]).filter((k) => !same(values[k], saved[k])) : [];
  const staged: StagedSpec | undefined = changed.length
    ? {
        items: changed.map((k) => ({ id: k, op: 'change', name: k, note: `${saved[k]} → ${values![k]}` })),
        discardAction: 'discard-one',
        discardAllAction: 'discard',
      }
    : undefined;
  const header = SPEC.header!;
  const spec: Spec = {
    ...SPEC,
    tab,
    staged,
    header: {
      ...header,
      tone: changed.length ? 'warning' : 'success',
      crumbs: [header.crumbs[0], saved.name],
      chips: [changed.length ? { label: `${changed.length} unsaved`, tone: 'warning' } : { label: `v${version} · saved`, variant: 'outline' }],
      actions: header.actions?.map((a) => ({ ...a, disabled: !changed.length })),
      description: saved.description,
      details: header.details?.map((d) => ({ ...d, value: String(saved[(d as { field?: keyof Model }).field!]) })),
    },
  };
  return mapPanels(spec, (p) => (p.id === 'saved' ? { ...p, aside: `as saved · v${version}`, options: { value: { ...saved } } } : p));
}

function Live({ onAction }: Args) {
  const [sent, record] = useSent(onAction);
  const [saved, setSaved] = React.useState<Model | null>(null);
  const [version, setVersion] = React.useState(1);
  const [tab, setTab] = React.useState(SPEC.tab ?? 'details');
  const loaded = useLoaded(page.record);
  const form = useForm<{ record: Model }>();
  const values = useWatch({ control: form.control, name: 'record' });

  React.useEffect(() => {
    if (!loaded) return;
    setSaved(loaded);
    form.reset({ record: loaded });
  }, [loaded, form]);

  const save = form.handleSubmit(({ record: next }) => {
    const written = { ...next, retentionDays: Number(next.retentionDays) };
    setSaved(written);
    setVersion((v) => v + 1);
    form.reset({ record: written });
  });

  return (
    <Surface sent={sent}>
      <Form {...form}>
        <Dashboard
          className="min-h-0 flex-1"
          spec={view(saved, values, version, tab)}
          registry={{ form: FormPanel as never }}
          icons={ICONS}
          onAction={(id, ctx) => {
            record(id, ctx);
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
}

/**
 * **Load, edit, save** — a record opened in a dashboard with a form on it; the page, the record
 * and the fields are `fixtures/dashboards/edit-record.json`.
 *
 * The record arrives after the page draws and fills the form (`reset`). Every field that now
 * differs from what was saved is listed in the `staged` bar, each with its own `×`; **Save** and
 * **Discard** in the header stay disabled until there is something to save. Save writes the
 * values back as the new saved record — shown beside the form as `record.json` — and the staged
 * bar empties. The `form` kind is the consumer's registry entry, not a built-in. Every action is
 * written in the footer.
 */
export const EditRecord: Story = {
  render: (args) => <Live {...args} />,
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const name = await canvas.findByRole('textbox', { name: 'Name' }, { timeout: 3000 });
    await step('An edit is staged', async () => {
      await userEvent.clear(name);
      await userEvent.type(name, 'AirRoutes v2');
      await expect(canvas.getByRole('region', { name: 'Staged changes' })).toHaveTextContent('1 staged');
    });
    await step('Save writes it back', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Save' }));
      await expect(args.onAction).toHaveBeenCalledWith('save', undefined);
      await expect(await canvas.findByText('v2 · saved')).toBeInTheDocument();
      await expect(canvas.queryByRole('region', { name: 'Staged changes' })).toBeNull();
      await expect(canvas.getByRole('list', { name: 'Events' })).toHaveTextContent('onAction("save")');
    });
  },
};
