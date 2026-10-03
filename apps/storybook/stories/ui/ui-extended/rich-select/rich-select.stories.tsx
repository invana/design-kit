import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { AgentChip, Badge, ChatSessionComposer, RichSelect, type RichSelectOption } from '@invana/ui';
import {
  ArrowUp,
  Bug,
  Circle,
  Database,
  Eye,
  GitFork,
  Globe,
  LayoutGrid,
  Network,
  Settings2,
  Shield,
  User,
  Zap,
} from 'lucide-react';

import DATA from '../../../../fixtures/ui-extended/rich-select.json';
import { inline, jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log } from '../../../_story/variant-grid';

/** Icons are code, so the JSON names them. */
const ICONS = {
  network: Network,
  grid: LayoutGrid,
  tree: GitFork,
  circle: Circle,
  bug: Bug,
  zap: Zap,
  database: Database,
  shield: Shield,
  eye: Eye,
  globe: Globe,
  settings: Settings2,
} as const;
type IconName = keyof typeof ICONS;

interface OptionData {
  value: string;
  label: string;
  description?: string;
  icon?: string;
  badge?: { text: string; variant: 'destructive' | 'secondary' };
  disabled?: boolean;
  disabledReason?: string;
}

interface SelectData {
  label?: string;
  placeholder?: string;
  multiple?: boolean;
  appearance?: 'field' | 'inline';
  side?: 'top' | 'bottom';
  align?: 'start' | 'end';
  triggerAriaLabel?: string;
  triggerIcon?: string;
  /** `person` — the story's `renderOption` / `renderValue` pair. */
  render?: string;
  value: string | string[];
  options: OptionData[];
  toggles?: { id: string; label: string; tag?: string }[];
  actions?: { id: string; label: string; icon?: string }[];
}

interface Variant {
  caption: string;
  width?: number;
  composer?: { placeholder: string };
  selects: SelectData[];
}

const VARIANTS = DATA as Variant[];

interface Args {
  variant: string;
  onChange: (value: string | string[]) => void;
  onCheckedChange: (id: string, checked: boolean) => void;
  onSelect: (id: string) => void;
  onSend: (text: string) => void;
}

const icon = (name?: string) => (name ? ICONS[name as IconName] : undefined);

function options(data: OptionData[]): RichSelectOption[] {
  return data.map(({ icon: name, badge, ...o }) => ({
    ...o,
    icon: icon(name),
    badge: badge ? <Badge variant={badge.variant}>{badge.text}</Badge> : undefined,
  }));
}

/** The `person` render: each row and the trigger are the person's chip. */
const person = (o: Pick<RichSelectOption, 'label' | 'description'>) => (
  <AgentChip kind="person" icon={<User />} name={`${o.label} · ${o.description}`} />
);

function SelectLive({ s, log, args }: { s: SelectData; log: Log; args: Omit<Args, 'variant'> }) {
  const [value, setValue] = React.useState(s.value);
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});
  const tag = s.toggles?.find((t) => checked[t.id])?.tag;
  return (
    <RichSelect
      label={s.label}
      placeholder={s.placeholder}
      multiple={s.multiple}
      appearance={s.appearance}
      side={s.side}
      align={s.align}
      triggerAriaLabel={s.triggerAriaLabel}
      triggerIcon={icon(s.triggerIcon)}
      triggerTag={tag}
      value={value}
      onChange={(v) => {
        args.onChange(v);
        log('onChange', v);
        setValue(v);
      }}
      options={options(s.options)}
      renderOption={s.render === 'person' ? (o) => person(o) : undefined}
      renderValue={s.render === 'person' ? (picked) => (picked[0] ? person(picked[0]) : 'Unassigned') : undefined}
      toggles={s.toggles?.map((t) => ({
        id: t.id,
        label: t.label,
        checked: !!checked[t.id],
        onCheckedChange: (c: boolean) => {
          args.onCheckedChange(t.id, c);
          log('onCheckedChange', { id: t.id, checked: c });
          setChecked((all) => ({ ...all, [t.id]: c }));
        },
      }))}
      actions={s.actions?.map((a) => ({
        id: a.id,
        label: a.label,
        icon: icon(a.icon),
        onSelect: () => {
          args.onSelect(a.id);
          log('onSelect', a.id);
        },
      }))}
    />
  );
}

function Live({ v, log, args }: { v: Variant; log: Log; args: Omit<Args, 'variant'> }) {
  const [text, setText] = React.useState('');
  const selects = v.selects.map((s, i) => <SelectLive key={i} s={s} log={log} args={args} />);
  if (!v.composer) return <>{selects}</>;
  return (
    <ChatSessionComposer
      value={text}
      onChange={setText}
      onSend={() => {
        args.onSend(text);
        log('onSend', text);
        setText('');
      }}
      placeholder={v.composer.placeholder}
      sendIcon={<ArrowUp />}
      toolbarStart={<>{selects}</>}
    />
  );
}

function selectCall(s: SelectData, i: number, many: boolean) {
  const n = many ? String(i + 1) : '';
  return jsx('RichSelect', {
    label: s.label ? { literal: s.label } : undefined,
    placeholder: s.placeholder ? { literal: s.placeholder } : undefined,
    multiple: s.multiple ? 'true' : undefined,
    appearance: s.appearance ? { literal: s.appearance } : undefined,
    side: s.side ? { literal: s.side } : undefined,
    align: s.align ? { literal: s.align } : undefined,
    triggerAriaLabel: s.triggerAriaLabel ? { literal: s.triggerAriaLabel } : undefined,
    triggerIcon: s.triggerIcon ? `ICONS.${s.triggerIcon}` : undefined,
    triggerTag: s.toggles ? `checked["${s.toggles[0].id}"] ? "${s.toggles[0].tag}" : undefined` : undefined,
    options: `options${n}`,
    value: `value${n}`,
    onChange: `setValue${n}`,
    renderOption: s.render === 'person' ? '(o) => <AgentChip kind="person" name={`${o.label} · ${o.description}`} />' : undefined,
    renderValue: s.render === 'person' ? '([o]) => (o ? <AgentChip kind="person" name={o.label} /> : "Unassigned")' : undefined,
    toggles: s.toggles ? `toggles${n}` : undefined,
    actions: s.actions ? `actions${n}` : undefined,
  });
}

const meta = {
  title: 'UI/UI Extended/RichSelect',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { Badge, ChatSessionComposer, RichSelect } from '@invana/ui';"],
            picked.map((v) => {
              const many = v.selects.length > 1;
              const data: Record<string, unknown> = {};
              const setup: string[] = [
                '// `icon: "network"` names a component: ICONS = { network: Network, … } (lucide).',
                '// A `badge` is a node: { text, variant } → <Badge variant={variant}>{text}</Badge>.',
              ];
              v.selects.forEach((s, i) => {
                const n = many ? String(i + 1) : '';
                data[`options${n}`] = s.options;
                setup.push(
                  `// onChange receives the value — a string, or string[] with \`multiple\`.`,
                  `const [value${n}, setValue${n}] = React.useState(${inline(s.value)});`,
                );
                if (s.toggles) {
                  setup.push(
                    'const [checked, setChecked] = React.useState({});',
                    `// A toggle scopes the choice; onCheckedChange receives true or false and keeps the menu open.`,
                    `const toggles${n} = ${inline(s.toggles.map((t) => ({ id: t.id, label: t.label })))}.map((t) => ({`,
                    '  ...t, checked: !!checked[t.id], onCheckedChange: (c) => setChecked({ ...checked, [t.id]: c }),',
                    '}));',
                  );
                }
                if (s.actions) {
                  setup.push(
                    '// An action is not a value: onSelect receives nothing.',
                    `const actions${n} = ${inline(s.actions.map((a) => ({ id: a.id, label: a.label })))}.map((a) => ({ ...a, onSelect: () => openManager() }));`,
                  );
                }
              });
              const calls = v.selects.map((s, i) => selectCall(s, i, many));
              return {
                comment: v.caption,
                data,
                setup: setup.join('\n'),
                call: v.composer
                  ? [
                      '<ChatSessionComposer',
                      '  value={text}',
                      '  onChange={setText}',
                      '  onSend={onSend} // receives nothing — read `text`',
                      `  placeholder="${v.composer.placeholder}"`,
                      '  toolbarStart={<>',
                      ...calls.map((c) => '    ' + c.split('\n').join('\n    ')),
                      '  </>}',
                      '/>',
                    ].join('\n')
                  : calls.join('\n'),
              };
            }),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onChange: fn(), onCheckedChange: fn(), onSelect: fn(), onSend: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * A select whose rows carry more than a label — an icon, a description, a count, a disabled
 * reason — and, beyond the choice, toggles that scope it and actions below it, from
 * `fixtures/ui-extended/rich-select.json`. In a composer every control is one `RichSelect` with
 * `appearance="inline"`; an inline trigger shows only its value, so each carries
 * `triggerAriaLabel`. Pick an option, flip *Next ask only*, or choose *Manage worlds…*: each is
 * logged with what it carried, and the trigger follows.
 */
export const RichSelectStory: Story = {
  name: 'RichSelect',
  render: ({ variant, ...args }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <Live v={v} log={log} args={args} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const page = within(canvasElement.ownerDocument.body);
    const cell = within(within(canvasElement).getByRole('group', { name: VARIANTS[0].caption }));
    await step('Pick Grid', async () => {
      await userEvent.click(cell.getByRole('button', { name: /Force-directed/ }));
      await userEvent.click(await page.findByRole('menuitemradio', { name: /Grid/ }));
      await expect(args.onChange).toHaveBeenCalledWith('grid');
    });
    await step('The trigger shows the choice, and the log the value', async () => {
      await waitFor(() => expect(cell.getByRole('button', { name: /Grid/ })).toBeInTheDocument());
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('onChange"grid"');
    });
  },
};
