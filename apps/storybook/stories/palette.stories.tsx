import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, Separator } from '@invana/ui';
import { themes, getThemeVariantById } from '@invana/styling/themes';
import React, { useEffect, useState } from 'react';
import { ThemeControls, useThemeControls } from '../src';

export default {
  title: 'ColorPalette',
  parameters: {
    layout: 'fullscreen',
  },
};


const ColorSwatch = ({ name, cssVar, description, themeKey, containerRef, accentKey }: { name: string; cssVar: string; description: string; themeKey?: string; containerRef?: React.RefObject<HTMLDivElement>; accentKey?: string }) => {
  const [color, setColor] = useState('');
  const swatchRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Get the computed color value from CSS variables
    // Use the container ref if provided (to get inline style overrides), otherwise use root
    const element = containerRef?.current || swatchRef.current || document.documentElement;
    const value = getComputedStyle(element).getPropertyValue(cssVar).trim();
    if (value) {
      // If it's HSL values without 'hsl()', wrap it
      const colorValue = value.includes('hsl') ? value : `hsl(${value})`;
      setColor(colorValue);
    }
  }, [cssVar, themeKey, containerRef, accentKey]); // Re-run when theme or accent changes

  return (
    <div className="space-y-2" ref={swatchRef}>
      <div
        className="w-full h-20 rounded-lg border border-border block"
        style={{ backgroundColor: color }}
      />
      <div>
        <p className="font-semibold text-sm text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground font-mono">{cssVar}</p>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
};

const colorGroups = [
  {
    title: 'Core Colors',
    colors: [
      { name: 'Background', cssVar: '--background', description: 'Main background color' },
      { name: 'Foreground', cssVar: '--foreground', description: 'Primary text color' },
      { name: 'Card', cssVar: '--card', description: 'Card background' },
      { name: 'Card Foreground', cssVar: '--card-foreground', description: 'Card text color' },
      { name: 'Muted', cssVar: '--muted', description: 'Muted background' },
      { name: 'Muted Foreground', cssVar: '--muted-foreground', description: 'Muted text color' },
    ],
  },
  {
    title: 'Interactive Colors',
    colors: [
      { name: 'Primary', cssVar: '--primary', description: 'Primary action color' },
      { name: 'Primary Foreground', cssVar: '--primary-foreground', description: 'Text on primary' },
      { name: 'Secondary', cssVar: '--secondary', description: 'Secondary action color' },
      { name: 'Secondary Foreground', cssVar: '--secondary-foreground', description: 'Text on secondary' },
      { name: 'Accent', cssVar: '--accent', description: 'Accent color for highlights' },
      { name: 'Accent Foreground', cssVar: '--accent-foreground', description: 'Text on accent' },
    ],
  },
  {
    title: 'Feedback & Utility',
    colors: [
      { name: 'Destructive', cssVar: '--destructive', description: 'Error/destructive color' },
      { name: 'Destructive Foreground', cssVar: '--destructive-foreground', description: 'Text on destructive' },
      { name: 'Border', cssVar: '--border', description: 'Border color' },
      { name: 'Input', cssVar: '--input', description: 'Input border color' },
      { name: 'Ring', cssVar: '--ring', description: 'Focus ring color' },
    ],
  },
];

export const ColorPalette: StoryObj = {
  render: (args, context) => {
    const [currentThemeId, setCurrentThemeId] = useState<string>('');
    const [debugInfo, setDebugInfo] = useState<string>('');
    const containerRef = React.useRef<HTMLDivElement>(null);
    
    // Use the theme controls hook to get accent styles and state
    const { 
      accentStyles, 
      currentAccent,
      currentTheme,
      setCurrentTheme,
      setCurrentAccent,
      isDarkMode,
      setIsDarkMode,
    } = useThemeControls(
      context.globals.theme,
      context.globals.variant
    );
    
    useEffect(() => {
      const themeId = context.globals.theme || themes[0].id;
      const variant = context.globals.variant || 'light';
      const themeVariantId = `${themeId}-${variant}`;
      setCurrentThemeId(themeVariantId);
      
      // Debug: Check what's set on the root element
      const root = document.documentElement;
      const dataTheme = root.getAttribute('data-theme');
      const bgColor = getComputedStyle(root).getPropertyValue('--background').trim();
      setDebugInfo(`data-theme: ${dataTheme}, --background: ${bgColor}`);
    }, [context.globals.theme, context.globals.variant]);

    const themeInfo = currentThemeId ? getThemeVariantById(currentThemeId) : null;

    return (
      <div className="p-8" style={accentStyles} ref={containerRef}>
        {/* Theme Controls Header */}
        <div className="sticky top-0 z-50 backdrop-blur -mx-8 -mt-8 px-8 py-4 mb-8 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Color Palette</h2>
              {themeInfo && (
                <>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                    <span>Current Theme:</span>
                    <Badge variant="secondary" className="font-semibold">
                      {themeInfo.theme.name}
                    </Badge>
                    <Badge variant="outline">
                      {themeInfo.variant.mode === 'light' ? '☀️ Light' : '🌙 Dark'}
                    </Badge>
                    <span className="text-xs">({currentThemeId})</span>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    Debug: {debugInfo}
                  </div>
                </>
              )}
            </div>
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
          </div>
        </div>

        {colorGroups.map((group) => (
          <section key={group.title} className="mb-10">
            <h3 className="text-xl font-semibold mb-4">{group.title}</h3>
            <Separator className="mb-6" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
};
