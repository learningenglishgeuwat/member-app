# CSS Architecture Overview

## Visual Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                         app/globals.css                         │
│                       (Main Entry Point)                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │  @import chain starts   │
                └────────────┬────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌───────▼────────┐
│  Tailwind CSS  │  │   Base Styles   │  │    Layouts     │
│                │  │                 │  │                │
│ • base         │  │ • variables.css │  │ • auth         │
│ • components   │  │ • typography    │  │ • dashboard    │
│ • utilities    │  │ • scrollbar     │  │ • skill        │
└────────────────┘  └─────────────────┘  │ • pronunciation│
                                         └────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌───────▼────────┐
│     Themes     │  │   Components    │  │   Utilities    │
│                │  │                 │  │                │
│ • neon.css     │  │ • buttons       │  │ • effects      │
│ • pronunciation│  │ • cards         │  │ • responsive   │
│   - _base      │  │ • tables        │  └────────────────┘
│   - alphabet   │  └─────────────────┘
│   - stressing  │
│   - intonation │
│   - final-sound│
│   - american-t │
│   - text       │
│   - reading    │
└────────────────┘
```

## Import Dependency Flow

```
globals.css
    │
    ├─> Tailwind (base, components, utilities)
    │
    ├─> base/variables.css
    │   └─> Defines: --font-*, --color-*, --font-size-*
    │
    ├─> base/typography.css
    │   └─> Uses: var(--font-display), var(--font-ui)
    │
    ├─> layouts/*.css
    │   └─> Defines: .auth-layout, .dashboard-layout, etc.
    │
    ├─> themes/pronunciation/_base.css
    │   └─> Defines: .pronunciation-theme with --pronun-* variables
    │
    ├─> themes/pronunciation/[specific].css
    │   └─> Overrides: --pronun-accent-1-rgb, --pronun-accent-2-rgb
    │
    ├─> themes/neon.css
    │   └─> Defines: .text-neon-*, .bg-neon-*, animations
    │
    ├─> components/*.css
    │   └─> Uses: var(--pronun-*) variables from themes
    │
    └─> utilities/*.css
        └─> Cross-cutting concerns: effects, responsive
```

## CSS Variable Cascade

```
Root Level (variables.css)
└─> --font-ipa, --font-ui, --color-*, --font-size-*
    │
    └─> Layout Classes (.auth-layout, .dashboard-layout, etc.)
        │
        └─> Base Theme (.pronunciation-theme)
            │
            └─> Specific Theme (.pronunciation-theme--alphabet)
                │
                └─> Component Classes (.play-btn-base, .prompt-card-base)
```

## File Size Distribution

```
variables.css      ████░░░░░░ (30 lines)   - Design tokens
typography.css     ████████░░ (60 lines)   - Font rules
scrollbar.css      ███░░░░░░░ (40 lines)   - Scrollbar styles
layouts/*.css      ████░░░░░░ (15 lines each) - Page layouts
_base.css          ████████████████ (120 lines) - Shared pronunciation
[theme].css        ██░░░░░░░░ (15 lines each) - Theme variants
buttons.css        ███████░░░ (50 lines)   - Button components
cards.css          ████░░░░░░ (30 lines)   - Card components
tables.css         █████░░░░░ (35 lines)   - Table components
effects.css        ████████████ (90 lines) - Visual effects
responsive.css     ████████████ (90 lines) - Mobile overrides
neon.css           ████████████████ (150 lines) - Neon theme
```

## Usage Patterns

### Pattern 1: Full App Style (Layout)

```tsx
// app/layout.tsx
import "./globals.css"
import "./styles/base/scrollbar.css"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
```

All styles loaded globally via `globals.css` import chain.

### Pattern 2: Page Layout Class

```tsx
// app/skill/page.tsx
export default function SkillPage() {
  return (
    <div className="skill-layout">
      {/* Uses .skill-layout from layouts/skill-layout.css */}
      <main>Content</main>
    </div>
  )
}
```

### Pattern 3: Theme Composition

```tsx
// app/skill/pronunciation/alphabet/page.tsx
export default function AlphabetPage() {
  return (
    <div className="pronunciation-layout pronunciation-theme pronunciation-theme--alphabet">
      {/* Combines 3 classes:
          1. .pronunciation-layout (base layout)
          2. .pronunciation-theme (base theme)
          3. .pronunciation-theme--alphabet (specific theme)
      */}
      <main>Content</main>
    </div>
  )
}
```

### Pattern 4: Component Utility Classes

```tsx
// Any pronunciation component
export default function PlayButton() {
  return (
    <button className="play-btn-base">
      <div className="play-icon-triangle" />
    </button>
  )
}
```

### Pattern 5: Neon Theme (Skill Selection)

```tsx
// app/skill/page.tsx
import './styles/neon.css' // If not already in globals

export default function SkillSelection() {
  return (
    <div className="skill-layout">
      <h1 className="text-neon-cyan font-neon">Skills</h1>
      <div className="bg-tech-grid tech-scanline">
        <button className="border-neon-purple shadow-neon-purple">
          Select
        </button>
      </div>
    </div>
  )
}
```

## Theme System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Pronunciation Theme System               │
└─────────────────────────────────────────────────────────────┘

Base Theme (_base.css)
├─> --pronun-text: rgba(255, 255, 255, 0.96)
├─> --pronun-muted: rgba(255, 255, 255, 0.78)
├─> --pronun-surface-rgb: 0 0 0
├─> --pronun-panel-rgb: 0 0 0
├─> --pronun-accent-1-rgb: 168 85 247  (default purple)
└─> --pronun-accent-2-rgb: 217 70 239  (default purple)

Specific Themes Override Accent Colors:
├─> alphabet.css:      29 78 216 / 59 130 246   (blue)
├─> stressing.css:     249 115 22 / 251 146 60  (orange)
├─> intonation.css:    236 72 153 / 225 29 72   (pink)
├─> final-sound.css:   163 230 53 / 132 204 22  (lime)
├─> american-t.css:    11 74 166 / 0 40 104     (dark blue)
├─> text.css:          100 116 139 / 148 163 184 (slate)
└─> reading-text.css:  51 65 85 / 71 85 105     (dark slate)

Components use rgb() with these variables:
└─> border-color: rgb(var(--pronun-accent-1-rgb) / 0.38)
└─> background: rgb(var(--pronun-accent-2-rgb) / 0.15)
└─> box-shadow: rgb(var(--pronun-accent-1-rgb) / 0.25)
```

## Responsive Strategy

```
Desktop (Default)
└─> Full font sizes (0.88rem UI, 1rem display)
    │
    └─> Mobile (@media max-width: 768px)
        ├─> Global font override (0.75rem)
        ├─> Component-specific overrides (responsive.css)
        │   ├─> Grammar accordions: 0.82rem
        │   ├─> Examples/explanations: 0.80rem
        │   └─> Safeguards: .alphabet-letter stays 3.75rem
        └─> Mobile-specific padding/spacing adjustments
```

## Performance Optimizations

```
✅ Optimizations Applied:
├─> Backdrop blur disabled globally (low-spec devices)
├─> CSS @import resolved at build time (no runtime cost)
├─> Aggressive font size reduction on mobile
├─> Minimal CSS specificity (easy to override)
└─> No inline styles (cacheable CSS)

❌ Future Optimizations (Optional):
├─> Critical CSS extraction
├─> CSS tree-shaking (remove unused styles)
├─> CSS modules for per-page splitting
└─> PurgeCSS for production builds
```

## Migration Path

```
Current State:
├─> globals.css (new, organized imports)
└─> Old CSS files (100+ scattered files) - PRESERVED

Gradual Migration:
├─> Update imports as you touch files
├─> Test each change
└─> Remove old files when all imports updated

End State:
├─> app/styles/ (organized structure)
├─> Page-specific CSS (if needed)
└─> Old files deleted
```

## Naming Conventions

### BEM-inspired but simplified:

```
Block:              .play-btn-base
Element:            .play-icon-triangle
Modifier:           .pronunciation-theme--alphabet

Layout:             .skill-layout
Theme:              .pronunciation-theme
State:              .is-active (avoid, use Tailwind)
Utility:            .text-neon-cyan

Namespace prefixes:
- pronun-   Pronunciation variables
- neon-     Neon theme
- geuwat-   App-specific utilities
```

## Testing Checklist

When adding new styles:

```
✅ Variables defined in variables.css?
✅ Component styles reusable?
✅ Mobile responsive tested?
✅ Theme variables used correctly?
✅ No !important unless necessary?
✅ Documented in README?
✅ TypeScript still compiles?
✅ No breaking changes?
```

## Common Patterns

### Adding a New Pronunciation Theme:

1. Create `app/styles/themes/pronunciation/new-theme.css`
2. Define accent RGB values:
   ```css
   .pronunciation-theme--new-theme {
     --pronun-accent-1-rgb: [R G B];
     --pronun-accent-2-rgb: [R G B];
   }
   ```
3. Add @import to `globals.css`
4. Apply class: `className="pronunciation-layout pronunciation-theme pronunciation-theme--new-theme"`

### Adding a New Component Style:

1. Create `app/styles/components/new-component.css`
2. Use CSS variables for theming:
   ```css
   .my-component {
     border: 1px solid rgb(var(--pronun-accent-1-rgb) / 0.5);
     background: rgb(var(--pronun-panel-rgb) / 0.9);
   }
   ```
3. Add @import to `globals.css`
4. Document in README

### Adding a New Layout:

1. Create `app/styles/layouts/new-layout.css`
2. Define with Tailwind utilities:
   ```css
   .new-layout {
     @apply min-h-screen bg-black text-white;
   }
   ```
3. Add @import to `globals.css`
4. Apply to page root element

---

**Last Updated:** 2026
**Maintained By:** Development Team
**Questions?** See `README.md` or ask the team.
