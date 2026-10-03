import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { FloatingPanel as Component, PropertyList, PropertyRow } from '@invana/ui';

import DATA from '../../../../fixtures/ui-extended/floating-panel.json';
import { jsxWith, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log, type Variant } from '../../../_story/variant-grid';

interface PanelVariant extends Variant {
  title: string;
  aside?: string;
  summary?: string;
  footer?: string;
  collapsed?: boolean;
  /** No fold, no close: a panel the host keeps open. */
  fixed?: boolean;
  rows: { label: string; value: string }[];
}

const VARIANTS = DATA.variants as PanelVariant[];

interface Args {
  variant: string;
  onCollapsedChange: (collapsed: boolean) => void;
  onClose: () => void;
}

const meta = {
  title: 'UI/UI Extended/FloatingPanel',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { FloatingPanel, PropertyList, PropertyRow } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { rows: v.rows },
              setup: v.fixed
                ? undefined
                : `// Receives the folded state to go to.\nconst [collapsed, onCollapsedChange] = React.useState(${!!v.collapsed});`,
              call: jsxWith(
                'FloatingPanel',
                {
                  title: { literal: v.title },
                  aside: v.aside ? { literal: v.aside } : undefined,
                  summary: v.summary ? { literal: v.summary } : undefined,
                  footer: v.footer ? { literal: v.footer } : undefined,
                  collapsed: v.fixed ? undefined : 'collapsed',
                  onCollapsedChange: v.fixed ? undefined : 'onCollapsedChange',
                  onClose: v.fixed ? undefined : 'onClose',
                },
                '<PropertyList>\n  {rows.map((r) => <PropertyRow key={r.label} label={r.label}>{r.value}</PropertyRow>)}\n</PropertyList>',
              ),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onCollapsedChange: fn(), onClose: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

function Panel({ v, args, log }: { v: PanelVariant; args: Args; log: Log }) {
  const [collapsed, setCollapsed] = React.useState(!!v.collapsed);
  return (
    <Component
      title={v.title}
      aside={v.aside}
      summary={v.summary}
      footer={v.footer}
      collapsed={collapsed}
      onCollapsedChange={
        v.fixed
          ? undefined
          : (next) => {
              args.onCollapsedChange(next);
              log('onCollapsedChange', next);
              setCollapsed(next);
            }
      }
      onClose={
        v.fixed
          ? undefined
          : () => {
              args.onClose();
              log('onClose', undefined);
            }
      }
    >
      <PropertyList>
        {v.rows.map((r) => (
          <PropertyRow key={r.label} label={r.label}>
            {r.value}
          </PropertyRow>
        ))}
      </PropertyList>
    </Component>
  );
}

/**
 * A panel that floats over the work rather than taking a split of it — the frame the run's
 * activity and `LogCard` are drawn in. It folds to its bar, keeping one line of what it would say, and
 * closes; given neither callback it has neither control. Data:
 * `fixtures/ui-extended/floating-panel.json`.
 */
export const FloatingPanel: Story = {
  render: (args) => (
    <VariantGrid variants={VARIANTS} variant={args.variant}>
      {(v, log) => <Panel v={v} args={args} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('Folding hides the body and shows the summary', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Open, with a footer' }));
      await userEvent.click(cell.getByRole('button', { name: 'Collapse' }));
      await expect(args.onCollapsedChange).toHaveBeenCalledWith(true);
      await expect(cell.queryByText('10:21:00')).not.toBeInTheDocument();
    });
    await step('A folded panel opens again', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Folded, with its summary' }));
      await expect(cell.getByText('7 calls · 3 layers')).toBeInTheDocument();
      await userEvent.click(cell.getByRole('button', { name: 'Expand' }));
      await expect(args.onCollapsedChange).toHaveBeenCalledWith(false);
    });
  },
};
