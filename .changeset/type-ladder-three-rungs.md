---
"@invana/styling": patch
"@invana/ui": patch
---

The type ladder is three rungs, and `text-sm` finally means small.

`--text-meta` is deleted. It was a fourth class name over a second size: `text-sm` was an alias of
`base` (both 13px) and `text-xs` an alias of `meta` (both 12px), so four names covered two sizes,
`text-sm` rendered the same pixels as `text-base`, and the one real step was a single pixel deep.
That is what made dense panels read as inconsistent — a label beside a value was a wobble, not a
ladder.

The scale is now `base 1rem` · `sm 0.923rem` · `xs 0.846rem` — **13 / 12 / 11** at the 13px root,
each still a ratio so the root stays the only dial. Default text declares no size and inherits the
root; `text-sm` is deliberately subordinate — a count, a timing, a row's subtitle — and `text-xs` is
genuinely small and rare.

**No pixel moved.** The migration was a 1:1 rename across the kit: `text-sm → text-base`, then
`text-meta → text-sm` and `text-xs → text-sm`. `PropertyList` and `LayerSection` render identically
before and after. `text-xs` is now a rung that was never available before — the 10.5px band the
artboards use had nothing to land on.

`cn` drops its `extendTailwindMerge` block. It existed only to register `meta` in the `font-size`
group; every name is a Tailwind built-in now, so the footgun where an unregistered `text-*` size was
read as a *colour* and silently dropped the colour class before it is gone with the token that
caused it.
