import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Badge, RecordHeader, RecordPager, SegmentedControl } from '@invana/ui';

import VARIANTS from '../../../../fixtures/ui-extended/record-pager.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log } from '../../../_story/variant-grid';

type Variant = (typeof VARIANTS)[number];

interface Args {
  variant: string;
  onPrevious: (index: number) => void;
  onNext: (index: number) => void;
}

const IMPORTS = ["import { Badge, RecordHeader, RecordPager, SegmentedControl } from '@invana/ui';"];

function pagerCall(v: Variant) {
  return jsx('RecordPager', {
    position: '`' + v.noun + ' ${index + 1} of ${records.length}`',
    previousLabel: { literal: `Previous ${v.noun}` },
    nextLabel: { literal: `Next ${v.noun}` },
    onPrevious: 'index > 0 ? onPrevious : undefined',
    onNext: 'index < records.length - 1 ? onNext : undefined',
  });
}

const meta = {
  title: 'UI/UI Extended/RecordPager',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            IMPORTS,
            picked.map((v) => ({
              comment: v.caption,
              data: { records: v.records, ...('header' in v && v.header ? { header: v.header } : {}) },
              setup: [
                `const [index, setIndex] = React.useState(${v.start});`,
                '// Neither callback carries a value: the pager only asks for the record before or after.',
                'const onPrevious = () => setIndex(index - 1);',
                'const onNext = () => setIndex(index + 1);',
              ].join('\n'),
              call:
                'header' in v && v.header
                  ? [
                      '<RecordHeader',
                      '  tone={header.tone}',
                      '  crumbs={[...header.crumbs, records[index]]}',
                      '  chips={header.chips.map((c) => <Badge key={c} variant="outline" size="xs" tone="muted">{c}</Badge>)}',
                      '  actions={<>',
                      '    <SegmentedControl size="sm" aria-label="How to read this step" options={header.readings} />',
                      '    ' + pagerCall(v).split('\n').join('\n    '),
                      '  </>}',
                      '/>',
                    ].join('\n')
                  : pagerCall(v),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onPrevious: fn(), onNext: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Holds the index a consumer holds; the pager only asks to move it. */
function Live({ v, log, onPrevious, onNext }: { v: Variant; log: Log } & Omit<Args, 'variant'>) {
  const [index, setIndex] = React.useState(v.start);
  const last = v.records.length - 1;
  const pager = (
    <RecordPager
      position={`${v.noun} ${index + 1} of ${v.records.length}`}
      previousLabel={`Previous ${v.noun}`}
      nextLabel={`Next ${v.noun}`}
      onPrevious={
        index > 0
          ? () => {
              onPrevious(index - 1);
              log('onPrevious', { index: index - 1, record: v.records[index - 1] });
              setIndex(index - 1);
            }
          : undefined
      }
      onNext={
        index < last
          ? () => {
              onNext(index + 1);
              log('onNext', { index: index + 1, record: v.records[index + 1] });
              setIndex(index + 1);
            }
          : undefined
      }
    />
  );
  if (!('header' in v) || !v.header) return pager;
  const { header } = v;
  return (
    <RecordHeader
      tone={header.tone as 'success'}
      crumbs={[...header.crumbs, `step ${v.records[index]}`]}
      chips={header.chips.map((c) => (
        <Badge key={c} variant="outline" size="xs" tone="muted">
          {c}
        </Badge>
      ))}
      actions={
        <>
          <SegmentedControl size="sm" aria-label="How to read this step" options={header.readings} />
          {pager}
        </>
      }
    />
  );
}

/**
 * The record before this one, and the one after — walking a run one step at a time from the
 * step's own pagehead, from `fixtures/ui-extended/record-pager.json`. The pager sits beside the
 * reading switch because both are moves on the record already open. At either end the control is
 * **disabled, not hidden** — a pager that drops a button moves the other one under the cursor.
 * Step through: each move is logged with the record it lands on.
 */
export const RecordPagerStory: Story = {
  name: 'RecordPager',
  render: ({ variant, onPrevious, onNext }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <Live v={v} log={log} onPrevious={onPrevious} onNext={onNext} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: VARIANTS[1].caption }));
    await step('Back is disabled at the first step', async () => {
      await expect(cell.getByRole('button', { name: 'Previous step' })).toBeDisabled();
    });
    await step('Next moves to the second step', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Next step' }));
      await expect(args.onNext).toHaveBeenCalledWith(1);
      await expect(cell.getByText('step 2 of 5')).toBeInTheDocument();
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('{ "index": 1, "record": "build_query" }');
    });
  },
};
