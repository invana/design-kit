import React2, { createContext, useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { getThemeVariantById, applyTheme, getAllThemeVariants, themes } from '@invana/styling/themes.config';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { TooltipProvider, ToggleGroup, Tooltip, TooltipTrigger, ToggleGroupItem, cn, TooltipContent, Separator, Button, NavHorizontal, NavVertical, ResizablePanelGroup, ResizablePanel, ResizableHandle, Card, CardHeader, CardContent, CardFooter, RichSelect } from '@invana/ui';
import { cn as cn$1 } from '@invana/ui/lib/utils';

// src/core/theme-provider.tsx

// src/core/accents.ts
var DEFAULT_ACCENTS = [
  { id: "green", name: "Green", swatch: "#22c55e", light: "142 70% 43%", dark: "142 70% 60%" },
  { id: "emerald", name: "Emerald", swatch: "#10b981", light: "160 84% 39%", dark: "160 84% 55%" },
  { id: "teal", name: "Teal", swatch: "#14b8a6", light: "172 66% 50%", dark: "172 66% 65%" },
  { id: "cyan", name: "Cyan", swatch: "#0ea5e9", light: "199 89% 48%", dark: "198 93% 60%" },
  { id: "blue", name: "Blue", swatch: "#3b82f6", light: "217 91% 60%", dark: "217 91% 70%" },
  { id: "indigo", name: "Indigo", swatch: "#747bff", light: "235 85% 70%", dark: "235 85% 75%" },
  { id: "purple", name: "Purple", swatch: "#a855f7", light: "271 81% 56%", dark: "271 81% 70%" },
  { id: "pink", name: "Pink", swatch: "#ec4899", light: "330 81% 60%", dark: "330 81% 70%" },
  { id: "red", name: "Red", swatch: "#ef4444", light: "0 84% 60%", dark: "0 84% 70%" },
  { id: "orange", name: "Orange", swatch: "#f97316", light: "24 95% 53%", dark: "24 95% 65%" },
  { id: "amber", name: "Amber", swatch: "#f59e0b", light: "38 92% 50%", dark: "38 92% 60%" },
  { id: "slate", name: "Slate", swatch: "#64748b", light: "215 16% 47%", dark: "215 16% 60%" }
];
function findAccent(id, accents = DEFAULT_ACCENTS) {
  if (!id) return void 0;
  return accents.find((a) => a.id === id);
}
function accentVars(accent, isDark) {
  if (!accent) return {};
  const raw = isDark ? accent.dark : accent.light;
  const hsl = `hsl(${raw})`;
  return {
    "--primary": raw,
    "--primary-foreground": "0 0% 100%",
    "--accent": raw,
    "--accent-foreground": "0 0% 100%",
    "--ring": raw,
    "--color-primary": hsl,
    "--color-primary-foreground": "hsl(0 0% 100%)",
    "--color-accent": hsl,
    "--color-accent-foreground": "hsl(0 0% 100%)",
    "--color-ring": hsl
  };
}
var ThemeContext = createContext(null);
var STORAGE_KEY = "invana-theme";
function readStorage() {
  try {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
function writeStorage(theme, mode, accent) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme, mode, accent }));
  } catch {
  }
}
function resolveIsDark(mode) {
  if (mode === "dark") return true;
  if (mode === "light") return false;
  return typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)").matches : false;
}
function buildVariantId(themeId, mode, isDark) {
  if (mode === "system") {
    return `${themeId}-${isDark ? "dark" : "light"}`;
  }
  return `${themeId}-${mode}`;
}
var ThemeProvider = ({
  children,
  defaultTheme = "default",
  defaultMode = "system",
  defaultAccent = null,
  accents = DEFAULT_ACCENTS,
  persist = "change"
}) => {
  const [theme, setThemeState] = useState(() => {
    return readStorage()?.theme ?? defaultTheme;
  });
  const [mode, setModeState] = useState(() => {
    return readStorage()?.mode ?? defaultMode;
  });
  const [accent, setAccentState] = useState(() => {
    return readStorage()?.accent ?? defaultAccent;
  });
  const [isDark, setIsDark] = useState(() => resolveIsDark(mode));
  useEffect(() => {
    if (mode !== "system") {
      setIsDark(mode === "dark");
      return;
    }
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mq.matches);
    const handler = (e) => setIsDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mode]);
  useEffect(() => {
    const variantId2 = buildVariantId(theme, mode, isDark);
    const resolved = getThemeVariantById(variantId2);
    if (resolved) {
      applyTheme(variantId2);
    } else {
      applyTheme("default-light");
    }
  }, [theme, mode, isDark]);
  const setTheme = useCallback((themeId) => {
    setThemeState(themeId);
    if (persist === "change") writeStorage(themeId, mode, accent);
  }, [mode, accent, persist]);
  const setMode = useCallback((newMode) => {
    setModeState(newMode);
    if (persist === "change") writeStorage(theme, newMode, accent);
  }, [theme, accent, persist]);
  const toggleMode = useCallback(() => {
    const next = isDark ? "light" : "dark";
    setModeState(next);
    if (persist === "change") writeStorage(theme, next, accent);
  }, [isDark, theme, accent, persist]);
  const setAccent = useCallback((next) => {
    setAccentState(next);
    if (persist === "change") writeStorage(theme, mode, next);
  }, [theme, mode, persist]);
  const commit = useCallback(() => {
    writeStorage(theme, mode, accent);
  }, [theme, mode, accent]);
  const variantId = buildVariantId(theme, mode, isDark);
  const resolvedAccentVars = accentVars(findAccent(accent, accents), isDark);
  const value = {
    theme,
    mode,
    variantId,
    isDark,
    themes,
    variants: getAllThemeVariants(),
    accent,
    accents,
    accentVars: resolvedAccentVars,
    setTheme,
    setMode,
    toggleMode,
    setAccent,
    commit
  };
  return /* @__PURE__ */ jsx(ThemeContext.Provider, { value, children });
};
function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }
  return ctx;
}
function useThemeOptional() {
  return useContext(ThemeContext);
}
var ThemeScope = ({
  accentVars: accentVars2,
  children,
  style,
  ...rest
}) => {
  const ctx = useThemeOptional();
  const vars = accentVars2 ?? ctx?.accentVars ?? {};
  return /* @__PURE__ */ jsx("div", { style: { ...vars, ...style }, ...rest, children });
};
var SWATCH_TOKENS = ["bg-primary", "bg-secondary", "bg-accent", "bg-muted", "bg-border"];
function CheckMark({ className }) {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 3,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className,
      "aria-hidden": true,
      children: /* @__PURE__ */ jsx("path", { d: "M5 13l4 4L19 7" })
    }
  );
}
function ThemeSwatches({
  themeId,
  isDark,
  className
}) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: cn(
        `theme-${themeId}-${isDark ? "dark" : "light"}`,
        "inline-flex shrink-0 items-center gap-1 rounded-md border bg-background p-1",
        className
      ),
      children: SWATCH_TOKENS.map((token) => /* @__PURE__ */ jsx("span", { className: cn("h-3 w-3 rounded-full", token) }, token))
    }
  );
}
var MODES = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" }
];
function prefersDark() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function useResolvedDark(mode, override) {
  const [isDark, setIsDark] = useState(
    () => override ?? (mode === "dark" ? true : mode === "light" ? false : prefersDark())
  );
  useEffect(() => {
    if (override !== void 0) {
      setIsDark(override);
      return;
    }
    if (mode !== "system") {
      setIsDark(mode === "dark");
      return;
    }
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mq.matches);
    const handler = (e) => setIsDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mode, override]);
  return isDark;
}
var ThemeSelector = ({
  layout = "inline",
  showTheme = true,
  themeVariant,
  showMode = true,
  showAccent = true,
  resetAccentOnThemeChange = true,
  modeIcons,
  themes: themeList = themes,
  accents = DEFAULT_ACCENTS,
  labels,
  className,
  theme: controlledTheme,
  mode: controlledMode,
  accent: controlledAccent,
  onThemeChange,
  onModeChange,
  onAccentChange,
  defaultTheme = "default",
  defaultMode = "system",
  defaultAccent = null
}) => {
  const ctx = useThemeOptional();
  const hasProvider = !!ctx;
  const [iTheme, setITheme] = useState(defaultTheme);
  const [iMode, setIMode] = useState(defaultMode);
  const [iAccent, setIAccent] = useState(defaultAccent);
  const theme = controlledTheme ?? ctx?.theme ?? iTheme;
  const mode = controlledMode ?? ctx?.mode ?? iMode;
  const accent = controlledAccent !== void 0 ? controlledAccent : ctx?.accent ?? iAccent;
  const isDark = useResolvedDark(mode, hasProvider ? ctx.isDark : void 0);
  useEffect(() => {
    if (hasProvider) return;
    const id = mode === "system" ? `${theme}-${isDark ? "dark" : "light"}` : `${theme}-${mode}`;
    applyTheme(getThemeVariantById(id) ? id : "default-light");
  }, [hasProvider, theme, mode, isDark]);
  const changeTheme = (next) => {
    onThemeChange?.(next);
    if (controlledTheme === void 0) (ctx?.setTheme ?? setITheme)(next);
    if (resetAccentOnThemeChange && accent !== null) changeAccent(null);
  };
  const changeMode = (next) => {
    onModeChange?.(next);
    if (controlledMode === void 0) (ctx?.setMode ?? setIMode)(next);
  };
  const changeAccent = (next) => {
    onAccentChange?.(next);
    if (controlledAccent === void 0) (ctx?.setAccent ?? setIAccent)(next);
  };
  const themeOptions = useMemo(
    () => themeList.map((t) => ({ value: t.id, label: t.name, description: t.description })),
    [themeList]
  );
  const stacked = layout === "form";
  const themeLabel = labels?.theme ?? "Theme";
  const modeLabel = labels?.mode ?? "Mode";
  const accentLabel = labels?.accent ?? "Accent";
  const currentThemeDescription = themeList.find((t) => t.id === theme)?.description;
  const resolvedThemeVariant = themeVariant ?? (stacked ? "cards" : "select");
  const themeCards = /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsx(
    ToggleGroup,
    {
      type: "single",
      value: theme,
      onValueChange: (v) => v && changeTheme(v),
      variant: "outline",
      className: "flex flex-wrap justify-start gap-2",
      children: themeList.map((t) => {
        const selected = theme === t.id;
        return /* @__PURE__ */ jsxs(Tooltip, { delayDuration: 300, children: [
          /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
            ToggleGroupItem,
            {
              value: t.id,
              "aria-label": t.name,
              className: cn(
                "relative h-auto min-w-24 flex-col items-start gap-1.5 rounded-md border-2 p-2",
                selected ? "border-primary bg-primary/10 text-foreground shadow-sm hover:bg-primary/10" : "border-border text-foreground hover:border-foreground/40 hover:bg-transparent"
              ),
              children: [
                /* @__PURE__ */ jsx(ThemeSwatches, { themeId: t.id, isDark }),
                /* @__PURE__ */ jsx("span", { className: "px-0.5 text-xs font-medium", children: t.name }),
                selected && /* @__PURE__ */ jsx("span", { className: "absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm", children: /* @__PURE__ */ jsx(CheckMark, { className: "h-2.5 w-2.5" }) })
              ]
            }
          ) }),
          t.description != null && /* @__PURE__ */ jsx(TooltipContent, { children: t.description })
        ] }, t.id);
      })
    }
  ) });
  const themeSelect = /* @__PURE__ */ jsx(
    RichSelect,
    {
      label: themeLabel,
      options: themeOptions,
      value: theme,
      onChange: (v) => changeTheme(v),
      triggerClassName: stacked ? "w-full" : "w-56",
      tooltip: currentThemeDescription,
      renderOption: (option) => /* @__PURE__ */ jsxs("span", { className: "flex w-full items-center gap-3 py-0.5", children: [
        /* @__PURE__ */ jsx(ThemeSwatches, { themeId: option.value, isDark }),
        /* @__PURE__ */ jsxs("span", { className: "flex min-w-0 flex-col", children: [
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: option.label }),
          option.description != null && /* @__PURE__ */ jsx("span", { className: "line-clamp-1 text-xs text-muted-foreground", children: option.description })
        ] })
      ] }),
      renderValue: (selected) => {
        const only = selected[0];
        if (!only) return themeLabel;
        return /* @__PURE__ */ jsxs("span", { className: "flex min-w-0 items-center gap-2", children: [
          /* @__PURE__ */ jsx(ThemeSwatches, { themeId: only.value, isDark, className: "p-0.5" }),
          /* @__PURE__ */ jsx("span", { className: "truncate", children: only.label })
        ] });
      }
    }
  );
  const themeField = showTheme && /* @__PURE__ */ jsx(Field, { stacked, label: stacked ? themeLabel : void 0, inlineLabel: !stacked ? themeLabel : void 0, children: resolvedThemeVariant === "cards" ? themeCards : themeSelect });
  const modeField = showMode && /* @__PURE__ */ jsx(Field, { stacked, label: stacked ? modeLabel : void 0, inlineLabel: !stacked ? modeLabel : void 0, children: /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsx(
    ToggleGroup,
    {
      type: "single",
      value: mode,
      onValueChange: (v) => v && changeMode(v),
      variant: "outline",
      size: "sm",
      children: MODES.map(({ value, label }) => {
        const Icon = modeIcons?.[value];
        return /* @__PURE__ */ jsxs(Tooltip, { delayDuration: 0, children: [
          /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsx(ToggleGroupItem, { value, "aria-label": label, children: Icon ? /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx("span", { className: "px-1 text-xs", children: label }) }) }),
          /* @__PURE__ */ jsx(TooltipContent, { children: label })
        ] }, value);
      })
    }
  ) }) });
  const accentField = showAccent && /* @__PURE__ */ jsx(Field, { stacked, label: stacked ? accentLabel : void 0, inlineLabel: !stacked ? accentLabel : void 0, children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => changeAccent(null),
        className: cn(
          `theme-${theme}-${isDark ? "dark" : "light"}`,
          "h-7 w-7 rounded-full border-2 bg-primary transition-all",
          accent === null ? "border-foreground scale-110 ring-2 ring-offset-2 ring-offset-background ring-foreground/20" : "border-border hover:border-foreground/50 hover:scale-105"
        ),
        title: "Theme accent",
        "aria-label": "Use the theme's own accent",
        "aria-pressed": accent === null
      }
    ),
    /* @__PURE__ */ jsx(Separator, { orientation: "vertical", className: "h-6" }),
    accents.map((a) => {
      const selected = accent === a.id;
      return /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => changeAccent(selected ? null : a.id),
          className: cn(
            "h-7 w-7 rounded-full border-2 transition-all",
            selected ? "border-foreground scale-110 ring-2 ring-offset-2 ring-offset-background ring-foreground/20" : "border-border hover:border-foreground/50 hover:scale-105"
          ),
          style: { backgroundColor: a.swatch },
          title: a.name,
          "aria-label": `${a.name} accent`,
          "aria-pressed": selected
        },
        a.id
      );
    })
  ] }) });
  if (stacked) {
    return /* @__PURE__ */ jsxs("div", { className: cn("flex flex-col gap-5", className), children: [
      themeField,
      modeField,
      accentField
    ] });
  }
  const sections = [themeField, modeField, accentField].filter(Boolean);
  return /* @__PURE__ */ jsx("div", { className: cn("flex flex-wrap items-center gap-4", className), children: sections.map((section, i) => /* @__PURE__ */ jsxs(React2.Fragment, { children: [
    i > 0 && /* @__PURE__ */ jsx(Separator, { orientation: "vertical", className: "h-6" }),
    section
  ] }, i)) });
};
var Field = ({ stacked, label, inlineLabel, children }) => {
  if (stacked) {
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
      label && /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: label }),
      children
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
    inlineLabel && /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
      inlineLabel,
      ":"
    ] }),
    children
  ] });
};
function renderSlot(slot, state) {
  return typeof slot === "function" ? slot(state) : slot;
}
var ThemeSettingsCardInner = ({
  header,
  footer,
  className,
  contentClassName,
  onSave,
  onReset,
  onChange,
  ...selectorProps
}) => {
  const ctx = useTheme();
  const [baseline, setBaseline] = useState(() => ({
    theme: ctx.theme,
    mode: ctx.mode,
    accent: ctx.accent
  }));
  const current = { theme: ctx.theme, mode: ctx.mode, accent: ctx.accent };
  const isDirty = current.theme !== baseline.theme || current.mode !== baseline.mode || current.accent !== baseline.accent;
  useEffect(() => {
    onChange?.({ theme: ctx.theme, mode: ctx.mode, accent: ctx.accent });
  }, [ctx.theme, ctx.mode, ctx.accent]);
  const save = useCallback(() => {
    const snapshot = { theme: ctx.theme, mode: ctx.mode, accent: ctx.accent };
    ctx.commit();
    setBaseline(snapshot);
    onSave?.(snapshot);
  }, [ctx, onSave]);
  const reset = useCallback(() => {
    ctx.setTheme(baseline.theme);
    ctx.setMode(baseline.mode);
    ctx.setAccent(baseline.accent);
    onReset?.(baseline);
  }, [ctx, baseline, onReset]);
  const state = { ...current, isDirty, save, reset };
  return /* @__PURE__ */ jsxs(Card, { className, children: [
    header != null && /* @__PURE__ */ jsx(CardHeader, { children: renderSlot(header, state) }),
    /* @__PURE__ */ jsx(CardContent, { className: cn("space-y-6", contentClassName), children: /* @__PURE__ */ jsx(ThemeSelector, { layout: "form", ...selectorProps }) }),
    footer != null && /* @__PURE__ */ jsx(CardFooter, { children: renderSlot(footer, state) })
  ] });
};
var ThemeSettingsCard = ({
  defaultTheme,
  defaultMode,
  defaultAccent,
  ...rest
}) => {
  const existing = useThemeOptional();
  if (existing) return /* @__PURE__ */ jsx(ThemeSettingsCardInner, { ...rest });
  return /* @__PURE__ */ jsx(
    ThemeProvider,
    {
      defaultTheme,
      defaultMode,
      defaultAccent,
      accents: rest.accents,
      persist: "manual",
      children: /* @__PURE__ */ jsx(ThemeSettingsCardInner, { ...rest })
    }
  );
};
var ThemeSettingsActions = ({
  state,
  saveLabel = "Save as default",
  resetLabel = "Reset",
  className
}) => /* @__PURE__ */ jsxs("div", { className: cn("flex w-full items-center justify-end gap-2", className), children: [
  /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: state.reset, disabled: !state.isDirty, children: resetLabel }),
  /* @__PURE__ */ jsx(Button, { size: "sm", onClick: state.save, disabled: !state.isDirty, children: saveLabel })
] });
var AppLayoutBase = (props) => {
  return /* @__PURE__ */ jsx(TooltipProvider, { delayDuration: 0, children: /* @__PURE__ */ jsxs("div", { className: cn$1("flex h-screen flex-col  bg-background text-foreground", props.className), children: [
    /* @__PURE__ */ jsx(
      NavHorizontal,
      {
        className: `h-[40px] border-b border-border bg-background ${props.header.className}`,
        left: props.header.left,
        leftNavItems: props.header.leftNavItems,
        center: props.header.center,
        centerNavItems: props.header.centerNavItems,
        right: props.header.right,
        rightNavItems: props.header.rightNavItems
      }
    ),
    /* @__PURE__ */ jsx("div", { className: `h-[calc(100vh-65px)]  w-full bg-background ${props?.mainClassName}`, children: props.main }),
    /* @__PURE__ */ jsx(
      NavHorizontal,
      {
        className: `h-[25px] border-t border-border bg-background ${props.footer.className}`,
        left: props.footer.left,
        leftNavItems: props.footer.leftNavItems,
        center: props.footer.center,
        centerNavItems: props.footer.centerNavItems,
        right: props.footer.right,
        rightNavItems: props.footer.rightNavItems
      }
    )
  ] }) });
};
var AppLayoutV1 = (props) => {
  return /* @__PURE__ */ jsx(
    AppLayoutBase,
    {
      header: props.header,
      mainClassName: props.mainClassName,
      main: /* @__PURE__ */ jsxs("div", { className: "relative h-full flex flex-1", children: [
        /* @__PURE__ */ jsx(
          NavVertical,
          {
            className: `border-r bg-card text-card-foreground ${props.leftNav.className}`,
            top: props.leftNav.top,
            topNavItems: props.leftNav.topNavItems,
            middle: props.leftNav.middle,
            bottom: props.leftNav.bottom,
            bottomNavItems: props.leftNav.bottomNavItems
          }
        ),
        /* @__PURE__ */ jsx("main", { className: "w-full", children: props.main })
      ] }),
      footer: props.footer
    }
  );
};
var DEFAULT_SIDEBAR = { defaultSize: "250px", minSize: "150px", maxSize: "500px", collapsible: true };
var DEFAULT_TERMINAL = { defaultSize: "300px", minSize: "100px", maxSize: "600px", collapsible: true };
var DEFAULT_AUXILIARY = { defaultSize: "300px", minSize: "200px", maxSize: "600px", collapsible: true };
var DEFAULT_EDITOR = { defaultSize: "600px", minSize: "400px" };
var DEFAULT_EDITOR_AREA = { defaultSize: "500px", minSize: "300px" };
var DEFAULT_LEFT_MAIN_AREA = { defaultSize: "800px", minSize: "400px" };
var AppLayoutV2 = ({
  className,
  header,
  footer,
  mainClassName,
  leftNav,
  leftSection,
  mainSection,
  bottomSection,
  rightSection
}) => {
  return /* @__PURE__ */ jsx(
    AppLayoutV1,
    {
      className,
      header,
      mainClassName,
      leftNav,
      footer: footer ?? { className: "" },
      main: /* @__PURE__ */ jsx("div", { className: "flex-1 h-full", children: /* @__PURE__ */ jsxs(ResizablePanelGroup, { orientation: "horizontal", id: "main-layout", children: [
        /* @__PURE__ */ jsx(
          ResizablePanel,
          {
            id: "left-main-area",
            defaultSize: rightSection ? DEFAULT_LEFT_MAIN_AREA.defaultSize : void 0,
            minSize: rightSection ? DEFAULT_LEFT_MAIN_AREA.minSize : void 0,
            children: /* @__PURE__ */ jsxs(ResizablePanelGroup, { orientation: "vertical", id: "left-main-vertical", children: [
              /* @__PURE__ */ jsx(
                ResizablePanel,
                {
                  id: "editor-area",
                  defaultSize: bottomSection ? DEFAULT_EDITOR_AREA.defaultSize : void 0,
                  minSize: bottomSection ? DEFAULT_EDITOR_AREA.minSize : void 0,
                  children: leftSection ? /* @__PURE__ */ jsxs(ResizablePanelGroup, { orientation: "horizontal", id: "editor-horizontal", children: [
                    /* @__PURE__ */ jsx(
                      ResizablePanel,
                      {
                        id: "sidebar-panel",
                        defaultSize: leftSection.defaultSize ?? DEFAULT_SIDEBAR.defaultSize,
                        minSize: leftSection.minSize ?? DEFAULT_SIDEBAR.minSize,
                        maxSize: leftSection.maxSize ?? DEFAULT_SIDEBAR.maxSize,
                        collapsible: leftSection.collapsible ?? DEFAULT_SIDEBAR.collapsible,
                        groupResizeBehavior: "preserve-pixel-size",
                        children: /* @__PURE__ */ jsx("div", { className: "h-full overflow-auto bg-card", children: leftSection.content })
                      }
                    ),
                    /* @__PURE__ */ jsx(ResizableHandle, { withHandle: true, className: "w-1" }),
                    /* @__PURE__ */ jsx(
                      ResizablePanel,
                      {
                        id: "editor-panel",
                        defaultSize: mainSection.defaultSize ?? DEFAULT_EDITOR.defaultSize,
                        minSize: mainSection.minSize ?? DEFAULT_EDITOR.minSize,
                        children: /* @__PURE__ */ jsx("div", { className: "h-full overflow-auto", children: mainSection.content })
                      }
                    )
                  ] }) : /* @__PURE__ */ jsx("div", { className: "h-full w-full overflow-auto", children: mainSection.content })
                }
              ),
              bottomSection && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(ResizableHandle, { withHandle: true, className: "h-1" }),
                /* @__PURE__ */ jsx(
                  ResizablePanel,
                  {
                    id: "terminal-panel",
                    defaultSize: bottomSection.defaultSize ?? DEFAULT_TERMINAL.defaultSize,
                    minSize: bottomSection.minSize ?? DEFAULT_TERMINAL.minSize,
                    maxSize: bottomSection.maxSize ?? DEFAULT_TERMINAL.maxSize,
                    collapsible: bottomSection.collapsible ?? DEFAULT_TERMINAL.collapsible,
                    children: /* @__PURE__ */ jsx("div", { className: "h-full overflow-auto bg-card", children: bottomSection.content })
                  }
                )
              ] })
            ] })
          }
        ),
        rightSection && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(ResizableHandle, { withHandle: true, className: "w-1" }),
          /* @__PURE__ */ jsx(
            ResizablePanel,
            {
              id: "auxiliary-panel",
              defaultSize: rightSection.defaultSize ?? DEFAULT_AUXILIARY.defaultSize,
              minSize: rightSection.minSize ?? DEFAULT_AUXILIARY.minSize,
              maxSize: rightSection.maxSize ?? DEFAULT_AUXILIARY.maxSize,
              collapsible: rightSection.collapsible ?? DEFAULT_AUXILIARY.collapsible,
              children: /* @__PURE__ */ jsx("div", { className: "h-full overflow-auto bg-card", children: rightSection.content })
            }
          )
        ] })
      ] }) })
    }
  );
};

export { AppLayoutBase, AppLayoutV1, AppLayoutV2, DEFAULT_ACCENTS, ThemeProvider, ThemeScope, ThemeSelector, ThemeSettingsActions, ThemeSettingsCard, accentVars, findAccent, useTheme, useThemeOptional };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map