# Navbar Toggle Feature - Hide/Show Navigation

## Overview

Kedua navbar bawah (Dashboard dan PVGS) sekarang memiliki tombol toggle dengan **panah di atas lingkaran** untuk hide/show navbar.

## Visual Design

```
        ↓ Panah (di atas lingkaran)
      ┌───┐
      │   │ ← Lingkaran kosong
      └───┘
┌─────────────────┐
│ [MENU] [Avatar] │ ← Navbar (visible)
│      [PROGRESS] │
└─────────────────┘
```

```
        ↑ Panah (di atas lingkaran)
      ┌───┐
      │   │ ← Lingkaran kosong
      └───┘
        
(Navbar hidden below screen)
```

## Features

### 1. **Toggle Button Structure**

```tsx
<button>
  <div className="flex flex-col items-center">
    {/* Arrow Icon - ABOVE circle */}
    <div className="mb-1">
      <ChevronDown /> or <ChevronUp />
    </div>
    
    {/* Circle - EMPTY */}
    <div className="w-10 h-10 rounded-full" />
  </div>
</button>
```

### 2. **Icon Styling**

#### Arrow (Above Circle)
- **Size**: 16px (w-4 h-4)
- **Position**: Above circle with margin-bottom: 4px
- **Effect**: Drop shadow for visibility
- **Dashboard**: purple-300
- **PVGS**: cyan-300

#### Circle (Empty)
- **Size**: 40px diameter
- **Background**: Gradient slate-800/90 to slate-900/95
- **Border**: Theme color with 30% opacity
- **Backdrop blur**: Medium
- **Shadow**: Large
- **Hover**: Border opacity 50%

### 3. **Behavior**

**When Visible:**
- Button positioned at top of navbar
- Shows ChevronDown icon (↓)
- Navbar fully visible
- `transform: translate(-50%, -100%)`

**When Hidden:**
- Button positioned slightly above bottom edge
- Shows ChevronUp icon (↑)
- Navbar slides down off-screen
- `transform: translate(-50%, -8px)`

### 4. **Animation**

```css
transition-transform duration-300
```

**Navbar:**
- Visible: `translate-y-0`
- Hidden: `translate-y-full`

**Button:**
- Visible: `translate(-50%, -100%)`
- Hidden: `translate(-50%, -8px)`

## Z-Index Layers

### Dashboard
```
Toggle Button: 1310 (highest)
Navbar: 1300
Sidebar: 1260
Backdrop: 1250
```

### PVGS
```
Toggle Button: 90
Navbar: 80
```

## State Management

Both components use local state:

```tsx
const [isNavVisible, setIsNavVisible] = useState(true)

const toggleNavVisibility = () => {
  setIsNavVisible(!isNavVisible)
}
```

## Accessibility

- `aria-label`: Dynamic label based on state
  - "Hide navigation" when visible
  - "Show navigation" when hidden
- `aria-hidden`: Applied to navbar when hidden
- Keyboard accessible (button element)

## User Experience

### Benefits:
✅ More screen space when navbar is hidden
✅ Quick access to toggle (always visible button)
✅ Smooth animations
✅ Visual feedback (icon changes)
✅ Consistent across both navbars

### Use Cases:
- Reading content without navbar obstruction
- Viewing full-screen content
- Temporary hide for screenshots
- Personal preference for minimal UI

## Implementation Files

1. `app/dashboard/components/DashboardBottomNav/index.tsx`
2. `app/components/MobileBottomNav.tsx`

Both files have identical toggle implementation with theme-specific colors.
