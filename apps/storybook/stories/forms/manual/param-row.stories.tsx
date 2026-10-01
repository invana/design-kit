import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ParamRow, type ParamSource } from '@invana/forms';
import { Badge, PanelBox } from '@invana/ui';

import spec from '../../../fixtures/forms/param-row.json';
import { jsx, snippet } from '../../_story/source';
import { VariantBoard, type Log } from '../../_story/variant-board';

type Param = {
  name: string;
  type: string;
  source: ParamSource;
  value: string;
  note?: string;
  invalid?: boolean;
  disabled?: boolean;
};

const PARAMS = spec.params as Param[];
const VARIANTS = [{ caption: 'Param Row', width: 520 }];

interface Args {
  onSourceChange: (name: string, source: ParamSource) => void;
  onValueChange: (name: string, value: string) => void;
}

function Live({ log, onSourceChange, onValueChange }: Args & { log: Log }) {
  const [params, setParams] = React.useState(PARAMS);
  const patch = (i: number, next: Partial<Param>) =>
    setParams((prev) => prev.map((p, j) => (j === i ? { ...p, ...next } : p)));

  return (
    <PanelBox title={spec.title} aside={<Badge variant="outline">{spec.badge}</Badge>}>
      {params.map((p, i) => (
        <ParamRow
          key={p.name}
          name={p.name}
          type={p.type}
          source={p.source}
          value={p.value}
          note={p.note}
          invalid={p.invalid}
          disabled={p.disabled}
          onSourceChange={(source) => {
            onSourceChange(p.name, source);
            log('onSourceChange', [p.name, source]);
            patch(i, { source });
          }}
          onValueChange={(value) => {
            onValueChange(p.name, value);
            log('onValueChange', [p.name, value]);
            patch(i, { value });
          }}
        />
      ))}
    </PanelBox>
  );
}

const meta = {
  title: 'Forms/Manual/Param Row',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        code: snippet({
          imports: ["import { ParamRow } from '@invana/forms';", "import { Badge, PanelBox } from '@invana/ui';"],
          comment: 'One row per parameter the catalogue entry declares — a descriptor, not children',
          data: { initial: PARAMS },
          setup: [
            'const [params, setParams] = React.useState(initial);',
            'const patch = (i, next) => setParams((all) => all.map((p, j) => (j === i ? { ...p, ...next } : p)));',
          ].join('\n'),
          call: [
            `<PanelBox title="${spec.title}" aside={<Badge variant="outline">${spec.badge}</Badge>}>`,
            '  {params.map((p, i) => (',
            `    ${jsx('ParamRow', {
              key: 'p.name',
              name: 'p.name',
              type: 'p.type',
              source: 'p.source',
              value: 'p.value',
              note: 'p.note',
              invalid: 'p.invalid',
              disabled: 'p.disabled',
              onSourceChange: '(source) => patch(i, { source })  // "literal" | "binding" | "argument"',
              onValueChange: '(value) => patch(i, { value })      // the text as typed',
            }).replace(/\n/g, '\n    ')}`,
            '  ))}',
            '</PanelBox>',
          ].join('\n'),
        }),
      },
    },
  },
  args: { onSourceChange: fn(), onValueChange: fn() },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * The parameters of one task — and the form **is** the catalogue contract
 * (`fixtures/forms/param-row.json`). The fields, their types and their obligations are read off
 * the entry, never authored here, so a row takes a descriptor rather than children and a
 * parameter the contract does not declare has no way to appear.
 *
 * `source` and `value` are one joined control because they are one decision: split into two
 * fields they read as two questions. `records` is invalid and `when` is disabled — both are
 * shown rather than hidden, because the contract's full surface is the point. Every change is
 * written under the panel.
 */
export const ParamRowStory: Story = {
  name: 'Param Row',
  render: (args) => <VariantBoard variants={VARIANTS}>{(_v, log) => <Live {...args} log={log} />}</VariantBoard>,
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Param Row' }));
    await step('Set the batch size', async () => {
      const input = cell.getByRole('textbox', { name: 'batch_size' });
      await userEvent.clear(input);
      await userEvent.type(input, '2000');
      await expect(args.onValueChange).toHaveBeenLastCalledWith('batch_size', '2000');
    });
    await step('The row holds the new value, and the change is logged', async () => {
      await expect(cell.getByRole('textbox', { name: 'batch_size' })).toHaveValue('2000');
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('["batch_size", "2000"]');
    });
  },
};
