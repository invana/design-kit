import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import {
  Badge,
  BoundChip,
  Button,
  ButtonGroup,
  RecordHeader,
  ToggleGroup,
  ToggleGroupItem,
  type ButtonProps,
  type RecordHeaderProps,
} from '@invana/ui';

import DATA from '../../../../fixtures/ui-extended/record-header.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log } from '../../../_story/variant-grid';

interface Variant {
  caption: string;
  wide?: boolean;
  width?: number;
  size?: string;
  tone: string;
  crumbs: string[];
  chips: { bound?: string; badge?: string }[];
  views?: { value: string; label: string }[];
  view?: string;
  actions?: { label: string; variant: string; icon?: string }[];
  pager?: { label: string; icon: string }[];
}

const VARIANTS: Variant[] = DATA;

interface Args {
  variant: string;
  /** A header button was pressed — its label. */
  onAction: (label: string) => void;
  /** The view switch moved — the view's value. */
  onViewChange: (value: string) => void;
}

/** Icons are code; the JSON names them. */
const ICONS = { more: <MoreHorizontal />, previous: <ChevronLeft />, next: <ChevronRight /> };
type IconName = keyof typeof ICONS;

const chipJsx = (c: { bound?: string; badge?: string }) =>
  c.bound ? `<BoundChip bound="${c.bound}" />` : `<Badge variant="outline" size="sm">${c.badge}</Badge>`;

function code(v: Variant) {
  const lines = [
    '<RecordHeader',
    ...(v.size ? [`  size="${v.size}"`] : []),
    `  tone="${v.tone}"`,
    '  crumbs={crumbs}',
    `  chips={<>${v.chips.map(chipJsx).join('')}</>}`,
    '  actions={<>',
    ...(v.views ? ['    <ToggleGroup type="single" size="sm" value={view} onValueChange={onViewChange}>', ...v.views.map((o) => `      <ToggleGroupItem value="${o.value}">${o.label}</ToggleGroupItem>`), '    </ToggleGroup>'] : []),
    ...(v.actions ?? []).map((a) =>
      a.icon
        ? `    <Button variant="${a.variant}" size="icon-sm" aria-label="${a.label}" onClick={() => onAction('${a.label}')}><MoreHorizontal /></Button>`
        : `    <Button variant="${a.variant}" size="sm" onClick={() => onAction('${a.label}')}>${a.label}</Button>`,
    ),
    ...(v.pager
      ? ['    <ButtonGroup>', ...v.pager.map((p) => `      <Button variant="ghost" size="icon-sm" aria-label="${p.label}" onClick={() => onAction('${p.label}')}>${p.icon === 'previous' ? '<ChevronLeft />' : '<ChevronRight />'}</Button>`), '    </ButtonGroup>']
      : []),
    '  </>}',
    '/>',
  ];
  return lines.join('\n');
}

const meta = {
  title: 'UI/UI Extended/RecordHeader',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import { Badge, BoundChip, Button, ButtonGroup, RecordHeader, ToggleGroup, ToggleGroupItem } from '@invana/ui';",
              "import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';",
            ],
            picked.map((v) => ({
              comment: v.caption,
              data: { crumbs: v.crumbs },
              setup: [
                ...(v.views ? [`const [view, setView] = React.useState('${v.view}');`, '// onViewChange receives the view\'s value — "yml".', 'const onViewChange = (value) => value && setView(value);'] : []),
                '// onAction receives the pressed button\'s label — "Cancel".',
                'const onAction = (label) => {};',
              ].join('\n'),
              call: code(v),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onAction: fn(), onViewChange: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Holds the view a consumer holds, and reports every press. */
function Live({ v, log, onAction, onViewChange }: { v: Variant; log: Log } & Omit<Args, 'variant'>) {
  const [view, setView] = React.useState(v.view);
  const press = (label: string) => () => {
    onAction(label);
    log('onAction', label);
  };
  return (
    <RecordHeader
      size={v.size as RecordHeaderProps['size']}
      tone={v.tone as RecordHeaderProps['tone']}
      crumbs={v.crumbs}
      chips={
        <>
          {v.chips.map((c) =>
            c.bound ? (
              <BoundChip key={c.bound} bound={c.bound} />
            ) : (
              <Badge key={c.badge} variant="outline" size="sm">
                {c.badge}
              </Badge>
            ),
          )}
        </>
      }
      actions={
        <>
          {v.views ? (
            <ToggleGroup
              type="single"
              size="sm"
              value={view}
              onValueChange={(value: string) => {
                if (!value) return;
                onViewChange(value);
                log('onViewChange', value);
                setView(value);
              }}
            >
              {v.views.map((o) => (
                <ToggleGroupItem key={o.value} value={o.value}>
                  {o.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          ) : null}
          {(v.actions ?? []).map((a) =>
            a.icon ? (
              <Button
                key={a.label}
                variant={a.variant as ButtonProps['variant']}
                size="icon-sm"
                aria-label={a.label}
                onClick={press(a.label)}
              >
                {ICONS[a.icon as IconName]}
              </Button>
            ) : (
              <Button key={a.label} variant={a.variant as ButtonProps['variant']} size="sm" onClick={press(a.label)}>
                {a.label}
              </Button>
            ),
          )}
          {v.pager ? (
            <ButtonGroup>
              {v.pager.map((p) => (
                <Button key={p.label} variant="ghost" size="icon-sm" aria-label={p.label} onClick={press(p.label)}>
                  {ICONS[p.icon as IconName]}
                </Button>
              ))}
            </ButtonGroup>
          ) : null}
        </>
      }
    />
  );
}

/**
 * Which record you are looking at, across the top of the surface showing it, from
 * `fixtures/ui-extended/record-header.json`. The **last** crumb is the record and is set solid;
 * the ones before it are the path, muted. Not a `ContextBar` — that describes the *view*; this
 * names the *record*. `lg` by default (a control's 40px, holding `sm` chips and buttons); `md`
 * sits level with a `PanelBox` header, for a record in a panel or drawer. Switch the view or press
 * a button: each is logged with what it carries.
 */
export const RecordHeaderStory: Story = {
  name: 'RecordHeader',
  render: ({ variant, onAction, onViewChange }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <Live v={v} log={log} onAction={onAction} onViewChange={onViewChange} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: VARIANTS[0].caption }));
    await step('Switch to the YAML view', async () => {
      await userEvent.click(cell.getByRole('radio', { name: 'board.yml' }));
      await expect(args.onViewChange).toHaveBeenCalledWith('yml');
      await expect(cell.getByRole('radio', { name: 'board.yml' })).toBeChecked();
    });
    await step('Cancel the run', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Cancel' }));
      await expect(args.onAction).toHaveBeenCalledWith('Cancel');
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"Cancel"');
    });
  },
};
