import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * `clsx` + `tailwind-merge`, and nothing else.
 *
 * This used to be an `extendTailwindMerge` that registered one class group.
 * `text-*` is ambiguous — it is both the font-size scale and the text-colour
 * scale — so tailwind-merge decides which group a class belongs to by matching
 * its value against Tailwind's built-in size names. `meta` was not one of them,
 * so `text-meta` was read as a *colour* and silently dropped whatever colour
 * class came before it:
 *
 *   cn("text-[var(--badge-ink)]", "text-meta")  →  "text-meta"   // colour lost
 *
 * The type ladder is now `base · sm · xs` (`@invana/styling`), every one of
 * them a Tailwind built-in, so there is nothing left to register and the
 * footgun is gone with the token that caused it. If a future `--text-*` token
 * invents a name Tailwind does not know, bring the `extend` back in the same
 * breath — it will eat colours at a distance and the cause will not be obvious.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
