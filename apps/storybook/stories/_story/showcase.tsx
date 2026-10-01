/// <reference types="vite/client" />
import * as React from 'react';
import { composeStories } from '@storybook/react-vite';
import { Button, SectionHeader } from '@invana/ui';

/** A story module as `import.meta.glob` hands it over: its meta, and its one story. */
export type StoryModule = Record<string, unknown> & { default: { title?: string } };

/**
 * Story chrome, not a kit component: every component of an area and its variants on one page.
 * It draws each `<Area>/Components/*` story itself — composed from its module, with that story's
 * own args and JSON — so the Showcase can never drift from the stories it gathers. A new
 * component's story appears here by existing.
 */
export function Showcase({ modules, root }: { modules: Record<string, StoryModule>; root: string }) {
  const sections = React.useMemo(
    () =>
      Object.values(modules)
        .map((mod) => {
          const title = mod.default.title ?? '';
          const [Story] = Object.values(composeStories(mod as Parameters<typeof composeStories>[0])) as Array<
            React.ComponentType & { id: string }
          >;
          return { title, name: title.slice(root.length + 1), Story };
        })
        .filter((s) => s.Story)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [modules, root],
  );

  return (
    <div className="flex flex-col gap-16">
      {sections.map(({ name, Story }) => (
        <section key={name} aria-label={name} data-showcase className="flex flex-col gap-4">
          <SectionHeader
            title={name}
            actions={
              <Button asChild size="xs" variant="ghost">
                <a href={`/?path=/story/${Story.id}`} target="_top">
                  Open story
                </a>
              </Button>
            }
          />
          <Story />
        </section>
      ))}
    </div>
  );
}
