'use client';
import * as React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  cn,
} from '@invana/ui';
import {
  FormField as FormFieldBase,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from './components/form';
import { Input } from './components/input';
import { PasswordInput } from './components/password-input';
import { Textarea } from './components/textarea';
import { Switch } from './components/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/select';
import { ColorSwatches } from './fields/color-swatches';
import { SliderNumber } from './fields/slider-number';
import { IconInput } from './fields/icon-input';
import type {
  ColorPreset,
  FieldConfig,
  FieldSize,
  LabelPosition,
  ObjectFieldProps,
  RowConfig,
} from './types';

/* -------------------------------------------------------------------------- */
/*  Field.X — leaf field components                                            */
/* -------------------------------------------------------------------------- */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyValue = any;

interface BaseFieldProps {
  label?: string;
  description?: string;
  placeholder?: string;
  value?: AnyValue;
  onChange?: (value: AnyValue) => void;
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
  step?: number;
  presetColors?: ColorPreset[];
  defaultValue?: string;
  rows?: number;
  className?: string;
  labelPosition?: LabelPosition;
  size?: FieldSize;
}

/**
 * Per-size class tokens. `sm` keeps the original compact look; `md` falls back
 * to the underlying components' natural full-size defaults (empty strings).
 */
const SIZE: Record<
  FieldSize,
  { input: string; select: string; label: string; desc: string }
> = {
  sm: { input: 'h-8 text-sm', select: 'h-8', label: 'text-xs', desc: 'text-xs' },
  md: { input: '', select: '', label: '', desc: '' },
};

function itemClasses(labelPosition: LabelPosition, className?: string) {
  return cn(
    labelPosition === 'side' && 'grid grid-cols-3 items-center gap-2',
    labelPosition === 'top' && 'space-y-2',
    className
  );
}

function inputWrapper(labelPosition: LabelPosition) {
  return cn(labelPosition === 'side' && 'col-span-2', 'space-y-1');
}

export const InputField: React.FC<BaseFieldProps> = ({
  label,
  description,
  placeholder,
  value,
  onChange,
  labelPosition = 'side',
  size = 'sm',
  className,
}) => (
  <FormItem className={itemClasses(labelPosition, className)}>
    {label && <FormLabel className={SIZE[size].label}>{label}</FormLabel>}
    <div className={inputWrapper(labelPosition)}>
      <FormControl>
        <Input
          className={SIZE[size].input}
          placeholder={placeholder}
          value={value ?? ''}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </FormControl>
      {description && (
        <FormDescription className={SIZE[size].desc}>{description}</FormDescription>
      )}
      <FormMessage className={SIZE[size].desc} />
    </div>
  </FormItem>
);

export const PasswordField: React.FC<BaseFieldProps> = ({
  label,
  description,
  placeholder,
  value,
  onChange,
  labelPosition = 'side',
  size = 'sm',
  className,
}) => (
  <FormItem className={itemClasses(labelPosition, className)}>
    {label && <FormLabel className={SIZE[size].label}>{label}</FormLabel>}
    <div className={inputWrapper(labelPosition)}>
      <FormControl>
        <PasswordInput
          className={SIZE[size].input}
          placeholder={placeholder}
          value={value ?? ''}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </FormControl>
      {description && (
        <FormDescription className={SIZE[size].desc}>{description}</FormDescription>
      )}
      <FormMessage className={SIZE[size].desc} />
    </div>
  </FormItem>
);

export const TextareaField: React.FC<BaseFieldProps> = ({
  label,
  description,
  placeholder,
  value,
  onChange,
  rows,
  labelPosition = 'side',
  size = 'sm',
  className,
}) => (
  <FormItem className={itemClasses(labelPosition, className)}>
    {label && <FormLabel className={SIZE[size].label}>{label}</FormLabel>}
    <div className={inputWrapper(labelPosition)}>
      <FormControl>
        <Textarea
          className={size === 'sm' ? 'text-sm' : undefined}
          rows={rows}
          placeholder={placeholder}
          value={value ?? ''}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </FormControl>
      {description && (
        <FormDescription className={SIZE[size].desc}>{description}</FormDescription>
      )}
      <FormMessage className={SIZE[size].desc} />
    </div>
  </FormItem>
);

export const SelectField: React.FC<BaseFieldProps> = ({
  label,
  description,
  options = [],
  value,
  onChange,
  placeholder = 'Select type',
  labelPosition = 'side',
  size = 'sm',
  className,
}) => (
  <FormItem className={itemClasses(labelPosition, className)}>
    {label && <FormLabel className={SIZE[size].label}>{label}</FormLabel>}
    <div className={inputWrapper(labelPosition)}>
      <Select value={value ?? ''} onValueChange={onChange}>
        <FormControl>
          <SelectTrigger className={SIZE[size].select}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description && (
        <FormDescription className={SIZE[size].desc}>{description}</FormDescription>
      )}
      <FormMessage className={SIZE[size].desc} />
    </div>
  </FormItem>
);

export const BooleanField: React.FC<BaseFieldProps> = ({
  label,
  description,
  value,
  onChange,
  labelPosition = 'side',
  size = 'sm',
}) => {
  if (labelPosition === 'side') {
    return (
      <FormItem className="flex items-center justify-between rounded-md border p-2">
        <div>
          {label && <FormLabel className={SIZE[size].label}>{label}</FormLabel>}
          {description && (
            <FormDescription className={SIZE[size].desc}>{description}</FormDescription>
          )}
        </div>
        <FormControl>
          <Switch checked={!!value} onCheckedChange={onChange} />
        </FormControl>
      </FormItem>
    );
  }
  return (
    <FormItem className="space-y-2">
      {label && <FormLabel className={SIZE[size].label}>{label}</FormLabel>}
      <div className="flex items-center justify-between rounded-md border p-2">
        <FormControl>
          <Switch checked={!!value} onCheckedChange={onChange} />
        </FormControl>
        {description && (
          <FormDescription className={cn('ml-2', SIZE[size].desc)}>
            {description}
          </FormDescription>
        )}
      </div>
    </FormItem>
  );
};

export const ColorField: React.FC<BaseFieldProps> = ({
  label,
  description,
  value,
  onChange,
  presetColors,
  defaultValue,
  labelPosition = 'side',
  size = 'sm',
  className,
}) => (
  <FormItem className={itemClasses(labelPosition, className)}>
    {label && <FormLabel className={SIZE[size].label}>{label}</FormLabel>}
    <div className={inputWrapper(labelPosition)}>
      <FormControl>
        <ColorSwatches
          value={value}
          onChange={onChange}
          presetColors={presetColors}
          defaultValue={defaultValue}
        />
      </FormControl>
      {description && (
        <FormDescription className={SIZE[size].desc}>{description}</FormDescription>
      )}
      <FormMessage className={SIZE[size].desc} />
    </div>
  </FormItem>
);

export const NumberField: React.FC<BaseFieldProps> = ({
  label,
  description,
  value,
  onChange,
  min,
  max,
  step,
  labelPosition = 'side',
  size = 'sm',
  className,
}) => (
  <FormItem className={itemClasses(labelPosition, className)}>
    {label && <FormLabel className={SIZE[size].label}>{label}</FormLabel>}
    <div className={inputWrapper(labelPosition)}>
      <FormControl>
        <SliderNumber
          value={typeof value === 'number' ? value : 0}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
        />
      </FormControl>
      {description && (
        <FormDescription className={SIZE[size].desc}>{description}</FormDescription>
      )}
      <FormMessage className={SIZE[size].desc} />
    </div>
  </FormItem>
);

export const IconField: React.FC<BaseFieldProps> = ({
  label,
  description,
  value,
  onChange,
  labelPosition = 'side',
  size = 'sm',
  className,
}) => (
  <FormItem className={itemClasses(labelPosition, className)}>
    {label && <FormLabel className={SIZE[size].label}>{label}</FormLabel>}
    <div className={inputWrapper(labelPosition)}>
      <FormControl>
        <IconInput value={value} onChange={onChange} />
      </FormControl>
      {description && (
        <FormDescription className={SIZE[size].desc}>{description}</FormDescription>
      )}
      <FormMessage className={SIZE[size].desc} />
    </div>
  </FormItem>
);

export const Field = {
  Input: InputField,
  Password: PasswordField,
  Textarea: TextareaField,
  Boolean: BooleanField,
  Color: ColorField,
  Number: NumberField,
  Select: SelectField,
  Icon: IconField,
};

/* -------------------------------------------------------------------------- */
/*  ObjectField — renders a flat field config array under a parent name        */
/* -------------------------------------------------------------------------- */

function humanize(name: string): string {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

function renderField(
  field: FieldConfig,
  parentName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any,
  labelPosition: LabelPosition,
  size: FieldSize
) {
  return (
    <FormFieldBase
      key={field.name}
      control={control}
      name={`${parentName}.${field.name}`}
      defaultValue={field.defaultValue as AnyValue}
      render={({ field: rhf }) => {
        const common: BaseFieldProps = {
          label: field.label ?? humanize(field.name),
          description: field.description,
          options: field.options,
          min: field.min,
          max: field.max,
          step: field.step,
          presetColors: field.presetColors,
          defaultValue: field.defaultValue,
          rows: field.rows,
          labelPosition,
          size,
          value: rhf.value,
          onChange: rhf.onChange,
        };
        switch (field.type) {
          case 'password':
            return (
              <PasswordField
                {...common}
                placeholder={field.placeholder ?? `Enter ${field.name}`}
              />
            );
          case 'boolean':
            return <BooleanField {...common} />;
          case 'color':
            return <ColorField {...common} />;
          case 'number':
            return <NumberField {...common} />;
          case 'select':
            return <SelectField {...common} />;
          case 'icon':
            return <IconField {...common} />;
          case 'textarea':
            return (
              <TextareaField
                {...common}
                placeholder={field.placeholder ?? `Enter ${field.name}`}
              />
            );
          case 'text':
          default:
            return (
              <InputField
                {...common}
                placeholder={field.placeholder ?? `Enter ${field.name}`}
              />
            );
        }
      }}
    />
  );
}

/**
 * Render a set of fields into the field grid. The grid is `columns`-wide on
 * `md+` (two by default) and collapses to a single column below `md`. A field
 * spans multiple columns via `colSpan` and can carry extra cell classes via
 * `className`.
 *
 * `colSpan` / `columns` drive the grid through CSS variables (`--ff-span` /
 * `--ff-cols`) read by static `md:` utilities rather than per-number Tailwind
 * classes — so any count works without the host app having to pre-generate
 * `col-span-N` / `grid-cols-N`. The `md:` prefix keeps spans from leaking into
 * the single-column mobile layout, where every field is already full width.
 */
function renderGrid(
  fields: FieldConfig[],
  parentName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any,
  labelPosition: LabelPosition,
  size: FieldSize,
  columns: number,
  key?: string
) {
  // Default 2-col layout keeps the plain `md:grid-cols-2` utility; custom
  // counts drive the template from `--ff-cols`.
  const customCols = columns !== 2;
  return (
    <div
      key={key}
      className={cn(
        'grid grid-cols-1 gap-4',
        customCols
          ? 'md:[grid-template-columns:repeat(var(--ff-cols),minmax(0,1fr))]'
          : 'md:grid-cols-2'
      )}
      style={
        customCols
          ? ({ '--ff-cols': columns } as React.CSSProperties)
          : undefined
      }
    >
      {fields.map((f) => {
        const span = f.colSpan && f.colSpan > 1 ? f.colSpan : undefined;
        return (
          <div
            key={f.name}
            className={cn(
              span && 'md:[grid-column:span_var(--ff-span)/span_var(--ff-span)]',
              f.className
            )}
            style={span ? ({ '--ff-span': span } as React.CSSProperties) : undefined}
          >
            {renderField(f, parentName, control, labelPosition, size)}
          </div>
        );
      })}
    </div>
  );
}

function renderRows(
  fields: FieldConfig[],
  rowConfig: RowConfig[] | undefined,
  parentName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any,
  labelPosition: LabelPosition,
  size: FieldSize,
  columns: number
) {
  if (!rowConfig || rowConfig.length === 0) {
    return renderGrid(fields, parentName, control, labelPosition, size, columns);
  }
  const used = new Set(rowConfig.flatMap((r) => r.fields));
  const unassigned = fields.filter((f) => !used.has(f.name));
  const byName = new Map(fields.map((f) => [f.name, f]));

  return (
    <div className="space-y-4">
      {rowConfig.map((row) => {
        const rowFields = row.fields
          .map((n) => byName.get(n))
          .filter((f): f is FieldConfig => !!f);
        if (rowFields.length === 0) return null;
        return renderGrid(
          rowFields,
          parentName,
          control,
          labelPosition,
          size,
          columns,
          row.id
        );
      })}
      {unassigned.length > 0 &&
        renderGrid(
          unassigned,
          parentName,
          control,
          labelPosition,
          size,
          columns,
          '_unassigned'
        )}
    </div>
  );
}

const ObjectField: React.FC<ObjectFieldProps> = ({
  control,
  name,
  fields,
  rowConfig,
  labelPosition = 'side',
  size = 'sm',
  columns = 2,
}) => {
  const grouped = fields.reduce<Record<string, FieldConfig[]>>((acc, f) => {
    const key = f.group ?? '_ungrouped';
    (acc[key] ??= []).push(f);
    return acc;
  }, {});

  const ungrouped = grouped['_ungrouped'] ?? [];
  delete grouped['_ungrouped'];
  const groupedEntries = Object.entries(grouped);

  return (
    <div className="space-y-6">
      {ungrouped.length > 0 && (
        <div className="space-y-4">
          {renderRows(
            ungrouped,
            rowConfig,
            name,
            control,
            labelPosition,
            size,
            columns
          )}
        </div>
      )}

      {groupedEntries.length > 0 && (
        <Accordion
          type="multiple"
          defaultValue={groupedEntries.map(([k]) => k)}
          className="w-full space-y-2"
        >
          {groupedEntries.map(([group, gFields]) => (
            <AccordionItem key={group} value={group} className="rounded-md border">
              <AccordionTrigger className="px-3 text-sm font-medium hover:no-underline">
                {humanize(group)} Settings
              </AccordionTrigger>
              <AccordionContent className="px-3 pb-3">
                <div className="space-y-4">
                  {renderRows(
                    gFields,
                    rowConfig,
                    name,
                    control,
                    labelPosition,
                    size,
                    columns
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  FormField — shadcn FormField augmented with Field.* and ObjectField        */
/* -------------------------------------------------------------------------- */

interface FormFieldExtensions {
  ObjectField: typeof ObjectField;
  Input: typeof InputField;
  Password: typeof PasswordField;
  Textarea: typeof TextareaField;
  Boolean: typeof BooleanField;
  Color: typeof ColorField;
  Number: typeof NumberField;
  Select: typeof SelectField;
  Icon: typeof IconField;
}

type FormFieldType = typeof FormFieldBase & FormFieldExtensions;

export const FormField = Object.assign(FormFieldBase, {
  ObjectField,
  Input: InputField,
  Password: PasswordField,
  Textarea: TextareaField,
  Boolean: BooleanField,
  Color: ColorField,
  Number: NumberField,
  Select: SelectField,
  Icon: IconField,
}) as FormFieldType;

// Also export ObjectField directly for consumers who prefer a flat import.
export { ObjectField };

export type {
  FieldConfig,
  FieldSize,
  FieldType,
  RowConfig,
  LabelPosition,
  ObjectFieldProps,
  ColorPreset,
} from './types';
