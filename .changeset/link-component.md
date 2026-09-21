---
"@invana/ui": patch
---

A link is a component now.

Every surface was writing its own — `text-primary hover:underline` here, `text-muted-foreground
hover:underline` there, `underline underline-offset-4` somewhere else — which is four spellings of
one object and a colour that drifts the day the accent moves.

`Link` has three variants, because three is what the product actually uses: `default` for a link
inside a sentence, `underlined` for one that must read as a link before the cursor arrives, and
`quiet` for a footer link or a navigable row. `external` sets `target` and `rel` together, because
the pair is what is correct and half of it is a security bug nobody notices.

Deliberately not a `Button` variant: a button acts on this page, a link goes somewhere, and a
`<button>` styled as a link takes away middle-click, copy-address and open-in-a-tab.
