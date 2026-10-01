import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Checkbox as CheckboxRoot } from '@invana/forms';
// The layout `Field` is shadowed at the package root by the generator's `Field` namespace.
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from '@invana/forms/components/field';

import data from '../../../../fixtures/ui/checkbox.json';
import { json, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Log, type Variant } from '../../../_story/variant-board';
import type { ChoiceSpec } from '../_content';

interface Choice extends ChoiceSpec {
  /** No visible label — the checkbox is named by `aria-label`. */
  hideLabel?: boolean;
}

interface CheckboxVariant extends Variant {
  choices: Choice[];
}

const VARIANTS = data as CheckboxVariant[];

interface Args {
  variant: string;
  onCheckedChange: (payload: { id: string; checked: boolean | 'indeterminate' }) => void;
}

const initial = (v: CheckboxVariant) => Object.fromEntries(v.choices.map((c) => [c.id, !!c.checked]));

const meta = {
  title: 'UI/UI/Checkbox',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import { Checkbox } from '@invana/forms';",
              "import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from '@invana/forms/components/field';",
            ],
            picked.map((v) => ({
              comment: v.caption,
              data: { initial: initial(v) },
              setup: [
                '// onCheckedChange receives the new state: true or false.',
                'const [checked, setChecked] = React.useState(initial);',
                'const onCheckedChange = (id) => (next) => setChecked((c) => ({ ...c, [id]: next === true }));',
              ].join('\n'),
              call: [
                '<FieldGroup>',
                ...v.choices.map((c) => {
                  const box = `<Checkbox id="${c.id}"${c.hideLabel ? ` aria-label="${c.label}"` : ''}${c.disabled ? ' disabled' : ''} checked={checked[${json(c.id)}]} onCheckedChange={onCheckedChange(${json(c.id)})} />`;
                  if (c.hideLabel) return `  ${box}`;
                  const label = c.description
                    ? `<FieldContent><FieldLabel htmlFor="${c.id}">${c.label}</FieldLabel><FieldDescription>${c.description}</FieldDescription></FieldContent>`
                    : `<FieldLabel htmlFor="${c.id}">${c.label}</FieldLabel>`;
                  return `  <Field orientation="horizontal"${c.disabled ? ' data-disabled' : ''}>\n    ${box}\n    ${label}\n  </Field>`;
                }),
                '</FieldGroup>',
              ].join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onCheckedChange: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Holds every box's state, as a consumer would, and reports each change. */
function Live({ v, onCheckedChange, log }: { v: CheckboxVariant; onCheckedChange: Args['onCheckedChange']; log: Log }) {
  const [checked, setChecked] = React.useState(() => initial(v));
  return (
    <FieldGroup>
      {v.choices.map((c) => {
        const box = (
          <CheckboxRoot
            id={c.id}
            aria-label={c.hideLabel ? c.label : undefined}
            disabled={c.disabled}
            checked={checked[c.id]}
            onCheckedChange={(next) => {
              setChecked((all) => ({ ...all, [c.id]: next === true }));
              onCheckedChange({ id: c.id, checked: next });
              log('onCheckedChange', { id: c.id, checked: next });
            }}
          />
        );
        if (c.hideLabel) return <React.Fragment key={c.id}>{box}</React.Fragment>;
        return (
          <Field key={c.id} orientation="horizontal" data-disabled={c.disabled || undefined}>
            {box}
            {c.description ? (
              <FieldContent>
                <FieldLabel htmlFor={c.id}>{c.label}</FieldLabel>
                <FieldDescription>{c.description}</FieldDescription>
              </FieldContent>
            ) : (
              <FieldLabel htmlFor={c.id}>{c.label}</FieldLabel>
            )}
          </Field>
        );
      })}
    </FieldGroup>
  );
}

/**
 * A yes or no per option — alone, labelled, described, disabled, and in the sets forms use,
 * from `fixtures/ui/checkbox.json`. Controlled: tick one and `onCheckedChange` sends its id
 * and new state, and the story stores it as a consumer would.
 */
export const Checkbox: Story = {
  render: ({ variant, onCheckedChange }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => <Live v={v} onCheckedChange={onCheckedChange} log={log} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('Tick a box by its label', async () => {
      const cell = within(canvas.getByRole('group', { name: 'With label' }));
      const box = cell.getByRole('checkbox', { name: 'Accept terms and conditions' });
      await userEvent.click(cell.getByText('Accept terms and conditions'));
      await expect(args.onCheckedChange).toHaveBeenCalledWith({ id: 'checkbox-terms', checked: true });
      await expect(box).toBeChecked();
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"checked": true');
    });
    await step('A disabled box does not change', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Disabled' }));
      await expect(cell.getByRole('checkbox', { name: 'Disabled checkbox' })).toBeDisabled();
    });
  },
};
