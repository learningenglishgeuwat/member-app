# IpaText Component

Komponen reusable untuk menampilkan simbol IPA (International Phonetic Alphabet) di seluruh proyek GEUWAT.

## 🎯 Tujuan

- **Konsistensi**: Satu komponen untuk semua teks IPA
- **Aksesibilitas**: Otomatis menambahkan `lang="und-fonipa"` dan `aria-label`
- **Font Optimal**: Menggunakan Noto Sans dengan fallback yang tepat
- **Fleksibel**: Mendukung styling custom via Tailwind classes

## 📦 Import

```tsx
import { IpaText } from '@/app/components/IpaText';
// atau
import { IpaText } from '@/app/components';
```

## 🚀 Cara Pakai

### Basic Usage

```tsx
<IpaText>/ʌ/</IpaText>
```

### Dengan Styling

```tsx
<IpaText className="text-[#00f3ff] text-lg">
  /aɪ θɔːt ə θɔːt/
</IpaText>
```

### Block Element

```tsx
<IpaText as="div" className="mt-2 text-[#00f3ff]">
  {line.ipa}
</IpaText>
```

### Dengan Event Handler

```tsx
<IpaText 
  className="cursor-pointer hover:text-cyan-400"
  onClick={() => speak(ipa)}
>
  /ʌ/
</IpaText>
```

### Dengan Children Complex

```tsx
<IpaText className="text-[#00f3ff]">
  /aɪ <span className="text-orange-400">θ</span>ɔːt/
</IpaText>
```

## 📋 Props

| Prop | Type | Default | Deskripsi |
|------|------|---------|-----------|
| `children` | `React.ReactNode` | - | Konten IPA yang akan ditampilkan |
| `as` | `'span' \| 'div' \| 'p'` | `'span'` | Tag HTML yang dirender |
| `className` | `string` | `''` | Class Tailwind tambahan |
| `aria-label` | `string` | auto | Override aria-label (otomatis dari children string) |
| `onClick` | `React.MouseEventHandler` | - | Event handler untuk click |
| `style` | `React.CSSProperties` | - | Inline style (jarang digunakan) |

## 🎨 Styling Guidelines

### Warna IPA Standar

```tsx
// Teks IPA dasar - Cyan
<IpaText className="text-[#00f3ff]">/ʌ/</IpaText>

// Simbol fokus - Orange (via nested span)
<IpaText className="text-[#00f3ff]">
  /aɪ <span className="text-orange-400">θ</span>ɔːt/
</IpaText>
```

### Ukuran Font

```tsx
// Small
<IpaText className="text-[0.75rem]">/ʌ/</IpaText>

// Medium (default)
<IpaText className="text-[0.85rem]">/ʌ/</IpaText>

// Large
<IpaText className="text-lg">/ʌ/</IpaText>
```

### Line Height

```tsx
// Untuk diakritik yang kompleks
<IpaText className="leading-loose">/ʌ̃ː/</IpaText>
```

## ♿ Aksesibilitas

Komponen ini otomatis menambahkan:

1. **`lang="und-fonipa"`**: Menandai konten sebagai IPA untuk screen reader
2. **`aria-label`**: Otomatis dari children string, atau bisa di-override
3. **`data-ipa`**: Attribute untuk styling CSS tambahan

```tsx
// Otomatis
<IpaText>/ʌ/</IpaText>
// Renders: <span lang="und-fonipa" aria-label="/ʌ/" data-ipa>

// Custom aria-label
<IpaText aria-label="schwa sound">/ʌ/</IpaText>
// Renders: <span lang="und-fonipa" aria-label="schwa sound" data-ipa>
```

## 🔄 Migrasi dari Kode Lama

### Dari Inline Style

```tsx
// ❌ LAMA
<span style={{ fontFamily: 'Lucida Sans Unicode, Arial Unicode MS, ...' }}>
  {symbol}
</span>

// ✅ BARU
<IpaText>{symbol}</IpaText>
```

### Dari font-mono

```tsx
// ❌ LAMA
<span className="font-mono text-[0.85rem] text-[#00f5ff]">
  {item.ipa}
</span>

// ✅ BARU
<IpaText className="text-[0.85rem] text-[#00f3ff]">
  {item.ipa}
</IpaText>
```

### Dari Custom Font Variable

```tsx
// ❌ LAMA
const [ipaFont, setIpaFont] = useState('...');
useEffect(() => { setIpaFont(getIPAFontFamily()); }, []);
<div style={{ fontFamily: ipaFont }}>{ipa}</div>

// ✅ BARU
<IpaText as="div">{ipa}</IpaText>
```

## 🧪 Testing

```tsx
import { render, screen } from '@testing-library/react';
import { IpaText } from '@/app/components/IpaText';

test('renders IPA text', () => {
  render(<IpaText>/ʌ/</IpaText>);
  expect(screen.getByText('/ʌ/')).toBeInTheDocument();
});

test('applies custom className', () => {
  const { container } = render(
    <IpaText className="text-cyan-400">/ʌ/</IpaText>
  );
  expect(container.firstChild).toHaveClass('font-ipa', 'text-cyan-400');
});
```

## 📚 Referensi

- **Font Setup**: `app/layout.tsx` (Noto Sans via next/font)
- **CSS Variables**: `app/globals.css` (--font-ipa)
- **Tailwind Config**: `tailwind.config.js` (fontFamily.ipa)
- **Utility**: `lib/ipaFont.ts` (untuk edge case inline style)
- **Panduan**: `AI/aturan-ipa/guide-implement` (dokumentasi lengkap)

## ❓ FAQ

### Kapan pakai `as="div"` vs default `span`?

- `span` (default): Untuk IPA inline dalam teks
- `div`: Untuk IPA sebagai block element dengan margin/padding
- `p`: Untuk paragraf IPA yang panjang

### Apakah perlu import `IPA_FONT_FAMILY` dari `lib/ipaFont.ts`?

Tidak. Gunakan komponen `<IpaText>` untuk 99% kasus. `IPA_FONT_FAMILY` hanya untuk edge case seperti third-party component yang tidak bisa pakai className.

### Kenapa warna tidak otomatis?

Komponen tidak inject warna secara default agar fleksibel. Tambahkan `text-[#00f3ff]` untuk warna cyan standar.

### Bagaimana cara highlight simbol tertentu?

Gunakan nested span:

```tsx
<IpaText className="text-[#00f3ff]">
  /aɪ <span className="text-orange-400">θ</span>ɔːt/
</IpaText>
```
