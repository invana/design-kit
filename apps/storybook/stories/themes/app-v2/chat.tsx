/**
 * Story-only state holder: the "Chat" AppV2 cell — sessions on the left, a prompt over a canvas
 * in the middle, changes and files on the right. Kit components only, fed from
 * `fixtures/themes/app-v2.json`.
 */
import * as React from 'react';
import { AppLayoutV2 } from '@invana/themes/app-v2/layout';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  EmptyState,
  NavHorizontal,
  PanelBox,
  PanelContent,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  SectionHeader,
  StatusDot,
  TabbedPanel,
  TreeView,
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@invana/ui';
import { Switch, Textarea } from '@invana/forms';

import { ICONS, footerProps, navItems, railProps, type FooterData, type NavItemData } from '../shell';
import { ItemList, treeItems, type ItemData, type TreeData } from './body';
import type { V2Handlers } from './handlers';

export interface ChatData {
  caption: string;
  kind: 'chat';
  rail: { top: NavItemData[]; bottom: NavItemData[] };
  header: {
    home: NavItemData;
    project: string;
    tag: string;
    actions: NavItemData[];
    me: { name: string; avatar: string; initials: string };
  };
  sessions: {
    title: string;
    groups: { name: string; items: { title: string; meta: string; open?: boolean }[] }[];
    more: string;
    customizations: { title: string; items: ItemData[] };
  };
  context: { workspace: string; agent: string };
  composer: { placeholder: string; model: string; auto: string; attach: string };
  canvas: string;
  right: { changes: string; files: TreeData[] };
  footer: FooterData;
}

export function ChatShell({ v, on }: { v: ChatData; on: V2Handlers }) {
  const [prompt, setPrompt] = React.useState('');
  const [auto, setAuto] = React.useState(true);
  const Folder = ICONS.folder;
  const Sparkles = ICONS.sparkles;

  const sessions = (
    <PanelContent
      title={v.sessions.title}
      headerActions={[{ name: 'New session', label: 'New', icon: ICONS.plus, onClick: () => on.onClick('New session') }]}
    >
      {v.sessions.groups.map((g) => (
        <React.Fragment key={g.name}>
          <SectionHeader bare title={g.name} count={g.items.length} />
          <ItemGroup>
            {g.items.map((s) => (
              <Item key={s.title} size="sm" onClick={() => on.onSelect(s.title)}>
                <ItemMedia>
                  <StatusDot tone={s.open ? 'success' : 'muted'} />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{s.title}</ItemTitle>
                  <ItemDescription>{s.meta}</ItemDescription>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        </React.Fragment>
      ))}
      <Button variant="link" size="sm" onClick={() => on.onClick(v.sessions.more)}>
        {v.sessions.more}
      </Button>
      <SectionHeader bare title={v.sessions.customizations.title} />
      <ItemList items={v.sessions.customizations.items} onSelect={on.onSelect} />
    </PanelContent>
  );

  const canvas = (
    <PanelContent
      title={
        <>
          Working in{' '}
          <Badge variant="secondary">
            <Folder size={12} /> {v.context.workspace}
          </Badge>{' '}
          with{' '}
          <Badge variant="secondary">
            <Sparkles size={12} /> {v.context.agent}
          </Badge>
        </>
      }
    >
      <ResizablePanelGroup orientation="vertical">
        <ResizablePanel defaultSize={30} minSize={15}>
          <PanelBox>
            <Textarea
              placeholder={v.composer.placeholder}
              value={prompt}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => (setPrompt(e.target.value), on.onSearch(e.target.value))}
            />
            <NavHorizontal
              leftNavItems={[
                { name: 'Model', label: v.composer.model, icon: ICONS.sparkles, onClick: () => on.onClick('Model'), showSeperator: true },
                {
                  name: v.composer.auto,
                  icon: ICONS.wand,
                  label: (
                    <>
                      {v.composer.auto}{' '}
                      <Switch
                        aria-label={v.composer.auto}
                        checked={auto}
                        onCheckedChange={(c: boolean) => (setAuto(c), on.onClick(`${v.composer.auto}: ${c ? 'on' : 'off'}`))}
                      />
                    </>
                  ),
                },
              ]}
              rightNavItems={[{ name: v.composer.attach, label: v.composer.attach, icon: ICONS.camera, onClick: () => on.onClick(v.composer.attach) }]}
            />
          </PanelBox>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70} minSize={20}>
          <EmptyState title={v.canvas} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </PanelContent>
  );

  const right = (
    <TabbedPanel
      defaultTab="files"
      onTabChange={on.onTabChange}
      tabs={[
        { value: 'changes', label: 'Changes', icon: ICONS['git-branch'], content: <EmptyState title={v.right.changes} /> },
        { value: 'files', label: 'Files', icon: ICONS['list-tree'], content: <TreeView items={treeItems(v.right.files, on.onSelect)} /> },
      ]}
    />
  );

  return (
    <AppLayoutV2
      leftNav={railProps(v.rail, on.onClick)}
      header={{
        leftNavItems: navItems(
          [v.header.home, { name: v.header.project, label: v.header.project, static: true }],
          on.onClick,
        ),

        center: <Badge variant="outline">{v.header.tag}</Badge>,
        rightNavItems: navItems(v.header.actions, on.onClick),
        right: (
          <Avatar>
            <AvatarImage src={v.header.me.avatar} alt={v.header.me.name} />
            <AvatarFallback>{v.header.me.initials}</AvatarFallback>
          </Avatar>
        ),
      }}
      leftSection={{ content: sessions, defaultSize: '300px', minSize: '220px', maxSize: '480px' }}
      mainSection={{ content: canvas, minSize: '400px' }}
      rightSection={{ content: right, defaultSize: '280px', minSize: '200px', maxSize: '500px' }}
      footer={footerProps(v.footer, on)}
    />
  );
}
