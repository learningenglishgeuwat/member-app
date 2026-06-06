# Card Components Library

Shared card components dengan tech/cyberpunk theme untuk aplikasi Learning English Geuwat.

## 🎯 Overview

Semua card components dibangun di atas **BaseCard** untuk memastikan consistency dalam styling, animations, dan behavior.

## 📦 Available Cards

### 1. BaseCard

**Base component** untuk semua card variants. Jarang digunakan langsung, lebih sering sebagai foundation untuk card lain.

**Features:**
- Tech grid background
- Active/inactive states
- Hover effects
- Corner decorations
- Scanline animations
- Multiple variants (default, minimal, elevated)

**Usage:**
```tsx
import { BaseCard } from '@/app/components/cards';

<BaseCard
  isActive={isActive}
  isPlaying={isPlaying}
  showGrid={true}
  showDecorations={true}
  showScanline={true}
  onClick={handleClick}
>
  {/* Your content */}
</BaseCard>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | string | '' | Additional CSS classes |
| style | React.CSSProperties | - | Inline styles |
| onClick | () => void | - | Click handler |
| isActive | boolean | false | Active state |
| isDisabled | boolean | false | Disabled state |
| isPlaying | boolean | false | Playing animation state |
| showDecorations | boolean | true | Show tech corners/dots |
| showGrid | boolean | true | Show grid background |
| showRing | boolean | false | Show active ring |
| showScanline | boolean | false | Show scanline animation |
| showGrayscale | boolean | false | Grayscale filter |
| variant | 'default' \| 'minimal' \| 'elevated' | 'default' | Visual variant |
| data-tour | string | - | Tour guide attribute |
| aria-label | string | - | Accessibility label |

---

### 2. TopicCard

**Pronunciation topic selection card** dengan carousel positioning.

**Used in:** `app/skill/pronunciation/page.tsx`

**Features:**
- Dynamic sizing (small → large on active)
- Locked state support
- Icon display with custom gradients
- Description reveal on active
- Custom clip-path for icon

**Usage:**
```tsx
import { TopicCard } from '@/app/components/cards';

<TopicCard
  topic={topic}
  isActive={activeTopicId === topic.id}
  onClick={() => setActiveTopic(topic.id)}
  style={{ transform: `translateX(${offset}px)` }}
/>
```

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| topic | Topic | ✅ | Topic data (id, title, icon, color, etc.) |
| isActive | boolean | ✅ | Active state |
| onClick | () => void | ✅ | Click handler |
| style | React.CSSProperties | ❌ | Positioning styles |

**Topic Type:**
```typescript
interface Topic {
  id: string;
  title: string;
  shortDesc: string;
  icon: ReactNode;
  color: string;        // Tailwind gradient classes
  cssClass?: string;    // Additional CSS classes
  // ...
}
```

---

### 3. LetterCard

**Alphabet letter display card** dengan IPA pronunciation.

**Used in:** `app/skill/pronunciation/alphabet/page.tsx`

**Features:**
- Large letter display
- IPA text with brackets
- Playing state animation
- Haptic feedback
- Auto-scroll on play
- Scanline effect when playing

**Usage:**
```tsx
import { LetterCard } from '@/app/components/cards';

<LetterCard
  letter="A"
  ipa="eɪ"
  isPlaying={playingLetter === 'A'}
  onPlay={() => playLetter('A')}
  showIpa={showIpaState}
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| letter | string | - | Letter to display (A-Z) |
| ipa | string | - | IPA pronunciation |
| isPlaying | boolean | - | Playing state |
| onPlay | () => void | - | Click/play handler |
| showIpa | boolean | true | Show IPA text |
| className | string | '' | Additional classes |

---

### 4. ContentCard

**Generic content card** untuk text/content display dengan play button.

**Used in:** Various modules (base for TwisterCard, etc.)

**Features:**
- Flexible content slot
- Optional play/pause button
- Active border accent (left side)
- Minimal variant (no grid)
- Scanline on playing

**Usage:**
```tsx
import { ContentCard } from '@/app/components/cards';

<ContentCard
  isActive={activeId === item.id}
  isPlaying={playingId === item.id}
  onPlay={() => play(item.id)}
  showIpa={showIpaState}
>
  <div>
    <h3>Title</h3>
    <p>Content...</p>
  </div>
</ContentCard>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| isActive | boolean | false | Active state |
| isPlaying | boolean | false | Playing state |
| onPlay | () => void | - | Play handler |
| onClick | () => void | - | Card click handler |
| children | ReactNode | - | Card content |
| showPlayButton | boolean | true | Show play/pause button |
| showBorderAccent | boolean | true | Show left border when active |
| showIpa | boolean | true | Context for IPA display |
| className | string | '' | Additional classes |

---

### 5. TwisterCard

**Tongue twister card** dengan text dan IPA.

**Used in:** `app/skill/pronunciation/reading-text/tongueTwister/`

**Features:**
- Built on ContentCard
- Text + IPA display
- Play/pause button
- Active border accent
- Responsive text sizing

**Usage:**
```tsx
import { TwisterCard } from '@/app/components/cards';

<TwisterCard
  line={twisterLine}
  isActive={activeId === line.id}
  isPlaying={playingId === line.id}
  onPlay={() => play(line.id)}
  showIpa={showIpaState}
/>
```

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| line | TwisterLine | ✅ | Twister line data |
| isActive | boolean | ✅ | Active state |
| isPlaying | boolean | ✅ | Playing state |
| onPlay | () => void | ✅ | Play handler |
| showIpa | boolean | ✅ | Show IPA text |
| className | string | ❌ | Additional classes |

**TwisterLine Type:**
```typescript
interface TwisterLine {
  id: number;
  text: ReactNode;
  ipa: ReactNode;
  rawText: string;
}
```

---

## 🎨 Theme System

All cards share the **tech/cyberpunk theme**:

### Colors
- Background: `bg-slate-800` / `bg-black` (active)
- Grid: Purple (`rgba(147,51,234,0.1)`)
- Accent: Purple/Cyan (`purple-400`, `cyan-400`)
- Border: `border-white/10`

### Animations
- **Pulse**: Active ring
- **Scan**: Scanline effect (2s linear infinite)
- **Fade In Up**: Description reveal
- **Scale**: Active state (1.05)
- **Hover**: Opacity + translateY

### Effects
- Tech grid pattern (30px × 30px)
- Corner decorations (dots + lines)
- Gradient overlays
- Scanline on playing

---

## 📁 File Structure

```
app/components/cards/
├── BaseCard.tsx           # Base component
├── BaseCard.css           # Animations
├── TopicCard.tsx          # Pronunciation topics
├── LetterCard.tsx         # Alphabet letters
├── ContentCard.tsx        # Generic content
├── TwisterCard.tsx        # Tongue twisters
├── index.ts               # Exports
└── README.md              # This file
```

---

## 🔧 Creating New Card Variants

### Option 1: Extend BaseCard

```tsx
import { BaseCard, BaseCardProps } from '@/app/components/cards';

export const MyCard: React.FC<MyCardProps> = (props) => {
  return (
    <BaseCard
      showGrid={true}
      showDecorations={true}
      {...props}
    >
      {/* Your custom content */}
    </BaseCard>
  );
};
```

### Option 2: Extend ContentCard

```tsx
import { ContentCard, ContentCardProps } from '@/app/components/cards';

export const MyContentCard: React.FC<MyProps> = (props) => {
  return (
    <ContentCard {...props}>
      {/* Your content layout */}
    </ContentCard>
  );
};
```

---

## 🎯 Best Practices

### ✅ DO
1. Use BaseCard for new card types
2. Maintain consistent spacing (p-3 sm:p-4)
3. Use tech theme colors (purple/cyan)
4. Add data-tour attributes for bot integration
5. Include proper aria-labels
6. Use forwardRef if card needs ref
7. Test responsive sizing
8. Add haptic feedback for interactive cards

### ❌ DON'T
1. Create standalone cards without BaseCard
2. Override BaseCard animations arbitrarily
3. Use different color schemes
4. Skip accessibility attributes
5. Hardcode sizes (use responsive classes)
6. Forget to handle disabled states

---

## 🧪 Testing Checklist

When creating or updating cards:

- [ ] Renders correctly in all states (idle, active, playing, disabled)
- [ ] Responsive on mobile, tablet, desktop
- [ ] Hover states work properly
- [ ] Animations smooth and performant
- [ ] Accessibility attributes present
- [ ] TypeScript types complete
- [ ] Works with ControlCenter integration
- [ ] Bot tourguide attributes added
- [ ] Haptic feedback (if interactive)

---

## 📊 Migration Status

### ✅ Completed
- BaseCard created
- TopicCard refactored
- LetterCard refactored
- ContentCard created
- TwisterCard refactored
- Documentation complete

### 🔄 In Progress
- Migrate existing pages to use new cards
- Test all interactions

### 📝 TODO
- Vocabulary cards migration (optional)
- Grammar cards (if needed)
- Performance optimization
- Additional variants as needed

---

## 🔗 Related Components

- **PlayStopButton** (`@/app/components/PlayStopButton`)
- **IpaText** (`@/app/components/IpaText`)
- **ControlCenter** (`@/app/components/ControlCenter`)
- **RecordingControlsButton** (`@/app/skill/components/RecordingControlsButton`)

---

## 📞 Support

**Questions about cards?**
1. Check this README
2. Review component source code
3. Check usage examples in existing pages
4. Ask development team

**Found a bug or need new feature?**
1. Document the use case
2. Check if BaseCard/ContentCard can handle it
3. Create new variant if needed
4. Update this documentation

---

**Created:** June 6, 2026  
**Last Updated:** June 6, 2026  
**Maintained by:** Development Team
