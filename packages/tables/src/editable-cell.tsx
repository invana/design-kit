import * as React from 'react';
import { cn } from '@invana/ui';
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@invana/forms';
import type { CellContext } from '@tanstack/react-table';
import type { CellEditHandler, EditOption, EditType } from './types';

export interface EditableCellProps<TData> {
  ctx: CellContext<TData, unknown>;
  editType?: EditType;
  options?: EditOption[];
  align?: 'left' | 'center' | 'right';
  onCellEdit?: CellEditHandler<TData>;
}

/**
 * One box, drawn the same whether the cell is being read or edited.
 *
 * It reaches out past the cell's padding by exactly its own padding and
 * border, so the value inside sits where a read-only cell's value sits — flush
 * with the header and with the rows above — and opening the editor moves no
 * text and grows no row, at any density.
 */
const FIELD =
  '-mx-[7px] -my-[3px] w-[calc(100%+14px)] rounded-control leading-[inherit]';
/** Reading: no border, so the padding makes up the border's pixel. */
const READ = 'px-[7px] py-[3px]';
/** Editing: a 1px border inside the same box. */
const EDIT = 'h-auto border border-input px-1.5 py-0.5 text-[length:inherit]';

type Save =
  | { state: 'idle' }
  | { state: 'saving'; value: unknown }
  | { state: 'failed'; message: string };

/**
 * A cell that edits in place: click it (or `Enter` on it), type, and `Enter`
 * or leaving the field saves; `Escape` puts it back. Focus returns to the
 * cell either way, so a keyboard reader can walk on with `Tab`.
 *
 * An empty number saves `null`, not `0`; a number that does not parse is not
 * saved. When `onCellEdit` returns a promise the cell shows the new value as
 * saving, and on a rejection restores the old one and says why.
 */
export function EditableCell<TData>({
  ctx,
  editType = 'text',
  options,
  align = 'left',
  onCellEdit,
}: EditableCellProps<TData>) {
  const initial = ctx.getValue();
  const [editing, setEditing] = React.useState(false);
  const [save, setSave] = React.useState<Save>({ state: 'idle' });
  const displayRef = React.useRef<HTMLButtonElement>(null);
  const refocus = React.useRef(false);
  // Set by `Escape`, so a blur that follows it (as the field unmounts) does
  // not save what `Escape` meant to throw away.
  const cancelled = React.useRef(false);

  React.useEffect(() => {
    if (!editing && refocus.current) {
      refocus.current = false;
      displayRef.current?.focus();
    }
  }, [editing]);

  const close = (focusCell: boolean) => {
    refocus.current = focusCell;
    setEditing(false);
  };

  const commit = (next: unknown, focusCell: boolean) => {
    close(focusCell);
    if (next === initial) return;
    const result = onCellEdit?.({
      rowIndex: ctx.row.index,
      columnId: ctx.column.id,
      value: next,
      row: ctx.row.original,
    });
    if (result && typeof (result as Promise<unknown>).then === 'function') {
      setSave({ state: 'saving', value: next });
      (result as Promise<unknown>).then(
        () => setSave({ state: 'idle' }),
        (error: unknown) =>
          setSave({
            state: 'failed',
            message:
              error instanceof Error
                ? error.message
                : String(error ?? 'Could not save'),
          }),
      );
    } else {
      setSave({ state: 'idle' });
    }
  };

  const parse = (raw: string): { ok: boolean; value: unknown } => {
    if (editType !== 'number') return { ok: true, value: raw };
    if (raw.trim() === '') return { ok: true, value: null };
    const n = Number(raw);
    return Number.isFinite(n)
      ? { ok: true, value: n }
      : { ok: false, value: initial };
  };

  const alignClass =
    align === 'right'
      ? 'text-right justify-end'
      : align === 'center'
        ? 'text-center justify-center'
        : 'text-left justify-start';

  if (!editing) {
    const shown = save.state === 'saving' ? save.value : initial;
    const label =
      shown == null || shown === ''
        ? null
        : editType === 'select'
          ? (options?.find((o) => o.value === String(shown))?.label ??
            String(shown))
          : String(shown);
    return (
      <button
        ref={displayRef}
        type="button"
        onClick={() => {
          cancelled.current = false;
          setSave({ state: 'idle' });
          setEditing(true);
        }}
        aria-busy={save.state === 'saving' || undefined}
        aria-invalid={save.state === 'failed' || undefined}
        title={save.state === 'failed' ? save.message : undefined}
        className={cn(
          FIELD,
          READ,
          // Rings, not borders: a box-shadow adds no pixel, so marking the
          // cell never moves its text.
          'flex cursor-text items-center hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          save.state === 'saving' && 'text-muted-foreground',
          save.state === 'failed' &&
            'bg-destructive/5 ring-1 ring-destructive/60',
          alignClass,
        )}
      >
        <span className="truncate">
          {label ?? <span className="text-muted-foreground">—</span>}
        </span>
      </button>
    );
  }

  if (editType === 'select') {
    return (
      <Select
        defaultValue={initial == null ? undefined : String(initial)}
        onValueChange={(v) => commit(v, true)}
        open
        onOpenChange={(open) => {
          if (!open) close(true);
        }}
      >
        <SelectTrigger className={cn(FIELD, EDIT)}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options?.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Input
      autoFocus
      type={editType === 'number' ? 'number' : 'text'}
      defaultValue={initial == null ? '' : String(initial)}
      onFocus={(e) => e.currentTarget.select()}
      onBlur={(e) => {
        if (cancelled.current) return;
        const { ok, value } = parse(e.currentTarget.value);
        if (ok) commit(value, refocus.current);
        else close(refocus.current);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          refocus.current = true;
          e.currentTarget.blur();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          cancelled.current = true;
          close(true);
        }
      }}
      className={cn(
        FIELD,
        EDIT,
        'ring-offset-0 focus-visible:ring-1',
        alignClass,
      )}
    />
  );
}
