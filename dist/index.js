import { cn, Accordion, AccordionItem, AccordionTrigger, Badge, AccordionContent, Card, CardContent, Separator, Button } from '@invana/ui';
import * as React2 from 'react';
import { useMemo } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { useFormContext, Controller, FormProvider } from 'react-hook-form';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva } from 'class-variance-authority';
import { jsx, jsxs } from 'react/jsx-runtime';
import { EyeOff, Eye, Check, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as SelectPrimitive from '@radix-ui/react-select';
import * as SliderPrimitive from '@radix-ui/react-slider';

// src/form-field.tsx
var labelVariants = cva(
  "font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
var Label = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  LabelPrimitive.Root,
  {
    ref,
    className: cn(labelVariants(), className),
    ...props
  }
));
Label.displayName = LabelPrimitive.Root.displayName;
var Form = FormProvider;
var FormFieldContext = React2.createContext(
  {}
);
var FormField = ({
  ...props
}) => {
  return /* @__PURE__ */ jsx(FormFieldContext.Provider, { value: { name: props.name }, children: /* @__PURE__ */ jsx(Controller, { ...props }) });
};
var useFormField = () => {
  const fieldContext = React2.useContext(FormFieldContext);
  const itemContext = React2.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(fieldContext.name, formState);
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }
  const { id } = itemContext;
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState
  };
};
var FormItemContext = React2.createContext(
  {}
);
var FormItem = React2.forwardRef(({ className, ...props }, ref) => {
  const id = React2.useId();
  return /* @__PURE__ */ jsx(FormItemContext.Provider, { value: { id }, children: /* @__PURE__ */ jsx("div", { ref, className: cn("space-y-2", className), ...props }) });
});
FormItem.displayName = "FormItem";
var FormLabel = React2.forwardRef(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();
  return /* @__PURE__ */ jsx(
    Label,
    {
      ref,
      className: cn(error && "text-destructive", className),
      htmlFor: formItemId,
      ...props
    }
  );
});
FormLabel.displayName = "FormLabel";
var FormControl = React2.forwardRef(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return /* @__PURE__ */ jsx(
    Slot,
    {
      ref,
      id: formItemId,
      "aria-describedby": !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`,
      "aria-invalid": !!error,
      ...props
    }
  );
});
FormControl.displayName = "FormControl";
var FormDescription = React2.forwardRef(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();
  return /* @__PURE__ */ jsx(
    "p",
    {
      ref,
      id: formDescriptionId,
      className: cn("text-[0.8rem] text-muted-foreground", className),
      ...props
    }
  );
});
FormDescription.displayName = "FormDescription";
var FormMessage = React2.forwardRef(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;
  if (!body) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "p",
    {
      ref,
      id: formMessageId,
      className: cn("text-[0.8rem] font-medium text-destructive", className),
      ...props,
      children: body
    }
  );
});
FormMessage.displayName = "FormMessage";
var Input = React2.forwardRef(
  ({ className, type, inputSize = "default", ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          inputSize === "sm" ? "h-[26px] px-2 py-0" : "h-10 px-3 py-2",
          "flex w-full rounded-control border border-input bg-background text-base ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
var PasswordInput = React2.forwardRef(
  ({ className, visible, onVisibleChange, disabled, ...props }, ref) => {
    const [internalVisible, setInternalVisible] = React2.useState(false);
    const isControlled = visible !== void 0;
    const show = isControlled ? visible : internalVisible;
    const toggle = () => {
      const next = !show;
      if (!isControlled) setInternalVisible(next);
      onVisibleChange?.(next);
    };
    return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(
        Input,
        {
          type: show ? "text" : "password",
          className: cn("pr-10", className),
          disabled,
          ref,
          ...props
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: toggle,
          disabled,
          tabIndex: -1,
          "aria-label": show ? "Hide password" : "Show password",
          "aria-pressed": show,
          className: "absolute inset-y-0 right-0 flex items-center justify-center px-3 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          children: show ? /* @__PURE__ */ jsx(EyeOff, { className: "size-4", "aria-hidden": "true" }) : /* @__PURE__ */ jsx(Eye, { className: "size-4", "aria-hidden": "true" })
        }
      )
    ] });
  }
);
PasswordInput.displayName = "PasswordInput";
var Textarea = React2.forwardRef(({ className, inputSize = "default", ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "textarea",
    {
      className: cn(
        inputSize === "sm" ? "min-h-[52px] px-2 py-1" : "min-h-[80px] px-3 py-2",
        "flex w-full rounded-control border border-input bg-background text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ref,
      ...props
    }
  );
});
Textarea.displayName = "Textarea";
var Switch = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SwitchPrimitives.Root,
  {
    className: cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-border shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=unchecked]:bg-input",
      className
    ),
    ...props,
    ref,
    children: /* @__PURE__ */ jsx(
      SwitchPrimitives.Thumb,
      {
        className: cn(
          "pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 data-[state=checked]:bg-primary-foreground data-[state=unchecked]:bg-foreground"
        )
      }
    )
  }
));
Switch.displayName = SwitchPrimitives.Root.displayName;
var Checkbox = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  CheckboxPrimitive.Root,
  {
    ref,
    className: cn(
      "peer h-4 w-4 shrink-0 rounded-control border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(
      CheckboxPrimitive.Indicator,
      {
        className: cn("flex items-center justify-center text-current"),
        children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" })
      }
    )
  }
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
var RadioGroup = React2.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    RadioGroupPrimitive.Root,
    {
      className: cn("grid gap-2", className),
      ...props,
      ref
    }
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;
var RadioGroupItem = React2.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    RadioGroupPrimitive.Item,
    {
      ref,
      className: cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(RadioGroupPrimitive.Indicator, { className: "flex items-center justify-center", children: /* @__PURE__ */ jsx(Circle, { className: "h-2.5 w-2.5 fill-current text-current" }) })
    }
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
var Select = SelectPrimitive.Root;
var SelectGroup = SelectPrimitive.Group;
var SelectValue = SelectPrimitive.Value;
var SelectTrigger = React2.forwardRef(({ className, children, triggerSize = "default", ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Trigger,
  {
    ref,
    className: cn(
      triggerSize === "sm" ? "h-[26px] px-2 py-0" : "h-9 px-3 py-2",
      "flex w-full items-center justify-between whitespace-nowrap rounded-control border border-input bg-transparent  shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
var SelectScrollUpButton = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollUpButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
var SelectScrollDownButton = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollDownButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
var SelectContent = React2.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
  SelectPrimitive.Content,
  {
    ref,
    className: cn(
      "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsx(
        SelectPrimitive.Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
var SelectLabel = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Label,
  {
    ref,
    className: cn("px-2 py-1.5 font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
var SelectItem = React2.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-control py-1.5 pl-2 pr-8 outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
var SelectSeparator = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
var DEFAULT_PRESETS = [
  { label: "Black", value: "rgb(0, 0, 0)", darkValue: "rgb(255, 255, 255)" },
  { label: "Red", value: "rgb(239, 68, 68)" },
  { label: "Blue", value: "rgb(59, 130, 246)" }
];
var ColorSwatches = ({
  value,
  onChange,
  presetColors = DEFAULT_PRESETS,
  defaultValue = "rgb(0, 0, 0)"
}) => {
  const [customColor, setCustomColor] = React2.useState(value || defaultValue);
  const [isCustom, setIsCustom] = React2.useState(false);
  React2.useEffect(() => {
    if (!value) return;
    const isPreset = presetColors.some((c) => c.value === value);
    setIsCustom(!isPreset);
    if (!isPreset) setCustomColor(value);
  }, [value, presetColors]);
  const select = (newColor, custom = false) => {
    setIsCustom(custom);
    if (custom) setCustomColor(newColor);
    onChange?.(newColor);
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
    presetColors.map((color) => /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => select(color.value),
        className: cn(
          "group relative h-8 w-8 overflow-hidden rounded-control border",
          "ring-offset-background transition-all hover:scale-105",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          !isCustom && value === color.value && "ring-2 ring-ring ring-offset-2"
        ),
        children: [
          /* @__PURE__ */ jsx("div", { className: "h-full w-full", style: { backgroundColor: color.value } }),
          !isCustom && value === color.value && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black/30", children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-white" }) }),
          /* @__PURE__ */ jsxs("span", { className: "sr-only", children: [
            "Select ",
            color.label
          ] })
        ]
      },
      color.label
    )),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: cn(
          "group relative h-8 w-8 overflow-hidden rounded-control border",
          "ring-offset-background transition-all hover:scale-105",
          isCustom && "ring-2 ring-ring ring-offset-2"
        ),
        children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "color",
              value: customColor,
              onChange: (e) => select(e.target.value, true),
              className: "absolute inset-0 cursor-pointer opacity-0"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "h-full w-full", style: { backgroundColor: customColor } }),
          isCustom && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black/30", children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-white" }) }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Custom color" })
        ]
      }
    )
  ] });
};
var Slider = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs(
  SliderPrimitive.Root,
  {
    ref,
    className: cn(
      "relative flex w-full touch-none select-none items-center",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx(SliderPrimitive.Track, { className: "relative h-2 w-full grow overflow-hidden rounded-full bg-secondary", children: /* @__PURE__ */ jsx(SliderPrimitive.Range, { className: "absolute h-full bg-primary" }) }),
      /* @__PURE__ */ jsx(SliderPrimitive.Thumb, { className: "block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" })
    ]
  }
));
Slider.displayName = SliderPrimitive.Root.displayName;
var SliderNumber = ({
  value = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className
}) => {
  const [local, setLocal] = React2.useState(value);
  React2.useEffect(() => {
    setLocal(value);
  }, [value]);
  const set = (n) => {
    setLocal(n);
    onChange?.(n);
  };
  return /* @__PURE__ */ jsxs("div", { className: cn("flex items-center gap-2", className), children: [
    /* @__PURE__ */ jsx(
      Slider,
      {
        value: [local],
        onValueChange: ([n]) => set(n),
        min,
        max,
        step,
        className: "flex-1"
      }
    ),
    /* @__PURE__ */ jsx(
      Input,
      {
        type: "number",
        value: local,
        onChange: (e) => set(Number(e.target.value)),
        className: "h-8 w-16",
        min,
        max,
        step
      }
    )
  ] });
};
var IconInput = ({ value, onChange }) => {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-control border bg-muted", children: value ? value.slice(0, 2) : "\u2013" }),
    /* @__PURE__ */ jsx(
      Input,
      {
        type: "text",
        value: value ?? "",
        onChange: (e) => onChange?.(e.target.value),
        placeholder: "icon name",
        className: "h-8"
      }
    )
  ] });
};
var SIZE = {
  xs: {
    input: "h-9",
    select: "h-9",
    textarea: "",
    label: "text-base",
    desc: "text-base",
    gap: "gap-x-3 gap-y-2.5",
    section: "space-y-3",
    outer: "space-y-4",
    stack: "space-y-2",
    sideGap: "gap-x-2",
    trigger: "py-1.5 text-base",
    switch: "scale-90 origin-right",
    check: "h-4 w-4",
    radio: "h-4 w-4"
  },
  sm: {
    input: "h-9",
    select: "h-9",
    textarea: "",
    label: "text-base",
    desc: "text-base",
    gap: "gap-x-3 gap-y-2",
    section: "space-y-3",
    outer: "space-y-4",
    stack: "space-y-1.5",
    sideGap: "gap-x-2",
    trigger: "py-1.5 text-base",
    switch: "scale-90 origin-right",
    check: "h-4 w-4",
    radio: "h-4 w-4"
  },
  md: {
    input: "",
    select: "",
    textarea: "",
    label: "text-base",
    desc: "text-base",
    gap: "gap-4",
    section: "space-y-4",
    outer: "space-y-6",
    stack: "space-y-2",
    sideGap: "gap-2",
    trigger: "py-1.5 text-base",
    switch: "",
    check: "h-4 w-4",
    radio: "h-4 w-4"
  }
};
function itemClasses(labelPosition, size, className) {
  return cn(
    labelPosition === "side" && cn("grid grid-cols-3 items-center", SIZE[size].sideGap),
    labelPosition === "top" && SIZE[size].stack,
    className
  );
}
function inputWrapper(labelPosition, size) {
  return cn(labelPosition === "side" && "col-span-2", SIZE[size].stack);
}
function StatusPill({ badge }) {
  return /* @__PURE__ */ jsx(
    Badge,
    {
      variant: badge.variant ?? "secondary",
      className: "px-1.5 py-0 text-base font-medium",
      children: badge.label
    }
  );
}
function FieldLabel({
  label,
  badge,
  size,
  className
}) {
  if (!label && !badge) return null;
  return /* @__PURE__ */ jsxs(FormLabel, { className: cn(SIZE[size].label, className), children: [
    label,
    badge && /* @__PURE__ */ jsx(StatusPill, { badge })
  ] });
}
var InputField = ({
  label,
  description,
  placeholder,
  value,
  onChange,
  labelPosition = "side",
  size = "sm",
  labelClassName,
  badge,
  className
}) => /* @__PURE__ */ jsxs(FormItem, { className: itemClasses(labelPosition, size, className), children: [
  /* @__PURE__ */ jsx(FieldLabel, { label, badge, size, className: labelClassName }),
  /* @__PURE__ */ jsxs("div", { className: inputWrapper(labelPosition, size), children: [
    /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
      Input,
      {
        className: SIZE[size].input,
        placeholder,
        value: value ?? "",
        onChange: (e) => onChange?.(e.target.value)
      }
    ) }),
    description && /* @__PURE__ */ jsx(FormDescription, { className: SIZE[size].desc, children: description }),
    /* @__PURE__ */ jsx(FormMessage, { className: SIZE[size].desc })
  ] })
] });
var PasswordField = ({
  label,
  description,
  placeholder,
  value,
  onChange,
  labelPosition = "side",
  size = "sm",
  labelClassName,
  badge,
  className
}) => /* @__PURE__ */ jsxs(FormItem, { className: itemClasses(labelPosition, size, className), children: [
  /* @__PURE__ */ jsx(FieldLabel, { label, badge, size, className: labelClassName }),
  /* @__PURE__ */ jsxs("div", { className: inputWrapper(labelPosition, size), children: [
    /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
      PasswordInput,
      {
        className: SIZE[size].input,
        placeholder,
        value: value ?? "",
        onChange: (e) => onChange?.(e.target.value)
      }
    ) }),
    description && /* @__PURE__ */ jsx(FormDescription, { className: SIZE[size].desc, children: description }),
    /* @__PURE__ */ jsx(FormMessage, { className: SIZE[size].desc })
  ] })
] });
var TextareaField = ({
  label,
  description,
  placeholder,
  value,
  onChange,
  rows,
  labelPosition = "side",
  size = "sm",
  labelClassName,
  badge,
  className
}) => /* @__PURE__ */ jsxs(FormItem, { className: itemClasses(labelPosition, size, className), children: [
  /* @__PURE__ */ jsx(FieldLabel, { label, badge, size, className: labelClassName }),
  /* @__PURE__ */ jsxs("div", { className: inputWrapper(labelPosition, size), children: [
    /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
      Textarea,
      {
        className: SIZE[size].textarea || void 0,
        rows,
        placeholder,
        value: value ?? "",
        onChange: (e) => onChange?.(e.target.value)
      }
    ) }),
    description && /* @__PURE__ */ jsx(FormDescription, { className: SIZE[size].desc, children: description }),
    /* @__PURE__ */ jsx(FormMessage, { className: SIZE[size].desc })
  ] })
] });
var SelectField = ({
  label,
  description,
  options = [],
  value,
  onChange,
  placeholder = "Select type",
  labelPosition = "side",
  size = "sm",
  labelClassName,
  badge,
  className
}) => /* @__PURE__ */ jsxs(FormItem, { className: itemClasses(labelPosition, size, className), children: [
  /* @__PURE__ */ jsx(FieldLabel, { label, badge, size, className: labelClassName }),
  /* @__PURE__ */ jsxs("div", { className: inputWrapper(labelPosition, size), children: [
    /* @__PURE__ */ jsxs(Select, { value: value ?? "", onValueChange: onChange, children: [
      /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(SelectTrigger, { className: SIZE[size].select, children: /* @__PURE__ */ jsx(SelectValue, { placeholder }) }) }),
      /* @__PURE__ */ jsx(SelectContent, { children: options.map((o) => /* @__PURE__ */ jsx(SelectItem, { value: o.value, children: o.label }, o.value)) })
    ] }),
    description && /* @__PURE__ */ jsx(FormDescription, { className: SIZE[size].desc, children: description }),
    /* @__PURE__ */ jsx(FormMessage, { className: SIZE[size].desc })
  ] })
] });
var BooleanField = ({
  label,
  description,
  value,
  onChange,
  labelPosition = "side",
  size = "sm",
  control = "switch",
  labelClassName,
  badge,
  className,
  boxed = false
}) => {
  const boxClass = boxed ? "rounded-md border p-2" : "";
  if (control === "checkbox") {
    return /* @__PURE__ */ jsxs(FormItem, { className: cn("flex items-center gap-2 space-y-0", className), children: [
      /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
        Checkbox,
        {
          className: SIZE[size].check,
          checked: !!value,
          onCheckedChange: onChange
        }
      ) }),
      /* @__PURE__ */ jsx(
        FieldLabel,
        {
          label,
          badge,
          size,
          className: cn(
            "!mt-0 cursor-pointer font-normal leading-none",
            labelClassName
          )
        }
      )
    ] });
  }
  if (labelPosition === "side") {
    return /* @__PURE__ */ jsxs(FormItem, { className: cn("flex items-center justify-between", boxClass), children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(FieldLabel, { label, badge, size, className: labelClassName }),
        description && /* @__PURE__ */ jsx(FormDescription, { className: SIZE[size].desc, children: description })
      ] }),
      /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
        Switch,
        {
          className: SIZE[size].switch || void 0,
          checked: !!value,
          onCheckedChange: onChange
        }
      ) })
    ] });
  }
  return /* @__PURE__ */ jsxs(FormItem, { className: SIZE[size].stack, children: [
    /* @__PURE__ */ jsx(FieldLabel, { label, badge, size, className: labelClassName }),
    /* @__PURE__ */ jsxs("div", { className: cn("flex items-center justify-between", boxClass), children: [
      /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
        Switch,
        {
          className: SIZE[size].switch || void 0,
          checked: !!value,
          onCheckedChange: onChange
        }
      ) }),
      description && /* @__PURE__ */ jsx(FormDescription, { className: cn("ml-2", SIZE[size].desc), children: description })
    ] })
  ] });
};
var RadioField = ({
  label,
  description,
  options = [],
  value,
  onChange,
  labelPosition = "side",
  size = "sm",
  orientation = "vertical",
  labelClassName,
  badge,
  className
}) => /* @__PURE__ */ jsxs(FormItem, { className: itemClasses(labelPosition, size, className), children: [
  /* @__PURE__ */ jsx(FieldLabel, { label, badge, size, className: labelClassName }),
  /* @__PURE__ */ jsxs("div", { className: inputWrapper(labelPosition, size), children: [
    /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
      RadioGroup,
      {
        value: value ?? "",
        onValueChange: onChange,
        className: orientation === "horizontal" ? "flex flex-row items-center gap-x-4" : cn("flex flex-col", SIZE[size].stack),
        children: options.map((o) => /* @__PURE__ */ jsxs(
          "label",
          {
            className: "flex cursor-pointer items-center gap-2",
            children: [
              /* @__PURE__ */ jsx(
                RadioGroupItem,
                {
                  value: o.value,
                  className: cn("shrink-0", SIZE[size].radio)
                }
              ),
              /* @__PURE__ */ jsx("span", { className: cn("leading-none", SIZE[size].label), children: o.label })
            ]
          },
          o.value
        ))
      }
    ) }),
    description && /* @__PURE__ */ jsx(FormDescription, { className: SIZE[size].desc, children: description }),
    /* @__PURE__ */ jsx(FormMessage, { className: SIZE[size].desc })
  ] })
] });
var CheckboxGroupField = ({
  label,
  description,
  options = [],
  value,
  onChange,
  labelPosition = "side",
  size = "sm",
  orientation = "vertical",
  labelClassName,
  badge,
  className
}) => {
  const selected = Array.isArray(value) ? value : [];
  const toggle = (v, checked) => onChange?.(checked ? [...selected, v] : selected.filter((x) => x !== v));
  return /* @__PURE__ */ jsxs(FormItem, { className: itemClasses(labelPosition, size, className), children: [
    /* @__PURE__ */ jsx(FieldLabel, { label, badge, size, className: labelClassName }),
    /* @__PURE__ */ jsxs("div", { className: inputWrapper(labelPosition, size), children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: orientation === "horizontal" ? "flex flex-row items-center gap-x-4" : cn("flex flex-col", SIZE[size].stack),
          children: options.map((o) => /* @__PURE__ */ jsxs(
            "label",
            {
              className: "flex cursor-pointer items-center gap-2",
              children: [
                /* @__PURE__ */ jsx(
                  Checkbox,
                  {
                    className: cn("shrink-0", SIZE[size].check),
                    checked: selected.includes(o.value),
                    onCheckedChange: (c) => toggle(o.value, c === true)
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: cn("leading-none", SIZE[size].label), children: o.label })
              ]
            },
            o.value
          ))
        }
      ),
      description && /* @__PURE__ */ jsx(FormDescription, { className: SIZE[size].desc, children: description }),
      /* @__PURE__ */ jsx(FormMessage, { className: SIZE[size].desc })
    ] })
  ] });
};
var ColorField = ({
  label,
  description,
  value,
  onChange,
  presetColors,
  defaultValue,
  labelPosition = "side",
  size = "sm",
  labelClassName,
  badge,
  className
}) => /* @__PURE__ */ jsxs(FormItem, { className: itemClasses(labelPosition, size, className), children: [
  /* @__PURE__ */ jsx(FieldLabel, { label, badge, size, className: labelClassName }),
  /* @__PURE__ */ jsxs("div", { className: inputWrapper(labelPosition, size), children: [
    /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
      ColorSwatches,
      {
        value,
        onChange,
        presetColors,
        defaultValue
      }
    ) }),
    description && /* @__PURE__ */ jsx(FormDescription, { className: SIZE[size].desc, children: description }),
    /* @__PURE__ */ jsx(FormMessage, { className: SIZE[size].desc })
  ] })
] });
var NumberField = ({
  label,
  description,
  value,
  onChange,
  min,
  max,
  step,
  labelPosition = "side",
  size = "sm",
  labelClassName,
  badge,
  className
}) => /* @__PURE__ */ jsxs(FormItem, { className: itemClasses(labelPosition, size, className), children: [
  /* @__PURE__ */ jsx(FieldLabel, { label, badge, size, className: labelClassName }),
  /* @__PURE__ */ jsxs("div", { className: inputWrapper(labelPosition, size), children: [
    /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
      SliderNumber,
      {
        value: typeof value === "number" ? value : 0,
        onChange,
        min,
        max,
        step
      }
    ) }),
    description && /* @__PURE__ */ jsx(FormDescription, { className: SIZE[size].desc, children: description }),
    /* @__PURE__ */ jsx(FormMessage, { className: SIZE[size].desc })
  ] })
] });
var IconField = ({
  label,
  description,
  value,
  onChange,
  labelPosition = "side",
  size = "sm",
  labelClassName,
  badge,
  className
}) => /* @__PURE__ */ jsxs(FormItem, { className: itemClasses(labelPosition, size, className), children: [
  /* @__PURE__ */ jsx(FieldLabel, { label, badge, size, className: labelClassName }),
  /* @__PURE__ */ jsxs("div", { className: inputWrapper(labelPosition, size), children: [
    /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(IconInput, { value, onChange }) }),
    description && /* @__PURE__ */ jsx(FormDescription, { className: SIZE[size].desc, children: description }),
    /* @__PURE__ */ jsx(FormMessage, { className: SIZE[size].desc })
  ] })
] });
var Field = {
  Input: InputField,
  Password: PasswordField,
  Textarea: TextareaField,
  Boolean: BooleanField,
  Radio: RadioField,
  CheckboxGroup: CheckboxGroupField,
  Color: ColorField,
  Number: NumberField,
  Select: SelectField,
  Icon: IconField
};
function humanize(name) {
  return name.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()).trim();
}
function renderField(field, parentName, control, labelPosition, size) {
  return /* @__PURE__ */ jsx(
    FormField,
    {
      control,
      name: `${parentName}.${field.name}`,
      defaultValue: field.defaultValue,
      render: ({ field: rhf }) => {
        const common = {
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
          boxed: field.boxed,
          labelClassName: field.labelClassName,
          badge: field.badge,
          labelPosition,
          size,
          value: rhf.value,
          onChange: rhf.onChange
        };
        switch (field.type) {
          case "password":
            return /* @__PURE__ */ jsx(
              PasswordField,
              {
                ...common,
                placeholder: field.placeholder ?? `Enter ${field.name}`
              }
            );
          case "boolean":
            return /* @__PURE__ */ jsx(BooleanField, { ...common });
          case "radio":
            return /* @__PURE__ */ jsx(RadioField, { ...common });
          case "checkbox":
            return /* @__PURE__ */ jsx(CheckboxGroupField, { ...common });
          case "color":
            return /* @__PURE__ */ jsx(ColorField, { ...common });
          case "number":
            return /* @__PURE__ */ jsx(NumberField, { ...common });
          case "select":
            return /* @__PURE__ */ jsx(SelectField, { ...common });
          case "icon":
            return /* @__PURE__ */ jsx(IconField, { ...common });
          case "textarea":
            return /* @__PURE__ */ jsx(
              TextareaField,
              {
                ...common,
                placeholder: field.placeholder ?? `Enter ${field.name}`
              }
            );
          case "text":
          default:
            return /* @__PURE__ */ jsx(
              InputField,
              {
                ...common,
                placeholder: field.placeholder ?? `Enter ${field.name}`
              }
            );
        }
      }
    },
    field.name
  );
}
function renderGrid(fields, parentName, control, labelPosition, size, columns, key) {
  const customCols = columns !== 2;
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "grid grid-cols-1",
        SIZE[size].gap,
        customCols ? "md:[grid-template-columns:repeat(var(--ff-cols),minmax(0,1fr))]" : "md:grid-cols-2"
      ),
      style: customCols ? { "--ff-cols": columns } : void 0,
      children: fields.map((f) => {
        const span = f.colSpan && f.colSpan > 1 ? f.colSpan : void 0;
        return /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              span && "md:[grid-column:span_var(--ff-span)/span_var(--ff-span)]",
              f.className
            ),
            style: span ? { "--ff-span": span } : void 0,
            children: renderField(f, parentName, control, labelPosition, size)
          },
          f.name
        );
      })
    },
    key
  );
}
function renderRows(fields, rowConfig, parentName, control, labelPosition, size, columns) {
  if (!rowConfig || rowConfig.length === 0) {
    return renderGrid(fields, parentName, control, labelPosition, size, columns);
  }
  const used = new Set(rowConfig.flatMap((r) => r.fields));
  const unassigned = fields.filter((f) => !used.has(f.name));
  const byName = new Map(fields.map((f) => [f.name, f]));
  return /* @__PURE__ */ jsxs("div", { className: SIZE[size].section, children: [
    rowConfig.map((row) => {
      const rowFields = row.fields.map((n) => byName.get(n)).filter((f) => !!f);
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
    }),
    unassigned.length > 0 && renderGrid(
      unassigned,
      parentName,
      control,
      labelPosition,
      size,
      columns,
      "_unassigned"
    )
  ] });
}
var ObjectField = ({
  control,
  name,
  fields,
  rowConfig,
  groupConfig,
  labelPosition = "side",
  size = "sm",
  columns = 2
}) => {
  const grouped = fields.reduce((acc, f) => {
    const key = f.group ?? "_ungrouped";
    (acc[key] ??= []).push(f);
    return acc;
  }, {});
  const ungrouped = grouped["_ungrouped"] ?? [];
  delete grouped["_ungrouped"];
  const groupedEntries = Object.entries(grouped);
  const groupConfigById = new Map(
    (groupConfig ?? []).map((g) => [g.id, g])
  );
  return /* @__PURE__ */ jsxs("div", { className: SIZE[size].outer, children: [
    ungrouped.length > 0 && /* @__PURE__ */ jsx("div", { className: SIZE[size].section, children: renderRows(
      ungrouped,
      rowConfig,
      name,
      control,
      labelPosition,
      size,
      columns
    ) }),
    groupedEntries.length > 0 && /* @__PURE__ */ jsx(
      Accordion,
      {
        type: "multiple",
        defaultValue: groupedEntries.map(([k]) => k),
        className: "w-full",
        children: groupedEntries.map(([group, gFields]) => {
          const gc = groupConfigById.get(group);
          return /* @__PURE__ */ jsxs(AccordionItem, { value: group, className: "border-b", children: [
            /* @__PURE__ */ jsx(
              AccordionTrigger,
              {
                className: cn(
                  "font-semibold uppercase tracking-wide text-muted-foreground hover:no-underline",
                  SIZE[size].trigger
                ),
                children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
                  gc?.label ?? humanize(group),
                  (gc?.showCount ?? true) && /* @__PURE__ */ jsx(
                    Badge,
                    {
                      variant: "secondary",
                      className: "px-1.5 py-0 text-base font-normal tabular-nums",
                      children: gFields.length
                    }
                  ),
                  gc?.badges?.map((b, i) => /* @__PURE__ */ jsx(StatusPill, { badge: b }, i))
                ] })
              }
            ),
            /* @__PURE__ */ jsx(AccordionContent, { className: "pb-3 pt-1", children: /* @__PURE__ */ jsx("div", { className: SIZE[size].section, children: renderRows(
              gFields,
              rowConfig,
              name,
              control,
              labelPosition,
              size,
              columns
            ) }) })
          ] }, group);
        })
      }
    )
  ] });
};
var FormField2 = Object.assign(FormField, {
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
  Icon: IconField
});
function SettingsPanel({
  form,
  title,
  className,
  contentClassName,
  children,
  ...objectField
}) {
  return /* @__PURE__ */ jsx(Card, { className, children: /* @__PURE__ */ jsxs(
    CardContent,
    {
      className: cn("max-h-[80vh] overflow-y-auto p-4", contentClassName),
      children: [
        title && /* @__PURE__ */ jsx("h2", { className: "mb-3 text-base font-semibold uppercase tracking-wide text-muted-foreground", children: title }),
        /* @__PURE__ */ jsxs(Form, { ...form, children: [
          /* @__PURE__ */ jsx(ObjectField, { control: form.control, ...objectField }),
          children
        ] })
      ]
    }
  ) });
}
function FieldSet({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "fieldset",
    {
      "data-slot": "field-set",
      className: cn(
        "flex flex-col gap-6",
        "has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
        className
      ),
      ...props
    }
  );
}
function FieldLegend({
  className,
  variant = "legend",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "legend",
    {
      "data-slot": "field-legend",
      "data-variant": variant,
      className: cn(
        "mb-3 font-medium",
        "data-[variant=legend]:text-base",
        className
      ),
      ...props
    }
  );
}
function FieldGroup({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "field-group",
      className: cn(
        "group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4",
        className
      ),
      ...props
    }
  );
}
cva(
  "group/field data-[invalid=true]:text-destructive flex w-full gap-3",
  {
    variants: {
      orientation: {
        vertical: ["flex-col [&>*]:w-full [&>.sr-only]:w-auto"],
        horizontal: [
          "flex-row items-center",
          "[&>[data-slot=field-label]]:flex-auto",
          "has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px has-[>[data-slot=field-content]]:items-start"
        ],
        responsive: [
          "@md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto flex-col [&>*]:w-full [&>.sr-only]:w-auto",
          "@md/field-group:[&>[data-slot=field-label]]:flex-auto",
          "@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"
        ]
      }
    },
    defaultVariants: {
      orientation: "vertical"
    }
  }
);
function FieldContent({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "field-content",
      className: cn(
        "group/field-content flex flex-1 flex-col gap-1.5 leading-snug",
        className
      ),
      ...props
    }
  );
}
function FieldLabel2({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Label,
    {
      "data-slot": "field-label",
      className: cn(
        "group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>[data-slot=field]]:p-4",
        "has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-primary/10",
        className
      ),
      ...props
    }
  );
}
function FieldTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "field-label",
      className: cn(
        "flex w-fit items-center gap-2 font-medium leading-snug group-data-[disabled=true]/field:opacity-50",
        className
      ),
      ...props
    }
  );
}
function FieldDescription({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "p",
    {
      "data-slot": "field-description",
      className: cn(
        "text-muted-foreground font-normal leading-normal group-has-[[data-orientation=horizontal]]/field:text-balance",
        "nth-last-2:-mt-1 last:mt-0 [[data-variant=legend]+&]:-mt-1.5",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className
      ),
      ...props
    }
  );
}
function FieldSeparator({
  children,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-slot": "field-separator",
      "data-content": !!children,
      className: cn(
        "relative -my-2 h-5 group-data-[variant=outline]/field-group:-mb-2",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx(Separator, { className: "absolute inset-0 top-1/2" }),
        children && /* @__PURE__ */ jsx(
          "span",
          {
            className: "bg-background text-muted-foreground relative mx-auto block w-fit px-2",
            "data-slot": "field-separator-content",
            children
          }
        )
      ]
    }
  );
}
function FieldError({
  className,
  children,
  errors,
  ...props
}) {
  const content = useMemo(() => {
    if (children) {
      return children;
    }
    if (!errors) {
      return null;
    }
    if (errors?.length === 1 && errors[0]?.message) {
      return errors[0].message;
    }
    return /* @__PURE__ */ jsx("ul", { className: "ml-4 flex list-disc flex-col gap-1", children: errors.map(
      (error, index) => error?.message && /* @__PURE__ */ jsx("li", { children: error.message }, index)
    ) });
  }, [children, errors]);
  if (!content) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "alert",
      "data-slot": "field-error",
      className: cn("text-destructive font-normal", className),
      ...props,
      children: content
    }
  );
}
var PARAM_SOURCES = ["literal", "argument", "binding"];
var ParamRow = React2.forwardRef(
  ({
    name,
    type,
    source,
    onSourceChange,
    value,
    onValueChange,
    note,
    invalid,
    disabled,
    className,
    children,
    ...props
  }, ref) => /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      "data-invalid": invalid || void 0,
      "data-disabled": disabled || void 0,
      className: cn("flex items-start gap-3 py-1.5", className),
      ...props,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "w-[118px] shrink-0 pt-1", children: [
          /* @__PURE__ */ jsx("div", { className: "truncate font-mono text-meta", children: name }),
          type != null ? /* @__PURE__ */ jsx("div", { className: "truncate text-meta text-muted-foreground", children: type }) : null
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-1 flex-col gap-1", children: [
          children ?? /* @__PURE__ */ jsxs("div", { className: "flex min-w-0", children: [
            /* @__PURE__ */ jsxs(
              Select,
              {
                value: source,
                onValueChange: (v) => onSourceChange?.(v),
                disabled,
                children: [
                  /* @__PURE__ */ jsx(
                    SelectTrigger,
                    {
                      triggerSize: "sm",
                      "aria-label": `${name} source`,
                      className: "w-auto shrink-0 rounded-r-none border-r-0 text-meta text-muted-foreground",
                      children: /* @__PURE__ */ jsx(SelectValue, {})
                    }
                  ),
                  /* @__PURE__ */ jsx(SelectContent, { children: PARAM_SOURCES.map((s) => /* @__PURE__ */ jsx(SelectItem, { value: s, children: s }, s)) })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              Input,
              {
                inputSize: "sm",
                value,
                onChange: (e) => onValueChange?.(e.target.value),
                disabled,
                "aria-invalid": invalid || void 0,
                "aria-label": name,
                style: invalid ? { borderColor: "var(--color-destructive)" } : void 0,
                className: "min-w-0 flex-1 rounded-l-none font-mono"
              }
            )
          ] }),
          note != null ? /* @__PURE__ */ jsx(
            "div",
            {
              className: cn(
                "text-meta",
                invalid ? "text-destructive" : "text-muted-foreground"
              ),
              children: note
            }
          ) : null
        ] })
      ]
    }
  )
);
ParamRow.displayName = "ParamRow";
function InputGroup({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "input-group",
      role: "group",
      className: cn(
        "group/input-group border-input dark:bg-input/30 shadow-xs relative flex w-full items-center rounded-control border outline-none transition-[color,box-shadow]",
        "h-9 has-[>textarea]:h-auto",
        // Variants based on alignment.
        "has-[>[data-align=inline-start]]:[&>input]:pl-2",
        "has-[>[data-align=inline-end]]:[&>input]:pr-2",
        "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3",
        "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3",
        // Focus state.
        "has-[[data-slot=input-group-control]:focus-visible]:ring-ring has-[[data-slot=input-group-control]:focus-visible]:ring-1",
        // Error state.
        "has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40",
        className
      ),
      ...props
    }
  );
}
var inputGroupAddonVariants = cva(
  "text-muted-foreground flex h-auto cursor-text select-none items-center justify-center gap-2 py-1.5 font-medium group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-control [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start": "order-first pl-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]",
        "inline-end": "order-last pr-3 has-[>button]:mr-[-0.4rem] has-[>kbd]:mr-[-0.35rem]",
        "block-start": "[.border-b]:pb-3 order-first w-full justify-start px-3 pt-3 group-has-[>input]/input-group:pt-2.5",
        "block-end": "[.border-t]:pt-3 order-last w-full justify-start px-3 pb-3 group-has-[>input]/input-group:pb-2.5"
      }
    },
    defaultVariants: {
      align: "inline-start"
    }
  }
);
function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "group",
      "data-slot": "input-group-addon",
      "data-align": align,
      className: cn(inputGroupAddonVariants({ align }), className),
      onClick: (e) => {
        if (e.target.closest("button")) {
          return;
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus();
      },
      ...props
    }
  );
}
var inputGroupButtonVariants = cva(
  "flex items-center gap-2 shadow-none",
  {
    variants: {
      size: {
        xs: "h-6 gap-1 rounded-control px-2 has-[>svg]:px-2 [&>svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 gap-1.5 rounded-control px-2.5 has-[>svg]:px-2.5",
        "icon-xs": "size-6 rounded-control p-0 has-[>svg]:p-0",
        "icon-sm": "size-8 p-0 has-[>svg]:p-0"
      }
    },
    defaultVariants: {
      size: "xs"
    }
  }
);
function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Button,
    {
      type,
      "data-size": size,
      variant,
      className: cn(inputGroupButtonVariants({ size }), className),
      ...props
    }
  );
}
function InputGroupText({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: cn(
        "text-muted-foreground flex items-center gap-2 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
        className
      ),
      ...props
    }
  );
}
function InputGroupInput({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Input,
    {
      "data-slot": "input-group-control",
      className: cn(
        "flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent",
        className
      ),
      ...props
    }
  );
}
function InputGroupTextarea({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Textarea,
    {
      "data-slot": "input-group-control",
      className: cn(
        "flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:ring-0 dark:bg-transparent",
        className
      ),
      ...props
    }
  );
}

export { BooleanField, Checkbox, CheckboxGroupField, ColorField, ColorSwatches, Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel2 as FieldLabel, FieldLegend, FieldSeparator, FieldSet, FieldTitle, Form, FormControl, FormDescription, FormField2 as FormField, FormItem, FormLabel, FormMessage, IconField, IconInput, Input, InputField, InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea, Label, NumberField, ObjectField, PARAM_SOURCES, ParamRow, PasswordField, PasswordInput, RadioField, RadioGroup, RadioGroupItem, Select, SelectContent, SelectField, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue, SettingsPanel, Slider, SliderNumber, Switch, Textarea, TextareaField, useFormField };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map