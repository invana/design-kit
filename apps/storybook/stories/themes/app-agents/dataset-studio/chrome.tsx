import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  type StageTrailStep,
} from '@invana/ui';
import { ThemeSelector } from '@invana/themes';
import { ChevronDown, GitBranch, ListTree, Monitor, Moon, Palette, Plus, Shapes, Sun } from 'lucide-react';

import { DATA } from './data';

/**
 * The studio's own chrome, story-only: the stages for the header's trail, the session menu on
 * the conversation's header, and the theme picker.
 */

/** Each stage is done once the work reaches this progress. */
const DONE_AT = [2, 3, 4, 5, 99];

/** The workflow's stages, for the header's `StageTrail`: each one's id is its index. */
export function stagesOf(progress: number): StageTrailStep[] {
  const current = progress < 2 ? 0 : progress < 3 ? 1 : progress < 4 ? 2 : progress < 5 ? 3 : 4;
  return DATA.stages.map((label, i) => ({
    id: String(i),
    label,
    state: i === current ? 'current' : progress >= DONE_AT[i]! ? 'done' : 'todo',
  }));
}

export interface SessionNode {
  id: string;
  name: string;
  parent?: string;
  asks: number;
}

/**
 * The session switcher: every session — a branch, marked so, after the one it came from — and what
 * makes a new one: branch this session, or start a blank canvas. Picking one opens its canvas.
 */
export function SessionMenu({
  sessions,
  current,
  onPick,
  onBranch,
  onNew,
}: {
  sessions: SessionNode[];
  current: string;
  onPick: (id: string) => void;
  onBranch: () => void;
  onNew: () => void;
}) {
  // Parents first, each followed by its branches.
  const ordered = (parent?: string): SessionNode[] =>
    sessions.filter((s) => s.parent === parent).flatMap((s) => [s, ...ordered(s.id)]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label="Sessions" title="Sessions">
          <ListTree />
          {sessions.length}
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Each canvas has its own session</DropdownMenuLabel>
        {ordered(undefined).map((s) => (
          <DropdownMenuCheckboxItem key={s.id} checked={s.id === current} onSelect={() => onPick(s.id)}>
            {s.parent ? <GitBranch /> : <Shapes />}
            {s.name} · {s.asks} asks
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onBranch}>
          <GitBranch />
          Branch this session
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onNew}>
          <Plus />
          New canvas
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const MODE_ICONS = { light: Sun, dark: Moon, system: Monitor };

/** The header theme picker, as the Explorer ships it: themes and light / dark / system. It drives the story's own `ThemeProvider`. */
export function ThemeMenu() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Theme" title="Theme & appearance">
          <Palette />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <ThemeSelector layout="form" showAccent={false} modeIcons={MODE_ICONS} />
      </PopoverContent>
    </Popover>
  );
}
