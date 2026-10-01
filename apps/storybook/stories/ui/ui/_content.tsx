/**
 * Story-only: draws the bodies of composed components (an accordion section, a card, a
 * dialog) from JSON with kit components, so a story holds no markup of its own. Not a kit
 * component — a JSON → kit mapping shared by the `UI/UI` stories that compose content.
 */
import * as React from 'react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  MetricTile,
  PropertyList,
  PropertyRow,
  TypographyList,
  TypographyMuted,
  TypographyP,
} from '@invana/ui';
import { Checkbox, Input, Switch } from '@invana/forms';
// The layout `Field` is shadowed at the package root by the generator's `Field` namespace,
// so its family is imported from its file (a kit gap, reported).
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from '@invana/forms';
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  Bold,
  Calculator,
  Calendar,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Download,
  Info,
  Italic,
  Lock,
  LogOut,
  Mail,
  Palette,
  Pencil,
  Plus,
  Rocket,
  Search,
  Settings,
  Settings2,
  Smile,
  Sparkles,
  Trash2,
  Underline,
  User,
  UserPlus,
  X,
  Zap,
} from 'lucide-react';

/** Icons by the name JSON gives them. */
export const ICONS = {
  'alert-circle': AlertCircle,
  'alert-triangle': AlertTriangle,
  bell: Bell,
  bold: Bold,
  calculator: Calculator,
  calendar: Calendar,
  'calendar-days': CalendarDays,
  'check-circle': CheckCircle2,
  'credit-card': CreditCard,
  download: Download,
  info: Info,
  italic: Italic,
  lock: Lock,
  'log-out': LogOut,
  mail: Mail,
  palette: Palette,
  pencil: Pencil,
  plus: Plus,
  rocket: Rocket,
  search: Search,
  settings: Settings,
  'settings-2': Settings2,
  smile: Smile,
  sparkles: Sparkles,
  trash: Trash2,
  underline: Underline,
  user: User,
  'user-plus': UserPlus,
  x: X,
  zap: Zap,
} as const;

export type IconName = keyof typeof ICONS;

/** The lucide component's name, for the Code tab: `trash` → `Trash2`. */
export function iconTag(name: IconName) {
  return ICONS[name].displayName ?? name;
}

export function Icon({ name }: { name?: IconName }) {
  if (!name) return null;
  const Glyph = ICONS[name];
  return <Glyph />;
}

type ButtonVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'soft' | 'link';
type Tone = 'primary' | 'success' | 'warning' | 'info' | 'destructive' | 'muted';
type MetricTone = 'success' | 'warning' | 'error' | 'info' | 'muted';

export interface ButtonSpec {
  label: string;
  variant?: ButtonVariant;
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm';
  icon?: IconName;
  /** The icon after the label. */
  iconEnd?: IconName;
  disabled?: boolean;
}

export interface BadgeSpec {
  label: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'soft';
  tone?: Tone;
  size?: 'xs' | 'sm';
}

export interface ChoiceSpec {
  id: string;
  label: string;
  description?: string;
  checked?: boolean;
  disabled?: boolean;
}

export interface FieldSpec {
  id: string;
  label: string;
  type?: string;
  value?: string;
  placeholder?: string;
}

/** One piece of a body. Exactly one key is set. */
export type Block =
  | { text: string }
  | { muted: string }
  | { list: string[] }
  | { properties: { label: string; value: string; mono?: boolean }[] }
  | { items: { title: string; description?: string; icon?: IconName }[] }
  | { item: { title: string; description?: string; icon?: IconName; initials?: string; image?: string; dismiss?: string } }
  | { fields: FieldSpec[] }
  | { checks: ChoiceSpec[] }
  | { switches: ChoiceSpec[] }
  | { buttons: ButtonSpec[] }
  | { badges: BadgeSpec[] }
  | { note: { title?: string; text: string; variant?: 'default' | 'destructive'; icon?: IconName } }
  | { metric: { label: string; value: string; caption?: string; captionTone?: MetricTone; meter?: number } };

/** What a body sent: a button's label, a choice's id and state, a field's id and value. */
export type Send = (name: string, payload: unknown) => void;

/**
 * Children separated by a space, so inline controls (badges, buttons) flow as a line of text
 * inside an unstyled block — the kit has no inline-row layout component.
 */
export function spaced(nodes: React.ReactNode[]) {
  return nodes.map((n, i) => (
    <React.Fragment key={i}>
      {i ? ' ' : null}
      {n}
    </React.Fragment>
  ));
}

/** A `Button` from its spec. Forwards its ref and props, so it can be a Radix `asChild` trigger. */
export const ButtonFromSpec = React.forwardRef<
  HTMLButtonElement,
  { spec: ButtonSpec } & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ spec, ...props }, ref) => {
  const iconOnly = spec.size?.startsWith('icon');
  return (
    <Button
      ref={ref}
      variant={spec.variant}
      size={spec.size}
      disabled={spec.disabled}
      aria-label={iconOnly ? spec.label : undefined}
      {...props}
    >
      <Icon name={spec.icon} />
      {iconOnly ? null : spec.label}
      <Icon name={spec.iconEnd} />
    </Button>
  );
});
ButtonFromSpec.displayName = 'ButtonFromSpec';

export function Buttons({ buttons, send }: { buttons: ButtonSpec[]; send?: Send }) {
  return (
    <>
      {spaced(
        buttons.map((b) => (
          <ButtonFromSpec key={b.label} spec={b} onClick={send ? () => send('onClick', b.label) : undefined} />
        )),
      )}
    </>
  );
}

export function Badges({ badges }: { badges: BadgeSpec[] }) {
  return (
    <>
      {spaced(
        badges.map((b) => (
          <Badge key={b.label} variant={b.variant} tone={b.tone} size={b.size}>
            {b.label}
          </Badge>
        )),
      )}
    </>
  );
}

function BlockView({ block, send }: { block: Block; send?: Send }) {
  if ('text' in block) return <TypographyP>{block.text}</TypographyP>;
  if ('muted' in block) return <TypographyMuted>{block.muted}</TypographyMuted>;
  if ('list' in block)
    return (
      <TypographyList>
        {block.list.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </TypographyList>
    );
  if ('properties' in block)
    return (
      <PropertyList labelWidth="auto">
        {block.properties.map((p) => (
          <PropertyRow key={p.label} label={p.label} mono={p.mono}>
            {p.value}
          </PropertyRow>
        ))}
      </PropertyList>
    );
  if ('items' in block)
    return (
      <ItemGroup>
        {block.items.map((i) => (
          <Item key={i.title} size="xs">
            {i.icon ? (
              <ItemMedia variant="icon">
                <Icon name={i.icon} />
              </ItemMedia>
            ) : null}
            <ItemContent>
              <ItemTitle>{i.title}</ItemTitle>
              {i.description ? <ItemDescription>{i.description}</ItemDescription> : null}
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    );
  if ('item' in block) {
    const i = block.item;
    return (
      <Item size="sm">
        {i.initials ? (
          <ItemMedia>
            <Avatar>
              {i.image ? <AvatarImage src={i.image} alt={i.title} /> : null}
              <AvatarFallback>{i.initials}</AvatarFallback>
            </Avatar>
          </ItemMedia>
        ) : i.icon ? (
          <ItemMedia variant="icon">
            <Icon name={i.icon} />
          </ItemMedia>
        ) : null}
        <ItemContent>
          <ItemTitle>{i.title}</ItemTitle>
          {i.description ? <ItemDescription>{i.description}</ItemDescription> : null}
        </ItemContent>
        {i.dismiss ? (
          <ItemActions>
            <ButtonFromSpec
              spec={{ label: i.dismiss, icon: 'x', size: 'icon-sm', variant: 'ghost' }}
              onClick={send ? () => send('onClick', i.dismiss) : undefined}
            />
          </ItemActions>
        ) : null}
      </Item>
    );
  }
  if ('fields' in block)
    return (
      <FieldGroup>
        {block.fields.map((f) => (
          <Field key={f.id}>
            <FieldLabel htmlFor={f.id}>{f.label}</FieldLabel>
            <Input
              id={f.id}
              type={f.type}
              defaultValue={f.value}
              placeholder={f.placeholder}
              onChange={send ? (e) => send('onChange', { id: f.id, value: e.target.value }) : undefined}
            />
          </Field>
        ))}
      </FieldGroup>
    );
  if ('checks' in block || 'switches' in block) {
    const choices = 'checks' in block ? block.checks : block.switches;
    const Control = 'checks' in block ? Checkbox : Switch;
    return (
      <FieldGroup>
        {choices.map((c) => (
          <Field key={c.id} orientation="horizontal" data-disabled={c.disabled || undefined}>
            <Control
              id={c.id}
              defaultChecked={c.checked}
              disabled={c.disabled}
              onCheckedChange={send ? (checked) => send('onCheckedChange', { id: c.id, checked }) : undefined}
            />
            {c.description ? (
              <FieldContent>
                <FieldLabel htmlFor={c.id}>{c.label}</FieldLabel>
                <FieldDescription>{c.description}</FieldDescription>
              </FieldContent>
            ) : (
              <FieldLabel htmlFor={c.id}>{c.label}</FieldLabel>
            )}
          </Field>
        ))}
      </FieldGroup>
    );
  }
  if ('buttons' in block)
    return (
      <div>
        <Buttons buttons={block.buttons} send={send} />
      </div>
    );
  if ('badges' in block)
    return (
      <div>
        <Badges badges={block.badges} />
      </div>
    );
  if ('note' in block)
    return (
      <Alert variant={block.note.variant}>
        <Icon name={block.note.icon} />
        {block.note.title ? <AlertTitle>{block.note.title}</AlertTitle> : null}
        <AlertDescription>{block.note.text}</AlertDescription>
      </Alert>
    );
  return <MetricTile variant="hero" {...block.metric} />;
}

/** A body, block after block. */
export function Content({ blocks, send }: { blocks: Block[]; send?: Send }) {
  return (
    <>
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} send={send} />
      ))}
    </>
  );
}

/** The same body as the JSX a consumer writes, for the Code tab. */
export function contentSource(blocks: Block[], indent = ''): string {
  const lines = blocks.flatMap((b): string[] => {
    if ('text' in b) return [`<TypographyP>${b.text}</TypographyP>`];
    if ('muted' in b) return [`<TypographyMuted>${b.muted}</TypographyMuted>`];
    if ('list' in b) return ['<TypographyList>', ...b.list.map((l) => `  <li>${l}</li>`), '</TypographyList>'];
    if ('properties' in b)
      return [
        '<PropertyList labelWidth="auto">',
        ...b.properties.map((p) => `  <PropertyRow label="${p.label}"${p.mono ? ' mono' : ''}>${p.value}</PropertyRow>`),
        '</PropertyList>',
      ];
    if ('items' in b)
      return [
        '<ItemGroup>',
        ...b.items.map(
          (i) =>
            `  <Item size="xs"><ItemContent><ItemTitle>${i.title}</ItemTitle>${i.description ? `<ItemDescription>${i.description}</ItemDescription>` : ''}</ItemContent></Item>`,
        ),
        '</ItemGroup>',
      ];
    if ('item' in b)
      return [
        '<Item size="sm">',
        b.item.initials
          ? `  <ItemMedia><Avatar><AvatarFallback>${b.item.initials}</AvatarFallback></Avatar></ItemMedia>`
          : b.item.icon
            ? `  <ItemMedia variant="icon"><${iconTag(b.item.icon)} /></ItemMedia>`
            : '',
        `  <ItemContent><ItemTitle>${b.item.title}</ItemTitle>${b.item.description ? `<ItemDescription>${b.item.description}</ItemDescription>` : ''}</ItemContent>`,
        b.item.dismiss
          ? `  <ItemActions><Button size="icon-sm" variant="ghost" aria-label="${b.item.dismiss}" onClick={onDismiss}><X /></Button></ItemActions>`
          : '',
        '</Item>',
      ].filter(Boolean);
    if ('fields' in b)
      return [
        '<FieldGroup>',
        ...b.fields.map(
          (f) =>
            `  <Field><FieldLabel htmlFor="${f.id}">${f.label}</FieldLabel><Input id="${f.id}"${f.type ? ` type="${f.type}"` : ''}${f.value ? ` defaultValue="${f.value}"` : ''} /></Field>`,
        ),
        '</FieldGroup>',
      ];
    if ('checks' in b || 'switches' in b) {
      const [choices, tag] = 'checks' in b ? [b.checks, 'Checkbox'] : [b.switches, 'Switch'];
      return [
        '<FieldGroup>',
        ...choices.map(
          (c) =>
            `  <Field orientation="horizontal"><${tag} id="${c.id}"${c.checked ? ' defaultChecked' : ''} onCheckedChange={onCheckedChange} /><FieldLabel htmlFor="${c.id}">${c.label}</FieldLabel></Field>`,
        ),
        '</FieldGroup>',
      ];
    }
    if ('buttons' in b) return b.buttons.map((x) => buttonSource(x));
    if ('badges' in b) return b.badges.map(badgeSource);
    if ('note' in b)
      return [
        `<Alert${b.note.variant ? ` variant="${b.note.variant}"` : ''}>`,
        b.note.title ? `  <AlertTitle>${b.note.title}</AlertTitle>` : '',
        `  <AlertDescription>${b.note.text}</AlertDescription>`,
        '</Alert>',
      ].filter(Boolean);
    const m = b.metric;
    return [
      `<MetricTile variant="hero" label="${m.label}" value="${m.value}"${m.caption ? ` caption="${m.caption}"` : ''}${m.captionTone ? ` captionTone="${m.captionTone}"` : ''}${m.meter !== undefined ? ` meter={${m.meter}}` : ''} />`,
    ];
  });
  return lines.map((l) => indent + l).join('\n');
}

export function buttonSource(b: ButtonSpec, onClick = 'onClick') {
  const attrs = [
    b.variant ? `variant="${b.variant}"` : '',
    b.size ? `size="${b.size}"` : '',
    b.disabled ? 'disabled' : '',
    b.size?.startsWith('icon') ? `aria-label="${b.label}"` : '',
    onClick ? `onClick={${onClick}}` : '',
  ].filter(Boolean);
  const body = [
    b.icon ? `<${iconTag(b.icon)} />` : '',
    b.size?.startsWith('icon') ? '' : b.label,
    b.iconEnd ? `<${iconTag(b.iconEnd)} />` : '',
  ]
    .filter(Boolean)
    .join(' ');
  return `<Button${attrs.length ? ' ' + attrs.join(' ') : ''}>${body}</Button>`;
}

export function badgeSource(b: BadgeSpec) {
  const attrs = [
    b.variant ? `variant="${b.variant}"` : '',
    b.tone ? `tone="${b.tone}"` : '',
    b.size ? `size="${b.size}"` : '',
  ].filter(Boolean);
  return `<Badge${attrs.length ? ' ' + attrs.join(' ') : ''}>${b.label}</Badge>`;
}
