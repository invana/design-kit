---
"@invana/ui": patch
"@invana/themes": patch
---

`styles.css` no longer ships Tailwind utilities, so an app's responsive and state variants (`lg:block`, `hover:…`) beat the kit's base classes. Apps compile the kit's classes themselves: `@source` the `@invana/ui` and `@invana/themes` dist. `@invana/themes` imports `cn` from `@invana/ui`, so production builds no longer fail on the unexported `@invana/ui/lib/utils`.
