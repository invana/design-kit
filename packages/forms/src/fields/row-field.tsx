import { cn } from '@invana/ui';
import type { FieldComponentProps, RowFieldSchema } from '../types';
import { FieldResolver } from '../field-resolver';

const GAP_CLASS: Record<string, string> = {
  '0': 'gap-0',
  '1': 'gap-1',
  '2': 'gap-2',
  '3': 'gap-3',
  '4': 'gap-4',
  '6': 'gap-6',
  '8': 'gap-8',
};

export function RowField({
  field,
  namePrefix,
  layout,
}: FieldComponentProps<RowFieldSchema>) {
  const children = field.fields;
  const gap = GAP_CLASS[field.gap ?? '4'] ?? 'gap-4';
  // Even distribution when a child doesn't declare `cols`.
  const defaultCols = Math.max(1, Math.floor(12 / Math.max(children.length, 1)));

  return (
    <div className={cn('grid grid-cols-12', gap, field.className)}>
      {children.map((child) => {
        const span =
          'cols' in child && typeof child.cols === 'number'
            ? Math.max(1, Math.min(12, child.cols))
            : defaultCols;
        // Inline style so Tailwind doesn't need a `col-span-N` safelist.
        const style = { gridColumn: `span ${span} / span ${span}` };
        const key =
          ('name' in child && typeof child.name === 'string'
            ? child.name
            : null) ?? `${child.type}-${children.indexOf(child)}`;
        return (
          <div key={key} style={style} className="min-w-0">
            <FieldResolver
              field={child}
              namePrefix={namePrefix}
              layout={layout}
            />
          </div>
        );
      })}
    </div>
  );
}
