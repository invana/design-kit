---
"@invana/forms": minor
---

Add a password field with a built-in show/hide toggle.

- New `PasswordInput` component (exported from `@invana/forms`) — wraps `Input` with an eye / eye-off button that flips the field between `password` and `text`. Visibility is self-managed by default, with optional controlled `visible` / `onVisibleChange` props.
- New `password` `FieldType` plus a `PasswordField` renderer, exported and available on `Field.Password` and `FormField.Password`, so password fields can be declared in `ObjectField` configs.
