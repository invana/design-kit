import type { StoryObj } from '@storybook/react-vite';
import { ThemeProvider, ThemeSelector, ThemeScope } from '@invana/themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Separator,
} from '@invana/ui';

const meta = {
  title: 'Themes/Theme Selector',
  parameters: {
    layout: 'fullscreen',
    // This story owns its theme via <ThemeProvider> — opt out of the toolbar decorator.
    selfThemed: true,
    docs: {
      description: {
        component:
          'A reusable `ThemeSelector` (theme picker · light/dark/system toggle · accent ' +
          'swatches) from `@invana/themes`. Use `layout="inline"` in a header or `layout="form"` ' +
          'in a settings panel. The theme picker renders as `themeVariant="cards"` (every theme ' +
          'shown inline, like the mode toggle) or `themeVariant="select"` (compact dropdown) — ' +
          'both are demonstrated below. Inside a `<ThemeProvider>` it drives + persists the theme; ' +
          'the accent is scoped — wrap any subtree in `<ThemeScope>` to re-tint only that section.',
      },
    },
  },
};

export default meta;

/** A small block that reacts to the active theme + accent. */
function Preview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading">Live preview</CardTitle>
        <CardDescription>
          This card sits inside a <code>&lt;ThemeScope&gt;</code>, so the accent swatch re-tints it.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button size="sm">Primary</Button>
          <Button size="sm" variant="secondary">Secondary</Button>
          <Button size="sm" variant="outline">Outline</Button>
          <Button size="sm" variant="ghost">Ghost</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <a href="#" className="text-sm text-primary underline underline-offset-4">A themed link</a>
        </div>
      </CardContent>
      <CardFooter>
        <span className="text-sm text-muted-foreground">
          Focus rings, links and the primary button follow the accent.
        </span>
      </CardFooter>
    </Card>
  );
}

export const ThemeSelectorStory: StoryObj = {
  name: 'Theme Selector',
  render: () => (
    <ThemeProvider persist="manual">
      <div className="min-h-screen bg-background text-foreground">
        {/* Header bar — inline layout */}
        <header className="flex items-center justify-between border-b px-6 py-3">
          <span className="font-heading text-lg">Invana</span>
          {/* Icons are injected — the package never bundles an icon library. */}
          <ThemeSelector layout="inline" modeIcons={{ light: Sun, dark: Moon, system: Monitor }} />
        </header>

        <div className="mx-auto grid max-w-5xl gap-6 p-6 md:grid-cols-2">
          {/* Settings panel — form layout, both themeVariant options */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Appearance</CardTitle>
              <CardDescription>
                Settings-style stacked fields (<code>layout="form"</code>). Both
                {' '}<code>themeVariant</code> options drive the same provider state.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* themeVariant="cards" — every theme shown inline like the mode toggle */}
              <ThemeSelector
                layout="form"
                themeVariant="cards"
                showMode={false}
                showAccent={false}
                labels={{ theme: 'Theme — themeVariant="cards"' }}
              />
              {/* themeVariant="select" — compact RichSelect dropdown */}
              <ThemeSelector
                layout="form"
                themeVariant="select"
                showMode={false}
                showAccent={false}
                labels={{ theme: 'Theme — themeVariant="select"' }}
              />
              <Separator />
              {/* Mode + accent shown once (shared across the pickers above) */}
              <ThemeSelector
                layout="form"
                showTheme={false}
                modeIcons={{ light: Sun, dark: Moon, system: Monitor }}
              />
            </CardContent>
          </Card>

          {/* Scoped preview — only this subtree picks up the accent override */}
          <ThemeScope>
            <Preview />
          </ThemeScope>
        </div>

        <Separator />
        <p className="mx-auto max-w-5xl px-6 py-4 text-sm text-muted-foreground">
          The header selector and the settings form share the same provider state. Picking an
          accent recolours only the <strong>Live preview</strong> (wrapped in <code>ThemeScope</code>),
          leaving the rest of the page on the theme's own accent.
        </p>
      </div>
    </ThemeProvider>
  ),
};
