import React, { useEffect } from "react";
import type { Preview } from "@storybook/react-vite";
import "../src/styles.css";
import {
  themes,
  applyTheme,
  getThemeById,
  getThemeVariantById,
} from "@invana/styling/themes";

// Every theme — classic (Invana, Tailwind, Vite) and colour preset (Gold, Ocean,
// Forest, Rose, Minimal) — varies by light / dark / system. The decorator applies
// `<theme>-<variant>` and falls back to the theme's default variant if it's missing.
const variantItems = [
  { value: "light", title: "Light", icon: "sun" },
  { value: "dark", title: "Dark", icon: "moon" },
  { value: "system", title: "System", icon: "circle" },
];

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true,
    },
    docs: {
      // disable: true,
    },
  },
  globalTypes: {
    theme: {
      description: "Select theme style",
      defaultValue: themes[0].id,
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: themes.map((theme) => ({
          value: theme.id,
          title: theme.name,
          icon: "paintbrush",
        })),
        dynamicTitle: true,
      },
    },
    variant: {
      description: "Theme variant — mode (light/dark/system)",
      defaultValue: "system",
      toolbar: {
        title: "Variant",
        icon: "circle",
        items: variantItems,
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      // Stories that manage their own theme (e.g. they render a <ThemeProvider>)
      // opt out of the global toolbar decorator so it doesn't fight them.
      if (context.parameters?.selfThemed) {
        return <Story />;
      }

      const themeId = context.globals.theme || themes[0].id;
      const variant = context.globals.variant || "system";

      // Apply `<theme>-<variant>` when that combination exists; otherwise fall
      // back to the selected theme's first variant (its default mode/accent).
      const candidate = `${themeId}-${variant}`;
      const fallback = getThemeById(themeId)?.variants[0]?.id ?? candidate;
      const themeVariantId = getThemeVariantById(candidate) ? candidate : fallback;

      useEffect(() => {
        applyTheme(themeVariantId);
      }, [themeVariantId]);

      return <Story />;
    },
  ],
};

export default preview;
