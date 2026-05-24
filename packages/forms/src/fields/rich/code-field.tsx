import { cn } from '@invana/ui';
import { FormField, Textarea } from '../../components';
import type { CodeFieldSchema, FieldComponentProps } from '../../types';
import { FieldShell, getFieldName } from '../_shared';

/**
 * Minimal code field — monospaced textarea with tab-handling. Good enough for
 * v1 and zero-extra-deps. Swap in CodeMirror/Monaco later by registering a
 * custom 'code' renderer.
 */
export function CodeField({
  field,
  control,
  namePrefix,
  layout,
}: FieldComponentProps<CodeFieldSchema>) {
  const name = getFieldName(field.name, namePrefix);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: rhf, fieldState }) => (
        <FieldShell field={field} layout={layout} error={fieldState.error}>
          <div className="relative">
            {field.language && (
              <span className="pointer-events-none absolute right-2 top-2 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">
                {field.language}
              </span>
            )}
            <Textarea
              rows={8}
              placeholder={field.placeholder}
              disabled={field.disabled}
              aria-invalid={!!fieldState.error}
              {...rhf}
              value={(rhf.value as string | undefined) ?? ''}
              onKeyDown={(e) => {
                if (e.key === 'Tab') {
                  e.preventDefault();
                  const t = e.currentTarget;
                  const start = t.selectionStart;
                  const end = t.selectionEnd;
                  const next =
                    t.value.substring(0, start) +
                    '  ' +
                    t.value.substring(end);
                  rhf.onChange(next);
                  requestAnimationFrame(() => {
                    t.selectionStart = t.selectionEnd = start + 2;
                  });
                }
              }}
              className={cn('font-mono text-xs')}
            />
          </div>
        </FieldShell>
      )}
    />
  );
}
