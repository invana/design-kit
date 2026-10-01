import { type ClassValue, clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * `clsx` + `tailwind-merge`, with the control heights registered.
 *
 * tailwind-merge decides which group a class belongs to by matching its value
 * against Tailwind's built-in names. The control heights (`h-control-sm`,
 * `size-control-xs`, … from `--spacing-control-*` in `@invana/styling`) are
 * not built-ins, so unregistered it keeps both sides of a conflict:
 *
 *   cn("h-control-sm", "h-8")  →  "h-control-sm h-8"   // whichever CSS wins
 *
 * Registering them as spacing values puts them in every spacing group, so the
 * later class wins as it does for any other height.
 *
 * The type ladder needs nothing here: `base · sm · xs` are all Tailwind
 * built-ins. If a future `--text-*` token invents a name Tailwind does not
 * know, register it in the same breath — `text-*` is both size and colour, and
 * an unknown size is read as a colour that silently drops the one before it.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: ["control-xs", "control-sm", "control-md", "control-lg"],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
