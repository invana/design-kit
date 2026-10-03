import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Board, type ActionContext, type BoardSpec, type ParamsOptions } from '@invana/boards';

import page from '../../../../fixtures/boards/task-parameters.json';
import { jsx, snippet } from '../../../_story/source';
import { FlowPanel, ICONS, Surface, mapPanels, useLoaded, useSent, type WithFlow } from '../../_fixtures';

type Param = ParamsOptions['params'][number];
type Spec = BoardSpec<WithFlow>;

// JSON widens the literal unions (`"binding"`, `"success"`); the shape is the board's own.
const SPEC = page.spec as unknown as Spec;
const PARAMS = page.params as Param[];
const LOADING = page.loading;
const REQUIRED = new Set(PARAMS.filter((p) => p.type?.includes('required')).map((p) => p.name));

interface Args {
  onAction: (id: string, ctx?: ActionContext) => void;
}

const meta = {
  title: 'Boards/Use Cases/Task Parameters',
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: {
        language: 'tsx',
        code: snippet({
          imports: [
            "import { Board } from '@invana/boards';",
            "import { Check, ChevronLeft, ChevronRight } from 'lucide-react'; // any icon set",
            "import { FlowPanel } from './flow-panel'; // your canvas, registered as `flow`",
          ],
          data: { spec: SPEC, params: PARAMS },
          setup: [
            '// Every edit → onAction("edit-param", { panelId: "params", param: { name, source, value } })',
            '//   → keep it in `params`, mark a required one left empty `invalid`, and re-derive the page:',
            '//     the staged bar (one item per changed parameter), the chips, Validation, Save / Publish.',
            '// A staged item\'s × → onAction("revert-one", { itemId: "batch_size" }) → put that one back',
            '// Save to draft      → onAction("save", { panelId: "footer" })          → the edits become the saved set',
            '// Revert this task   → onAction("revert", { panelId: "footer" })        → throw them away',
            'const icons = { prev: ChevronLeft, next: ChevronRight, check: Check };',
          ].join('\n'),
          call: jsx('Board', { spec: 'view(spec, params)', registry: '{ flow: FlowPanel }', icons: 'icons', onAction: 'onAction' }),
        }),
      },
    },
  },
  args: { onAction: fn() },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * The page for one state of the draft: `params` is what the form holds now (`null` until it
 * loads), `changed` the names that differ from what was saved.
 */
function view(params: Param[] | null, changed: string[], version: number): Spec {
  const problems = params?.filter((p) => p.invalid).map((p) => p.name) ?? [];
  const dirty = changed.length > 0;
  const header = SPEC.header!;
  const spec: Spec = {
    ...SPEC,
    header: {
      ...header,
      tone: dirty ? 'warning' : 'success',
      chips: [
        header.chips![0],
        dirty ? { label: `${changed.length} unsaved`, tone: 'warning' } : { label: `draft v5 · save ${version}`, variant: 'outline' },
      ],
      actions: header.actions?.map((a) => (a.id === 'publish' ? { ...a, disabled: dirty } : a)),
    },
    staged: dirty
      ? {
          items: changed.map((name) => ({ id: name, op: 'change', name, note: 'parameter' })),
          discardAction: 'revert-one',
          discardAllAction: 'revert',
        }
      : undefined,
  };
  return mapPanels(spec, (p) => {
    if (p.id === 'params')
      return params
        ? { ...p, asideChip: dirty ? { label: 'edited', tone: 'warning' } : p.asideChip, options: { ...p.options, params } }
        : LOADING;
    if (p.id === 'validation' && problems.length)
      return {
        ...p,
        asideChip: { label: `${problems.length} to fix`, tone: 'error' },
        options: { tone: 'error', text: `No value for ${problems.join(', ')}. A parameter the catalogue requires cannot be empty.` },
      };
    if (p.id === 'footer')
      return {
        ...p,
        options: {
          ...p.options,
          text: dirty ? 'Unsaved changes to this task — v4 is untouched until you publish.' : p.options.text,
          actions: p.options.actions.map((a: { id: string }) => ({
            ...a,
            disabled: a.id === 'save' ? !dirty || problems.length > 0 : !dirty,
          })),
        },
      };
    return p;
  });
}

function Live({ onAction }: Args) {
  const [sent, record] = useSent(onAction);
  const loaded = useLoaded(PARAMS);
  const [saved, setSaved] = React.useState<Param[] | null>(null);
  const [params, setParams] = React.useState<Param[] | null>(null);
  const [version, setVersion] = React.useState(1);

  React.useEffect(() => {
    setSaved(loaded);
    setParams(loaded);
  }, [loaded]);

  const changed =
    params && saved ? params.filter((p, i) => p.value !== saved[i].value || p.source !== saved[i].source).map((p) => p.name) : [];

  return (
    <Surface sent={sent}>
      <Board
        className="min-h-0 flex-1"
        spec={view(params, changed, version)}
        registry={{ flow: FlowPanel as never }}
        icons={ICONS}
        onAction={(id, ctx) => {
          record(id, ctx);
          if (id === 'edit-param' && ctx?.param) {
            const { name, source, value } = ctx.param;
            setParams(
              (ps) =>
                ps?.map((p) =>
                  p.name === name ? { ...p, source: source as Param['source'], value, invalid: REQUIRED.has(name) && !value.trim() } : p,
                ) ?? ps,
            );
          }
          if (id === 'revert-one' && ctx?.itemId && saved) {
            const was = saved.find((p) => p.name === ctx.itemId);
            setParams((ps) => ps?.map((p) => (p.name === ctx.itemId && was ? was : p)) ?? ps);
          }
          if (id === 'revert') setParams(saved);
          if (id === 'save') {
            setSaved(params);
            setVersion((v) => v + 1);
          }
        }}
      />
    </Surface>
  );
}

/**
 * **Load, edit, save** — a task's parameters, in a draft; the page and the saved parameters are
 * `fixtures/boards/task-parameters.json`.
 *
 * The draft's parameters arrive after the page draws. Each edit dispatches `edit-param` with
 * `{ name, source, value }` and the story keeps it; the `staged` bar lists every parameter that
 * differs from the last save, with an `×` to revert one. **Save to draft** commits them,
 * **Revert** throws them away, and emptying a required parameter fails validation and holds
 * Save. Every action is written in the footer.
 */
export const TaskParameters: Story = {
  render: (args) => <Live {...args} />,
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const dataset = await canvas.findByRole('textbox', { name: 'dataset' }, { timeout: 3000 });
    await step('Emptying a required parameter fails validation', async () => {
      await userEvent.clear(dataset);
      await expect(args.onAction).toHaveBeenLastCalledWith('edit-param', {
        panelId: 'params',
        param: { name: 'dataset', source: 'binding', value: '' },
      });
      await expect(canvas.getByText('1 to fix')).toBeInTheDocument();
      await expect(canvas.getByRole('button', { name: 'Save to draft' })).toBeDisabled();
    });
    await step('Revert it from the staged bar', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Discard this change' }));
      await expect(args.onAction).toHaveBeenLastCalledWith('revert-one', { itemId: 'dataset' });
      await expect(canvas.queryByRole('region', { name: 'Staged changes' })).toBeNull();
    });
    await step('Edit and save to the draft', async () => {
      await userEvent.type(canvas.getByRole('textbox', { name: 'batch_size' }), '0');
      await userEvent.click(canvas.getByRole('button', { name: 'Save to draft' }));
      await expect(args.onAction).toHaveBeenLastCalledWith('save', { panelId: 'footer' });
      await expect(canvas.getByText('draft v5 · save 2')).toBeInTheDocument();
      await expect(canvas.getByRole('list', { name: 'Events' })).toHaveTextContent('onAction("save")');
    });
  },
};
