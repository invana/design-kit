import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { FieldLabel, RadioGroup as RadioGroupRoot, RadioGroupItem } from '@invana/forms';

import data from '../../../../fixtures/ui/radio-group.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Log, type Variant } from '../../../_story/variant-board';

interface RadioGroupVariant extends Variant {
  name: string;
  value: string;
  options: { value: string; label: string }[];
}

const VARIANTS = data as RadioGroupVariant[];

interface Args {
  variant: string;
  onValueChange: (value: string) => void;
}

const meta = {
  title: 'UI/UI/RadioGroup',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import * as React from 'react';", "import { FieldLabel, RadioGroup, RadioGroupItem } from '@invana/forms';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { options: v.options },
              setup: [
                `const [value, setValue] = React.useState(${JSON.stringify(v.value)});`,
                '// Called with the picked option\'s value, e.g. "compact".',
                'const onValueChange = (next: string) => setValue(next);',
              ].join('\n'),
              call: [
                `<RadioGroup name="${v.name}" value={value} onValueChange={onValueChange}>`,
                '  {options.map((o) => (',
                '    <FieldLabel key={o.value}>',
                '      <RadioGroupItem value={o.value} />',
                '      {o.label}',
                '    </FieldLabel>',
                '  ))}',
                '</RadioGroup>',
              ].join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onValueChange: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** The group, controlled: the checked option is the story's state. */
function LiveRadioGroup({ v, onValueChange, log }: { v: RadioGroupVariant; onValueChange: Args['onValueChange']; log: Log }) {
  const [value, setValue] = React.useState(v.value);
  const change = (next: string) => {
    setValue(next);
    onValueChange(next);
    log('onValueChange', next);
  };
  return (
    <RadioGroupRoot name={v.name} value={value} onValueChange={change} aria-label={v.caption}>
      {v.options.map((o) => (
        <FieldLabel key={o.value}>
          <RadioGroupItem value={o.value} />
          {o.label}
        </FieldLabel>
      ))}
    </RadioGroupRoot>
  );
}

/**
 * One choice of several, controlled, from `fixtures/ui/radio-group.json`. Pick an option:
 * `onValueChange` receives its value and the story moves the check to it.
 */
export const RadioGroup: Story = {
  render: ({ variant, onValueChange }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveRadioGroup v={v} onValueChange={onValueChange} log={log} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Default' }));
    await step('Pick Compact', async () => {
      await userEvent.click(cell.getByRole('radio', { name: 'Compact' }));
      await expect(args.onValueChange).toHaveBeenCalledWith('compact');
    });
    await step('The check moves to it', async () => {
      await expect(cell.getByRole('radio', { name: 'Compact' })).toBeChecked();
      await expect(cell.getByRole('radio', { name: 'Comfortable' })).not.toBeChecked();
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"compact"');
    });
  },
};
