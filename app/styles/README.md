# Styles Organization

Struktur ini mengorganisir CSS dengan prinsip **separation of concerns** dan **scalability**.

## Struktur Folder

```
app/styles/
├── base/              # Base styles & design tokens
│   ├── variables.css  # CSS custom properties (design tokens)
│   ├── typography.css # Font rules & text styles
│   └── scrollbar.css  # Scrollbar utilities
├── layouts/           # Page layout styles
│   ├── auth-layout.css
│   ├── dashboard-layout.css
│   ├── skill-layout.css
│   └── pronunciation-layout.css
├── themes/            # Theme variations
│   ├── neon.css       # Neon cyberpunk theme
│   └── pronunciation/ # Pronunciation-specific themes
│       ├── _base.css
│       ├── alphabet.css
│       ├── stressing.css
│       ├── intonation.css
│       ├── final-sound.css
│       ├── american-t.css
│       ├── text.css
│       └── reading-text.css
├── components/        # Reusable component styles
│   ├── buttons.css
│   ├── cards.css
│   └── tables.css
└── utilities/         # Utility classes & effects
    ├── effects.css    # Visual effects (sweep, hover)
    └── responsive.css # Mobile overrides
```

## Import Strategy

### Global Import (app/globals.css)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Base Styles */
@import './styles/base/variables.css';
@import './styles/base/typography.css';

/* Layouts */
@import './styles/layouts/auth-layout.css';
@import './styles/layouts/dashboard-layout.css';
/* ... */

/* Themes */
@import './styles/themes/pronunciation/_base.css';
/* ... */

/* Components */
@import './styles/components/buttons.css';
/* ... */

/* Utilities */
@import './styles/utilities/effects.css';
@import './styles/utilities/responsive.css';
```

### Page-Specific Import (Optional)
Jika suatu halaman membutuhkan theme khusus yang tidak perlu di-load global:

```tsx
// app/skill/pronunciation/alphabet/page.tsx
import '@/app/styles/themes/pronunciation/alphabet.css'
```

## CSS Variables

### Design Tokens (variables.css)
```css
--font-ipa: sans-serif;
--font-ui: var(--font-noto);
--color-ipa: #06b6d4;
--app-page-bg: #000000;
--app-page-fg: rgb(226 232 240);
--font-size-ui: 0.88rem;
--font-size-display: 1rem;
--font-size-ipa: 0.85rem;
```

### Pronunciation Theme Variables
```css
--pronun-text: rgba(255, 255, 255, 0.96);
--pronun-muted: rgba(255, 255, 255, 0.78);
--pronun-surface-rgb: 0 0 0;
--pronun-panel-rgb: 0 0 0;
--pronun-accent-1-rgb: [varies per theme];
--pronun-accent-2-rgb: [varies per theme];
```

## Utility Classes

### Layout Classes
- `.auth-layout` - Login, signup, password reset pages
- `.dashboard-layout` - Dashboard page
- `.skill-layout` - Skill selection & skill pages
- `.pronunciation-layout` - Pronunciation pages base

### Pronunciation Theme Classes
- `.pronunciation-theme` - Base pronunciation theme
- `.pronunciation-theme--alphabet` - Alphabet sub-theme
- `.pronunciation-theme--stressing` - Stressing sub-theme
- `.pronunciation-theme--intonation` - Intonation sub-theme
- `.pronunciation-theme--final-sound` - Final sound sub-theme
- `.pronunciation-theme--american-t` - American T sub-theme
- `.pronunciation-theme--text` - Text sub-theme
- `.pronunciation-theme--reading-text` - Reading text sub-theme

### Component Classes
- `.play-btn-base` - Reusable play button
- `.play-icon-triangle` - Play icon
- `.prompt-card-base` - Prompt card container
- `.prompt-card-header` - Card header
- `.prompt-card-title` - Card title
- `.prompt-card-quote` - Card quote text
- `.prompt-card-copy-btn` - Copy button
- `.geuwat-table-scroll` - Responsive table wrapper
- `.geuwat-table-responsive` - Responsive table

### Neon Theme Classes (themes/neon.css)
- `.text-neon-cyan`, `.text-neon-pink`, `.text-neon-purple`, `.text-neon-green`
- `.border-neon-*` - Neon borders
- `.bg-neon-*` - Neon backgrounds
- `.shadow-neon-*` - Neon glow effects
- `.bg-tech-grid` - Tech grid background
- `.bg-tech-panel` - Tech panel background
- `.tech-scanline` - Scanline animation effect
- `.font-neon` - Neon font with glow
- `.clip-tech-panel` - Tech panel clip path
- `.animate-scan`, `.animate-spin-slow`, `.animate-spin-reverse`

## Best Practices

### ✅ DO
- Use CSS variables for theming
- Keep component styles DRY and reusable
- Use @import for organization in development
- Apply layout classes to page containers
- Use utility classes for common patterns

### ❌ DON'T
- Don't inline critical styles (use classes)
- Don't duplicate theme variables
- Don't use !important unless necessary
- Don't create page-specific variables in component files

## Performance Notes

1. **Backdrop Blur Disabled**: For low-spec devices, backdrop-filter is globally disabled
2. **Mobile Optimizations**: Aggressive font-size reductions for mobile devices
3. **CSS Import Chain**: All imports are resolved at build time by Next.js

## Migration from Old Structure

Old CSS files are kept temporarily for backwards compatibility. Gradually update imports:

### Before
```tsx
import '../../../pronunciation.css'
import './stressing/stressing.css'
```

### After
```tsx
import '@/app/styles/themes/pronunciation/stressing.css'
```

## Adding New Themes

1. Create theme file in appropriate folder
2. Define CSS variables using existing naming conventions
3. Add @import to globals.css (if needed globally)
4. Document in this README

Example:
```css
/* app/styles/themes/pronunciation/new-theme.css */
.pronunciation-theme--new-theme {
  --pronun-base: #000000;
  --pronun-accent-1-rgb: [your color];
  --pronun-accent-2-rgb: [your color];
  /* ... */
}
```
