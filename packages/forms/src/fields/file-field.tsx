import * as React from 'react';
import { Upload, X } from 'lucide-react';
import { Button, cn } from '@invana/ui';
import { FormField } from '../components';
import type { FieldComponentProps, FileFieldSchema } from '../types';
import { FieldShell, getFieldName } from './_shared';

function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

export function FileField({
  field,
  control,
  namePrefix,
  layout,
}: FieldComponentProps<FileFieldSchema>) {
  const name = getFieldName(field.name, namePrefix);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = React.useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: rhf, fieldState }) => {
        const setFiles = (files: FileList | File[] | null) => {
          if (!files) {
            rhf.onChange(field.multiple ? [] : null);
            return;
          }
          const arr = Array.from(files);
          rhf.onChange(field.multiple ? arr : (arr[0] ?? null));
        };

        const list: File[] = (() => {
          if (!rhf.value) return [];
          if (Array.isArray(rhf.value)) return rhf.value as File[];
          return [rhf.value as File];
        })();

        return (
          <FieldShell field={field} layout={layout} error={fieldState.error}>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                setFiles(e.dataTransfer.files);
              }}
              className={cn(
                'flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-input bg-background p-6 text-center text-sm transition-colors',
                dragging && 'border-primary bg-accent',
                field.disabled && 'pointer-events-none opacity-50'
              )}
            >
              <Upload className="h-6 w-6 text-muted-foreground" />
              <div className="text-muted-foreground">
                Drag & drop or{' '}
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0 align-baseline"
                  onClick={() => inputRef.current?.click()}
                >
                  browse
                </Button>
              </div>
              {field.accept && (
                <div className="text-xs text-muted-foreground">
                  Accepted: {field.accept}
                </div>
              )}
              <input
                ref={inputRef}
                type="file"
                hidden
                accept={field.accept}
                multiple={field.multiple}
                disabled={field.disabled}
                onChange={(e) => setFiles(e.target.files)}
              />
            </div>

            {list.length > 0 && (
              <ul className="space-y-1">
                {list.map((f, i) => (
                  <li
                    key={`${f.name}-${i}`}
                    className="flex items-center justify-between rounded-md border bg-muted/30 px-2 py-1 text-sm"
                  >
                    <span className="truncate">
                      {f.name}{' '}
                      <span className="text-xs text-muted-foreground">
                        ({fmtSize(f.size)})
                      </span>
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (field.multiple) {
                          const next = list.filter((_, idx) => idx !== i);
                          rhf.onChange(next);
                        } else {
                          rhf.onChange(null);
                        }
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </FieldShell>
        );
      }}
    />
  );
}
