import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Input as InputRoot } from '@invana/forms';
// The layout `Field` is shadowed at the package root by the generator's `Field` namespace.
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@invana/forms';

import data from '../../../../fixtures/ui/input.json';
import { json, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log, type Variant } from '../../../_story/variant-grid';

interface InputSpec {
  id: string;
  /** A visible label. */
  label?: string;
  /** No visible label — the input is named by `aria-label`. */
  ariaLabel?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  readOnly?: boolean;
  inputSize?: 'sm' | 'default' | 'lg';
  /** A line under the field. */
  help?: string;
  /** What is wrong — marks the field invalid. */
  error?: string;
  /** Only in the "with a custom class" cell. */
  className?: string;
}

interface InputVariant extends Variant {
  fields: InputSpec[];
}

const VARIANTS = data as InputVariant[];

interface Args {
  variant: string;
  onChange: (payload: { id: string; value: string }) => void;
}

const initial = (v: InputVariant) => Object.fromEntries(v.fields.map((f) => [f.id, f.value ?? '']));

function inputSource(f: InputSpec) {
  const attrs = [
    `id="${f.id}"`,
    f.ariaLabel ? `aria-label="${f.ariaLabel}"` : '',
    f.type ? `type="${f.type}"` : '',
    f.inputSize ? `inputSize="${f.inputSize}"` : '',
    f.placeholder ? `placeholder="${f.placeholder}"` : '',
    f.disabled ? 'disabled' : '',
    f.readOnly ? 'readOnly' : '',
    f.error ? 'aria-invalid' : '',
    f.className ? `className="${f.className}"` : '',
    `value={values[${json(f.id)}]}`,
    `onChange={onChange(${json(f.id)})}`,
  ].filter(Boolean);
  return `<Input ${attrs.join(' ')} />`;
}

const meta = {
  title: 'UI/UI/Input',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import { Input } from '@invana/forms';",
              "import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@invana/forms';",
            ],
            picked.map((v) => ({
              comment: v.caption,
              data: { initial: initial(v) },
              setup: [
                '// onChange receives the change event; the value is event.target.value.',
                'const [values, setValues] = React.useState(initial);',
                'const onChange = (id) => (event) => setValues((all) => ({ ...all, [id]: event.target.value }));',
              ].join('\n'),
              call: [
                '<FieldGroup>',
                ...v.fields.map((f) =>
                  f.label
                    ? [
                        `  <Field${f.error ? ' data-invalid' : ''}>`,
                        `    <FieldLabel htmlFor="${f.id}">${f.label}</FieldLabel>`,
                        `    ${inputSource(f)}`,
                        f.help ? `    <FieldDescription>${f.help}</FieldDescription>` : '',
                        f.error ? `    <FieldError>${f.error}</FieldError>` : '',
                        '  </Field>',
                      ]
                        .filter(Boolean)
                        .join('\n')
                    : `  ${inputSource(f)}`,
                ),
                '</FieldGroup>',
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

/** Holds every field's value, as a consumer would, and reports each change. */
function Live({ v, onChange, log }: { v: InputVariant; onChange: Args['onChange']; log: Log }) {
  const [values, setValues] = React.useState(() => initial(v));
  return (
    <FieldGroup>
      {v.fields.map((f) => {
        const input = (
          <InputRoot
            id={f.id}
            aria-label={f.ariaLabel}
            type={f.type}
            inputSize={f.inputSize}
            placeholder={f.placeholder}
            disabled={f.disabled}
            readOnly={f.readOnly}
            aria-invalid={f.error ? true : undefined}
            className={f.className}
            value={values[f.id]}
            onChange={(e) => {
              const value = e.target.value;
              setValues((all) => ({ ...all, [f.id]: value }));
              onChange({ id: f.id, value });
              log('onChange', { id: f.id, value });
            }}
          />
        );
        if (!f.label) return <React.Fragment key={f.id}>{input}</React.Fragment>;
        return (
          <Field key={f.id} data-invalid={f.error ? true : undefined}>
            <FieldLabel htmlFor={f.id}>{f.label}</FieldLabel>
            {input}
            {f.help ? <FieldDescription>{f.help}</FieldDescription> : null}
            {f.error ? <FieldError>{f.error}</FieldError> : null}
          </Field>
        );
      })}
    </FieldGroup>
  );
}

/**
 * A line of text the user types — every input type, its states and sizes, with a label, a
 * help line or an error, from `fixtures/ui/input.json`. Controlled: type and `onChange` sends
 * the field's id and value, and the story stores it as a consumer would.
 */
export const Input: Story = {
  render: ({ variant, onChange }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <Live v={v} onChange={onChange} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('Type into a labelled field', async () => {
      const cell = within(canvas.getByRole('group', { name: 'With label' }));
      const input = cell.getByLabelText('Email');
      await userEvent.type(input, 'ada@example.com');
      await expect(input).toHaveValue('ada@example.com');
      await expect(args.onChange).toHaveBeenLastCalledWith({ id: 'input-email', value: 'ada@example.com' });
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"value": "ada@example.com"');
    });
    await step('Edit a pre-filled value', async () => {
      const cell = within(canvas.getByRole('group', { name: 'With value' }));
      const input = cell.getByLabelText('Pre-filled');
      await userEvent.clear(input);
      await userEvent.type(input, 'New');
      await expect(input).toHaveValue('New');
    });
    await step('A disabled field takes no input', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Disabled' }));
      await expect(cell.getByLabelText('Disabled')).toBeDisabled();
    });
  },
};
