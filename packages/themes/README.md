# @invana/themes

Application shells for Invana products — the header / sidebar / panel layouts, and the theme
provider that drives them.

```bash
pnpm add @invana/themes
```

Peer dependencies: `@invana/ui`, `@invana/styling`, `react`, `react-dom`.

## Styles

```ts
import '@invana/themes/styles.css';
```

Or compile the tokens yourself with Tailwind v4 — see
[`@invana/styling`](../styling/README.md) for the import order.

## Theme provider

`ThemeProvider` owns the theme id, the light/dark mode and the accent. It writes `data-theme`, the
`theme-<id>` class and `light`/`dark` onto `document.documentElement`, and in `system` mode it
follows `prefers-color-scheme`.

```tsx
import { ThemeProvider } from '@invana/themes';

<ThemeProvider defaultTheme="default" defaultMode="system">
  <App />
</ThemeProvider>;
```

Also in `core`: `ThemeScope` (a theme applied to a subtree rather than the document),
`ThemeSelector`, `ThemeSettingsCard` and `ThemeSettingsActions`.

The theme variants themselves — `default`, `tailwind`, `vite` — are defined in
`@invana/styling`'s `themes.config.ts`, which is the single source of truth.

## Layouts

Three shells, each self-contained and built from `@invana/ui` primitives:

| Export | Shape |
| --- | --- |
| `AppLayoutBase` | The plain header / main / footer shell. |
| `AppLayoutV1` | Header plus resizable side and bottom sections. |
| `AppLayoutV2` | Adds a left activity bar; omit `leftNav` and the workspace stretches full width. |

```tsx
import { AppLayoutV2 } from '@invana/themes';

<AppLayoutV2
  header={{ left: <Logo />, centerNavItems: navItems, rightNavItems: accountItems }}
  leftNav={{ topNavItems: activityItems, bottomNavItems: settingsItems }}
  mainSection={{ content: <Workspace /> }}
  rightSection={{ content: <Inspector />, defaultSize: '300px' }}
  bottomSection={{ content: <Console />, collapsible: true }}
/>;
```

Sections are resizable and collapsible, with sensible default sizes. `AppLayoutV2` derives its
panel ids from `useId()`, so nesting one shell inside another works without configuration — pass
`idPrefix` only when the ids must stay stable across mounts (a persisted layout, an e2e locator).

## License

MIT © Ravi Raja Merugu
