import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  Textarea as TextareaControl,
} from '@invana/forms';

import data from '../../../../fixtures/ui/textarea.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log, type Variant } from '../../../_story/variant-grid';

interface TextareaField {
  id: string;
  label?: string;
  ariaLabel?: string;
  placeholder?: string;
  value?: string;
  rows?: number;
  disabled?: boolean;
  readOnly?: boolean;
  description?: string;
  error?: string;
}

interface TextareaVariant extends Variant {
  sections: { title?: string; fields: TextareaField[] }[];
}

const VARIANTS = data as TextareaVariant[];

interface Args {
  variant: string;
  /** Receives the text, not the event — what a consumer stores. */
  onChange: (value: string) => void;
}

const meta = {
  title: 'UI/UI/Textarea',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import * as React from 'react';",
              "import { FieldContent, FieldDescription, FieldError, FieldLabel, Textarea } from '@invana/forms';",
            ],
            picked.flatMap((v) =>
              v.sections.flatMap((s) =>
                s.fields.map((f) => ({
                  comment: [v.caption, s.title, f.label].filter(Boolean).join(' · '),
                  setup: [
                    `const [value, setValue] = React.useState(${JSON.stringify(f.value ?? '')});`,
                    '// The event carries the whole text: e.target.value.',
                    'const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value);',
                  ].join('\n'),
                  call: [
                    '<FieldContent>',
                    f.label ? `  <FieldLabel htmlFor="${f.id}">${f.label}</FieldLabel>` : null,
                    jsx('Textarea', {
                      id: { literal: f.id },
                      value: 'value',
                      onChange: 'onChange',
                      placeholder: f.placeholder ? { literal: f.placeholder } : undefined,
                      rows: f.rows ? String(f.rows) : undefined,
                      disabled: f.disabled ? 'true' : undefined,
                      readOnly: f.readOnly ? 'true' : undefined,
                      'aria-invalid': f.error ? 'true' : undefined,
                    })
                      .split('\n')
                      .map((l) => `  ${l}`)
                      .join('\n'),
                    f.description ? `  <FieldDescription>${f.description}</FieldDescription>` : null,
                    f.error ? `  <FieldError>${f.error}</FieldError>` : null,
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
  args: { variant: 'All', onChange: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** One textarea, controlled: the text it shows is the one the story holds. */
function LiveTextarea({ field, onChange, log }: { field: TextareaField; onChange: Args['onChange']; log: Log }) {
  const [value, setValue] = React.useState(field.value ?? '');
  const change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    onChange(e.target.value);
    log('onChange', e.target.value);
  };
  return (
    <FieldContent>
      {field.label ? <FieldLabel htmlFor={field.id}>{field.label}</FieldLabel> : null}
      <TextareaControl
        id={field.id}
        aria-label={field.ariaLabel}
        value={value}
        onChange={change}
        placeholder={field.placeholder}
        rows={field.rows}
        disabled={field.disabled}
        readOnly={field.readOnly}
        aria-invalid={field.error ? true : undefined}
      />
      {field.description ? <FieldDescription>{field.description}</FieldDescription> : null}
      {field.error ? <FieldError>{field.error}</FieldError> : null}
    </FieldContent>
  );
}

/**
 * Multi-line text, controlled — every variant from `fixtures/ui/textarea.json`. Height comes from
 * `rows`, never a class. Type: `onChange` fires per keystroke and the story holds the text.
 */
export const Textarea: Story = {
  render: ({ variant, onChange }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => (
        <FieldGroup>
          {v.sections.map((s, i) =>
            s.title ? (
              <FieldSet key={i}>
                <FieldLegend>{s.title}</FieldLegend>
                {s.fields.map((f) => (
                  <LiveTextarea key={f.id} field={f} onChange={onChange} log={log} />
                ))}
              </FieldSet>
            ) : (
              s.fields.map((f) => <LiveTextarea key={f.id} field={f} onChange={onChange} log={log} />)
            ),
          )}
        </FieldGroup>
      )}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'With label' }));
    await step('Type a message', async () => {
      await userEvent.type(cell.getByRole('textbox', { name: 'Message' }), 'Hi');
      await expect(args.onChange).toHaveBeenLastCalledWith('Hi');
    });
    await step('The textarea holds the text', async () => {
      await expect(cell.getByRole('textbox', { name: 'Message' })).toHaveValue('Hi');
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"Hi"');
    });
  },
};
