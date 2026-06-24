import { useState } from 'react';
import type { StoryObj } from '@storybook/react-vite';
import {
  ThemeProvider,
  ThemeSettingsCard,
  ThemeSettingsActions,
  ThemeScope,
  type ThemeSelection,
} from '@invana/themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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
          '`ThemeSettingsCard` composes the theme · mode · accent fields into a `Card` with ' +
          'optional `header` / `footer` slots (ReactNode or `(state) => …` render-prop). Changes ' +
          'apply **live**; `save` locks the current selection as the new default and `reset` ' +
          'reverts to the pre-selection — both surfaced to the footer via `state`. With a ' +
          '`persist="manual"` provider, an unsaved preview is discarded on reload — only Save sticks. ' +
          'Drop in the ready-made `<ThemeSettingsActions>` or build your own buttons.',
      },
    },
  },
};

export default meta;

/** A block that reacts to the active theme + (scoped) accent. */
function Preview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading">Live preview</CardTitle>
        <CardDescription>
          Inside a <code>&lt;ThemeScope&gt;</code> — edits in the settings card apply here instantly.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button size="sm">Primary</Button>
          <Button size="sm" variant="secondary">Secondary</Button>
          <Button size="sm" variant="outline">Outline</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <a href="#" className="text-sm text-primary underline underline-offset-4">A themed link</a>
        </div>
      </CardContent>
    </Card>
  );
}

function Demo() {
  const [saved, setSaved] = useState<ThemeSelection | null>(null);

  return (
    // One provider shared by the settings card and the preview, so live edits
    // from the card recolour the preview. The card detects this provider.
    <ThemeProvider persist="manual">
      <div className="min-h-screen bg-background p-6 text-foreground">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <ThemeSettingsCard
            modeIcons={{ light: Sun, dark: Moon, system: Monitor }}
            onSave={setSaved}
            header={
              <>
                <CardTitle className="font-heading">Appearance</CardTitle>
                <CardDescription>Pick a theme, mode and accent. Save to set as default.</CardDescription>
              </>
            }
            // Render-prop footer: build your own chrome with the live state,
            // dropping in the ready-made Save / Reset actions.
            footer={(state) => (
              <div className="flex w-full items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  {state.isDirty ? 'Unsaved changes' : 'Saved'}
                </span>
                <ThemeSettingsActions state={state} />
              </div>
            )}
          />

          <div className="space-y-4">
            <ThemeScope>
              <Preview />
            </ThemeScope>
            <Card>
              <CardContent className="pt-6 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">onSave payload</p>
                <pre className="mt-2 overflow-auto rounded-md bg-muted p-3 text-xs">
                  {saved ? JSON.stringify(saved, null, 2) : '— click "Save as default" —'}
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export const ThemeSettingsCardStory: StoryObj = {
  name: 'Themes Settings Card',
  render: () => <Demo />,
};
