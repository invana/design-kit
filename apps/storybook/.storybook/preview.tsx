import React, { useEffect } from "react";
import type { Preview } from "@storybook/react-vite";
import "../src/styles.css";
import {
  themes,
  applyTheme,
  getThemeById,
  getThemeVariantById,
} from "@invana/styling/themes";

// The "variant" axis carries two kinds of value:
//   • light / dark / system  — for the classic themes (Invana, Tailwind, Vite)
//   • an accent swatch id     — for the preset themes (Dark Gold, Dark Ocean, …)
// A single shared dropdown lists both; the decorator applies whichever combo
// actually exists and otherwise falls back to the theme's default variant.
const MODES = ["light", "dark", "system"];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Accent suffixes contributed by the preset themes, e.g. "gold", "ocean", …
const accentSuffixes = Array.from(
  new Set(
    themes.flatMap((t) =>
      t.variants
        .map((v) => (v.id.startsWith(`${t.id}-`) ? v.id.slice(t.id.length + 1) : ""))
        .filter((s) => s && !MODES.includes(s)),
    ),
  ),
);

const variantItems = [
  { value: "light", title: "Light", icon: "sun" },
  { value: "dark", title: "Dark", icon: "moon" },
  { value: "system", title: "System", icon: "circle" },
  ...accentSuffixes.map((accent) => ({
    value: accent,
    title: `Accent: ${cap(accent)}`,
    icon: "paintbrush",
  })),
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
      description: "Theme variant — mode (light/dark/system) or accent swatch",
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
