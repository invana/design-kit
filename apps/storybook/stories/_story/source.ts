/**
 * What the Code tab shows. Storybook's own guess is the story's chrome — `<VariantBoard …>`
 * or a `render` function — so a story writes its source from the same JSON it draws: the
 * data a consumer would hold, then the call that draws it.
 */

/**
 * A value as the code that holds it — JSON, indented the way a reader would write it: an
 * object or array that fits on a line stays on one, so a list of figures reads as a list.
 */
export function json(value: unknown, indent = ''): string {
  const flat = inline(value);
  if (value === null || typeof value !== 'object' || indent.length + flat.length <= 80) return flat;
  const inner = indent + '  ';
  if (Array.isArray(value)) return `[\n${value.map((v) => inner + json(v, inner)).join(',\n')}\n${indent}]`;
  const entries = Object.entries(value).filter(([, v]) => v !== undefined);
  return `{\n${entries.map(([k, v]) => `${inner}${JSON.stringify(k)}: ${json(v, inner)}`).join(',\n')}\n${indent}}`;
}

/** On one line, spaced as a person writes it: `{ "label": "Rows", "value": "2.3B" }`. */
export function inline(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(inline).join(', ')}]`;
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'undefined';
  const entries = Object.entries(value).filter(([, v]) => v !== undefined);
  return entries.length ? `{ ${entries.map(([k, v]) => `${JSON.stringify(k)}: ${inline(v)}`).join(', ')} }` : '{}';
}

/**
 * A JSX call. Props are code, not values: `{ spec: 'spec', onAction: 'onAction' }`
 * writes `spec={spec} onAction={onAction}`; a string literal is written with quotes.
 */
export function jsx(tag: string, props: Record<string, string | { literal: string } | undefined>) {
  const attrs = Object.entries(props)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => (typeof v === 'string' ? `${k}={${v}}` : `${k}="${v!.literal}"`));
  if (!attrs.length) return `<${tag} />`;
  if (attrs.length <= 2) return `<${tag} ${attrs.join(' ')} />`;
  return `<${tag}\n${attrs.map((a) => `  ${a}`).join('\n')}\n/>`;
}

/**
 * JSON props as `jsx()` attributes: a string is written as a literal (`label="Run it"`), anything
 * else as code (`count={3}`, `items={[…]}`). Name a prop in `refs` to write it as a variable
 * instead — `onChange={onChange}`.
 */
export function attrs(props: Record<string, unknown>, refs: string[] = []) {
  const out: Record<string, string | { literal: string }> = {};
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined || k === 'children') continue;
    out[k] = typeof v === 'string' && !v.includes('"') ? { literal: v } : json(v);
  }
  for (const r of refs) out[r] = r;
  return out;
}

/** A JSX element with children — `<Badge tone="good">Ready</Badge>`. */
export function jsxWith(tag: string, props: Record<string, string | { literal: string } | undefined>, children: string) {
  const open = jsx(tag, props).replace(/\s*\/>$/, '>');
  return children.includes('\n') ? `${open}\n  ${children.split('\n').join('\n  ')}\n</${tag}>` : `${open}${children}</${tag}>`;
}

export interface Snippet {
  /** `import { ConfirmAsk } from '@invana/blocks';` — one line each. */
  imports: string[];
  /** The data, in order: `const spec = {…};`. Values are written as JSON. */
  data?: Record<string, unknown>;
  /** Code between the data and the call — a handler, a hook. */
  setup?: string;
  /** The call, from `jsx()`. */
  call: string;
  /** A line over the block — the variant's caption. */
  comment?: string;
}

/** One snippet as the Code tab shows it. */
export function snippet({ imports, data = {}, setup, call, comment }: Snippet) {
  const consts = Object.entries(data).map(([name, value]) => `const ${name} = ${json(value)};`);
  return [
    imports.join('\n'),
    [[comment ? `// ${comment}` : '', ...consts].filter(Boolean).join('\n'), setup ?? '', call]
      .filter(Boolean)
      .join('\n\n'),
  ].join('\n\n');
}

/** Several variants under one set of imports, each under its caption. */
export function snippets(imports: string[], parts: Omit<Snippet, 'imports'>[]) {
  const body = parts.map((p) => snippet({ ...p, imports: [] }).trimStart());
  return `${imports.join('\n')}\n\n${body.join('\n\n// ─────────────────────────────────────────────\n\n')}`;
}

/**
 * The Code tab's text for a story with a `variant` select: all of them, or the one picked.
 * Goes in `parameters.docs.source.transform`, which Storybook calls with the story's args.
 */
export function sourceFor<V extends { caption: string }>(
  variants: V[],
  write: (picked: V[]) => string,
) {
  return (_code: string, ctx: { args: { variant?: string } }) => {
    const picked = variants.filter((v) => !ctx.args.variant || ctx.args.variant === ALL || v.caption === ctx.args.variant);
    return write(picked);
  };
}

/** The `variant` select's first option. */
export const ALL = 'All';

/** The `variant` arg: a select over the captions, `All` first. */
export function variantArg<V extends { caption: string }>(variants: V[]) {
  return {
    control: { type: 'select' as const },
    options: [ALL, ...variants.map((v) => v.caption)],
    description: 'Draw every variant, or one — the Code tab follows.',
  };
}
