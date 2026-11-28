---
"@invana/forms": patch
---

A `text` or `password` field takes `autoComplete`, the token its input hands the browser (`username`, `current-password`), so a generated sign-in form keeps password-manager autofill.

It also re-exports `useForm`, so an app builds its form with the same `react-hook-form` the generators read.
