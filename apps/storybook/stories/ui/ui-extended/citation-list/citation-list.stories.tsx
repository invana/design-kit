import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { CitationList as Component, CitationRow } from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/citation-list.json';
import { inline, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Log, type Variant } from '../../../_story/variant-board';

interface Row {
  kind?: string;
  marker?: number;
  source?: string;
  count?: string;
  text: string;
}

interface CitationVariant extends Variant {
  rows: Row[];
}

const VARIANTS = VARIANTS_JSON as CitationVariant[];

interface Args {
  variant: string;
  /** A row was picked — the reader followed its marker. */
  onSelect: (index: number) => void;
}

const meta = {
  title: 'UI/UI Extended/CitationList',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { CitationList, CitationRow } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { rows: v.rows },
              setup: [
                '// The row the reader is on — the one a lit marker in the prose points to.',
                'const [active, setActive] = React.useState(null);',
              ].join('\n'),
              call: [
                '<CitationList>',
                '  {rows.map(({ text, ...row }, i) => (',
                '    <CitationRow key={i} {...row} active={active === i} onClick={() => setActive(i)}>',
                '      {text}',
                '    </CitationRow>',
                '  ))}',
                '</CitationList>',
              ].join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onSelect: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

function List({ v, onSelect, log }: { v: CitationVariant; onSelect: Args['onSelect']; log: Log }) {
  const [active, setActive] = React.useState<number | null>(null);
  return (
    <Component>
      {v.rows.map(({ text, ...row }, i) => (
        <CitationRow
          key={i}
          {...row}
          active={active === i}
          onClick={() => {
            onSelect(i);
            log('onClick', { index: i, ...row });
            setActive(i);
          }}
        >
          {text}
        </CitationRow>
      ))}
    </Component>
  );
}

/**
 * The records an answer rests on. Kind first — it tells the reader whether the claim rests on the
 * right sort of evidence. Numbered rows are how an answer's markers resolve, each with the number
 * of records it contributed at the right. Pick a row and it becomes `active`, the one a lit marker
 * in the prose points to.
 */
export const CitationList: Story = {
  render: ({ variant, onSelect }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => <List v={v} onSelect={onSelect} log={log} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Numbered' }));
    await step('Follow marker 2', async () => {
      await userEvent.click(cell.getByText('Risk factor returns, v4'));
      await expect(args.onSelect).toHaveBeenCalledWith(1);
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent(
        inline({ index: 1, marker: 2, count: '5 days' }),
      );
    });
  },
};
