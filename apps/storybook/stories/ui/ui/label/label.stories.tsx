import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { FieldContent, Input, Label as LabelText } from '@invana/forms';

import data from '../../../../fixtures/ui/label.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Log, type Variant } from '../../../_story/variant-board';

interface LabelVariant extends Variant {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
}

const VARIANTS = data as LabelVariant[];

interface Args {
  variant: string;
  onChange: (value: string) => void;
}

const meta = {
  title: 'UI/UI/Label',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import * as React from 'react';", "import { FieldContent, Input, Label } from '@invana/forms';"],
            picked.map((v) => ({
              comment: v.caption,
              setup: [
                `const [value, setValue] = React.useState(${JSON.stringify(v.value)});`,
                '// Called with the input\'s text on every keystroke.',
                'const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value);',
              ].join('\n'),
              call: [
                '<FieldContent>',
                `  <Label htmlFor="${v.id}">${v.label}</Label>`,
                `  <Input id="${v.id}" type="${v.type}" placeholder="${v.placeholder}" value={value} onChange={onChange} />`,
                '</FieldContent>',
              ].join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onChange: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

function LiveLabel({ v, onChange, log }: { v: LabelVariant; onChange: Args['onChange']; log: Log }) {
  const [value, setValue] = React.useState(v.value);
  return (
    <FieldContent>
      <LabelText htmlFor={v.id}>{v.label}</LabelText>
      <Input
        id={v.id}
        type={v.type}
        placeholder={v.placeholder}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
          log('onChange', e.target.value);
        }}
      />
    </FieldContent>
  );
}

/**
 * A label names its control — from `fixtures/ui/label.json`. Clicking the label focuses the
 * input it is `htmlFor`; typing writes the value to the cell's log.
 */
export const Label: Story = {
  render: ({ variant, onChange }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveLabel v={v} onChange={onChange} log={log} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Default' }));
    await step('Clicking the label focuses its input', async () => {
      await userEvent.click(cell.getByText('Email address'));
      await expect(cell.getByLabelText('Email address')).toHaveFocus();
    });
    await step('Type an address', async () => {
      await userEvent.keyboard('a@b.io');
      await expect(args.onChange).toHaveBeenLastCalledWith('a@b.io');
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"a@b.io"');
    });
  },
};
