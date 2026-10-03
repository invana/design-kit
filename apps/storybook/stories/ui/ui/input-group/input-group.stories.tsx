import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  InputGroup as InputGroupPart,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from '@invana/forms';
import { DollarSign, Search } from 'lucide-react';

import data from '../../../../fixtures/ui/input-group.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log, type Variant } from '../../../_story/variant-grid';

/** What JSON names an icon by; the story holds the icons. */
const ICONS = { search: <Search />, dollar: <DollarSign /> };
const ICON_NAMES = { search: 'Search', dollar: 'DollarSign' };

interface Addon {
  icon?: keyof typeof ICONS;
  text?: string;
  button?: string;
}

interface InputGroupVariant extends Variant {
  id: string;
  start?: Addon;
  end?: Addon;
  type?: string;
  placeholder: string;
  value: string;
}

const VARIANTS = data as InputGroupVariant[];

interface Args {
  variant: string;
  onChange: (value: string) => void;
  onClick: (value: string) => void;
}

const addonCode = (a: Addon | undefined, align: string) => {
  if (!a) return [];
  const inner = a.icon
    ? `<${ICON_NAMES[a.icon]} />`
    : a.text
      ? `<InputGroupText>${a.text}</InputGroupText>`
      : `<InputGroupButton onClick={onClick}>${a.button}</InputGroupButton>`;
  return [`  <InputGroupAddon align="${align}">`, `    ${inner}`, '  </InputGroupAddon>'];
};

const meta = {
  title: 'UI/UI/InputGroup',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import * as React from 'react';",
              "import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from '@invana/forms';",
              "import { DollarSign, Search } from 'lucide-react';",
            ],
            picked.map((v) => ({
              comment: v.caption,
              setup: [
                `const [value, setValue] = React.useState(${JSON.stringify(v.value)});`,
                '// The input\'s text on every keystroke.',
                'const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value);',
                v.end?.button ? '// The button submits what the input holds.\nconst onClick = () => search(value);' : null,
              ]
                .filter(Boolean)
                .join('\n'),
              call: [
                '<InputGroup>',
                ...addonCode(v.start, 'inline-start'),
                `  <InputGroupInput${v.type ? ` type="${v.type}"` : ''} placeholder="${v.placeholder}" value={value} onChange={onChange} />`,
                ...addonCode(v.end, 'inline-end'),
                '</InputGroup>',
              ].join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onChange: fn(), onClick: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

function LiveInputGroup({ v, onChange, onClick, log }: { v: InputGroupVariant } & Omit<Args, 'variant'> & { log: Log }) {
  const [value, setValue] = React.useState(v.value);
  const addon = (a: Addon | undefined, align: 'inline-start' | 'inline-end') =>
    a ? (
      <InputGroupAddon align={align}>
        {a.icon ? ICONS[a.icon] : null}
        {a.text ? <InputGroupText>{a.text}</InputGroupText> : null}
        {a.button ? (
          <InputGroupButton
            onClick={() => {
              onClick(value);
              log('onClick', value);
            }}
          >
            {a.button}
          </InputGroupButton>
        ) : null}
      </InputGroupAddon>
    ) : null;
  return (
    <InputGroupPart>
      {addon(v.start, 'inline-start')}
      <InputGroupInput
        id={v.id}
        aria-label={v.placeholder}
        type={v.type}
        placeholder={v.placeholder}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
          log('onChange', e.target.value);
        }}
      />
      {addon(v.end, 'inline-end')}
    </InputGroupPart>
  );
}

/**
 * An input with what explains it attached — an icon, a unit, a button — from
 * `fixtures/ui/input-group.json`. Type into one: `onChange` logs the text and the story holds it;
 * the search button sends what the input holds.
 */
export const InputGroup: Story = {
  render: ({ variant, onChange, onClick }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveInputGroup v={v} onChange={onChange} onClick={onClick} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Search with a button' }));
    await step('Type a query', async () => {
      await userEvent.type(cell.getByRole('textbox'), 'table');
      await expect(args.onChange).toHaveBeenLastCalledWith('table');
      await expect(cell.getByRole('textbox')).toHaveValue('table');
    });
    await step('Search sends it', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Search' }));
      await expect(args.onClick).toHaveBeenCalledWith('table');
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('onClick"table"');
    });
  },
};
