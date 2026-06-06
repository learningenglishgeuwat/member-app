# CSS Quick Reference Guide

## 🚀 Quick Start

### Using Layout Classes

```tsx
// Auth pages (login, signup, forgot password)
<div className="auth-layout">...</div>

// Dashboard
<div className="dashboard-layout">...</div>

// Skill selection & skill pages
<div className="skill-layout">...</div>

// Pronunciation pages
<div className="pronunciation-layout pronunciation-theme pronunciation-theme--alphabet">...</div>
```

### Using Component Classes

```tsx
// Play button
<button className="play-btn-base">
  <div className="play-icon-triangle" />
</button>

// Prompt card
<div className="prompt-card-base">
  <div className="prompt-card-header">
    <h3 className="prompt-card-title">Title</h3>
    <button className="prompt-card-copy-btn">Copy</button>
  </div>
  <p className="prompt-card-quote">Quote text</p>
</div>

// Responsive table
<div className="geuwat-table-scroll">
  <table className="geuwat-table-responsive">...</table>
</div>
```

### Using Neon Theme Classes

```tsx
// Text colors
<span className="text-neon-cyan">Cyan</span>
<span className="text-neon-pink">Pink</span>
<span className="text-neon-purple">Purple</span>
<span className="text-neon-green">Green</span>

// Borders
<div className="border-neon-purple">...</div>

// Backgrounds
<div className="bg-neon-cyan">...</div>

// Glow effects
<div className="shadow-neon-pink">...</div>

// Tech effects
<div className="bg-tech-grid tech-scanline">...</div>
<div className="bg-tech-panel">...</div>

// Animations
<div className="animate-scan">...</div>
<div className="animate-spin-slow">...</div>
<div className="animate-spin-reverse">...</div>
```

## 📦 CSS Variables

### Font Variables

```css
var(--font-ipa)         /* IPA font (sans-serif) */
var(--font-ui)          /* UI font (Noto Sans) */
var(--font-display)     /* Display font (Orbitron) */
```

### Color Variables

```css
var(--color-ipa)        /* #06b6d4 - Cyan for IPA text */
var(--app-page-bg)      /* #000000 - Page background */
var(--app-page-fg)      /* rgb(226 232 240) - Page foreground */
```

### Font Size Variables

```css
var(--font-size-ui)       /* 0.88rem (desktop) / 0.75rem (mobile) */
var(--font-size-display)  /* 1rem (desktop) / 0.75rem (mobile) */
var(--font-size-ipa)      /* 0.85rem (desktop) / 0.75rem (mobile) */
```

### Pronunciation Theme Variables

```css
var(--pronun-text)           /* Text color */
var(--pronun-muted)          /* Muted text color */
var(--pronun-surface-rgb)    /* Surface RGB values */
var(--pronun-panel-rgb)      /* Panel RGB values */
var(--pronun-accent-1-rgb)   /* Primary accent RGB */
var(--pronun-accent-2-rgb)   /* Secondary accent RGB */
```

### Using RGB Variables

```css
/* Border with opacity */
border-color: rgb(var(--pronun-accent-1-rgb) / 0.38);

/* Background with opacity */
background: rgb(var(--pronun-accent-2-rgb) / 0.15);

/* Box shadow with opacity */
box-shadow: 0 0 20px rgb(var(--pronun-accent-1-rgb) / 0.5);
```

## 🎨 Pronunciation Themes

| Theme Class | Color | Use Case |
|-------------|-------|----------|
| `.pronunciation-theme--alphabet` | Blue | Alphabet lessons |
| `.pronunciation-theme--stressing` | Orange | Stress patterns |
| `.pronunciation-theme--intonation` | Pink | Intonation practice |
| `.pronunciation-theme--final-sound` | Lime | Final sound rules |
| `.pronunciation-theme--american-t` | Dark Blue | American T sound |
| `.pronunciation-theme--text` | Slate | Text pronunciation |
| `.pronunciation-theme--reading-text` | Dark Slate | Reading practice |

### Example Usage

```tsx
<div className="pronunciation-layout pronunciation-theme pronunciation-theme--stressing">
  {/* Orange-themed pronunciation page */}
</div>
```

## 📱 Responsive Classes

### Mobile-Specific Overrides (< 768px)

```css
/* Grammar topic pages */
.gr-topic-page [class*='-card-title']   /* 0.82rem */

/* Vocabulary examples */
.vocab-example                          /* 0.80rem */
.vocab-example-ipa                      /* 0.80rem */
.vocab-example-translation              /* 0.80rem */

/* Pronunciation examples */
.alphabet-practice-example              /* 0.80rem */
.stress-rule-example-sentence           /* 0.80rem */
.fs-topic-table-example-word            /* 0.80rem */

/* Generic examples */
[class*='example-text']                 /* 0.80rem */
[class*='explanation']                  /* 0.80rem */
```

## 🔧 Common Tasks

### Change Theme Color

```tsx
// Before
<div className="pronunciation-theme--alphabet">

// After (change to orange stressing theme)
<div className="pronunciation-theme--stressing">
```

### Add Neon Glow to Text

```tsx
// Simple
<span className="text-neon-cyan">Glowing text</span>

// With custom glow
<span className="text-neon-pink shadow-neon-pink">Strong glow</span>
```

### Make Table Responsive

```tsx
// Wrap table in scroll container
<div className="geuwat-table-scroll">
  <table className="geuwat-table-responsive">
    <thead>...</thead>
    <tbody>...</tbody>
  </table>
</div>
```

### Create Tech-Style Panel

```tsx
<div className="bg-tech-panel clip-tech-panel">
  <div className="bg-tech-grid tech-scanline">
    <p>Tech-styled content</p>
  </div>
</div>
```

## 🎯 Best Practices

### ✅ DO

```tsx
// Use layout classes for page containers
<div className="skill-layout">

// Use component classes for reusable elements
<button className="play-btn-base">

// Use CSS variables for theming
style={{ color: `rgb(var(--pronun-accent-1-rgb) / 0.8)` }}

// Combine classes for theme composition
<div className="pronunciation-layout pronunciation-theme pronunciation-theme--alphabet">
```

### ❌ DON'T

```tsx
// Don't inline critical styles
<div style={{ minHeight: '100vh', background: 'black' }}>
// Instead: <div className="skill-layout">

// Don't duplicate theme variables
:root { --my-accent: #ff00ff; }
// Instead: use existing --pronun-accent-*-rgb

// Don't use !important unless necessary
.my-class { color: red !important; }
// Instead: increase specificity or use proper cascade

// Don't hardcode colors
<div style={{ borderColor: '#1d4ed8' }}>
// Instead: use theme variables or Tailwind classes
```

## 🔍 Finding Styles

### Where to Look:

| Need | Look In |
|------|---------|
| Color/font variables | `app/styles/base/variables.css` |
| Text styles | `app/styles/base/typography.css` |
| Page layouts | `app/styles/layouts/*.css` |
| Theme colors | `app/styles/themes/pronunciation/*.css` |
| Button styles | `app/styles/components/buttons.css` |
| Card styles | `app/styles/components/cards.css` |
| Table styles | `app/styles/components/tables.css` |
| Neon effects | `app/styles/themes/neon.css` |
| Visual effects | `app/styles/utilities/effects.css` |
| Mobile overrides | `app/styles/utilities/responsive.css` |

## 🐛 Troubleshooting

### Styles not applying?

1. **Check class name spelling**
   ```tsx
   // Wrong
   <div className="pronunciation-layout pronounciation-theme">
   
   // Right
   <div className="pronunciation-layout pronunciation-theme">
   ```

2. **Check theme composition**
   ```tsx
   // Wrong (missing base theme)
   <div className="pronunciation-theme--alphabet">
   
   // Right
   <div className="pronunciation-theme pronunciation-theme--alphabet">
   ```

3. **Check import in globals.css**
   ```css
   @import './styles/themes/pronunciation/alphabet.css';
   ```

4. **Clear Next.js cache**
   ```bash
   npm run clean
   npm run dev
   ```

### Theme colors not changing?

```tsx
// Ensure both theme classes are present
<div className="pronunciation-theme pronunciation-theme--[specific]">
  {/* --pronun-accent-* variables are now set */}
</div>
```

### Mobile styles not working?

```tsx
// Check media query in responsive.css
@media (max-width: 767px) {
  /* Your mobile styles */
}

// Ensure class names match
<div className="vocab-example">  {/* Will get 0.80rem on mobile */}
```

## 📚 Further Reading

- **Complete Guide:** `app/styles/README.md`
- **Architecture:** `app/styles/ARCHITECTURE.md`
- **Refactoring Notes:** `REFACTORING_STYLES.md`
- **Completion Report:** `STYLES_REFACTORING_COMPLETE.md`

## 💡 Tips

1. **Use browser DevTools** to inspect which CSS variables are active
2. **Check computed styles** to see final values with opacity
3. **Use VS Code CSS intellisense** for class name autocomplete
4. **Test mobile responsively** with browser responsive design mode
5. **Keep Tailwind for utilities**, use custom classes for components

---

**Need help?** Check the full documentation or ask the team!
