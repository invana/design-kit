import { type ClassValue, clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * `text-*` is ambiguous — it is both the font-size scale and the text-colour
 * scale — so tailwind-merge decides which group a class belongs to by matching
 * its value against Tailwind's built-in size names. A size this kit adds is not
 * in that list, so it is read as a *colour* and silently drops whatever colour
 * class came before it:
 *
 *   cn("text-[var(--badge-ink)]", "text-meta")  →  "text-meta"   // colour lost
 *
 * Registering our own sizes in the `font-size` group is what stops that. Add
 * every future `--text-*` token from `@invana/styling` here in the same breath,
 * or it will eat colours at a distance and the cause will not be obvious.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["meta"] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
