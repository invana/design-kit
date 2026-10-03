import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { FilterBar, FilterChip, PanelBox, RunRow } from '@invana/ui';

import DATA from '../../../../fixtures/ui-extended/run-row.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log } from '../../../_story/variant-grid';

interface Run {
  address: string;
  title: string;
  titleMono?: boolean;
  meta: string;
  status: string;
  depth: number;
}
interface RunRowVariant {
  caption: string;
  width?: number;
  /** Present means the rows are pickable. */
  selected?: string;
  summary?: string;
  filters?: { label: string; value?: string; active?: boolean }[];
  runs: Run[];
}

const VARIANTS = DATA as RunRowVariant[];

interface Args {
  variant: string;
  onSelect: (address: string) => void;
  onRemove: (filter: string) => void;
}

function Journal({ v, log, onSelect, onRemove }: { v: RunRowVariant; log: Log } & Omit<Args, 'variant'>) {
  const [selected, setSelected] = React.useState(v.selected);
  const [filters, setFilters] = React.useState(v.filters ?? []);
  const pickable = v.selected != null;
  return (
    <PanelBox flush>
      {v.filters ? (
        <FilterBar summary={v.summary}>
          {filters.map((f) => (
            <FilterChip
              key={f.label}
              label={f.label}
              value={f.value}
              active={f.active}
              onRemove={
                f.value != null
                  ? () => {
                      onRemove(f.label);
                      log('onRemove', f.label);
                      setFilters((all) => all.map((x) => (x.label === f.label ? { label: x.label } : x)));
                    }
                  : undefined
              }
            />
          ))}
        </FilterBar>
      ) : null}
      {v.runs.map((run) => (
        <RunRow
          key={run.address}
          status={run.status}
          address={run.address}
          title={run.title}
          titleMono={run.titleMono}
          meta={run.meta}
          depth={run.depth}
          selected={pickable && selected === run.address}
          onSelect={
            pickable
              ? () => {
                  onSelect(run.address);
                  log('onSelect', run.address);
                  setSelected(run.address);
                }
              : undefined
          }
        />
      ))}
    </PanelBox>
  );
}

const meta = {
  title: 'UI/UI Extended/RunRow',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { FilterBar, FilterChip, PanelBox, RunRow } from '@invana/ui';"],
            picked.map((v) => {
              const pickable = v.selected != null;
              return {
                comment: v.caption,
                data: { runs: v.runs, ...(v.filters ? { filters: v.filters } : {}) },
                setup: pickable
                  ? [
                      `const [selected, setSelected] = React.useState(${JSON.stringify(v.selected)});`,
                      '// `onSelect` takes no argument — each row closes over its run: onSelect("c0193ab7").',
                      'const onSelect = (address) => setSelected(address);',
                      '// `onRemove` clears one set filter: onRemove("since").',
                      'const onRemove = (label) => clearFilter(label);',
                    ].join('\n')
                  : undefined,
                call: [
                  '<PanelBox flush>',
                  ...(v.filters
                    ? [
                        `  <FilterBar summary="${v.summary}">`,
                        '    {filters.map((f) => (',
                        '      <FilterChip key={f.label} {...f} onRemove={f.value ? () => onRemove(f.label) : undefined} />',
                        '    ))}',
                        '  </FilterBar>',
                      ]
                    : []),
                  '  {runs.map((run) => (',
                  pickable
                    ? '    <RunRow key={run.address} {...run} selected={selected === run.address} onSelect={() => onSelect(run.address)} />'
                    : '    <RunRow key={run.address} {...run} />',
                  '  ))}',
                  '</PanelBox>',
                ].join('\n'),
              };
            }),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onSelect: fn(), onRemove: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * The journal: everything that has run in this Graph, newest first — from
 * `fixtures/ui-extended/run-row.json`. A question, a bundle, two imports under it, an
 * enrichment parked on a person: **one row type, because they are one record**. The status is the
 * glyph in front, never a word on the row; children sit **under** the run that spawned them,
 * indented; a query reads mono. Pick a run, or clear the `since` filter — both are logged.
 */
export const RunRowStory: Story = {
  name: 'RunRow',
  render: ({ variant, onSelect, onRemove }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <Journal v={v} log={log} onSelect={onSelect} onRemove={onRemove} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: VARIANTS[0].caption }));
    await step('Pick the bundle', async () => {
      await userEvent.click(cell.getByRole('button', { name: /Nightly bundle/ }));
      await expect(args.onSelect).toHaveBeenCalledWith('c0193ab7');
      await expect(cell.getByRole('button', { name: /Nightly bundle/ })).toHaveAttribute('aria-current', 'true');
    });
    await step('Clear the since filter', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Clear since' }));
      await expect(args.onRemove).toHaveBeenCalledWith('since');
      await expect(cell.queryByRole('button', { name: 'Clear since' })).toBeNull();
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('onRemove"since"');
    });
  },
};
