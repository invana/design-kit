import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  Badge,
  Button,
  FilterChip,
  SearchInput,
  SegmentedControl,
  Tabs,
  TabsList,
  TabsTrigger,
  Toggle,
  Stack,
} from '@invana/ui';
import { Input } from '@invana/forms';
import { Settings2 } from 'lucide-react';

import data from '../../../fixtures/others/control-sizes.json';
import { snippets, sourceFor, variantArg } from '../../_story/source';
import { VariantGrid, type Log, type Variant } from '../../_story/variant-grid';

type Size = 'xs' | 'sm' | 'lg';
type Control = 'button' | 'icon-button' | 'badge' | 'segmented' | 'search' | 'input' | 'filter-chip' | 'tabs' | 'toggle';

interface Row extends Variant {
  /** Absent on the `default` row: no size passed at all, so every control's own default (`md`) shows. */
  size?: Size;
  controls: Control[];
}

const OPTIONS = data.options;
const VARIANTS = data.rows as Row[];

const ICON_SIZE = { xs: 'icon-xs', sm: 'icon-sm', lg: 'icon' } as const;

interface Args {
  variant: string;
  onClick: (control: string) => void;
  onChange: (value: string) => void;
  onValueChange: (value: string) => void;
  onPressedChange: (pressed: boolean) => void;
}

/** One row of the scale, holding what a consumer would: the search text, the range, the tab, the toggle. */
function Live({ row, args, log }: { row: Row; args: Args; log: Log }) {
  const [q, setQ] = React.useState('');
  const [text, setText] = React.useState('');
  const [range, setRange] = React.useState('day');
  const [tab, setTab] = React.useState('day');
  const [pressed, setPressed] = React.useState(false);
  const { size } = row;
  // Inputs and Toggle start at `sm`; no row asks them for `xs`.
  const fromSm = size === "xs" ? undefined : size;

  const click = (control: string) => () => {
    args.onClick(control);
    log('onClick', control);
  };
  const change = (name: string, set: (v: string) => void) => (value: string) => {
    set(value);
    (name === 'onChange' ? args.onChange : args.onValueChange)(value);
    log(name, value);
  };

  const draw = (c: Control) => {
    switch (c) {
      case 'button':
        return (
          <Button key={c} size={size} variant="outline" onClick={click('button')}>
            Button
          </Button>
        );
      case 'icon-button':
        return (
          <Button key={c} size={size ? ICON_SIZE[size] : 'icon'} variant="ghost" aria-label="Settings" onClick={click('settings')}>
            <Settings2 />
          </Button>
        );
      case 'badge':
        return (
          <Badge key={c} size={size === 'lg' ? undefined : size} variant="outline">
            badge
          </Badge>
        );
      case 'segmented':
        return (
          <SegmentedControl
            key={c}
            size={size === 'lg' ? undefined : size}
            aria-label="Range"
            options={OPTIONS}
            value={range}
            onValueChange={change('onValueChange', setRange)}
          />
        );
      case 'search':
        // Kit gap: SearchInput and Input fill their row and take no width prop, so the row sets one.
        return <SearchInput key={c} className="w-40" inputSize={fromSm} value={q} onChange={change('onChange', setQ)} placeholder="Search" />;
      case 'input':
        return (
          <Input
            key={c}
            className="w-32"
            inputSize={fromSm}
            placeholder="Input"
            value={text}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => change('onChange', setText)(e.target.value)}
          />
        );
      case 'filter-chip':
        return <FilterChip key={c} label="kind" onClick={click('filter-chip')} />;
      case 'tabs':
        return (
          <Tabs key={c} size={size === 'sm' ? 'sm' : undefined} value={tab} onValueChange={change('onValueChange', setTab)}>
            <TabsList>
              {OPTIONS.map((o) => (
                <TabsTrigger key={o.value} value={o.value}>
                  {o.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        );
      case 'toggle':
        return (
          <Toggle
            key={c}
            size={fromSm}
            variant="outline"
            aria-label="Bold"
            pressed={pressed}
            onPressedChange={(p) => {
              setPressed(p);
              args.onPressedChange(p);
              log('onPressedChange', p);
            }}
          >
            B
          </Toggle>
        );
    }
  };

  // Kit gap: no inline layout primitive (a row of controls on one baseline), so this one
  // flex row stays. Every control in it reads its height from the scale, not from here.
  return <Stack direction="row" gap="sm">{row.controls.map(draw)}</Stack>;
}

const CODE: Record<Control, (size?: Size) => string> = {
  button: (s) => `<Button${s ? ` size="${s}"` : ''} variant="outline" onClick={onClick}>Button</Button>`,
  'icon-button': (s) =>
    `<Button size="${s ? ICON_SIZE[s] : 'icon'}" variant="ghost" aria-label="Settings" onClick={onClick}><Settings2 /></Button>`,
  badge: (s) => `<Badge${s ? ` size="${s}"` : ''} variant="outline">badge</Badge>`,
  segmented: (s) =>
    `<SegmentedControl${s ? ` size="${s}"` : ''} aria-label="Range" options={options} value={range} onValueChange={setRange} />`,
  search: (s) => `<SearchInput${s ? ` inputSize="${s}"` : ''} value={q} onChange={setQ} placeholder="Search" />`,
  input: (s) => `<Input${s ? ` inputSize="${s}"` : ''} placeholder="Input" value={text} onChange={(e) => setText(e.target.value)} />`,
  'filter-chip': () => '<FilterChip label="kind" onClick={onClick} />',
  tabs: (s) =>
    `<Tabs${s === 'sm' ? ' size="sm"' : ''} value={tab} onValueChange={setTab}>\n  <TabsList>\n    {options.map((o) => <TabsTrigger key={o.value} value={o.value}>{o.label}</TabsTrigger>)}\n  </TabsList>\n</Tabs>`,
  toggle: (s) => `<Toggle${s ? ` size="${s}"` : ''} variant="outline" pressed={bold} onPressedChange={setBold}>B</Toggle>`,
};

const meta = {
  title: 'Others/ControlSizes',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import { Badge, Button, FilterChip, SearchInput, SegmentedControl, Tabs, TabsList, TabsTrigger, Toggle } from '@invana/ui';",
              "import { Input } from '@invana/forms';",
            ],
            picked.map((row, i) => ({
              comment: row.caption,
              data: i === 0 ? { options: OPTIONS } : undefined,
              setup:
                i === 0
                  ? '// onChange / onValueChange receive the new string; onPressedChange the new boolean.'
                  : undefined,
              call: row.controls.map((c) => CODE[c](row.size)).join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onClick: fn(), onChange: fn(), onValueChange: fn(), onPressedChange: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * One size name, one height, in every component — the control scale from
 * `@invana/styling` (`--spacing-control-*`), rows from `fixtures/others/control-sizes.json`.
 * Each row lines its controls up on one baseline; a control taller or shorter than its row is
 * a component that has stopped reading the scale. The `default` row passes no size at all —
 * every control's default is `md`. Every control answers: type, pick, toggle, click.
 */
export const ControlSizes: Story = {
  render: (args) => (
    <VariantGrid variants={VARIANTS} variant={args.variant}>
      {(row, log) => <Live row={row} args={args} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    for (const v of VARIANTS) await expect(canvas.getByRole('group', { name: v.caption })).toBeInTheDocument();
    const row = within(canvas.getByRole('group', { name: 'sm · 26px' }));
    await step('Toggle bold', async () => {
      await userEvent.click(row.getByRole('button', { name: 'Bold' }));
      await expect(args.onPressedChange).toHaveBeenCalledWith(true);
      await expect(row.getByRole('button', { name: 'Bold' })).toHaveAttribute('data-state', 'on');
    });
    await step('Type a search', async () => {
      await userEvent.type(row.getByPlaceholderText('Search'), 'q');
      await expect(args.onChange).toHaveBeenCalledWith('q');
      await expect(row.getByRole('list', { name: 'Events' })).toHaveTextContent('onChange"q"');
    });
  },
};
