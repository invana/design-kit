import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  Card as CardRoot,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardWithHeader,
} from '@invana/ui';

import data from '../../../../fixtures/ui/card.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log, type Variant } from '../../../_story/variant-grid';
import { Buttons, Content, buttonSource, contentSource, type Block, type ButtonSpec, type Send } from '../_content';

/**
 * The header colours, as `CardWithHeader`'s `headerClassName` — theme tokens only. The card
 * has no `tone` prop, so a coloured header is a class (a kit gap, reported). `*:text-inherit`
 * lets the description take the header's ink instead of the muted grey.
 */
const HEADERS = {
  primary: 'bg-primary text-primary-foreground *:text-inherit',
  success: 'bg-success text-success-foreground *:text-inherit',
  warning: 'bg-warning text-warning-foreground *:text-inherit',
  info: 'bg-info text-info-foreground *:text-inherit',
  destructive: 'bg-destructive text-destructive-foreground *:text-inherit',
  muted: 'bg-muted text-foreground',
  accent: 'bg-accent text-accent-foreground *:text-inherit',
  inverse: 'bg-foreground text-background *:text-inherit',
  gradient: 'bg-gradient-to-r from-primary to-info text-primary-foreground *:text-inherit',
} as const;

interface CardSpec {
  title?: string;
  description?: string;
  /** A coloured header, drawn with `CardWithHeader`. */
  header?: keyof typeof HEADERS;
  content?: Block[];
  footer?: ButtonSpec[];
  /** The whole card is a click target. */
  interactive?: boolean;
  /** Only in the "with a custom class" cell. */
  className?: string;
}

interface CardVariant extends Variant {
  cards: CardSpec[];
}

const VARIANTS = data as CardVariant[];

interface Args {
  variant: string;
  onClick: (payload: { card: string; target: string }) => void;
  onCheckedChange: (payload: { id: string; checked: boolean }) => void;
}

/** What a card is called in the event log: its title, else its first item or figure. */
function nameOf(c: CardSpec): string {
  const first = c.content?.[0];
  if (c.title) return c.title;
  if (first && 'item' in first) return first.item.title;
  if (first && 'metric' in first) return first.metric.label;
  return 'card';
}

function cardSource(c: CardSpec) {
  const body = c.content ? contentSource(c.content, '    ') : '';
  const footer = c.footer?.map((b) => buttonSource(b)).join('\n    ');
  if (c.header)
    return [
      '<CardWithHeader',
      `  title="${c.title}"`,
      c.description ? `  description="${c.description}"` : '',
      `  headerClassName="${HEADERS[c.header]}"`,
      footer ? `  footer={<>${c.footer!.map((b) => buttonSource(b)).join('')}</>}` : '',
      '>',
      body.replace(/^ {2}/gm, ''),
      '</CardWithHeader>',
    ]
      .filter(Boolean)
      .join('\n');
  return [
    `<Card${c.className ? ` className="${c.className}"` : ''}${c.interactive ? ' role="button" tabIndex={0} onClick={onOpen}' : ''}>`,
    c.title
      ? [
          '  <CardHeader>',
          `    <CardTitle>${c.title}</CardTitle>`,
          c.description ? `    <CardDescription>${c.description}</CardDescription>` : '',
          '  </CardHeader>',
        ]
          .filter(Boolean)
          .join('\n')
      : '',
    body ? `  <CardContent>\n${body}\n  </CardContent>` : '',
    footer ? `  <CardFooter>\n    ${footer}\n  </CardFooter>` : '',
    '</Card>',
  ]
    .filter(Boolean)
    .join('\n');
}

const meta = {
  title: 'UI/UI/Card',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, CardWithHeader } from '@invana/ui';",
              "import { Item, ItemContent, ItemMedia, ItemTitle, ItemDescription, MetricTile, PropertyList, PropertyRow } from '@invana/ui';",
              "import { Switch } from '@invana/forms';",
            ],
            picked.map((v, i) => ({
              comment: v.caption,
              setup: i
                ? undefined
                : '// Buttons take onClick (the click event); a switch takes onCheckedChange (true or false).\nconst onClick = (event) => {};\nconst onCheckedChange = (checked) => {};',
              call: v.cards.map(cardSource).join('\n\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onClick: fn(), onCheckedChange: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

function OneCard({ c, args, log }: { c: CardSpec; args: Args; log: Log }) {
  const card = nameOf(c);
  const send: Send = (name, payload) => {
    if (name === 'onClick') {
      args.onClick({ card, target: String(payload) });
      log('onClick', { card, target: payload });
    } else if (name === 'onCheckedChange') {
      args.onCheckedChange(payload as { id: string; checked: boolean });
      log(name, payload);
    } else log(name, payload);
  };
  const body = c.content ? <Content blocks={c.content} send={send} /> : null;
  const footer = c.footer ? <Buttons buttons={c.footer} send={send} /> : undefined;

  if (c.header)
    return (
      <CardWithHeader
        title={c.title}
        description={c.description}
        headerClassName={HEADERS[c.header]}
        footer={footer}
      >
        {body}
      </CardWithHeader>
    );
  return (
    <CardRoot
      className={c.className}
      role={c.interactive ? 'button' : undefined}
      tabIndex={c.interactive ? 0 : undefined}
      onClick={c.interactive ? () => send('onClick', 'card') : undefined}
    >
      {c.title ? (
        <CardHeader>
          <CardTitle>{c.title}</CardTitle>
          {c.description ? <CardDescription>{c.description}</CardDescription> : null}
        </CardHeader>
      ) : null}
      {body ? <CardContent>{body}</CardContent> : null}
      {footer ? <CardFooter>{footer}</CardFooter> : null}
    </CardRoot>
  );
}

/**
 * A surface that holds one thing — the bare parts, coloured headers (theme tokens only), and
 * the cards real screens use (feature, settings, pricing, metrics, notification, product,
 * profile), from `fixtures/ui/card.json`. Click a button or the interactive card: `onClick`
 * sends which card and what was clicked. Flip a switch: `onCheckedChange` sends its id and state.
 */
export const Card: Story = {
  render: (args) => (
    <VariantGrid variants={VARIANTS} variant={args.variant}>
      {(v, log) => (
        <>
          {v.cards.map((c, i) => (
            <OneCard key={i} c={c} args={args} log={log} />
          ))}
        </>
      )}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('Click a footer button', async () => {
      const cell = within(canvas.getByRole('group', { name: 'With footer' }));
      await userEvent.click(cell.getByRole('button', { name: 'Continue' }));
      await expect(args.onClick).toHaveBeenCalledWith({ card: 'Complete card', target: 'Continue' });
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"target": "Continue"');
    });
    await step('Flip a setting', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Settings card' }));
      await userEvent.click(cell.getByRole('switch', { name: /Marketing emails/ }));
      await expect(args.onCheckedChange).toHaveBeenCalledWith({ id: 'card-settings-marketing', checked: true });
    });
    await step('Click the interactive card', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Interactive card — with a custom class' }));
      await userEvent.click(cell.getByRole('button', { name: /Interactive card/ }));
      await expect(args.onClick).toHaveBeenCalledWith({ card: 'Interactive card', target: 'card' });
    });
  },
};
