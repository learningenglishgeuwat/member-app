# MobileBottomNav (PVGS) - Styling Guide

## Card-Style Design

Navbar PVGS sekarang menggunakan bentuk card yang sama dengan DashboardBottomNav untuk konsistensi visual.

## Struktur Layout

```
┌─────────────────────────────────────────┐
│  ┌───────────────────────────────────┐  │ ← Container (max-w-2xl)
│  │                                   │  │
│  │  [MENU]  [Avatar]  [PROGRESS]    │  │ ← Buttons
│  │                                   │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## Key Features

### 1. **Card Container**
- `max-w-2xl` - Maximum width 672px (sama dengan dashboard)
- `mx-auto` - Centered horizontally
- `rounded-t-2xl` - Rounded top corners (mobile)
- `md:rounded-2xl` - Fully rounded (desktop)
- `md:mb-4` - Bottom margin on desktop (floating effect)

### 2. **Responsive Behavior**

**Mobile:**
```
┌─────────────────────────┐
│ [MENU] [Avatar] [PROG] │ ← Full width, rounded top only
└─────────────────────────┘
```

**Desktop:**
```
        ┌───────────────────┐
        │ [MENU] [Avatar]   │ ← Max 672px, fully rounded
        │       [PROGRESS]  │ ← Floating with margin bottom
        └───────────────────┘
```

### 3. **Padding**
- Mobile: `px-6 pt-5 pb-[calc(env(safe-area-inset-bottom)+12px)]`
- Desktop: `md:px-8 md:pb-4`

### 4. **Visual Effects**
- Gradient background: `from-slate-900/30 via-slate-950/95 to-black/95`
- Backdrop blur: `backdrop-blur-xl`
- Glow shadow: `shadow-[0_0_32px_rgba(cyan,0.14)]`
- Border: `border-t border-white/6%`

## Comparison with DashboardBottomNav

| Feature | MobileBottomNav (PVGS) | DashboardBottomNav |
|---------|------------------------|-------------------|
| Max Width | `max-w-2xl` ✅ | `max-w-2xl` ✅ |
| Rounded Corners | `rounded-t-2xl md:rounded-2xl` ✅ | `rounded-t-2xl md:rounded-2xl` ✅ |
| Desktop Margin | `md:mb-4` ✅ | `md:mb-4` ✅ |
| Padding | `px-6 pt-5 pb-[calc(...)] md:px-8 md:pb-4` ✅ | `px-6 pt-5 pb-[calc(...)] md:px-8 md:pb-4` ✅ |
| Theme Color | Cyan/Teal | Purple/Indigo |
| Z-Index | 80 | 1300 |

## Theme Colors

### PVGS (Cyan/Teal)
```css
--geuwat-nav-accent-rgb: 34, 211, 238
```

### Dashboard (Purple/Indigo)
```css
--dashboard-tour-accent-rgb: (purple/indigo values)
```

## Visual Consistency

✅ Same card shape and size
✅ Same rounded corners behavior
✅ Same padding and spacing
✅ Same floating effect on desktop
✅ Different theme colors for visual distinction
