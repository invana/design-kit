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
  FieldTitle,
  Switch as SwitchControl,
} from '@invana/forms';

import data from '../../../../fixtures/ui/switch.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Log, type Variant } from '../../../_story/variant-board';

interface SwitchField {
  id: string;
  label?: string;
  /** The accessible name when there is no label. */
  ariaLabel?: string;
  description?: string;
  checked: boolean;
  disabled?: boolean;
}

interface SwitchVariant extends Variant {
  sections: { title?: string; fields: SwitchField[] }[];
}

const VARIANTS = data as SwitchVariant[];

interface Args {
  variant: string;
  onCheckedChange: (checked: boolean) => void;
}

const meta = {
  title: 'UI/UI/Switch',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import * as React from 'react';",
              "import { FieldContent, FieldDescription, FieldLabel, FieldTitle, Switch } from '@invana/forms';",
            ],
            picked.flatMap((v) =>
              v.sections.flatMap((s) =>
                s.fields.map((f) => {
                  const control = jsx('Switch', {
                    id: { literal: f.id },
                    checked: 'checked',
                    onCheckedChange: 'onCheckedChange',
                    disabled: f.disabled ? 'true' : undefined,
                    'aria-label': f.ariaLabel ? { literal: f.ariaLabel } : undefined,
                  });
                  const indented = control.split('\n').map((l) => `  ${l}`).join('\n');
                  return {
                    comment: [v.caption, s.title, f.label].filter(Boolean).join(' · '),
                    setup: [
                      `const [checked, setChecked] = React.useState(${f.checked});`,
                      '// Called with the new state — true or false.',
                      'const onCheckedChange = (next: boolean) => setChecked(next);',
                    ].join('\n'),
                    call: !f.label
                      ? control
                      : [
                          `<FieldLabel htmlFor="${f.id}">`,
                          indented,
                          f.description
                            ? `  <FieldContent>\n    <FieldTitle>${f.label}</FieldTitle>\n    <FieldDescription>${f.description}</FieldDescription>\n  </FieldContent>`
                            : `  ${f.label}`,
                          '</FieldLabel>',
                        ].join('\n'),
                  };
                }),
              ),
            ),
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

/** One switch, controlled: the state it shows is the one the story holds. */
function LiveSwitch({ field, onCheckedChange, log }: { field: SwitchField; onCheckedChange: Args['onCheckedChange']; log: Log }) {
  const [checked, setChecked] = React.useState(field.checked);
  const change = (next: boolean) => {
    setChecked(next);
    onCheckedChange(next);
    log('onCheckedChange', next);
  };
  const control = (
    <SwitchControl
      id={field.id}
      aria-label={field.ariaLabel}
      checked={checked}
      onCheckedChange={change}
      disabled={field.disabled}
    />
  );
  if (!field.label) return control;
  return (
    <FieldLabel htmlFor={field.id}>
      {control}
      {field.description ? (
        <FieldContent>
          <FieldTitle>{field.label}</FieldTitle>
          <FieldDescription>{field.description}</FieldDescription>
        </FieldContent>
      ) : (
        field.label
      )}
    </FieldLabel>
  );
}

/**
 * An on/off control, controlled — every variant from `fixtures/ui/switch.json`. Click a switch or
 * its label: `onCheckedChange` receives the new state and the story holds it.
 */
export const Switch: Story = {
  render: ({ variant, onCheckedChange }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => (
        <FieldGroup>
          {v.sections.map((s, i) =>
            s.title ? (
              <FieldSet key={i}>
                <FieldLegend>{s.title}</FieldLegend>
                {s.fields.map((f) => (
                  <LiveSwitch key={f.id} field={f} onCheckedChange={onCheckedChange} log={log} />
                ))}
              </FieldSet>
            ) : (
              s.fields.map((f) => <LiveSwitch key={f.id} field={f} onCheckedChange={onCheckedChange} log={log} />)
            ),
          )}
        </FieldGroup>
      )}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'With label' }));
    await step('Turn airplane mode on', async () => {
      await userEvent.click(cell.getByRole('switch', { name: 'Airplane Mode' }));
      await expect(args.onCheckedChange).toHaveBeenCalledWith(true);
    });
    await step('The switch holds the new state', async () => {
      await expect(cell.getByRole('switch', { name: 'Airplane Mode' })).toBeChecked();
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('onCheckedChangetrue');
    });
  },
};
