import * as React from 'react';
import { Badge, Button, Popover, PopoverContent, PopoverTrigger, Separator, Stack, StatusDot, TreeView, type TreeItem } from '@invana/ui';
import { ThemeSelector } from '@invana/themes';
import { GitBranch, ListTree, Monitor, Moon, Palette, Shapes, Sun } from 'lucide-react';

import { DATA } from './data';

/**
 * The studio's own chrome, story-only: the workflow stepper in the app header and the session
 * tree on the conversation's header, and the theme picker. The first two are not kit components
 * yet — see the coverage notes.
 */

/** Each stage is done once the work reaches this progress. */
const DONE_AT = [2, 3, 4, 5, 99];

export function WorkflowStepper({ progress, onPick }: { progress: number; onPick: (stage: number) => void }) {
  const current = progress < 2 ? 0 : progress < 3 ? 1 : progress < 4 ? 2 : progress < 5 ? 3 : 4;
  return (
    <Stack direction="row" gap="xs" aria-label="Workflow stages">
      {DATA.stages.map((label, i) => {
        const done = progress >= DONE_AT[i]!;
        return (
          <React.Fragment key={label}>
            {i ? <Separator orientation="horizontal" /> : null}
            <Button
              variant={i === current ? 'secondary' : 'ghost'}
              size="sm"
              aria-current={i === current ? 'step' : undefined}
              onClick={() => onPick(i)}
            >
              <StatusDot tone={done ? 'success' : i === current ? 'info' : 'queued'} />
              {label}
            </Button>
          </React.Fragment>
        );
      })}
    </Stack>
  );
}

export interface SessionNode {
  id: string;
  name: string;
  parent?: string;
  asks: number;
}

/** Every session as a tree — a branch under the session it came from. Picking one opens its canvas. */
export function SessionMenu({ sessions, current, onPick }: { sessions: SessionNode[]; current: string; onPick: (id: string) => void }) {
  const [open, setOpen] = React.useState(false);
  const childrenOf = (parent?: string): TreeItem[] =>
    sessions
      .filter((s) => s.parent === parent)
      .map((s) => ({
        id: s.id,
        label: `${s.name}${s.id === current ? ' · open' : ''} · ${s.asks} asks`,
        icon: s.parent ? <GitBranch /> : <Shapes />,
        isExpanded: true,
        onClick: () => {
          onPick(s.id);
          setOpen(false);
        },
        children: childrenOf(s.id),
      }));
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" aria-label="Sessions">
          <ListTree />
          Sessions
          <Badge tone="muted">{sessions.length}</Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <TreeView items={childrenOf(undefined)} header={<>Each canvas has its own session</>} />
      </PopoverContent>
    </Popover>
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
