import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet, Slider as SliderControl } from '@invana/forms';

import data from '../../../../fixtures/ui/slider.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Log, type Variant } from '../../../_story/variant-board';

interface SliderField {
  id: string;
  label?: string;
  value: number[];
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  prefix?: string;
  suffix?: string;
}

interface SliderVariant extends Variant {
  sections: { title?: string; fields: SliderField[] }[];
}

const VARIANTS = data as SliderVariant[];

interface Args {
  variant: string;
  onValueChange: (value: number[]) => void;
}

const meta = {
  title: 'UI/UI/Slider',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import * as React from 'react';",
              "import { FieldContent, FieldLabel, Slider } from '@invana/forms';",
            ],
            picked.flatMap((v) =>
              v.sections.flatMap((s) =>
                s.fields.map((f) => ({
                  comment: [v.caption, s.title, f.label].filter(Boolean).join(' · '),
                  setup: [
                    `const [value, setValue] = React.useState(${JSON.stringify(f.value)});`,
                    '// Called with every value the thumb moves through, e.g. [51].',
                    'const onValueChange = (next: number[]) => setValue(next);',
                  ].join('\n'),
                  call: [
                    '<FieldContent>',
                    f.label ? `  <FieldLabel htmlFor="${f.id}">${f.label}</FieldLabel>` : null,
                    jsx('Slider', {
                      id: { literal: f.id },
                      value: 'value',
                      onValueChange: 'onValueChange',
                      min: f.min === undefined ? undefined : String(f.min),
                      max: f.max === undefined ? undefined : String(f.max),
                      step: f.step === undefined ? undefined : String(f.step),
                      disabled: f.disabled ? 'true' : undefined,
                    })
                      .split('\n')
                      .map((l) => `  ${l}`)
                      .join('\n'),
                    '</FieldContent>',
                  ]
                    .filter(Boolean)
                    .join('\n'),
                })),
              ),
            ),
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

/** One slider, controlled: the value it shows is the one the story holds. */
function LiveSlider({ field, onValueChange, log }: { field: SliderField; onValueChange: Args['onValueChange']; log: Log }) {
  const [value, setValue] = React.useState(field.value);
  const change = (next: number[]) => {
    setValue(next);
    onValueChange(next);
    log('onValueChange', next);
  };
  return (
    <FieldContent>
      {field.label ? <FieldLabel htmlFor={field.id}>{field.label}</FieldLabel> : null}
      <SliderControl
        id={field.id}
        aria-label={field.label ?? field.id}
        value={value}
        onValueChange={change}
        min={field.min}
        max={field.max}
        step={field.step}
        disabled={field.disabled}
      />
      <FieldDescription>
        {field.prefix}
        {value.join(' – ')}
        {field.suffix}
      </FieldDescription>
    </FieldContent>
  );
}

/**
 * A range input, controlled — every variant from `fixtures/ui/slider.json`. Drag a thumb or
 * press an arrow key: `onValueChange` receives the new value array and the story holds it.
 */
export const Slider: Story = {
  render: ({ variant, onValueChange }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => (
        <FieldGroup>
          {v.sections.map((s, i) =>
            s.title ? (
              <FieldSet key={i}>
                <FieldLegend>{s.title}</FieldLegend>
                <FieldGroup>
                  {s.fields.map((f) => (
                    <LiveSlider key={f.id} field={f} onValueChange={onValueChange} log={log} />
                  ))}
                </FieldGroup>
              </FieldSet>
            ) : (
              s.fields.map((f) => <LiveSlider key={f.id} field={f} onValueChange={onValueChange} log={log} />)
            ),
          )}
        </FieldGroup>
      )}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'With label' }));
    await step('Nudge the volume up one step', async () => {
      cell.getByRole('slider').focus();
      await userEvent.keyboard('{ArrowRight}');
      await expect(args.onValueChange).toHaveBeenCalledWith([76]);
    });
    await step('The slider holds the new value', async () => {
      await expect(cell.getByRole('slider')).toHaveAttribute('aria-valuenow', '76');
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('[76]');
    });
  },
};
