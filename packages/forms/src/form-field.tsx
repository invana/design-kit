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
  className?: string;
  labelPosition?: LabelPosition;
}

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
  className,
}) => (
  <FormItem className={itemClasses(labelPosition, className)}>
    {label && <FormLabel className="text-xs">{label}</FormLabel>}
    <div className={inputWrapper(labelPosition)}>
      <FormControl>
        <Input
          className="h-8 text-sm"
          placeholder={placeholder}
          value={value ?? ''}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </FormControl>
      {description && <FormDescription className="text-xs">{description}</FormDescription>}
      <FormMessage className="text-xs" />
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
  className,
}) => (
  <FormItem className={itemClasses(labelPosition, className)}>
    {label && <FormLabel className="text-xs">{label}</FormLabel>}
    <div className={inputWrapper(labelPosition)}>
      <Select value={value ?? ''} onValueChange={onChange}>
        <FormControl>
          <SelectTrigger className="h-8">
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
      {description && <FormDescription className="text-xs">{description}</FormDescription>}
      <FormMessage className="text-xs" />
    </div>
  </FormItem>
);

export const BooleanField: React.FC<BaseFieldProps> = ({
  label,
  description,
  value,
  onChange,
  labelPosition = 'side',
}) => {
  if (labelPosition === 'side') {
    return (
      <FormItem className="flex items-center justify-between rounded-md border p-2">
        <div>
          {label && <FormLabel className="text-xs">{label}</FormLabel>}
          {description && <FormDescription className="text-xs">{description}</FormDescription>}
        </div>
        <FormControl>
          <Switch checked={!!value} onCheckedChange={onChange} />
        </FormControl>
      </FormItem>
    );
  }
  return (
    <FormItem className="space-y-2">
      {label && <FormLabel className="text-xs">{label}</FormLabel>}
      <div className="flex items-center justify-between rounded-md border p-2">
        <FormControl>
          <Switch checked={!!value} onCheckedChange={onChange} />
        </FormControl>
        {description && <FormDescription className="ml-2 text-xs">{description}</FormDescription>}
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
  className,
}) => (
  <FormItem className={itemClasses(labelPosition, className)}>
    {label && <FormLabel className="text-xs">{label}</FormLabel>}
    <div className={inputWrapper(labelPosition)}>
      <FormControl>
        <ColorSwatches
          value={value}
          onChange={onChange}
          presetColors={presetColors}
          defaultValue={defaultValue}
        />
      </FormControl>
      {description && <FormDescription className="text-xs">{description}</FormDescription>}
      <FormMessage className="text-xs" />
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
  className,
}) => (
  <FormItem className={itemClasses(labelPosition, className)}>
    {label && <FormLabel className="text-xs">{label}</FormLabel>}
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
      {description && <FormDescription className="text-xs">{description}</FormDescription>}
      <FormMessage className="text-xs" />
    </div>
  </FormItem>
);

export const IconField: React.FC<BaseFieldProps> = ({
  label,
  description,
  value,
  onChange,
  labelPosition = 'side',
  className,
}) => (
  <FormItem className={itemClasses(labelPosition, className)}>
    {label && <FormLabel className="text-xs">{label}</FormLabel>}
    <div className={inputWrapper(labelPosition)}>
      <FormControl>
        <IconInput value={value} onChange={onChange} />
      </FormControl>
      {description && <FormDescription className="text-xs">{description}</FormDescription>}
      <FormMessage className="text-xs" />
    </div>
  </FormItem>
);

export const Field = {
  Input: InputField,
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

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function renderField(
  field: FieldConfig,
  parentName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any,
  labelPosition: LabelPosition
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
          labelPosition,
          value: rhf.value,
          onChange: rhf.onChange,
        };
        switch (field.type) {
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

function renderRows(
  fields: FieldConfig[],
  rowConfig: RowConfig[] | undefined,
  parentName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any,
  labelPosition: LabelPosition
) {
  if (!rowConfig || rowConfig.length === 0) {
    return (
      <div className="grid gap-4">
        {chunk(fields, 2).map((row, i) => (
          <div key={i} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {row.map((f) => renderField(f, parentName, control, labelPosition))}
          </div>
        ))}
      </div>
    );
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
        return chunk(rowFields, 2).map((cnk, idx) => (
          <div
            key={`${row.id}-${idx}`}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            {cnk.map((f) => renderField(f, parentName, control, labelPosition))}
          </div>
        ));
      })}
      {unassigned.length > 0 && (
        <div className="grid gap-4">
          {chunk(unassigned, 2).map((row, i) => (
            <div key={`u-${i}`} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {row.map((f) => renderField(f, parentName, control, labelPosition))}
            </div>
          ))}
        </div>
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
          {renderRows(ungrouped, rowConfig, name, control, labelPosition)}
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
                  {renderRows(gFields, rowConfig, name, control, labelPosition)}
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
  RowConfig,
  LabelPosition,
  ObjectFieldProps,
  ColorPreset,
} from './types';
