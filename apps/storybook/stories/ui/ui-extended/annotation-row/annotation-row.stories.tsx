import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { AnnotationRow as Component, Button, type AnnotationRowProps } from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/annotation-row.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log, type Variant } from '../../../_story/variant-grid';

interface Row extends Omit<AnnotationRowProps, 'trailing' | 'onSelect' | 'selected'> {
  id: string;
  /** Not on this board: draw *Load*. */
  load?: boolean;
}

interface AnnotationRowVariant extends Variant {
  rows: Row[];
}

const VARIANTS = VARIANTS_JSON as AnnotationRowVariant[];

interface Args {
  variant: string;
  onSelect: (id: string) => void;
  onLoad: (id: string) => void;
}

const meta = {
  title: 'UI/UI Extended/AnnotationRow',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { AnnotationRow, Button } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { rows: v.rows },
              setup: '// onSelect receives the annotation\'s id; onLoad the one whose records to load.',
              call: [
                'rows.map(({ id, load, ...row }) => (',
                '  <AnnotationRow key={id} {...row} selected={selected === id} onSelect={() => onSelect(id)}',
                '    trailing={load ? <Button size="xs" variant="outline" onClick={() => onLoad(id)}>Load</Button> : undefined} />',
                '))',
              ].join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onSelect: fn(), onLoad: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

function List({ v, args, log }: { v: AnnotationRowVariant; args: Args; log: Log }) {
  const [selected, setSelected] = React.useState<string | null>(null);
  return v.rows.map(({ id, load, ...row }) => (
    <Component
      key={id}
      {...row}
      selected={selected === id}
      onSelect={() => {
        setSelected(id);
        args.onSelect(id);
        log('onSelect', id);
      }}
      {...(load
        ? {
            trailing: (
              <Button
                size="xs"
                variant="outline"
                onClick={() => {
                  args.onLoad(id);
                  log('onLoad', id);
                }}
              >
                Load
              </Button>
            ),
          }
        : {})}
    />
  ));
}

/**
 * The Annotations panel's row: the kind as a tile in the annotation's colour, the text (two lines),
 * then what it is on, who wrote it, and the marks a reader scans for — changed since written, record
 * gone, this session only, its walkthrough step. Elsewhere in the graph rows are dimmed, with *Load*.
 */
export const AnnotationRow: Story = {
  render: (args) => (
    <VariantGrid variants={VARIANTS} variant={args.variant}>
      {(v, log) => <List v={v} args={args} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const root = within(canvasElement);
    await step('Select a row', async () => {
      const cell = within(root.getByRole('group', { name: 'On this board' }));
      const row = cell.getByRole('button', { name: /Slipping since the summer schedule/ });
      await userEvent.click(row);
      await expect(args.onSelect).toHaveBeenCalledWith('c2');
      await expect(row).toHaveAttribute('aria-pressed', 'true');
    });
    await step('Load what is elsewhere', async () => {
      const cell = within(root.getByRole('group', { name: 'Elsewhere, and gone' }));
      await userEvent.click(cell.getByRole('button', { name: 'Load' }));
      await expect(args.onLoad).toHaveBeenCalledWith('e1');
    });
  },
};
