import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  Select as SelectControl,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@invana/forms';

import data from '../../../../fixtures/ui/select.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Log, type Variant } from '../../../_story/variant-board';

interface SelectField {
  id: string;
  label?: string;
  placeholder: string;
  description?: string;
  disabled?: boolean;
  value?: string;
  options: { value: string; label: string }[];
}

interface SelectVariant extends Variant {
  sections: { title?: string; fields: SelectField[] }[];
}

const VARIANTS = data as SelectVariant[];

interface Args {
  variant: string;
  onValueChange: (value: string) => void;
}

const meta = {
  title: 'UI/UI/Select',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import * as React from 'react';",
              "import { FieldContent, FieldDescription, FieldLabel, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@invana/forms';",
            ],
            picked.flatMap((v) =>
              v.sections.flatMap((s) =>
                s.fields.map((f) => ({
                  comment: [v.caption, s.title, f.label].filter(Boolean).join(' · '),
                  data: { options: f.options },
                  setup: [
                    `const [value, setValue] = React.useState<string | undefined>(${JSON.stringify(f.value)});`,
                    '// Called with the picked option\'s value, e.g. "ca".',
                    'const onValueChange = (next: string) => setValue(next);',
                  ].join('\n'),
                  call: [
                    '<FieldContent>',
                    f.label ? `  <FieldLabel htmlFor="${f.id}">${f.label}</FieldLabel>` : null,
                    `  <Select value={value} onValueChange={onValueChange}${f.disabled ? ' disabled' : ''}>`,
                    `    <SelectTrigger id="${f.id}">`,
                    `      <SelectValue placeholder="${f.placeholder}" />`,
                    '    </SelectTrigger>',
                    '    <SelectContent>',
                    '      {options.map((o) => (',
                    '        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>',
                    '      ))}',
                    '    </SelectContent>',
                    '  </Select>',
                    f.description ? `  <FieldDescription>${f.description}</FieldDescription>` : null,
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

/** One select, controlled: the pick it shows is the one the story holds. */
function LiveSelect({ field, onValueChange, log }: { field: SelectField; onValueChange: Args['onValueChange']; log: Log }) {
  const [value, setValue] = React.useState(field.value);
  const change = (next: string) => {
    setValue(next);
    onValueChange(next);
    log('onValueChange', next);
  };
  return (
    <FieldContent>
      {field.label ? <FieldLabel htmlFor={field.id}>{field.label}</FieldLabel> : null}
      <SelectControl value={value} onValueChange={change} disabled={field.disabled}>
        <SelectTrigger id={field.id} aria-label={field.label ?? field.placeholder}>
          <SelectValue placeholder={field.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {field.options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectControl>
      {field.description ? <FieldDescription>{field.description}</FieldDescription> : null}
    </FieldContent>
  );
}

/**
 * A pick from a list, controlled — every variant from `fixtures/ui/select.json`. Open a
 * select and choose: `onValueChange` receives the option's value and the story holds it.
 */
export const Select: Story = {
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
                    <LiveSelect key={f.id} field={f} onValueChange={onValueChange} log={log} />
                  ))}
                </FieldGroup>
              </FieldSet>
            ) : (
              s.fields.map((f) => <LiveSelect key={f.id} field={f} onValueChange={onValueChange} log={log} />)
            ),
          )}
        </FieldGroup>
      )}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'With label' }));
    const page = within(canvasElement.ownerDocument.body);
    await step('Open the country select and pick Canada', async () => {
      await userEvent.click(cell.getByRole('combobox'));
      await userEvent.click(await page.findByRole('option', { name: 'Canada' }));
      await expect(args.onValueChange).toHaveBeenCalledWith('ca');
    });
    await step('The trigger shows the pick, and it is logged', async () => {
      await expect(cell.getByRole('combobox')).toHaveTextContent('Canada');
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"ca"');
    });
  },
};
