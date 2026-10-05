import { PropertyList, PropertyRow } from '@invana/ui';

/**
 * Story-only: the details a single click on a cell shows — what a consumer draws beside the
 * table for the cell `onCellClick` picked. Not a story file, so Storybook does not index it.
 */
export function PickedCell({
  rowId,
  row,
  column,
}: {
  rowId?: string;
  row?: Record<string, unknown>;
  column?: string;
}) {
  if (!rowId || !row || !column) return 'Click a cell to see it here; double-click it to edit.';
  return (
    <PropertyList labelWidth={96}>
      <PropertyRow label="rowId" mono>
        {rowId}
      </PropertyRow>
      <PropertyRow label="columnId" mono>
        {column}
      </PropertyRow>
      <PropertyRow label="value" mono>
        {JSON.stringify(row[column])}
      </PropertyRow>
    </PropertyList>
  );
}
