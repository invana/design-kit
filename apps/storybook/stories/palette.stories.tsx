import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Badge, SectionHeader, Typography } from '@invana/ui';
import { themes, getThemeVariantById } from '@invana/styling/themes';
import React, { useEffect, useState } from 'react';
import { ThemeControls, useThemeControls } from '../src';

import GROUPS from '../fixtures/others/palette.json';

interface Swatch {
  name: string;
  cssVar: string;
  description: string;
}

const meta = {
  title: 'Palette',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The resolved value of a token on `element`, as a colour the swatch can paint. */
function resolve(element: Element, cssVar: string) {
  // Prefer the `--color-*` token: every theme defines it as a complete colour value
  // (hsl(…) for classic themes, #hex for the presets). The raw `--<name>` HSL triple
  // only exists on the classic themes, so reading it leaves preset swatches blank.
  const colorVar = cssVar.startsWith('--color-') ? cssVar : cssVar.replace(/^--/, '--color-');
  const value = getComputedStyle(element).getPropertyValue(colorVar).trim();
  if (value) return value;
  const raw = getComputedStyle(element).getPropertyValue(cssVar).trim();
  return raw && !/^(#|rgb|hsl|oklch)/.test(raw) ? `hsl(${raw})` : raw;
}

function ColorSwatch({
  name,
  cssVar,
  description,
  themeKey,
  containerRef,
  accentKey,
}: Swatch & {
  themeKey?: string;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  accentKey?: string | null;
}) {
  const [color, setColor] = useState('');

  useEffect(() => {
    // Read from the container so its inline accent overrides apply.
    setColor(resolve(containerRef?.current ?? document.documentElement, cssVar));
  }, [cssVar, themeKey, containerRef, accentKey]);

  return (
    <figure>
      {/* Kit gap: no colour-swatch component — a filled box painted from a token's value. */}
      <div className="h-20 w-full rounded-lg border border-border" style={{ backgroundColor: color }} />
      <figcaption>
        <Typography.Large>{name}</Typography.Large>
        <Typography.Code>{cssVar}</Typography.Code>
        <Typography.Muted>{description}</Typography.Muted>
      </figcaption>
    </figure>
  );
}

/**
 * Every colour token of the active theme, painted from its computed value — so switching the
 * theme, mode or accent (toolbar or the controls here) repaints each swatch. Groups and tokens
 * are in `fixtures/others/palette.json`.
 */
export const Palette: Story = {
  render: function Render(_args, context) {
    const [currentThemeId, setCurrentThemeId] = useState<string>('');
    const containerRef = React.useRef<HTMLDivElement>(null);

    const { accentStyles, currentAccent, currentTheme, setCurrentTheme, setCurrentAccent, isDarkMode, setIsDarkMode } =
      useThemeControls(context.globals.theme, context.globals.variant);

    useEffect(() => {
      const themeId = context.globals.theme || themes[0].id;
      const variant = context.globals.variant || 'light';
      setCurrentThemeId(`${themeId}-${variant}`);
    }, [context.globals.theme, context.globals.variant]);

    const themeInfo = currentThemeId ? getThemeVariantById(currentThemeId) : null;

    return (
      // Kit gap: no page/stack layout primitive — padding and vertical rhythm are classes.
      <div className="flex flex-col gap-8 p-8" style={accentStyles} ref={containerRef}>
        <SectionHeader
          title="Color Palette"
          count={
            themeInfo ? (
              <>
                <Badge variant="secondary">{themeInfo.theme.name}</Badge>{' '}
                <Badge variant="outline">{themeInfo.variant.mode === 'light' ? 'Light' : 'Dark'}</Badge>{' '}
                {currentThemeId}
              </>
            ) : null
          }
          actions={
            <ThemeControls
              storybookTheme={context.globals.theme}
              storybookVariant={context.globals.variant}
              currentTheme={currentTheme}
              currentAccent={currentAccent}
              isDarkMode={isDarkMode}
              onThemeChange={setCurrentTheme}
              onAccentChange={setCurrentAccent}
              onModeChange={setIsDarkMode}
            />
          }
        />

        {(GROUPS as { title: string; colors: Swatch[] }[]).map((group) => (
          <section key={group.title} aria-label={group.title} className="flex flex-col gap-6">
            <SectionHeader title={group.title} count={group.colors.length} />
            {/* Kit gap: no responsive grid primitive for a gallery of cards. */}
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
              {group.colors.map((color) => (
                <ColorSwatch
                  key={`${color.cssVar}-${currentAccent}`}
                  {...color}
                  themeKey={currentThemeId}
                  containerRef={containerRef}
                  accentKey={currentAccent}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const group of GROUPS) {
      const section = canvas.getByRole('region', { name: group.title });
      await expect(within(section).getByText(group.title)).toBeInTheDocument();
      await expect(within(section).getAllByRole('figure')).toHaveLength(group.colors.length);
    }
  },
};
