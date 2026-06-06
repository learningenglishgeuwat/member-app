# 📦 Components Library

Shared, reusable components for the Learning English Geuwat application.

---

## 🗂️ Structure

```
components/
├── ui/              # Pure UI components (no business logic)
│   ├── buttons/     # Action triggers
│   ├── cards/       # Content containers
│   ├── loading/     # Loading states
│   └── links/       # Navigation elements
│
├── features/        # Feature-specific components
│   ├── navigation/  # App navigation
│   ├── pronunciation/ # IPA & phonetics
│   ├── learning/    # Learning features
│   ├── control-center/ # App controls
│   └── haptic/      # Haptic feedback
│
├── layout/          # App structure & theming
│   ├── AppClientShell
│   └── SkillThemeSync
│
├── guards/          # Auth & access control
│   ├── RequireActive
│   └── RequireActiveWrapper
│
├── effects/         # Side effects & behaviors
│   ├── ScrollToHashMount
│   └── GlobalScrollToItemMount
│
└── index.ts         # Root barrel export (public API)
```

---

## 📖 Usage

### Importing Components

**Preferred (explicit category):**
```typescript
import { PlayStopButton } from '@/app/components/ui/buttons';
import { IpaText } from '@/app/components/features/pronunciation';
```

**Also OK (root barrel):**
```typescript
import { PlayStopButton, IpaText } from '@/app/components';
```

### Component Categories

#### 🎨 UI Components (`ui/`)
Pure presentational components with no business logic.

```typescript
import { PlayStopButton, BaseCard, AuthLoadingSkeleton } from '@/app/components/ui';

<PlayStopButton isPlaying={false} onToggle={handlePlay} />
<BaseCard showGrid showDecorations>Content</BaseCard>
<AuthLoadingSkeleton />
```

#### 🎯 Feature Components (`features/`)
Domain-specific components with business logic.

```typescript
import { IpaText, MobileBottomNav } from '@/app/components/features';

<IpaText text="æ" showBrackets={true} />
<MobileBottomNav />
```

#### 🏠 Layout Components (`layout/`)
App structure and theming.

```typescript
import { AppClientShell, SkillThemeSync } from '@/app/components/layout';

<AppClientShell>
  <SkillThemeSync />
  {children}
</AppClientShell>
```

#### 🔒 Guards (`guards/`)
Authentication and access control.

```typescript
import { RequireActive } from '@/app/components/guards';

<RequireActive>
  <ProtectedContent />
</RequireActive>
```

#### ⚡ Effects (`effects/`)
Side effects without UI.

```typescript
import { ScrollToHashMount } from '@/app/components/effects';

<ScrollToHashMount />
```

---

## 📁 Available Components

### UI Components

**Buttons:**
- `PlayStopButton` - Toggle play/stop state
- `TTSInitButton` - Initialize text-to-speech

**Cards:** (✅ Refactored June 2026)
- `BaseCard` - Foundation card with tech theme
- `TopicCard` - Pronunciation topic selector
- `LetterCard` - Alphabet letter display
- `ContentCard` - Generic content card
- `TwisterCard` - Tongue twister display

**Loading:**
- `AuthLoadingSkeleton` - Authentication loading state

**Links:**
- `HoverPrefetchLink` - Link with hover prefetch

### Feature Components

**Navigation:**
- `MobileBottomNav` - Mobile bottom navigation bar

**Pronunciation:**
- `IpaText` - IPA text rendering
- `IpaVisibilityToggle` - Toggle IPA visibility

**Learning:**
- `HighlightVisibilityToggle` - Toggle highlight visibility

**Control Center:**
- `ControlCenter` - App control panel

**Haptic:**
- `GlobalHaptic` - Global haptic feedback handler

### Layout Components

- `AppClientShell` - Main app wrapper
- `SkillThemeSync` - Skill theme synchronization

### Guards

- `RequireActive` - Require active session
- `RequireActiveWrapper` - Feature-specific active check

### Effects

- `ScrollToHashMount` - Scroll to URL hash on mount
- `GlobalScrollToItemMount` - Custom scroll event listener

---

## 🆕 Adding New Components

### 1. Decide Category

Use the decision tree in [COMPONENT_GUIDELINES.md](../../documentation/COMPONENT_GUIDELINES.md):

```
Does it contain business logic?
  NO → Is it reusable? 
       YES → ui/
       NO → features/
  YES → features/[feature-name]/
```

### 2. Create Component

**Simple component:**
```
ui/buttons/
├── NewButton.tsx
├── NewButton.test.tsx
└── index.ts (update)
```

**Complex component:**
```
features/new-feature/NewComponent/
├── NewComponent.tsx
├── NewComponent.test.tsx
├── NewComponent.README.md
├── useNewFeature.ts
└── index.ts
```

### 3. Add to Barrel Export

```typescript
// ui/buttons/index.ts
export { NewButton } from './NewButton';
export type { NewButtonProps } from './NewButton';
```

### 4. Write Tests

```typescript
// NewButton.test.tsx
import { render, screen } from '@testing-library/react';
import { NewButton } from './NewButton';

describe('NewButton', () => {
  it('renders correctly', () => {
    render(<NewButton />);
    // assertions
  });
});
```

### 5. Document (if needed)

For complex components, add README with:
- Usage examples
- Props documentation
- Edge cases
- Notes

---

## 🧪 Testing

Tests are co-located with components:

```bash
# Run all component tests
npm run test -- app/components

# Run specific category
npm run test -- app/components/ui/buttons

# Watch mode
npm run test:watch -- app/components
```

---

## 📚 Documentation

- **[Component Guidelines](../../documentation/COMPONENT_GUIDELINES.md)** - Where to place components
- **[Refactoring Plan](../../documentation/COMPONENT_ORGANIZATION_REFACTORING.md)** - Migration strategy
- **[Card Components](./cards/README.md)** - Card library documentation
- **[Styles Architecture](../styles/ARCHITECTURE.md)** - CSS organization

---

## ✅ Best Practices

### Do's ✅

- **Co-locate tests** next to components
- **Use TypeScript** for all components
- **Export types** alongside components
- **Document complex** components
- **Single responsibility** per component
- **Props-driven** UI components

### Don'ts ❌

- **Don't mix concerns** (UI + business logic in ui/)
- **Don't deep nest** folders (max 2 levels)
- **Don't skip tests** for public components
- **Don't use generic names** (Button, Card, etc)
- **Don't inline styles** (use CSS or Tailwind)

---

## 🔄 Recent Changes

### June 2026

**✅ Card Components Refactored**
- Created shared card library (`ui/cards/`)
- Refactored 4 card types
- Full documentation added

**✅ CSS Architecture Refactored**
- Organized styles into `app/styles/`
- Created modular theme system
- Reduced globals.css from 900 to 40 lines

**📋 Component Organization (Planned)**
- Reorganize into categorized structure
- See [COMPONENT_ORGANIZATION_REFACTORING.md](../../documentation/COMPONENT_ORGANIZATION_REFACTORING.md)

---

## 📞 Questions?

1. Check [COMPONENT_GUIDELINES.md](../../documentation/COMPONENT_GUIDELINES.md)
2. Look for similar existing components
3. Ask the team
4. When in doubt, start in `features/` and refactor later

---

**Maintained by:** Development Team  
**Last Updated:** June 7, 2026  
**Status:** ✅ Active, 📋 Migration Planned

