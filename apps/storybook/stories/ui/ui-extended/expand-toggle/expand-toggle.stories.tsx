import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ExpandToggle as Component, Stack, TypographyMuted } from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/expand-toggle.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Log, type Variant } from '../../../_story/variant-board';

interface ToggleVariant extends Variant {
  label?: string;
  open: boolean;
}

const VARIANTS = VARIANTS_JSON as ToggleVariant[];

interface Args {
  variant: string;
  onToggle: (open: boolean) => void;
}

function Live({ v, log, onToggle }: { v: ToggleVariant; log: Log; onToggle: Args['onToggle'] }) {
  const [open, setOpen] = React.useState(v.open);
  return (
    <Stack gap="xs">
      <Stack direction="row" gap="xs">
        <Component
          open={open}
          label={v.label}
          onClick={() => {
            onToggle(!open);
            log('onClick', !open);
            setOpen(!open);
          }}
        />
        {v.label ?? 'row'}
      </Stack>
      <Stack direction="row" gap="xs">
        <Component.Spacer />
        <TypographyMuted>a leaf keeps the chevron's room</TypographyMuted>
      </Stack>
    </Stack>
  );
}

const meta = {
  title: 'UI/UI Extended/ExpandToggle',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { ExpandToggle } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              setup: `const [open, setOpen] = React.useState(${v.open});`,
              call: [
                jsx('ExpandToggle', {
                  open: 'open',
                  label: v.label ? { literal: v.label } : undefined,
                  onClick: '() => setOpen(!open)',
                }),
                '<ExpandToggle.Spacer /> {/* a leaf beside it */}',
              ].join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onToggle: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * The chevron that opens a row into the rows under it — a `DataTable`'s sub-rows, a `TaskGantt`'s
 * subtasks, a `HeatStrip`'s children — so every tree in the kit opens alike. With a `label` it
 * reads `Open fetch_filings` / `Close fetch_filings`; without, `Expand row` / `Collapse row`. A
 * click never reaches the row around it, so opening a pickable row does not pick it.
 * `ExpandToggle.Spacer` keeps a leaf's text in line with its expandable siblings.
 */
export const ExpandToggle: Story = {
  render: ({ variant, onToggle }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => <Live v={v} log={log} onToggle={onToggle} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Closed' }));
    await step('Open it', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Open fetch_filings' }));
      await expect(args.onToggle).toHaveBeenCalledWith(true);
      await expect(cell.getByRole('button', { name: 'Close fetch_filings' })).toHaveAttribute('aria-expanded', 'true');
    });
  },
};
