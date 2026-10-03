import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, within } from 'storybook/test';
import { useForm } from 'react-hook-form';
import { SettingsPanel, type FieldConfig, type FieldValues, type GroupConfig } from '@invana/forms';

import spec from '../../../fixtures/forms/inspector.json';
import { jsx, snippet } from '../../_story/source';
import { VariantGrid, type Log } from '../../_story/variant-grid';
import { withLists } from '../form-source';

type ShapeKind = keyof typeof spec.geometryByKind;

const LISTS = { presets: spec.presets };
const REST = withLists(spec.rest, LISTS);
const [SIZE, ...STYLE] = REST;
const GROUPS = spec.groupConfig as GroupConfig[];
const VARIANTS = [{ caption: 'Inspector', width: 360 }];

/**
 * The full NodeStyle field set as one grouped `FieldConfig[]`. Geometry numerics vary with the
 * current `shapeKind` (a discriminated union), so this is a function of the live values.
 */
const fieldsFor = (kind: ShapeKind): FieldConfig[] => [
  spec.shapeKind as FieldConfig,
  ...((spec.geometryByKind[kind] ?? []) as FieldConfig[]),
  SIZE!,
  ...STYLE,
];

interface Args {
  onChange: (change: { name?: string; value: unknown }) => void;
}

function Live({ log, onChange }: Args & { log: Log }) {
  const form = useForm<FieldValues>({ defaultValues: spec.defaultValues });
  // Watch the shape kind so the Geometry section swaps its numerics live.
  const kind = form.watch(`${spec.name}.shapeKind`) as ShapeKind;

  // An inspector saves as you go: every change is the event.
  React.useEffect(() => {
    const sub = form.watch((values, { name }) => {
      const value = name?.split('.').reduce<unknown>((v, k) => (v as Record<string, unknown>)?.[k], values);
      onChange({ name, value });
      log('onChange', { name, value });
    });
    return () => sub.unsubscribe();
  }, [form, onChange, log]);

  return (
    <SettingsPanel
      title={spec.title}
      form={form}
      name={spec.name}
      fields={fieldsFor(kind)}
      groupConfig={GROUPS}
      labelPosition="top"
      size="xs"
      columns={2}
    />
  );
}

const meta = {
  title: 'Forms/Generated/Inspector',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        code: snippet({
          imports: ["import { useForm } from 'react-hook-form';", "import { SettingsPanel } from '@invana/forms';"],
          comment: 'A docked inspector: grouped FieldConfigs, each `group` a collapsible section with a count badge',
          data: {
            shapeKind: spec.shapeKind,
            geometryByKind: spec.geometryByKind,
            style: REST,
            groupConfig: GROUPS,
            defaultValues: spec.defaultValues,
          },
          setup: [
            'const form = useForm({ defaultValues });',
            '// The shape picks its own geometry fields — recomputed from the live value.',
            `const kind = form.watch("${spec.name}.shapeKind");`,
            'const fields = [shapeKind, ...geometryByKind[kind], ...style];',
            '// Saves as you go: hear every change with form.watch — { name: "style.shapeKind", value: "rect" }.',
            'React.useEffect(() => form.watch((values, { name }) => save(name, values)).unsubscribe, [form]);',
          ].join('\n'),
          call: jsx('SettingsPanel', {
            title: { literal: spec.title },
            form: 'form',
            name: { literal: spec.name },
            fields: 'fields',
            groupConfig: 'groupConfig',
            labelPosition: { literal: 'top' },
            size: { literal: 'xs' },
            columns: '2',
          }),
        }),
      },
    },
  },
  args: { onChange: fn() },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * A docked inspector: the dense side panel beside a canvas or a graph, built with
 * `SettingsPanel` at `size="xs"`, from `fixtures/forms/inspector.json`. The field set is the
 * real `NodeStyle` editor schema: grouped `FieldConfig`s across **Geometry**, **Background**,
 * **Stroke** and **Label**, mixing colour pickers with presets, numeric inputs with
 * `min`/`max`/`step`, selects and text.
 *
 * **Geometry** shows the discriminated-union pattern: changing `Shape` swaps in that kind's
 * numerics (radius vs width/height vs sides…), recomputed via `form.watch`. Every change is
 * written under the panel.
 */
export const Inspector: Story = {
  render: (args) => <VariantGrid variants={VARIANTS}>{(_v, log) => <Live {...args} log={log} />}</VariantGrid>,
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Inspector' }));
    await step('Change the shape to a rectangle', async () => {
      await userEvent.click(cell.getByRole('combobox', { name: 'Shape' }));
      await userEvent.click(await screen.findByRole('option', { name: 'Rectangle' }));
      await expect(args.onChange).toHaveBeenCalledWith({ name: `${spec.name}.shapeKind`, value: 'rect' });
    });
    await step('Geometry swaps to the rectangle\'s fields', async () => {
      await expect(cell.getByText('Width')).toBeInTheDocument();
      await expect(cell.queryByText('Radius')).toBeNull();
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"value": "rect"');
    });
  },
};
