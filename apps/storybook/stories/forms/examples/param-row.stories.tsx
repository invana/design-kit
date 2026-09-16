import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ParamRow, type ParamSource } from '@invana/forms';
import { PanelBox, Badge } from '@invana/ui';

const meta: Meta<typeof ParamRow> = {
  title: 'Forms/Examples/ParamRow',
  component: ParamRow,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

type Param = {
  name: string;
  type: string;
  source: ParamSource;
  value: string;
  note?: string;
  invalid?: boolean;
  disabled?: boolean;
};

const INITIAL: Param[] = [
  {
    name: 'dataset',
    type: 'str · required',
    source: 'binding',
    value: '${lane.dataset}',
    note: 'one lane per entry in ${datasets}',
  },
  {
    name: 'model',
    type: 'str · required',
    source: 'argument',
    value: '${args.model} → "Brokerage@v2"',
    note: 'resolved from the plan argument, default "Brokerage@latest"',
  },
  { name: 'mode', type: 'enum · default upsert', source: 'literal', value: 'upsert', note: 'upsert · append' },
  {
    name: 'records',
    type: 'list · required',
    source: 'binding',
    value: '${steps.validate_recrds.rows}',
    note: 'no task named validate_recrds — did you mean validate_records?',
    invalid: true,
  },
  { name: 'batch_size', type: 'int · optional', source: 'literal', value: '5000', note: 'left at the catalogue default' },
  { name: 'when', type: 'expr', source: 'literal', value: '—', note: 'always runs', disabled: true },
];

/**
 * The parameters of one task — and the form **is** the catalogue contract.
 *
 * The fields, their types and their obligations are read off the entry, never
 * authored here, so a row takes a descriptor rather than children and a
 * parameter the contract does not declare has no way to appear.
 *
 * `source` and `value` are one joined control because they are one decision:
 * split into two fields they read as two questions, and you end up with
 * `literal` selected beside a value that is plainly a binding.
 *
 * `records` is invalid and `when` is disabled — both are shown rather than
 * hidden, because the contract's full surface is the point.
 */
export const Default: Story = {
  render: () => {
    const [params, setParams] = React.useState(INITIAL);
    const patch = (i: number, next: Partial<Param>) =>
      setParams((prev) => prev.map((p, j) => (j === i ? { ...p, ...next } : p)));

    return (
      <div className="w-[520px]">
        <PanelBox
          title="Parameters · import_dataset"
          aside={<Badge variant="outline">draft v5</Badge>}
        >
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
              onSourceChange={(source) => patch(i, { source })}
              onValueChange={(value) => patch(i, { value })}
            />
          ))}
        </PanelBox>
      </div>
    );
  },
};
