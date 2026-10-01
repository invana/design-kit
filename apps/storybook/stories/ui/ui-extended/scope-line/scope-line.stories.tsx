import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ScopeLine, type ScopeLinePart } from '@invana/ui';

import DATA from '../../../../fixtures/ui-extended/scope-line.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Log } from '../../../_story/variant-board';

interface Variant {
  caption: string;
  editable?: boolean;
  props: {
    parts: (string | ScopeLinePart)[];
    fixedParts?: number[];
    seamless?: boolean;
    note?: string;
  };
}

const VARIANTS = DATA as Variant[];

interface Args {
  variant: string;
  onPartChange: (index: number, value: string) => void;
  onOpenPartChange: (index: number | null) => void;
}

/** What a consumer does with a change: re-scope, and mark the part it changed. */
function Live({ v, log, args }: { v: Variant; log: Log; args: Omit<Args, 'variant'> }) {
  const [parts, setParts] = React.useState(v.props.parts);
  if (!v.editable) return <ScopeLine {...v.props} />;
  return (
    <ScopeLine
      {...v.props}
      parts={parts}
      onPartChange={(index, value) => {
        args.onPartChange(index, value);
        log('onPartChange', [index, value]);
        setParts((all) =>
          all.map((p, i) =>
            i !== index ? p : typeof p === 'string' ? { text: value, mark: 'changed' } : { ...p, text: value, mark: 'changed' },
          ),
        );
      }}
      onOpenPartChange={(index) => {
        args.onOpenPartChange(index);
        log('onOpenPartChange', index);
      }}
    />
  );
}

const meta = {
  title: 'UI/UI Extended/ScopeLine',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { ScopeLine } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { parts: v.props.parts },
              setup: v.editable
                ? [
                    '// onPartChange receives (index, value) — Enter on an edited part, or a picked choice.',
                    '// onOpenPartChange receives the index of the part whose choices opened, or null.',
                    'const onPartChange = (index, value) => rescope(index, value);',
                  ].join('\n')
                : undefined,
              call: jsx('ScopeLine', {
                parts: 'parts',
                fixedParts: v.props.fixedParts ? JSON.stringify(v.props.fixedParts) : undefined,
                seamless: v.props.seamless ? 'true' : undefined,
                note: v.props.note ? { literal: v.props.note } : undefined,
                onPartChange: v.editable ? 'onPartChange' : undefined,
                onOpenPartChange: v.editable && v.props.parts.some((p) => typeof p !== 'string') ? 'onOpenPartChange' : undefined,
              }),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onPartChange: fn(), onOpenPartChange: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * Period, comparison, filters, population and freshness, as the query applied them, in one strip
 * above the figures — from `fixtures/ui-extended/scope-line.json`. With `onPartChange` the scope
 * is also where it is changed: click a part, type, `Enter`. The freshness is fixed — a fact
 * about the data, not a choice. `seamless` drops the box for a scope inside an answer. Each
 * change is logged as `[index, value]` and the story marks the part it changed.
 */
export const ScopeLineStory: Story = {
  name: 'ScopeLine',
  render: ({ variant, ...args }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => <Live v={v} log={log} args={args} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: VARIANTS[1].caption }));
    await step('Edit the comparison', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'vs Q2' }));
      const input = cell.getByRole('textbox', { name: 'Change vs Q2' });
      await userEvent.clear(input);
      await userEvent.type(input, 'vs Q3 2025{Enter}');
      await expect(args.onPartChange).toHaveBeenCalledWith(1, 'vs Q3 2025');
    });
    await step('The part reads the new value, and the log the payload', async () => {
      await expect(cell.getByRole('button', { name: 'vs Q3 2025' })).toBeInTheDocument();
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('[1, "vs Q3 2025"]');
    });
    await step('The freshness is fixed', async () => {
      await expect(cell.queryByRole('button', { name: 'as of 06:00' })).toBeNull();
    });
  },
};
