import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  Button,
  ButtonGroup,
  EmptyState,
  Item,
  ItemContent,
  ItemGroup,
  ItemTitle,
  PropertyList,
  PropertyRow,
  SearchInput,
  SectionHeader,
} from '@invana/ui';
import { X } from 'lucide-react';

import DATA from '../../../../fixtures/ui-extended/search-input.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Log } from '../../../_story/variant-board';

interface Field {
  /** What the field filters, when a cell has several. */
  name?: string;
  value: string;
  inputSize?: 'sm' | 'default' | 'lg';
  placeholder?: string;
}

interface Variant {
  caption: string;
  wide?: boolean;
  width?: number;
  fields: Field[];
  /** Draw a clear button beside the field. */
  clear?: boolean;
  /** Filter these as the reader types. */
  items?: string[];
}

const VARIANTS = DATA as Variant[];

interface Args {
  variant: string;
  onChange: (value: string) => void;
}

function Live({ v, log, onChange }: { v: Variant; log: Log; onChange: Args['onChange'] }) {
  const [values, setValues] = React.useState(v.fields.map((f) => f.value));
  const set = (i: number, value: string, from = 'onChange') => {
    onChange(value);
    log(from, v.fields[i].name ? { [v.fields[i].name!]: value } : value);
    setValues((all) => all.map((x, j) => (j === i ? value : x)));
  };
  const inputs = v.fields.map((f, i) => (
    <SearchInput
      key={i}
      aria-label={f.placeholder ?? 'Search'}
      inputSize={f.inputSize}
      placeholder={f.placeholder}
      value={values[i]}
      onChange={(value) => set(i, value)}
    />
  ));

  if (v.clear) {
    return (
      <ButtonGroup>
        {inputs}
        <Button variant="outline" size="icon" aria-label="Clear search" disabled={!values[0]} onClick={() => set(0, '', 'clear')}>
          <X />
        </Button>
      </ButtonGroup>
    );
  }
  if (v.items) {
    const query = values[0].toLowerCase();
    const found = v.items.filter((item) => item.toLowerCase().includes(query));
    return (
      <>
        {inputs}
        <SectionHeader title="Results" count={String(found.length)} bare />
        {found.length ? (
          <ItemGroup aria-label="Results">
            {found.map((item) => (
              <Item key={item} size="xs">
                <ItemContent>
                  <ItemTitle>{item}</ItemTitle>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        ) : (
          <EmptyState title="No results found" />
        )}
      </>
    );
  }
  if (v.fields.length > 1) {
    const active = v.fields.map((f, i) => [f.name!, values[i]] as const).filter(([, value]) => value);
    return (
      <>
        {inputs}
        <SectionHeader title="Active filters" count={String(active.length)} bare />
        <PropertyList labelWidth="auto">
          {active.length ? (
            active.map(([name, value]) => (
              <PropertyRow key={name} label={name} mono>
                {value}
              </PropertyRow>
            ))
          ) : (
            <PropertyRow label="Filters">none applied</PropertyRow>
          )}
        </PropertyList>
      </>
    );
  }
  return <>{inputs}</>;
}

const meta = {
  title: 'UI/UI Extended/SearchInput',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { SearchInput } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: v.items ? { items: v.items } : undefined,
              setup: [
                '// onChange receives the raw string, not the event — a search box has one value.',
                ...v.fields.map((f, i) => {
                  const n = v.fields.length > 1 ? String(i + 1) : '';
                  return `const [query${n}, setQuery${n}] = React.useState(${JSON.stringify(f.value)});`;
                }),
                ...(v.items ? ['const found = items.filter((i) => i.toLowerCase().includes(query.toLowerCase()));'] : []),
              ].join('\n'),
              call: v.fields
                .map((f, i) => {
                  const n = v.fields.length > 1 ? String(i + 1) : '';
                  return jsx('SearchInput', {
                    inputSize: f.inputSize ? { literal: f.inputSize } : undefined,
                    placeholder: f.placeholder ? { literal: f.placeholder } : undefined,
                    value: `query${n}`,
                    onChange: `setQuery${n}`,
                  });
                })
                .concat(v.clear ? ['<Button variant="outline" size="icon" aria-label="Clear search" onClick={() => setQuery("")}><X /></Button>'] : [])
                .join('\n'),
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

/**
 * One value, on the control scale: `sm` (26px) is the application field — docked in a panel
 * header or a table toolbar; `default` (32px) a standalone form; `lg` (40px) a page. From
 * `fixtures/ui-extended/search-input.json`. `placeholder` says what *this* box searches — two
 * panels both saying "Search..." have stopped telling you anything. Type: every keystroke is
 * logged as the string `onChange` receives, and the filtering cells follow it.
 */
export const SearchInputStory: Story = {
  name: 'SearchInput',
  render: ({ variant, onChange }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => <Live v={v} log={log} onChange={onChange} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'With filtering' }));
    await step('Type to filter', async () => {
      await userEvent.type(cell.getByRole('textbox', { name: 'Search fruit' }), 'an');
      await expect(args.onChange).toHaveBeenLastCalledWith('an');
      await expect(cell.getByText('Banana')).toBeInTheDocument();
      await expect(cell.queryByText('Apple')).toBeNull();
    });
    await step('Clear empties the field', async () => {
      const clear = within(within(canvasElement).getByRole('group', { name: 'With clear button' }));
      await userEvent.click(clear.getByRole('button', { name: 'Clear search' }));
      await expect(args.onChange).toHaveBeenLastCalledWith('');
      await expect(clear.getByRole('textbox')).toHaveValue('');
      await expect(clear.getByRole('list', { name: 'Events' })).toHaveTextContent('clear""');
    });
  },
};
