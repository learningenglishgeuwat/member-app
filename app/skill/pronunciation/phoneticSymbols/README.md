# Phonetic Symbols Module

## 📁 Folder Structure

```
phoneticSymbols/
├── 📄 README.md                 ← This documentation
├── 🎨 styles/                   ← CSS Styles (organized)
│   ├── shared.css              ← Variables, animations, utilities
│   ├── portal.css              ← Portal page styles
│   └── detail.css              ← Detail page styles
├── 📊 data/                     ← Data & Functions
│   ├── index.ts                ← Central exports
│   ├── wordExamples/           ← Word examples data
│   ├── symbolDescriptions/     ← Symbol descriptions
│   ├── pronunciationTips/      ← Pronunciation tips
│   ├── videoIds/               ← YouTube video IDs
│   └── commonLetters/          ← Letter mappings
├── 📄 page.tsx                  ← Portal selection page
└── 📄 [symbol]/page.tsx         ← Dynamic detail page
```

## 🎯 Purpose

### Portal Page (`page.tsx`)
- **Selection hub** for phonetic symbol categories
- **Interactive portals**: Vowel, Consonant, Diphthong
- **Navigation** to detail pages

### Detail Page (`[symbol]/page.tsx`) 
- **Learning interface** for individual symbols
- **Video tutorials** with YouTube integration
- **Word examples** with audio pronunciation
- **Recording practice** with progress tracking
- **Tips & guidance** for proper pronunciation

## 🎨 Styles Organization

### `styles/shared.css`
- CSS variables for cyber theme
- Common animations (pulse, spin, scan)
- Utility classes and helpers
- Reusable components

### `styles/portal.css`
- Portal page specific styles
- Interactive hover effects
- Portal animations and transitions
- Responsive grid layout

### `styles/detail.css`
- Detail page specific styles
- Symbol display components
- Word cards grid
- Recording controls
- Video player styling

## 📊 Data Structure

### `data/index.ts`
- Central export hub for all data functions
- Type definitions and interfaces
- Clean import paths

### Data Categories
- **Word Examples**: Sample words for each symbol
- **Symbol Descriptions**: Categories and descriptions
- **Pronunciation Tips**: How-to guidance
- **Video IDs**: YouTube tutorial links
- **Common Letters**: Letter-to-sound mappings

## 🚀 Usage

### Import Styles
```typescript
// Portal page
import './styles/portal.css';

// Detail page
import '../styles/detail.css';
```

### Import Data
```typescript
// Detail page
import { 
  getWordExamples, 
  getSymbolDescription,
  getVideoIdBySymbol 
} from '../data/index';
```

## 🔄 Navigation Flow

```
Pronunciation Menu
        ↓
Phonetic Symbols (Portal)
        ↓
Vowel/Consonant/Diphthong Selection
        ↓
Symbol Detail Page
        ↓
Back to Portal or Pronunciation Menu
```

## 🎨 Theme

- **Cyber/futuristic** aesthetic
- **Neon colors**: Purple, cyan, magenta
- **Glow effects** and animations
- **Dark background** with gradients
- **Responsive design** for all devices

## 🛠️ Development Notes

- **Next.js App Router** with dynamic routes
- **TypeScript** for type safety
- **Tailwind CSS** for utilities
- **Custom CSS** for specific animations
- **LocalStorage** for progress tracking
- **YouTube API** for video integration
