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

export function EditableCell<TData>({
  ctx,
  editType = 'text',
  options,
  align = 'left',
  onCellEdit,
}: EditableCellProps<TData>) {
  const initial = ctx.getValue();
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState<unknown>(initial);

  React.useEffect(() => {
    if (!editing) setDraft(initial);
  }, [initial, editing]);

  const commit = (next: unknown) => {
    setEditing(false);
    if (next === initial) return;
    onCellEdit?.({
      rowIndex: ctx.row.index,
      columnId: ctx.column.id,
      value: next,
      row: ctx.row.original,
    });
  };

  const alignClass =
    align === 'right'
      ? 'text-right justify-end'
      : align === 'center'
        ? 'text-center justify-center'
        : 'text-left justify-start';

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className={cn(
          'group flex w-full items-center rounded-sm px-1.5 py-1 text-sm hover:bg-muted/60 focus:outline-none focus:ring-2 focus:ring-ring',
          alignClass,
        )}
        title="Click to edit"
      >
        <span className="truncate">
          {initial == null || initial === '' ? (
            <span className="text-muted-foreground italic">empty</span>
          ) : (
            String(initial)
          )}
        </span>
      </button>
    );
  }

  if (editType === 'select') {
    return (
      <Select
        defaultValue={initial == null ? undefined : String(initial)}
        onValueChange={(v) => commit(v)}
        open
        onOpenChange={(open) => {
          if (!open) setEditing(false);
        }}
      >
        <SelectTrigger className="h-8">
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
      onBlur={(e) => {
        const v =
          editType === 'number' ? Number(e.currentTarget.value) : e.currentTarget.value;
        commit(v);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          (e.currentTarget as HTMLInputElement).blur();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          setEditing(false);
        }
      }}
      className={cn('h-8', alignClass)}
    />
  );
}
