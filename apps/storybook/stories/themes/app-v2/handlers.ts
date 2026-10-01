import type { ShellHandlers } from '../shell';

/** What every AppV2 cell answers, on top of a shell's clicks and search. */
export interface V2Handlers extends ShellHandlers {
  /** A panel's tab changed — receives the tab's value. */
  onTabChange: (value: string) => void;
  /** A tree row or list item was picked — receives its label. */
  onSelect: (label: string) => void;
}
