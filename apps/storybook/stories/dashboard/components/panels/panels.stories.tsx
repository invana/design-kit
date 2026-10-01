import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  Dashboard,
  RUN_PANELS,
  type ActionContext,
  type DashboardSpec,
  type ParamsOptions,
  type RunPanelOptions,
} from '@invana/dashboard';

import data from '../../../../fixtures/dashboard/panels.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Log, type Variant } from '../../../_story/variant-board';
import { ICONS, mapPanels, patchPanel } from '../../_fixtures';

type Spec = DashboardSpec<RunPanelOptions>;
type Panel = Spec['rows'][number]['panels'][number];

interface PanelVariant extends Variant {
  panel: Panel;
}

// JSON widens the literal unions (`"succeeded"`, `"warning"`); the shape is the dashboard's own.
const VARIANTS = data as unknown as PanelVariant[];

const RUN_KINDS = new Set(Object.keys(RUN_PANELS));

/** What each kind sends, as the Code tab says it. Kinds that send nothing are left out. */
const SENDS: Record<string, string> = {
  trace: '// A row picked → onAction("select-step", { panelId: "trace", stepId: "execute_query" })',
  gantt: '// A task picked → onAction("select-task", { panelId: "performance", taskKey: "fetch_source" })',
  list: '// A row picked → onAction("open-run", { panelId: "artifacts-list", itemId: "run-7d31" })',
  params: '// Every edit → onAction("edit-param", { panelId: "params", param: { name, source, value } })',
  text: '// A button → onAction("retry", { panelId: "notice" })',
  artifacts: '// Open or download → onAction("open-file", { panelId: "files", itemId: "<digest>" })',
  layers:
    '// A bar picked → onAction("select-item", { panelId: "layers", itemId: "fetch" })\n// The Fit switch → onAction("fit", { panelId: "layers", pressed: false })',
};

interface Args {
  variant: string;
  onAction: (id: string, ctx?: ActionContext) => void;
}

const meta = {
  title: 'Dashboard/Components/Panels',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { Dashboard, RUN_PANELS } from '@invana/dashboard';"],
            picked.map((v) => ({
              comment: `${v.caption} — kind "${v.panel.kind}"`,
              data: { spec: { rows: [{ panels: [v.panel] }] } },
              setup: SENDS[v.panel.kind]
                ? `${SENDS[v.panel.kind]}\nconst onAction = (id, ctx) => api.send({ id, ...ctx });`
                : undefined,
              call: jsx('Dashboard', {
                spec: 'spec',
                registry: RUN_KINDS.has(v.panel.kind) ? 'RUN_PANELS' : undefined,
                icons: v.panel.kind === 'list' ? 'icons' : undefined,
                onAction: SENDS[v.panel.kind] ? 'onAction' : undefined,
              }),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: VARIANTS[0].caption, onAction: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** What a consumer does with each action: move the selection, keep the edit, act on the notice. */
function answer(spec: Spec, id: string, ctx: ActionContext = {}): Spec {
  const panelId = ctx.panelId;
  switch (id) {
    case 'select-step':
      return patchPanel(spec, panelId, { selectedId: ctx.stepId });
    case 'select-task':
      return patchPanel(spec, panelId, { selectedKey: ctx.taskKey });
    case 'select-item':
      return patchPanel(spec, panelId, { selectedItem: ctx.itemId });
    case 'edit-param':
      return mapPanels(spec, (p) =>
        p.id === panelId && ctx.param
          ? {
              ...p,
              options: {
                ...p.options,
                params: (p.options as ParamsOptions).params.map((x) =>
                  x.name === ctx.param!.name ? { ...x, value: ctx.param!.value, source: ctx.param!.source } : x,
                ),
              },
            }
          : p,
      );
    case 'fit':
      return mapPanels(spec, (p) =>
        p.id === panelId
          ? { ...p, actions: p.actions?.map((a) => (a.id === 'fit' ? { ...a, pressed: ctx.pressed } : a)), options: { ...p.options, fit: ctx.pressed } }
          : p,
      );
    case 'retry':
      return patchPanel(spec, panelId, { tone: 'info', text: 'Retrying fetch_source…', actions: undefined });
    case 'dismiss':
      return patchPanel(spec, panelId, { tone: 'muted', callout: false, text: 'Dismissed.', actions: undefined });
    default:
      // open-run, open-file, download-file: the consumer navigates; the panel itself does not change.
      return spec;
  }
}

/** A state holder: a one-panel spec, patched as each action is answered. */
function Live({ variant, log, onAction }: { variant: PanelVariant; log: Log; onAction: Args['onAction'] }) {
  const [spec, setSpec] = React.useState<Spec>({ rows: [{ panels: [variant.panel] }] });
  return (
    <Dashboard
      spec={spec}
      registry={RUN_PANELS}
      icons={ICONS}
      onAction={(id, ctx) => {
        onAction(id, ctx);
        log(`onAction("${id}")`, ctx);
        setSpec((s) => answer(s, id, ctx));
      }}
    />
  );
}

/**
 * Every panel kind a dashboard draws that is not a block — one cell each, from
 * `fixtures/dashboard/panels.json`, drawn through `<Dashboard spec>` with a one-panel spec.
 * `json`, `code`, `exchange`, `gantt`, `log`, `list`, `params` and `text` are built in; `trace`,
 * `touched`, `attempts`, `artifacts`, `layers`, `lens` and `clarification` arrive with
 * `registry={RUN_PANELS}`. Every block kind is a panel kind too — those are under `Blocks`.
 *
 * Each action reaches `onAction(id, { panelId, … })`, is written under the cell, and is answered
 * as a consumer would: a picked step, task or bar is selected, a parameter edit is kept, the
 * notice's buttons act. One kind is drawn at a time; pick another with `variant`.
 */
export const Panels: Story = {
  render: ({ variant, onAction }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => <Live variant={v} log={log} onAction={onAction} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Trace' }));
    await step('Pick a step out of the run', async () => {
      await userEvent.click(cell.getByRole('button', { name: /execute_query/ }));
      await expect(args.onAction).toHaveBeenCalledWith('select-step', { panelId: 'trace', stepId: 'execute_query' });
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"stepId": "execute_query"');
    });
  },
};
