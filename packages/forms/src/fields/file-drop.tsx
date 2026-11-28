'use client';
import * as React from 'react';
import { Upload } from 'lucide-react';
import { cn } from '@invana/ui';

export interface FileDropProps {
  /** The file input's id, so a form label can point at it; one is made when omitted. */
  id?: string;
  /** What may be picked, as `<input accept>` takes it: `.csv,.json`, `text/*`. */
  accept?: string;
  /** More than one file at a time. */
  multiple?: boolean;
  /** The most bytes one file may have. */
  maxBytes?: number;
  /** The files that passed `accept` and `maxBytes`; a refused one never reaches it. */
  onFiles: (files: File[]) => void;
  disabled?: boolean;
  /** The area's text; "Drop files here, or click to pick" by default. */
  children?: React.ReactNode;
  className?: string;
}

/** `1.2 MB` from a byte count. */
function bytes(n: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let v = n;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i += 1;
  }
  return `${i === 0 ? v : v.toFixed(1)} ${units[i]}`;
}

/** Whether a file matches one `accept` entry: an extension, a `type/*`, or an exact type. */
function matches(file: File, entry: string): boolean {
  const want = entry.trim().toLowerCase();
  if (!want) return false;
  if (want.startsWith('.')) return file.name.toLowerCase().endsWith(want);
  if (want.endsWith('/*')) return file.type.toLowerCase().startsWith(want.slice(0, -1));
  return file.type.toLowerCase() === want;
}

/**
 * An upload drop area. Dropping files on it and clicking it to pick them do
 * the same thing; the area is a `<label>` around a visually hidden file input,
 * so the keyboard and a screen reader reach the input itself.
 *
 * It checks what the browser cannot: `accept` again on drop (a drop ignores
 * `<input accept>`), and `maxBytes`. A refused file is named under the area
 * with why, and only the files that pass reach `onFiles`. Reading or uploading
 * them is the caller's.
 */
export const FileDrop: React.FC<FileDropProps> = ({
  id: given,
  accept,
  multiple = false,
  maxBytes,
  onFiles,
  disabled = false,
  children,
  className,
}) => {
  const generated = React.useId();
  const id = given ?? generated;
  const [over, setOver] = React.useState(false);
  const [refused, setRefused] = React.useState<string[]>([]);

  const take = (list: FileList | null) => {
    if (!list) return;
    const files = Array.from(list).slice(0, multiple ? undefined : 1);
    const entries = accept ? accept.split(',') : [];
    const ok: File[] = [];
    const why: string[] = [];
    for (const file of files) {
      if (entries.length && !entries.some((e) => matches(file, e))) {
        why.push(`${file.name}: not ${accept}`);
      } else if (maxBytes != null && file.size > maxBytes) {
        why.push(`${file.name}: ${bytes(file.size)}, more than ${bytes(maxBytes)}`);
      } else {
        ok.push(file);
      }
    }
    setRefused(why);
    if (ok.length) onFiles(ok);
  };

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={id}
        data-over={over || undefined}
        onDragOver={(e) => {
          if (disabled) return;
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          if (!disabled) take(e.dataTransfer.files);
        }}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-input p-6 text-center text-muted-foreground transition-colors',
          'hover:border-primary/60 hover:bg-primary/5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
          'data-[over]:border-primary data-[over]:bg-primary/10',
          disabled && 'pointer-events-none opacity-50',
        )}
      >
        <Upload aria-hidden className="size-5" />
        <span>{children ?? 'Drop files here, or click to pick'}</span>
        {accept || maxBytes != null ? (
          <span className="text-sm">
            {[accept, maxBytes != null ? `up to ${bytes(maxBytes)}` : null].filter(Boolean).join(' · ')}
          </span>
        ) : null}
        <input
          id={id}
          type="file"
          className="sr-only"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => {
            take(e.target.files);
            e.target.value = '';
          }}
        />
      </label>
      {refused.length ? (
        <ul role="alert" className="flex flex-col gap-0.5 text-sm text-destructive">
          {refused.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
