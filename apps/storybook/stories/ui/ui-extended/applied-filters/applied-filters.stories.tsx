import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { AppliedFilters as Component, type AppliedFilter } from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/applied-filters.json';
import { attrs, jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log, type Variant } from '../../../_story/variant-grid';

interface FiltersVariant extends Variant {
  filters: AppliedFilter[];
  setBy?: string;
}

const VARIANTS = VARIANTS_JSON as FiltersVariant[];

interface Args {
  variant: string;
  onRemove: (field: string, value: string) => void;
  onClearAll: () => void;
}

const meta = {
  title: 'UI/UI Extended/AppliedFilters',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { AppliedFilters } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { filters: v.filters },
              setup: [
                '// onRemove receives the field and value of the chip whose × was pressed.',
                'const onRemove = (field, value) => {};',
                'const onClearAll = () => {};',
              ].join('\n'),
              call: jsx('AppliedFilters', {
                filters: 'filters',
                ...attrs({ setBy: v.setBy }),
                onRemove: 'onRemove',
                onClearAll: 'onClearAll',
              }),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onRemove: fn(), onClearAll: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

function Cell({ v, args, log }: { v: FiltersVariant; args: Args; log: Log }) {
  const [filters, setFilters] = React.useState(v.filters);
  return (
    <Component
      filters={filters}
      setBy={v.setBy}
      onRemove={(field, value) => {
        args.onRemove(field, value);
        log('onRemove', [field, value]);
        setFilters((all) => all.filter((f) => !(f.field === field && f.value === value)));
      }}
      onClearAll={() => {
        args.onClearAll();
        log('onClearAll', null);
        setFilters([]);
      }}
    />
  );
}

/**
 * The filters narrowing a list, read back as one line over it: `Filtered`, a chip per filter
 * with the × that drops it, who set them when it was not the reader, and `Clear all`.
 *
 * Each chip is a `FilterChip` in `readOnly` — shown, not picked; the list's `FilterBar` is where
 * a filter is chosen. With no filters the strip draws nothing.
 */
export const AppliedFilters: Story = {
  render: (args) => (
    <VariantGrid variants={VARIANTS} variant={args.variant}>
      {(v, log) => <Cell v={v} args={args} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('Drop one filter', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Set by the assistant' }));
      await expect(cell.getByText('set by the assistant')).toBeInTheDocument();
      await userEvent.click(cell.getByRole('button', { name: 'Remove status not served' }));
      await expect(args.onRemove).toHaveBeenCalledWith('status', 'not_served');
      await expect(cell.queryByText('not served')).toBeNull();
    });
    await step('Clear all removes the strip', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Set by the reader' }));
      await userEvent.click(cell.getByRole('button', { name: 'Clear all' }));
      await expect(args.onClearAll).toHaveBeenCalled();
      await expect(cell.queryByRole('group', { name: 'Applied filters' })).toBeNull();
    });
  },
};
