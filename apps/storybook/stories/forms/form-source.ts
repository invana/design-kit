import type { FieldConfig } from '@invana/forms';

import { jsx } from '../_story/source';

/**
 * Story-only helpers for `Forms/*`: what JSON cannot say about a field config, and the code a
 * consumer writes around one. Not a story file, so Storybook does not index it.
 */

/**
 * A field config as JSON writes it, where an `options` or `presetColors` list shared by many
 * fields is named rather than repeated: `"options": "properties"` reads `lists.properties`.
 */
export function withLists(fields: unknown[], lists: Record<string, unknown> = {}): FieldConfig[] {
  return (fields as Record<string, unknown>[]).map((f) => ({
    ...f,
    ...(typeof f.options === 'string' ? { options: lists[f.options] } : {}),
    ...(typeof f.presetColors === 'string' ? { presetColors: lists[f.presetColors] } : {}),
  })) as FieldConfig[];
}

/** The `useForm` a consumer owns, and the submit handler every form story logs. */
export const USE_FORM = [
  'const form = useForm({ defaultValues });',
  '// handleSubmit validates, then hands over the whole object every ObjectField wrote into.',
  'const onSubmit = form.handleSubmit((values) => save(values));',
].join('\n');

/** `<FormField.ObjectField control={form.control} name="…" fields={…} … />`. */
export function objectField(
  name: string,
  fields: string,
  extra: Record<string, string | { literal: string } | undefined> = {},
) {
  return jsx('FormField.ObjectField', {
    control: 'form.control',
    name: { literal: name },
    fields,
    ...extra,
    labelPosition: { literal: 'top' },
  });
}

/** Indent every line of `code` but the first by `by`. */
export const indent = (code: string, by = '  ') => code.replace(/\n/g, `\n${by}`);
