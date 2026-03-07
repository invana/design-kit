import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { getThemeVariantById, applyTheme, getAllThemeVariants, themes } from '@invana/styling/themes.config';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { TooltipProvider, NavHorizontal, NavVertical, ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@invana/ui';
import { cn } from '@invana/ui/lib/utils';

// src/core/theme-provider.tsx
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
function writeStorage(theme, mode) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme, mode }));
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
  defaultMode = "system"
}) => {
  const [theme, setThemeState] = useState(() => {
    return readStorage()?.theme ?? defaultTheme;
  });
  const [mode, setModeState] = useState(() => {
    return readStorage()?.mode ?? defaultMode;
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
    writeStorage(themeId, mode);
  }, [mode]);
  const setMode = useCallback((newMode) => {
    setModeState(newMode);
    writeStorage(theme, newMode);
  }, [theme]);
  const toggleMode = useCallback(() => {
    const next = isDark ? "light" : "dark";
    setModeState(next);
    writeStorage(theme, next);
  }, [isDark, theme]);
  const variantId = buildVariantId(theme, mode, isDark);
  const value = {
    theme,
    mode,
    variantId,
    isDark,
    themes,
    variants: getAllThemeVariants(),
    setTheme,
    setMode,
    toggleMode
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
var AppLayoutBase = (props) => {
  return /* @__PURE__ */ jsx(TooltipProvider, { delayDuration: 0, children: /* @__PURE__ */ jsxs("div", { className: cn("flex h-screen flex-col  bg-background text-foreground", props.className), children: [
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

export { AppLayoutBase, AppLayoutV1, AppLayoutV2, ThemeProvider, useTheme };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map