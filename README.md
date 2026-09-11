# @invana/styling

Invana's reusable TailwindCSS 4 design system. This package provides a consistent set of design tokens, theme configuration, and base styles that can be used across all Invana projects.

## Installation

This expects tailwindcss 4

```bash
npm install @invana/styling
# or
pnpm add @invana/styling
# or
yarn add @invana/styling
```

## Usage

### In CSS Files

Import the complete stylesheet with theme and base styles:

```css
/* 1. Import Tailwind first */
@import "tailwindcss";

/* 2. Define YOUR app's source paths */
@source "./components/**/*.{js,ts,jsx,tsx}";
@source "./pages/**/*.{js,ts,jsx,tsx}";

/* 3. Import the shared theme */
@import "@invana/styling/index.css";

```

Or import specific parts:

```css
/* 1. Import Tailwind first */
@import "tailwindcss";

/* 2. Define YOUR app's source paths */
@source "./components/**/*.{js,ts,jsx,tsx}";
@source "./pages/**/*.{js,ts,jsx,tsx}";

/* 3. Import the shared theme */
@import "@invana/styling/index.css";
/* Import just the theme */
@import "@invana/styling/theme";

/* Import just the base styles */
@import "@invana/styling/base";
```

### In React/Vite Projects

```tsx
// In your main entry file (e.g., main.tsx or App.tsx)
import "@invana/styling";
```

### In the Monorepo

This package is already set up for use within this monorepo. Simply import it in your CSS files:

```css
/* In your globals.css or main CSS file */
@import "@invana/styling";
```

## Features

- 🎨 **Design Tokens**: Consistent color palette with semantic naming
- 🌓 **Dark Mode**: Automatic dark mode support via `prefers-color-scheme`
- 📦 **Modular**: Import only what you need
- 🎯 **TailwindCSS v4**: Built with the latest TailwindCSS features using `@theme` directive
- 🔧 **Customizable**: Easy to extend and override
- 📱 **Responsive**: Container configuration with responsive breakpoints

## Design Tokens

### Colors

All colors follow the CSS variable pattern and can be used with TailwindCSS utilities:

- `background`, `foreground` - Main background and text colors
- `primary`, `primary-foreground` - Primary brand colors
- `secondary`, `secondary-foreground` - Secondary UI elements
- `destructive`, `destructive-foreground` - Error and dangerous actions
- `muted`, `muted-foreground` - Muted/subdued content
- `accent`, `accent-foreground` - Accent highlights
- `popover`, `popover-foreground` - Popover/dropdown backgrounds
- `card`, `card-foreground` - Card component colors
- `border`, `input`, `ring` - Border and input styling

### Border Radius

- `--radius`: Base radius (0.5rem)
- `--radius-lg`: Large radius
- `--radius-md`: Medium radius
- `--radius-sm`: Small radius

### Animations

- `accordion-down`: Accordion expand animation
- `accordion-up`: Accordion collapse animation

### Container

- Centered by default
- 2rem padding
- Max width of 1400px on 2xl screens

## Customization

You can override any variable by defining it after importing:

```css
@import "@invana/styling";

@theme {
  --color-primary: hsl(270 100% 50%); /* Override primary color */
  --radius: 1rem; /* Increase border radius */
}
```

## Publishing to NPM

```bash
# Make sure you're logged in to npm
npm login

# Publish the package
cd packages/styling
npm publish
```

### Updating Versions

```bash
# Update version in package.json
cd packages/styling

# For patch update (0.1.0 -> 0.1.1)
npm version patch

# For minor update (0.1.0 -> 0.2.0)
npm version minor

# For major update (0.1.0 -> 1.0.0)
npm version major

# Then publish
npm publish
```

## Development

This package ships source CSS files directly. Your build tool (Vite, Next.js, etc.) will process the TailwindCSS directives automatically if you have TailwindCSS v4 installed.

## License

MIT © Ravi Raja Merugu

.