import { z, type ZodTypeAny } from 'zod';
import type { FieldSchema, FormSchema } from '../types';

/**
 * Walk a list of fields and yield `[name, zodSchema]` pairs for every
 * value-bearing field. Structural rows are transparent — their children are
 * yielded at the same level as the row itself.
 */
function* walkLeaves(
  fields: FieldSchema[]
): Iterable<[string, ZodTypeAny]> {
  for (const field of fields) {
    if (field.type === 'row') {
      yield* walkLeaves(field.fields);
    } else {
      yield [field.name, buildField(field)];
    }
  }
}

function buildField(field: FieldSchema): ZodTypeAny {
  if ('validation' in field && field.validation) return field.validation;

  switch (field.type) {
    case 'text':
    case 'password':
    case 'textarea':
    case 'rich-text':
    case 'code': {
      let s = z.string();
      if ('minLength' in field && field.minLength != null) s = s.min(field.minLength);
      if ('maxLength' in field && field.maxLength != null) s = s.max(field.maxLength);
      return field.required ? s.min(1, 'Required') : s.optional().or(z.literal(''));
    }
    case 'email': {
      const s = z.string().email('Invalid email');
      return field.required ? s.min(1, 'Required') : s.optional().or(z.literal(''));
    }
    case 'url': {
      const s = z.string().url('Invalid URL');
      return field.required ? s.min(1, 'Required') : s.optional().or(z.literal(''));
    }
    case 'number':
    case 'slider': {
      let s = z.coerce.number();
      if (field.min != null) s = s.min(field.min);
      if (field.max != null) s = s.max(field.max);
      return field.required ? s : s.optional();
    }
    case 'select':
    case 'radio': {
      const s = z.string();
      return field.required ? s.min(1, 'Required') : s.optional();
    }
    case 'multi-select': {
      let s = z.array(z.string());
      if (field.min != null) s = s.min(field.min);
      if (field.max != null) s = s.max(field.max);
      return field.required ? s.min(1, 'Required') : s.optional();
    }
    case 'checkbox':
    case 'switch': {
      const s = z.boolean();
      return field.required ? s.refine((v) => v === true, 'Required') : s.optional();
    }
    case 'date': {
      const s = z.date();
      return field.required ? s : s.optional().nullable();
    }
    case 'date-range': {
      const s = z.object({
        from: z.date().optional(),
        to: z.date().optional(),
      });
      return field.required ? s : s.optional();
    }
    case 'file': {
      const s = z.any();
      return field.required ? s.refine((v) => v != null, 'Required') : s.optional();
    }
    case 'color': {
      const s = z.string();
      return field.required ? s.min(1, 'Required') : s.optional();
    }
    case 'group': {
      const shape: Record<string, ZodTypeAny> = {};
      for (const [name, schema] of walkLeaves(field.fields)) {
        shape[name] = schema;
      }
      return z.object(shape);
    }
    case 'array': {
      const itemShape: Record<string, ZodTypeAny> = {};
      for (const [name, schema] of walkLeaves(field.itemFields)) {
        itemShape[name] = schema;
      }
      let s = z.array(z.object(itemShape));
      if (field.min != null) s = s.min(field.min);
      if (field.max != null) s = s.max(field.max);
      return field.required ? s : s.optional();
    }
    case 'row': {
      // Should never be hit — walkLeaves flattens rows before calling buildField.
      return z.any().optional();
    }
    default:
      return z.any().optional();
  }
}

export function zodFromSchema(schema: FormSchema): ZodTypeAny {
  const shape: Record<string, ZodTypeAny> = {};
  for (const [name, fieldSchema] of walkLeaves(schema.fields)) {
    shape[name] = fieldSchema;
  }
  return z.object(shape);
}
