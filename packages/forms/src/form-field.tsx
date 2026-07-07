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
import { Checkbox } from './components/checkbox';
import { RadioGroup, RadioGroupItem } from './components/radio-group';
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
  BooleanControl,
  ColorPreset,
  FieldConfig,
  FieldOrientation,
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
  defaultValue?: AnyValue;
  rows?: number;
  className?: string;
  labelPosition?: LabelPosition;
  size?: FieldSize;
  control?: BooleanControl;
  orientation?: FieldOrientation;
}

/**
 * Per-size class tokens. Each size drives not just the control heights and text
 * but the surrounding density — grid gaps, section rhythm, label stacking, the
 * boolean box padding, the switch scale and the group accordion header — so a
 * single `size` prop reshapes the whole form from airy (`md`) to a dense
 * inspector panel (`xs`). `md` leaves the control tokens empty to fall back to
 * the underlying components' natural full-size defaults.
 */
const SIZE: Record<
  FieldSize,
  {
    /** control text/height */
    input: string;
    select: string;
    textarea: string;
    label: string;
    desc: string;
    /** field-grid gaps */
    gap: string;
    /** rhythm between rows / accordion groups */
    section: string;
    /** rhythm between the ungrouped block and the group accordion */
    outer: string;
    /** vertical stacking inside a field (label→control, control→desc) */
    stack: string;
    /** column gap for `side` label layout */
    sideGap: string;
    /** group accordion header */
    trigger: string;
    /** boolean/switch enclosing box padding */
    box: string;
    /** switch scale (transform keeps the thumb proportions correct) */
    switch: string;
    /** checkbox control size (indicator icon scaled to match) */
    check: string;
    /** radio item size */
    radio: string;
  }
> = {
  xs: {
    input: 'h-8 text-sm',
    select: 'h-8 text-sm',
    textarea: 'text-sm',
    label: 'text-xs',
    desc: 'text-xs',
    gap: 'gap-x-3 gap-y-2.5',
    section: 'space-y-3',
    outer: 'space-y-4',
    stack: 'space-y-2',
    sideGap: 'gap-x-2',
    trigger: 'px-3 py-2 text-sm',
    box: 'p-2',
    switch: 'scale-90 origin-right',
    check: 'h-4 w-4',
    radio: 'h-4 w-4',
  },
  sm: {
    input: 'h-8 text-sm',
    select: 'h-8 text-sm',
    textarea: 'text-sm',
    label: 'text-xs',
    desc: 'text-xs',
    gap: 'gap-x-3 gap-y-2',
    section: 'space-y-3',
    outer: 'space-y-4',
    stack: 'space-y-1.5',
    sideGap: 'gap-x-2',
    trigger: 'px-3 py-2 text-sm',
    box: 'p-2',
    switch: 'scale-90 origin-right',
    check: 'h-4 w-4',
    radio: 'h-4 w-4',
  },
  md: {
    input: '',
    select: '',
    textarea: '',
    label: '',
    desc: '',
    gap: 'gap-4',
    section: 'space-y-4',
    outer: 'space-y-6',
    stack: 'space-y-2',
    sideGap: 'gap-2',
    trigger: 'px-3 text-sm',
    box: 'p-2',
    switch: '',
    check: 'h-4 w-4',
    radio: 'h-4 w-4',
  },
};

function itemClasses(
  labelPosition: LabelPosition,
  size: FieldSize,
  className?: string
) {
  return cn(
    labelPosition === 'side' &&
      cn('grid grid-cols-3 items-center', SIZE[size].sideGap),
    labelPosition === 'top' && SIZE[size].stack,
    className
  );
}

function inputWrapper(labelPosition: LabelPosition, size: FieldSize) {
  return cn(labelPosition === 'side' && 'col-span-2', SIZE[size].stack);
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
  <FormItem className={itemClasses(labelPosition, size, className)}>
    {label && <FormLabel className={SIZE[size].label}>{label}</FormLabel>}
    <div className={inputWrapper(labelPosition, size)}>
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
  <FormItem className={itemClasses(labelPosition, size, className)}>
    {label && <FormLabel className={SIZE[size].label}>{label}</FormLabel>}
    <div className={inputWrapper(labelPosition, size)}>
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
  <FormItem className={itemClasses(labelPosition, size, className)}>
    {label && <FormLabel className={SIZE[size].label}>{label}</FormLabel>}
    <div className={inputWrapper(labelPosition, size)}>
      <FormControl>
        <Textarea
          className={SIZE[size].textarea || undefined}
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
  <FormItem className={itemClasses(labelPosition, size, className)}>
    {label && <FormLabel className={SIZE[size].label}>{label}</FormLabel>}
    <div className={inputWrapper(labelPosition, size)}>
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
  control = 'switch',
  className,
}) => {
  // `checkbox` control: a compact inline `☑ label` that packs into the grid,
  // independent of labelPosition (the label always sits beside the box).
  if (control === 'checkbox') {
    return (
      <FormItem className={cn('flex items-center gap-2 space-y-0', className)}>
        <FormControl>
          <Checkbox
            className={SIZE[size].check}
            checked={!!value}
            onCheckedChange={onChange}
          />
        </FormControl>
        {label && (
          <FormLabel
            className={cn(
              '!mt-0 cursor-pointer font-normal leading-none',
              SIZE[size].label
            )}
          >
            {label}
          </FormLabel>
        )}
      </FormItem>
    );
  }
  if (labelPosition === 'side') {
    return (
      <FormItem
        className={cn(
          'flex items-center justify-between rounded-md border',
          SIZE[size].box
        )}
      >
        <div>
          {label && <FormLabel className={SIZE[size].label}>{label}</FormLabel>}
          {description && (
            <FormDescription className={SIZE[size].desc}>{description}</FormDescription>
          )}
        </div>
        <FormControl>
          <Switch
            className={SIZE[size].switch || undefined}
            checked={!!value}
            onCheckedChange={onChange}
          />
        </FormControl>
      </FormItem>
    );
  }
  return (
    <FormItem className={SIZE[size].stack}>
      {label && <FormLabel className={SIZE[size].label}>{label}</FormLabel>}
      <div
        className={cn(
          'flex items-center justify-between rounded-md border',
          SIZE[size].box
        )}
      >
        <FormControl>
          <Switch
            className={SIZE[size].switch || undefined}
            checked={!!value}
            onCheckedChange={onChange}
          />
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

export const RadioField: React.FC<BaseFieldProps> = ({
  label,
  description,
  options = [],
  value,
  onChange,
  labelPosition = 'side',
  size = 'sm',
  orientation = 'vertical',
  className,
}) => (
  <FormItem className={itemClasses(labelPosition, size, className)}>
    {label && <FormLabel className={SIZE[size].label}>{label}</FormLabel>}
    <div className={inputWrapper(labelPosition, size)}>
      <FormControl>
        <RadioGroup
          value={value ?? ''}
          onValueChange={onChange}
          className={
            orientation === 'horizontal'
              ? 'flex flex-row items-center gap-x-4'
              : cn('flex flex-col', SIZE[size].stack)
          }
        >
          {options.map((o) => (
            <label
              key={o.value}
              className="flex cursor-pointer items-center gap-2"
            >
              <RadioGroupItem
                value={o.value}
                className={cn('shrink-0', SIZE[size].radio)}
              />
              <span className={cn('leading-none', SIZE[size].label)}>{o.label}</span>
            </label>
          ))}
        </RadioGroup>
      </FormControl>
      {description && (
        <FormDescription className={SIZE[size].desc}>{description}</FormDescription>
      )}
      <FormMessage className={SIZE[size].desc} />
    </div>
  </FormItem>
);

export const CheckboxGroupField: React.FC<BaseFieldProps> = ({
  label,
  description,
  options = [],
  value,
  onChange,
  labelPosition = 'side',
  size = 'sm',
  orientation = 'vertical',
  className,
}) => {
  const selected: string[] = Array.isArray(value) ? value : [];
  const toggle = (v: string, checked: boolean) =>
    onChange?.(checked ? [...selected, v] : selected.filter((x) => x !== v));

  return (
    <FormItem className={itemClasses(labelPosition, size, className)}>
      {label && <FormLabel className={SIZE[size].label}>{label}</FormLabel>}
      <div className={inputWrapper(labelPosition, size)}>
        <div
          className={
            orientation === 'horizontal'
              ? 'flex flex-row items-center gap-x-4'
              : cn('flex flex-col', SIZE[size].stack)
          }
        >
          {options.map((o) => (
            <label
              key={o.value}
              className="flex cursor-pointer items-center gap-2"
            >
              <Checkbox
                className={cn('shrink-0', SIZE[size].check)}
                checked={selected.includes(o.value)}
                onCheckedChange={(c) => toggle(o.value, c === true)}
              />
              <span className={cn('leading-none', SIZE[size].label)}>{o.label}</span>
            </label>
          ))}
        </div>
        {description && (
          <FormDescription className={SIZE[size].desc}>{description}</FormDescription>
        )}
        <FormMessage className={SIZE[size].desc} />
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
  <FormItem className={itemClasses(labelPosition, size, className)}>
    {label && <FormLabel className={SIZE[size].label}>{label}</FormLabel>}
    <div className={inputWrapper(labelPosition, size)}>
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
  <FormItem className={itemClasses(labelPosition, size, className)}>
    {label && <FormLabel className={SIZE[size].label}>{label}</FormLabel>}
    <div className={inputWrapper(labelPosition, size)}>
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
  <FormItem className={itemClasses(labelPosition, size, className)}>
    {label && <FormLabel className={SIZE[size].label}>{label}</FormLabel>}
    <div className={inputWrapper(labelPosition, size)}>
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
  Radio: RadioField,
  CheckboxGroup: CheckboxGroupField,
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
          control: field.control,
          orientation: field.orientation,
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
          case 'radio':
            return <RadioField {...common} />;
          case 'checkbox':
            return <CheckboxGroupField {...common} />;
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
        'grid grid-cols-1',
        SIZE[size].gap,
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
    <div className={SIZE[size].section}>
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
    <div className={SIZE[size].outer}>
      {ungrouped.length > 0 && (
        <div className={SIZE[size].section}>
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
              <AccordionTrigger
                className={cn(
                  'font-medium hover:no-underline',
                  SIZE[size].trigger
                )}
              >
                {humanize(group)} Settings
              </AccordionTrigger>
              <AccordionContent className="px-3 pb-3">
                <div className={SIZE[size].section}>
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
  Radio: typeof RadioField;
  CheckboxGroup: typeof CheckboxGroupField;
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
  Radio: RadioField,
  CheckboxGroup: CheckboxGroupField,
  Color: ColorField,
  Number: NumberField,
  Select: SelectField,
  Icon: IconField,
}) as FormFieldType;

// Also export ObjectField directly for consumers who prefer a flat import.
export { ObjectField };

export type {
  BooleanControl,
  FieldConfig,
  FieldOrientation,
  FieldSize,
  FieldType,
  RowConfig,
  LabelPosition,
  ObjectFieldProps,
  ColorPreset,
} from './types';
