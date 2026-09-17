import * as React$1 from 'react';
import * as react_hook_form from 'react-hook-form';
import { FieldValues, FieldPath, ControllerProps, Control, UseFormReturn } from 'react-hook-form';
export { Control, DefaultValues, FieldValues, Mode, SubmitHandler, UseFormReturn } from 'react-hook-form';
import * as LabelPrimitive from '@radix-ui/react-label';
import * as SelectPrimitive from '@radix-ui/react-select';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as SliderPrimitive from '@radix-ui/react-slider';
import * as class_variance_authority_types from 'class-variance-authority/types';
import { VariantProps } from 'class-variance-authority';
import { Button } from '@invana/ui';

declare const Form: <TFieldValues extends FieldValues, TContext = any, TTransformedValues = TFieldValues>({ children, watch, getValues, getFieldState, setError, clearErrors, setValue, setValues, trigger, formState, resetField, reset, handleSubmit, unregister, control, register, setFocus, subscribe, }: react_hook_form.FormProviderProps<TFieldValues, TContext, TTransformedValues>) => React$1.JSX.Element;
declare const FormField$1: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ ...props }: ControllerProps<TFieldValues, TName>) => React$1.JSX.Element;
declare const useFormField: () => {
    invalid: boolean;
    isDirty: boolean;
    isTouched: boolean;
    isValidating: boolean;
    error?: react_hook_form.FieldError;
    id: string;
    name: string;
    formItemId: string;
    formDescriptionId: string;
    formMessageId: string;
};
declare const FormItem: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & React$1.RefAttributes<HTMLDivElement>>;
declare const FormLabel: React$1.ForwardRefExoticComponent<Omit<LabelPrimitive.LabelProps & React$1.RefAttributes<HTMLLabelElement>, "ref"> & React$1.RefAttributes<HTMLLabelElement>>;
declare const FormControl: React$1.ForwardRefExoticComponent<Omit<React$1.HTMLAttributes<HTMLElement> & {
    children?: React$1.ReactNode;
} & React$1.RefAttributes<HTMLElement>, "ref"> & React$1.RefAttributes<HTMLElement>>;
declare const FormDescription: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLParagraphElement> & React$1.RefAttributes<HTMLParagraphElement>>;
declare const FormMessage: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLParagraphElement> & React$1.RefAttributes<HTMLParagraphElement>>;

type LabelPosition = 'side' | 'top';
/**
 * Field density.
 * - `xs` — ultra-dense property-panel look (small controls, tight rows, compact
 *   section headers). Use for inspector/side panels like the modeller diagram
 *   properties editor.
 * - `sm` — compact look, the default for backward compatibility.
 * - `md` — full-size fields for primary, page-level forms.
 */
type FieldSize = 'xs' | 'sm' | 'md';
type FieldType = 'text' | 'password' | 'textarea' | 'number' | 'boolean' | 'checkbox' | 'radio' | 'color' | 'select' | 'icon';
/** Widget used to render a single `boolean` field. Defaults to `switch`. */
type BooleanControl = 'switch' | 'checkbox';
/** Layout for the `radio` list and the multi-select `checkbox` group. */
type FieldOrientation = 'vertical' | 'horizontal';
type ColorPreset = {
    label: string;
    value: string;
    darkValue?: string;
};
/**
 * Small status pill rendered next to a field's label — the "on" / "active" /
 * "no editor" chips seen in inspector panels. `variant` maps to the `Badge`
 * component's variants and defaults to `secondary` (neutral grey). Use
 * `default` for the solid accent ("on") pill.
 */
type FieldBadge = {
    label: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'soft';
};
type FieldConfig = {
    name: string;
    type: FieldType;
    label?: string;
    description?: string;
    placeholder?: string;
    options?: {
        label: string;
        value: string;
    }[];
    min?: number;
    max?: number;
    step?: number;
    group?: string;
    row?: string;
    presetColors?: ColorPreset[];
    /**
     * Widget for a single `boolean` field: `switch` (default) renders a toggle;
     * `checkbox` renders a compact inline `☑ label`. Ignored by non-boolean types.
     */
    control?: BooleanControl;
    /**
     * Wrap a `switch` boolean in a bordered, padded box. Defaults to `false`
     * (the switch renders inline). Ignored by non-boolean / `checkbox` fields.
     */
    boxed?: boolean;
    /**
     * Layout for `radio` and multi-select `checkbox` groups. Defaults to
     * `vertical`. Ignored by other types.
     */
    orientation?: FieldOrientation;
    /**
     * Initial value. A `string` for most fields, `boolean` for `boolean`, or a
     * `string[]` for a multi-select `checkbox` group.
     */
    defaultValue?: string | number | boolean | string[];
    /** Number of visible rows for `textarea` fields. */
    rows?: number;
    /**
     * How many grid columns the field spans on `md+` screens. Defaults to `1`.
     * The grid is two columns by default (see `ObjectField`'s `columns`), so
     * `colSpan: 2` makes a full-width field (textarea, long URI, …). A span
     * larger than the column count simply fills the row. Ignored below `md`,
     * where every field stacks full width.
     */
    colSpan?: number;
    /**
     * Extra classes merged onto the field's grid cell. Escape hatch for
     * per-field layout/spacing tweaks (custom width, ordering, margins, …)
     * without adding a dedicated prop for every case.
     */
    className?: string;
    /**
     * Extra classes merged onto the field's `<FormLabel>`. Escape hatch for
     * per-field label styling (padding, colour, weight, casing, the label→control
     * gap via margin, …) on top of the size-driven defaults.
     */
    labelClassName?: string;
    /**
     * Optional status pill rendered next to the field's label (e.g. an "on" /
     * "active" chip in an inspector row). See {@link FieldBadge}.
     */
    badge?: FieldBadge;
};
type RowConfig = {
    id: string;
    fields: string[];
};
/**
 * Per-group metadata for the section headers of a grouped `ObjectField`.
 * Groups are still discovered from each field's `group` value; this only
 * decorates the matching section header.
 */
type GroupConfig = {
    /** Matches the `group` value on fields. */
    id: string;
    /** Override the auto-humanized section label (e.g. `viewMode` → "View Mode"). */
    label?: string;
    /**
     * Extra status pills rendered in the section header, after the automatic
     * field-count badge. See {@link FieldBadge}.
     */
    badges?: FieldBadge[];
    /** Show the automatic field-count badge. Defaults to `true`. */
    showCount?: boolean;
};
interface ObjectFieldProps {
    control: Control<any>;
    name: string;
    fields: FieldConfig[];
    rowConfig?: RowConfig[];
    /** Optional per-group header decoration (extra badges, label override). */
    groupConfig?: GroupConfig[];
    labelPosition?: LabelPosition;
    /** Field density. Defaults to `sm` (compact) for backward compatibility. */
    size?: FieldSize;
    /**
     * Number of columns in the field grid on `md+` screens. Defaults to `2`.
     * Increase it to build wider layouts that fields can span via `colSpan`.
     * Below `md` the grid always collapses to a single column.
     */
    columns?: number;
}

type AnyValue = any;
interface BaseFieldProps {
    label?: string;
    description?: string;
    placeholder?: string;
    value?: AnyValue;
    onChange?: (value: AnyValue) => void;
    options?: {
        label: string;
        value: string;
    }[];
    min?: number;
    max?: number;
    step?: number;
    presetColors?: ColorPreset[];
    defaultValue?: AnyValue;
    rows?: number;
    className?: string;
    labelClassName?: string;
    badge?: FieldBadge;
    labelPosition?: LabelPosition;
    size?: FieldSize;
    control?: BooleanControl;
    orientation?: FieldOrientation;
    /** Wrap a `switch` boolean in a bordered, padded box. Defaults to `false`. */
    boxed?: boolean;
}
declare const InputField: React$1.FC<BaseFieldProps>;
declare const PasswordField: React$1.FC<BaseFieldProps>;
declare const TextareaField: React$1.FC<BaseFieldProps>;
declare const SelectField: React$1.FC<BaseFieldProps>;
declare const BooleanField: React$1.FC<BaseFieldProps>;
declare const RadioField: React$1.FC<BaseFieldProps>;
declare const CheckboxGroupField: React$1.FC<BaseFieldProps>;
declare const ColorField: React$1.FC<BaseFieldProps>;
declare const NumberField: React$1.FC<BaseFieldProps>;
declare const IconField: React$1.FC<BaseFieldProps>;
declare const Field: {
    Input: React$1.FC<BaseFieldProps>;
    Password: React$1.FC<BaseFieldProps>;
    Textarea: React$1.FC<BaseFieldProps>;
    Boolean: React$1.FC<BaseFieldProps>;
    Radio: React$1.FC<BaseFieldProps>;
    CheckboxGroup: React$1.FC<BaseFieldProps>;
    Color: React$1.FC<BaseFieldProps>;
    Number: React$1.FC<BaseFieldProps>;
    Select: React$1.FC<BaseFieldProps>;
    Icon: React$1.FC<BaseFieldProps>;
};
declare const ObjectField: React$1.FC<ObjectFieldProps>;
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
type FormFieldType = typeof FormField$1 & FormFieldExtensions;
declare const FormField: FormFieldType;

interface SettingsPanelProps extends Omit<ObjectFieldProps, 'control'> {
    /**
     * The react-hook-form instance (from `useForm`). The panel renders its own
     * `<Form>` provider around the fields, so it is fully self-contained — no
     * external `<Form>` wrapper is required.
     */
    form: UseFormReturn<any>;
    /** Title shown above the fields (uppercase, muted — the panel heading). */
    title?: React$1.ReactNode;
    /** Extra classes merged onto the outer `Card` (e.g. a fixed width). */
    className?: string;
    /** Extra classes merged onto the scrollable `CardContent`. */
    contentClassName?: string;
    /**
     * Extra content rendered inside the form, after the fields — e.g. a footer
     * with Apply / Reset actions. Rendered within the `<Form>` provider so a
     * submit button has form context.
     */
    children?: React$1.ReactNode;
}
/**
 * A self-contained, form-driven settings / inspector panel: the card chrome, an
 * uppercase heading and the sectioned {@link ObjectField} accordion in a single
 * component. Consumers own their `useForm` and pass it in; everything else — the
 * `Card`, scroll region, `<Form>` provider, grouped accordions with count
 * badges and per-field status pills — is handled here.
 *
 * ```tsx
 * const form = useForm({ defaultValues });
 * <SettingsPanel title="Canvas Settings" form={form} name="canvas" fields={fields} />
 * ```
 *
 * All {@link ObjectFieldProps} (`name`, `fields`, `rowConfig`, `labelPosition`,
 * `size`, `columns`) are forwarded to the underlying `ObjectField`.
 */
declare function SettingsPanel({ form, title, className, contentClassName, children, ...objectField }: SettingsPanelProps): React$1.JSX.Element;

interface ColorSwatchesProps {
    value?: string;
    onChange?: (value: string) => void;
    presetColors?: ColorPreset[];
    defaultValue?: string;
}
declare const ColorSwatches: React$1.FC<ColorSwatchesProps>;

interface SliderNumberProps {
    value?: number;
    onChange?: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    className?: string;
}
declare const SliderNumber: React$1.FC<SliderNumberProps>;

interface IconInputProps {
    value?: string;
    onChange?: (value: string) => void;
}
/**
 * Minimal icon picker — text input + preview swatch. Acts as a placeholder
 * until a real icon picker (e.g. lucide search) is added.
 */
declare const IconInput: React$1.FC<IconInputProps>;

/**
 * `sm` (26px) is the application field — a property editor, a settings row, a
 * form inside a 420px panel. `default` (40px) stays the form-page size.
 *
 * Named `inputSize` because `size` is already an `<input>` attribute meaning
 * "how many characters wide", and shadowing it would silently drop that.
 */
type InputSize = "default" | "sm";
declare const Input: React$1.ForwardRefExoticComponent<Omit<React$1.ClassAttributes<HTMLInputElement> & React$1.InputHTMLAttributes<HTMLInputElement> & {
    inputSize?: InputSize;
}, "ref"> & React$1.RefAttributes<HTMLInputElement>>;

type PasswordInputProps = Omit<React$1.ComponentProps<"input">, "type"> & {
    /** Controls visibility in a controlled fashion. Omit for self-managed toggle. */
    visible?: boolean;
    onVisibleChange?: (visible: boolean) => void;
};
/**
 * Password input with a built-in show/hide toggle. Wraps {@link Input} and
 * overlays an eye / eye-off button that flips the field between `password`
 * and `text`. Visibility is self-managed unless `visible` is supplied.
 */
declare const PasswordInput: React$1.ForwardRefExoticComponent<Omit<PasswordInputProps, "ref"> & React$1.RefAttributes<HTMLInputElement>>;

declare const Textarea: React$1.ForwardRefExoticComponent<Omit<React$1.ClassAttributes<HTMLTextAreaElement> & React$1.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    /** Matches `Input`'s `inputSize`. `sm` tightens padding and the floor. */
    inputSize?: "default" | "sm";
}, "ref"> & React$1.RefAttributes<HTMLTextAreaElement>>;

declare const Select: React$1.FC<SelectPrimitive.SelectProps>;
declare const SelectGroup: React$1.ForwardRefExoticComponent<SelectPrimitive.SelectGroupProps & React$1.RefAttributes<HTMLDivElement>>;
declare const SelectValue: React$1.ForwardRefExoticComponent<SelectPrimitive.SelectValueProps & React$1.RefAttributes<HTMLSpanElement>>;
declare const SelectTrigger: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectTriggerProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & {
    /** Matches `Input`'s `inputSize` — `sm` is the 26px application field. */
    triggerSize?: "default" | "sm";
} & React$1.RefAttributes<HTMLButtonElement>>;
declare const SelectScrollUpButton: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectScrollUpButtonProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SelectScrollDownButton: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectScrollDownButtonProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SelectContent: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SelectLabel: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectLabelProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SelectItem: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectItemProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SelectSeparator: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectSeparatorProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

declare const Checkbox: React$1.ForwardRefExoticComponent<Omit<CheckboxPrimitive.CheckboxProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;

declare const Switch: React$1.ForwardRefExoticComponent<Omit<SwitchPrimitives.SwitchProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;

declare const RadioGroup: React$1.ForwardRefExoticComponent<Omit<RadioGroupPrimitive.RadioGroupProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const RadioGroupItem: React$1.ForwardRefExoticComponent<Omit<RadioGroupPrimitive.RadioGroupItemProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;

declare const Slider: React$1.ForwardRefExoticComponent<Omit<SliderPrimitive.SliderProps & React$1.RefAttributes<HTMLSpanElement>, "ref"> & React$1.RefAttributes<HTMLSpanElement>>;

declare const Label: React$1.ForwardRefExoticComponent<Omit<LabelPrimitive.LabelProps & React$1.RefAttributes<HTMLLabelElement>, "ref"> & VariantProps<(props?: class_variance_authority_types.ClassProp | undefined) => string> & React$1.RefAttributes<HTMLLabelElement>>;

declare function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">): React$1.JSX.Element;
declare function FieldLegend({ className, variant, ...props }: React.ComponentProps<"legend"> & {
    variant?: "legend" | "label";
}): React$1.JSX.Element;
declare function FieldGroup({ className, ...props }: React.ComponentProps<"div">): React$1.JSX.Element;
declare function FieldContent({ className, ...props }: React.ComponentProps<"div">): React$1.JSX.Element;
declare function FieldLabel({ className, ...props }: React.ComponentProps<typeof Label>): React$1.JSX.Element;
declare function FieldTitle({ className, ...props }: React.ComponentProps<"div">): React$1.JSX.Element;
declare function FieldDescription({ className, ...props }: React.ComponentProps<"p">): React$1.JSX.Element;
declare function FieldSeparator({ children, className, ...props }: React.ComponentProps<"div"> & {
    children?: React.ReactNode;
}): React$1.JSX.Element;
declare function FieldError({ className, children, errors, ...props }: React.ComponentProps<"div"> & {
    errors?: Array<{
        message?: string;
    } | undefined>;
}): React$1.JSX.Element | null;

/**
 * Where a parameter's value comes from.
 *
 * The three are not styles of the same thing — they decide *when* the value is
 * known. A literal is known now; an argument is known when a run is started; a
 * binding is known only once an earlier task has produced it.
 */
type ParamSource = "literal" | "argument" | "binding";
declare const PARAM_SOURCES: ParamSource[];
interface ParamRowProps extends Omit<React$1.HTMLAttributes<HTMLDivElement>, "onChange"> {
    /** The parameter's name, as the contract spells it — `batch_size`, `map_over`. */
    name: string;
    /** Its type and obligation, from the contract — `str · required`, `int · optional`. */
    type?: React$1.ReactNode;
    /** Which of the three the current value is. */
    source: ParamSource;
    onSourceChange?: (source: ParamSource) => void;
    /** The value itself — a literal, `${args.model}`, `${steps.x.rows}`. */
    value: string;
    onValueChange?: (value: string) => void;
    /**
     * What the reader needs to know that the value does not say — what a binding
     * will resolve to, which alternatives an enum allows, why a default was left
     * alone. Rendered as the error when `invalid` is set.
     */
    note?: React$1.ReactNode;
    /** The value does not resolve, or the contract refuses it. Reddens the control and the note. */
    invalid?: boolean;
    /**
     * The parameter is not in play — a `when` on a task that always runs. Shown
     * rather than hidden, because a contract's full surface is the point of the
     * form.
     */
    disabled?: boolean;
    /** Replaces the value control entirely, for a parameter that needs its own editor. */
    children?: React$1.ReactNode;
}
/**
 * One parameter of a task, as a row: what it is called, where its value comes
 * from, what the value is, and what that means.
 *
 * The form these rows make **is** the catalogue contract — the fields, their
 * types and their obligations are read off the entry, never authored here. So a
 * row takes a descriptor rather than children, and a parameter the contract
 * does not declare has no way to appear.
 *
 * `source` and `value` are one control, joined, because they are one decision.
 * Split into two fields they read as two questions, and a reader can end up
 * with `literal` selected beside a value that is plainly a binding.
 *
 * Not a `Field`. That one lays out a label, a control and a description for a
 * form a person fills in from nothing; this lays out a *contract* — the label
 * column carries a type, and the description usually explains a value the
 * person did not type.
 */
declare const ParamRow: React$1.ForwardRefExoticComponent<ParamRowProps & React$1.RefAttributes<HTMLDivElement>>;

declare function InputGroup({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare const inputGroupAddonVariants: (props?: ({
    align?: "inline-end" | "inline-start" | "block-end" | "block-start" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare function InputGroupAddon({ className, align, ...props }: React$1.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>): React$1.JSX.Element;
declare const inputGroupButtonVariants: (props?: ({
    size?: "xs" | "sm" | "icon-xs" | "icon-sm" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare function InputGroupButton({ className, type, variant, size, ...props }: Omit<React$1.ComponentProps<typeof Button>, "size"> & VariantProps<typeof inputGroupButtonVariants>): React$1.JSX.Element;
declare function InputGroupText({ className, ...props }: React$1.ComponentProps<"span">): React$1.JSX.Element;
declare function InputGroupInput({ className, ...props }: React$1.ComponentProps<"input">): React$1.JSX.Element;
declare function InputGroupTextarea({ className, ...props }: React$1.ComponentProps<"textarea">): React$1.JSX.Element;

export { type BooleanControl, BooleanField, Checkbox, CheckboxGroupField, ColorField, type ColorPreset, ColorSwatches, Field, type FieldBadge, type FieldConfig, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, type FieldOrientation, FieldSeparator, FieldSet, type FieldSize, FieldTitle, type FieldType, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, type GroupConfig, IconField, IconInput, Input, InputField, InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea, type InputSize, Label, type LabelPosition, NumberField, ObjectField, type ObjectFieldProps, PARAM_SOURCES, ParamRow, type ParamRowProps, type ParamSource, PasswordField, PasswordInput, type PasswordInputProps, RadioField, RadioGroup, RadioGroupItem, type RowConfig, Select, SelectContent, SelectField, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue, SettingsPanel, type SettingsPanelProps, Slider, SliderNumber, Switch, Textarea, TextareaField, useFormField };
