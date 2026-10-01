/**
 * Story-only: what fills a panel of the AppV2 shells, as JSON → kit components. Each shape is
 * one kit component: a tree is `TreeView`, a list is `Item`s, an empty panel is `EmptyState`,
 * code is `Typography.Pre`, a terminal or a log is `Terminal`, history is `TimelineList`.
 */
import {
  Badge,
  EmptyState,
  Eyebrow,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  StatusIcon,
  Terminal,
  TerminalLine,
  TimelineEntry,
  TimelineList,
  TreeView,
  Typography,
  type TerminalLineKind,
  type TreeItem,
} from '@invana/ui';

import { ICONS } from '../shell';

export interface TreeData {
  id: string;
  label: string;
  icon?: string;
  children?: TreeData[];
}

export interface ItemData {
  title: string;
  description?: string;
  icon?: string;
  /** A state drawn as `StatusIcon` instead of an icon — a problem's severity. */
  status?: 'error' | 'alert';
  /** A short mark at the right: a file's git status, a count. */
  tag?: string;
}

export type Body =
  | { tree: TreeData[] }
  | { summary?: string; items: ItemData[] }
  | { empty: { title: string; description?: string } }
  | { code: string }
  | { terminal: { kind: TerminalLineKind; text: string }[] }
  | { log: { level: string; text: string }[] }
  | { timeline: { title: string; when: string }[] };

const iconOf = (name?: string) => {
  const Icon = name ? ICONS[name] : undefined;
  return Icon ? <Icon size={16} /> : undefined;
};

/** JSON tree → `TreeItem[]`, every row answering `onSelect` with its label. */
export function treeItems(nodes: TreeData[], onSelect: (label: string) => void): TreeItem[] {
  return nodes.map((n) => ({
    id: n.id,
    label: n.label,
    icon: iconOf(n.icon),
    onClick: () => onSelect(n.label),
    children: n.children ? treeItems(n.children, onSelect) : undefined,
  }));
}

export function ItemList({ items, onSelect }: { items: ItemData[]; onSelect?: (title: string) => void }) {
  return (
    <ItemGroup>
      {items.map((i) => (
        <Item key={i.title} size="sm" onClick={onSelect ? () => onSelect(i.title) : undefined}>
          {i.status || i.icon ? (
            <ItemMedia variant={i.status ? "default" : "icon"}>{i.status ? <StatusIcon state={i.status} /> : iconOf(i.icon)}</ItemMedia>
          ) : null}
          <ItemContent>
            <ItemTitle>{i.title}</ItemTitle>
            {i.description ? <ItemDescription>{i.description}</ItemDescription> : null}
          </ItemContent>
          {i.tag ? (
            <ItemActions>
              <Badge variant="outline">{i.tag}</Badge>
            </ItemActions>
          ) : null}
        </Item>
      ))}
    </ItemGroup>
  );
}

/** One panel's content, from JSON. `onSelect` receives the label of a tree row or list item. */
export function PanelBody({ body, onSelect }: { body: Body; onSelect: (label: string) => void }) {
  if ('tree' in body) return <TreeView items={treeItems(body.tree, onSelect)} />;
  if ('items' in body)
    return (
      <>
        {body.summary ? <Eyebrow>{body.summary}</Eyebrow> : null}
        <ItemList items={body.items} onSelect={onSelect} />
      </>
    );
  if ('empty' in body) return <EmptyState title={body.empty.title} description={body.empty.description} />;
  if ('code' in body)
    return (
      <Typography.Pre>
        <code>{body.code}</code>
      </Typography.Pre>
    );
  if ('terminal' in body)
    return (
      <Terminal cursor>
        {body.terminal.map((l, i) => (
          <TerminalLine key={i} kind={l.kind}>
            {l.text}
          </TerminalLine>
        ))}
      </Terminal>
    );
  if ('log' in body)
    return (
      <Terminal>
        {body.log.map((l, i) => (
          <TerminalLine key={i} level={l.level}>
            {l.text}
          </TerminalLine>
        ))}
      </Terminal>
    );
  return (
    <TimelineList variant="compact">
      {body.timeline.map((e) => (
        <TimelineEntry key={e.title} when={e.when} title={e.title} />
      ))}
    </TimelineList>
  );
}

/** A tab of a `TabbedPanel`, from JSON. */
export interface TabData {
  value: string;
  label: string;
  icon?: string;
  body: Body;
}

export function tabsOf(tabs: TabData[], onSelect: (label: string) => void) {
  return tabs.map((t) => ({
    value: t.value,
    label: t.label,
    icon: t.icon ? ICONS[t.icon] : undefined,
    content: <PanelBody body={t.body} onSelect={onSelect} />,
  }));
}

