import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { StagedBar as Part, type StagedBarProps } from '@invana/boards';

import data from '../../../../fixtures/board/staged-bar.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log, type Variant } from '../../../_story/variant-grid';

interface StagedVariant extends Variant {
  /** Drawn without `onDiscard` / `onDiscardAll` — a set someone else is reviewing. */
  readOnly?: boolean;
  props: Omit<StagedBarProps, 'onDiscard' | 'onDiscardAll'> & { hint?: string };
}

// JSON widens `op` to string; the shape is the part's own.
const VARIANTS = data as unknown as StagedVariant[];

interface Args {
  variant: string;
  onDiscard: (id: string) => void;
  onDiscardAll: () => void;
}

const meta = {
  title: 'Boards/Components/StagedBar',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { StagedBar } from '@invana/boards';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { staged: v.props.items },
              setup: v.readOnly
                ? undefined
                : [
                    '// `onDiscard` receives the item\'s id; drop it from what you hold. `onDiscardAll` receives nothing.',
                    'const [items, setItems] = React.useState(staged);',
                    'const onDiscard = (id) => setItems((xs) => xs.filter((x) => x.id !== id));',
                    'const onDiscardAll = () => setItems([]);',
                  ].join('\n'),
              call: `${v.readOnly ? '' : '{items.length ? '}${jsx('StagedBar', {
                items: v.readOnly ? 'staged' : 'items',
                hint: v.props.hint ? { literal: v.props.hint } : undefined,
                discardAllLabel: v.props.discardAllLabel ? { literal: v.props.discardAllLabel } : undefined,
                onDiscard: v.readOnly ? undefined : 'onDiscard',
                onDiscardAll: v.readOnly ? undefined : 'onDiscardAll',
              })}${v.readOnly ? '' : ' : null}'}`,
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onDiscard: fn(), onDiscardAll: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** A state holder: the staged set as its owner keeps it — a discard drops the item, `Discard all` empties it. */
function Live({ variant, log, onDiscard, onDiscardAll }: { variant: StagedVariant; log: Log } & Omit<Args, 'variant'>) {
  const [items, setItems] = React.useState(variant.props.items);
  if (variant.readOnly) return <Part {...variant.props} />;
  // With nothing staged the bar is not drawn: a bar reading *0 staged* is noise.
  if (!items.length) return null;
  return (
    <Part
      {...variant.props}
      items={items}
      onDiscard={(id) => {
        onDiscard(id);
        log('onDiscard', id);
        setItems((xs) => xs.filter((x) => x.id !== id));
      }}
      onDiscardAll={() => {
        onDiscardAll();
        log('onDiscardAll', null);
        setItems([]);
      }}
    />
  );
}

/**
 * What is staged and not yet published, as one bar under the record's header — from
 * `fixtures/board/staged-bar.json`. Each change is a chip with its sign spelled out and its
 * own `×`; `Discard all` and the publishing shortcut sit on the right. Discard one, or all: the
 * story drops them as the owner of the set would, and the bar goes when nothing is left. Without
 * the callbacks (**Read-only**) the chips carry no `×` and there is no `Discard all`.
 */
export const StagedBar: Story = {
  render: ({ variant, onDiscard, onDiscardAll }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <Live variant={v} log={log} onDiscard={onDiscard} onDiscardAll={onDiscardAll} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const cell = within(canvas.getByRole('group', { name: 'Default' }));
    await step('Discard one change', async () => {
      await userEvent.click(cell.getAllByRole('button', { name: 'Discard this change' })[0]);
      await expect(args.onDiscard).toHaveBeenCalledWith('1');
      await expect(cell.getByText('2 staged')).toBeInTheDocument();
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"1"');
    });
    await step('Discard the rest', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Discard all' }));
      await expect(args.onDiscardAll).toHaveBeenCalled();
      await expect(cell.queryByRole('region', { name: 'Staged changes' })).toBeNull();
    });
    await step('A read-only set offers no discard', async () => {
      const ro = within(canvas.getByRole('group', { name: 'Read-only' }));
      await expect(ro.queryByRole('button', { name: 'Discard this change' })).toBeNull();
    });
  },
};
